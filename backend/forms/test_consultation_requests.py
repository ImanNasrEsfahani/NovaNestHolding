"""Shared consultation API: offline tests for three service pages plus Startup.

Django's locmem backend is used for every successful send. No real Microsoft
Graph call is performed. A separate runtime-only harness is also provided in
TESTING_FA.md for environments without Django installed.
"""
from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.core.mail.message import EmailMultiAlternatives
from django.test import TestCase, override_settings

from .consultation_requests import notify_consultation
from .models import ConsultationRequest


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='info@novanestholding.com',
)
class ConsultationRequestTests(TestCase):
    URL = '/small-reservation'

    def setUp(self):
        cache.clear()
        self.payload = {
            'service': 'investment',
            'first_name': 'Nadia',
            'last_name': 'Rostami',
            'email': 'nadia@example.com',
            'phone_number': '+17785550124',
            'language': 'en',
        }

    def post(self, **overrides):
        return self.client.post(self.URL, data={**self.payload, **overrides},
                                content_type='application/json')

    @patch.dict('os.environ', {'CONSULTATION_ADMIN_EMAILS': 'info@novanestholding.com'})
    def test_three_pages_have_two_independent_messages_and_correct_source(self):
        cases = (
            ('investment', 'Investment', '/en/investment'),
            ('acceleration', 'Acceleration', '/en/acceleration'),
            ('entrepreneur-pnp', 'Entrepreneur PNP', '/en/pnp'),
        )
        for service, name, source in cases:
            with self.subTest(service=service):
                mail.outbox.clear()
                response = self.post(service=service)
                self.assertEqual(response.status_code, 201, response.content)
                self.assertTrue(response.json()['notifications_sent'])
                self.assertTrue(response.json()['reference'])
                request = ConsultationRequest.objects.get(pk=response.json()['reference'])
                self.assertTrue(request.visitor_notified)
                self.assertTrue(request.admin_notified)
                self.assertEqual(request.notification_error, '')
                self.assertEqual(request.service, service)
                self.assertEqual([item.to for item in mail.outbox], [
                    ['nadia@example.com'], ['info@novanestholding.com'],
                ])
                applicant, admin = mail.outbox
                self.assertIn(name, applicant.subject)
                self.assertIn(name, admin.subject)
                self.assertIn('Nadia Rostami', admin.body)
                self.assertIn('+17785550124', admin.body)
                self.assertIn('nadia@example.com', admin.body)
                self.assertIn(source, admin.body)
                self.assertIn('Reference: #', admin.body)
                self.assertIn('Submitted at:', admin.body)
                self.assertEqual(applicant.reply_to, ['info@novanestholding.com'])
                self.assertEqual(admin.reply_to, ['nadia@example.com'])
                for item in mail.outbox:
                    self.assertEqual(item.from_email, 'info@novanestholding.com')
                    self.assertEqual(item.alternatives[0][1], 'text/html')
                    self.assertIn('novanest-email-mark.png', item.alternatives[0][0])
                    self.assertIn('Synergy of energy', item.alternatives[0][0])

    def test_farsi_application_is_farsi_only_for_visitor(self):
        response = self.post(service='entrepreneur-pnp', language='fa')
        self.assertEqual(response.status_code, 201)
        self.assertIn('درخواست مشاوره شما دریافت شد', mail.outbox[0].alternatives[0][0])
        self.assertIn('dir="rtl"', mail.outbox[0].alternatives[0][0])
        self.assertIn('برنامه کارآفرینی', mail.outbox[0].body)
        self.assertIn('New Entrepreneur PNP consultation', mail.outbox[1].subject)
        self.assertIn('/fa/pnp', mail.outbox[1].body)

    def test_startup_page_still_works_with_same_form(self):
        response = self.post(service='startup')
        self.assertEqual(response.status_code, 201, response.content)
        self.assertIn('Startup Visa', mail.outbox[1].subject)
        self.assertIn('/en/startup', mail.outbox[1].body)

    def test_rejects_invalid_service_and_fields_without_sending(self):
        invalid = (
            {'service': 'other'}, {'service': ''},
            {'first_name': ''}, {'last_name': '  '},
            {'email': 'invalid'}, {'phone_number': ''},
            {'language': 'de'},
        )
        for overrides in invalid:
            with self.subTest(overrides=overrides):
                response = self.post(**overrides)
                self.assertEqual(response.status_code, 400, response.content)
                self.assertIn(next(iter(overrides)), response.json())
        self.assertEqual(ConsultationRequest.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_untrusted_recipient_flags_and_source_are_ignored(self):
        response = self.post(admin_email='attacker@example.com',
                             admin_notified=True, visitor_notified=True,
                             source='/en/attacker', pk=999)
        self.assertEqual(response.status_code, 201)
        self.assertNotIn('attacker@example.com', str(mail.outbox))
        self.assertIn('/en/investment', mail.outbox[1].body)
        self.assertEqual(ConsultationRequest.objects.count(), 1)

    def test_escaped_html_for_untrusted_name(self):
        response = self.post(first_name='<script>alert(1)</script>')
        self.assertEqual(response.status_code, 201)
        for message in mail.outbox:
            html = message.alternatives[0][0]
            self.assertNotIn('<script>', html)
            self.assertIn('&lt;script&gt;', html)

    def test_one_email_failure_returns_202_and_retry_does_not_duplicate(self):
        with patch.object(EmailMultiAlternatives, 'send', side_effect=[1, RuntimeError('admin offline')]):
            response = self.post()
        self.assertEqual(response.status_code, 202, response.content)
        self.assertFalse(response.json()['notifications_sent'])
        saved = ConsultationRequest.objects.get()
        self.assertTrue(saved.visitor_notified)
        self.assertFalse(saved.admin_notified)
        self.assertEqual(saved.notification_error, 'admin_notified')
        self.assertTrue(notify_consultation(saved))
        saved.refresh_from_db()
        self.assertTrue(saved.visitor_notified and saved.admin_notified)
        self.assertEqual(saved.notification_error, '')
        self.assertEqual([message.to for message in mail.outbox], [['info@novanestholding.com']])
        self.assertTrue(notify_consultation(saved))
        self.assertEqual(len(mail.outbox), 1)

    def test_both_mail_failures_preserve_record_and_allow_retry(self):
        with patch.object(EmailMultiAlternatives, 'send', side_effect=RuntimeError('Graph unavailable')):
            response = self.post()
        self.assertEqual(response.status_code, 202)
        saved = ConsultationRequest.objects.get()
        self.assertFalse(saved.visitor_notified)
        self.assertFalse(saved.admin_notified)
        self.assertEqual(saved.notification_error, 'visitor_notified,admin_notified')
        self.assertTrue(notify_consultation(saved))
        self.assertEqual([msg.to for msg in mail.outbox], [
            ['nadia@example.com'], ['info@novanestholding.com'],
        ])

    def test_twenty_first_request_is_throttled_across_services(self):
        with patch.object(EmailMultiAlternatives, 'send', return_value=1):
            for i in range(20):
                service = 'investment' if i % 2 == 0 else 'acceleration'
                response = self.post(service=service)
                self.assertEqual(response.status_code, 201, response.content)
            rejected = self.post(service='entrepreneur-pnp')
        self.assertEqual(rejected.status_code, 429, rejected.content)
        self.assertEqual(ConsultationRequest.objects.count(), 20)
