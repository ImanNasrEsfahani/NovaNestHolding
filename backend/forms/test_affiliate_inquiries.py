"""Affiliate profile inquiries: API, safe routing and three independent emails."""
import json
import os
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings

from .affiliate_inquiries import notify_inquiry
from .models import AffiliateInquiry


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='info@novanestholding.com',
)
class AffiliateInquiryTests(TestCase):
    def setUp(self):
        cache.clear()
        temp = TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        registry = Path(temp.name) / 'ourTeamAffiliates.json'
        registry.write_text(json.dumps({
            'affiliates': {'partners': [
                {
                    'slug': 'sama-owj-middle-east',
                    'name': 'Sama Owj Middle East Travel Agency',
                    'emails': ['info@samaowj.ir'],
                    'primaryEmail': 'info@samaowj.ir',
                },
                {
                    'slug': 'gohar-afarinan-farda',
                    'name': 'Gohar Afarinan Farda',
                    'emails': ['info@goharafarinan.com'],
                    'primaryEmail': 'info@goharafarinan.com',
                },
            ]}
        }), encoding='utf-8')
        registry_patch = patch('forms.affiliate_applications.REGISTRY_PATH', registry)
        registry_patch.start()
        self.addCleanup(registry_patch.stop)
        env_patch = patch.dict(os.environ, {'AFFILIATE_APPLICATION_ADMIN_EMAILS': 'info@novanestholding.com'})
        env_patch.start()
        self.addCleanup(env_patch.stop)
        self.payload = {
            'first_name': 'Jane',
            'last_name': 'Doe',
            'email': 'jane@example.com',
            'phone_number': '+17789865432',
            'message': 'I have a question about business growth.',
            'language': 'en',
            'primaryEmail': 'injected@example.com',
            'affiliate_name': 'Untrusted override',
        }
        self.url = '/affiliate-inquiries/gohar-afarinan-farda'

    def post_inquiry(self, url=None, payload=None):
        return self.client.post(url or self.url, data=payload or self.payload,
                                content_type='application/json')

    def test_three_messages_with_one_default_email_template(self):
        response = self.post_inquiry()
        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(response.json()['notifications_sent'])
        inquiry = AffiliateInquiry.objects.get()
        self.assertEqual(inquiry.affiliate_slug, 'gohar-afarinan-farda')
        self.assertEqual(inquiry.partner_primary_email, 'info@goharafarinan.com')
        self.assertNotIn('Untrusted override', inquiry.affiliate_name)
        self.assertTrue(inquiry.admin_notified)
        self.assertTrue(inquiry.partner_notified)
        self.assertTrue(inquiry.applicant_notified)
        self.assertEqual(inquiry.notification_error, '')
        self.assertEqual([m.to for m in mail.outbox], [
            ['info@novanestholding.com'], ['info@goharafarinan.com'], ['jane@example.com'],
        ])
        self.assertEqual(len(set(m.subject for m in mail.outbox)), 3)
        for message in mail.outbox:
            self.assertEqual(message.from_email, 'info@novanestholding.com')
            self.assertEqual(message.alternatives[0][1], 'text/html')
            html = message.alternatives[0][0]
            self.assertIn('Synergy of energy', html)
            self.assertIn('Gohar Afarinan Farda', html)
            self.assertIn('I have a question about business growth.', html)
            self.assertIn('I have a question about business growth.', message.body)
            self.assertNotIn('injected@example.com', html)
        self.assertEqual(mail.outbox[0].reply_to, ['jane@example.com'])
        self.assertEqual(mail.outbox[1].reply_to, ['jane@example.com'])
        self.assertEqual(mail.outbox[2].reply_to, ['info@novanestholding.com'])

    def test_second_affiliate_uses_other_primary_email(self):
        response = self.post_inquiry('/affiliate-inquiries/sama-owj-middle-east')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(mail.outbox[1].to, ['info@samaowj.ir'])

    def test_persian_confirmation_only_for_contact(self):
        response = self.post_inquiry(payload={**self.payload, 'language': 'fa'})
        self.assertEqual(response.status_code, 201)
        self.assertIn('New affiliate profile inquiry', mail.outbox[0].subject)
        self.assertIn('New inquiry through your affiliate profile', mail.outbox[1].alternatives[0][0])
        self.assertIn('پیام شما دریافت شد', mail.outbox[2].alternatives[0][0])
        self.assertIn('dir="rtl"', mail.outbox[2].alternatives[0][0])

    def test_reject_unknown_partner_without_storing(self):
        response = self.post_inquiry('/affiliate-inquiries/unregistered')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(AffiliateInquiry.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_bad_fields_do_not_send_or_save(self):
        for key, value in [('email', 'bad'), ('message', ''), ('first_name', ''),
                           ('language', 'fr'), ('last_name', 'x'*151)]:
            with self.subTest(field=key):
                response = self.post_inquiry(payload={**self.payload, key: value})
                self.assertEqual(response.status_code, 400, response.content)
                self.assertIn(key, response.json())
        self.assertEqual(AffiliateInquiry.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_throttle_blocks_twenty_first_inquiry(self):
        # Invalid submissions still consume the per-IP quota, but do not save
        # database records or send mail.
        invalid = {**self.payload, 'email': 'invalid-email'}
        for attempt in range(20):
            with self.subTest(attempt=attempt + 1):
                response = self.post_inquiry(payload=invalid)
                self.assertEqual(response.status_code, 400, response.content)
        response = self.post_inquiry(payload=invalid)
        self.assertEqual(response.status_code, 429, response.content)
        self.assertEqual(AffiliateInquiry.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_untrusted_message_is_html_escaped(self):
        response = self.post_inquiry(payload={**self.payload, 'message': '<script>alert(1)</script>'})
        self.assertEqual(response.status_code, 201)
        for msg in mail.outbox:
            self.assertNotIn('<script>', msg.alternatives[0][0])
            self.assertIn('&lt;script&gt;', msg.alternatives[0][0])

    def test_retry_sends_only_failed_role(self):
        from django.core.mail.message import EmailMultiAlternatives
        with patch.object(EmailMultiAlternatives, 'send', side_effect=[1, RuntimeError('network'), 1]):
            response = self.post_inquiry()
        self.assertEqual(response.status_code, 202)
        inquiry = AffiliateInquiry.objects.get()
        self.assertTrue(inquiry.admin_notified)
        self.assertFalse(inquiry.partner_notified)
        self.assertTrue(inquiry.applicant_notified)
        self.assertEqual(inquiry.notification_error, 'partner_notified')
        self.assertTrue(notify_inquiry(inquiry))
        inquiry.refresh_from_db()
        self.assertTrue(inquiry.partner_notified)
        self.assertEqual(inquiry.notification_error, '')
        self.assertEqual([m.to for m in mail.outbox], [['info@goharafarinan.com']])
        self.assertTrue(notify_inquiry(inquiry))
        self.assertEqual(len(mail.outbox), 1)

    def test_all_send_failures_still_save_inquiry(self):
        from django.core.mail.message import EmailMultiAlternatives
        with patch.object(EmailMultiAlternatives, 'send', side_effect=RuntimeError('offline')):
            response = self.post_inquiry()
        self.assertEqual(response.status_code, 202)
        inquiry = AffiliateInquiry.objects.get()
        self.assertFalse(inquiry.admin_notified)
        self.assertFalse(inquiry.partner_notified)
        self.assertFalse(inquiry.applicant_notified)
        self.assertEqual(inquiry.notification_error,
                         'admin_notified,partner_notified,applicant_notified')
