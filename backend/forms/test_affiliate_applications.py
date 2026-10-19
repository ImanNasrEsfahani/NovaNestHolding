"""End-to-end API + in-memory email tests; no real email leaves the test runner."""
import json
import os
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings

from .models import AffiliateApplication
from .affiliate_applications import delivery_body, notify_application


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
                   DEFAULT_FROM_EMAIL='noreply@novanestholding.com')
class AffiliateApplicationTests(TestCase):
    def setUp(self):
        cache.clear()
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        registry = Path(self.temp.name) / 'ourTeamAffiliates.json'
        registry.write_text(json.dumps({
            'affiliates': {'partners': [
                {
                    'slug': 'sama-owj-middle-east',
                    'name': 'Sama Owj Middle East Travel Agency',
                    'emails': ['samaowj@novanestholding.com', 'info@samaowj.ir'],
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
        self.url = '/affiliate-applications/sama-owj-middle-east'
        self.payload = {
            'full_name': 'Example Applicant', 'phone_number': '+14165550123',
            'email': 'candidate@example.com',
            'position': 'owner_ceo', 'years_of_experience': '10_20',
            'industry_field': 'Travel and tourism', 'assets_range': '500k_1m',
            'education_degree': 'bachelor', 'language_level': 'advanced',
            'traveled_to_canada': True, 'visa_rejected': False,
            'language': 'en',
            'primaryEmail': 'attacker@example.com',  # never authoritative
        }

    def submit(self, url=None, data=None):
        return self.client.post(url or self.url, data=data or self.payload,
                                content_type='application/json')

    def test_three_distinct_html_and_plaintext_messages(self):
        response = self.submit()
        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(response.json()['notifications_sent'])
        application = AffiliateApplication.objects.get()
        self.assertEqual(application.partner_primary_email, 'info@samaowj.ir')
        self.assertTrue(application.admin_notified)
        self.assertTrue(application.partner_notified)
        self.assertTrue(application.applicant_notified)
        self.assertEqual(application.notification_error, '')
        self.assertEqual(len(mail.outbox), 3)
        self.assertEqual([item.to for item in mail.outbox], [
            ['info@novanestholding.com'], ['info@samaowj.ir'], ['candidate@example.com'],
        ])
        self.assertEqual(len(set(item.subject for item in mail.outbox)), 3)
        for item in mail.outbox:
            self.assertEqual(item.from_email, 'noreply@novanestholding.com')
            self.assertEqual(item.alternatives[0][1], 'text/html')
            html = item.alternatives[0][0]
            self.assertIn('NovaNest', html)
            self.assertIn('novanest-email-mark.png', html)
            self.assertIn('Synergy of energy', html)
            self.assertIn('3833 Evergreen', html)
            self.assertIn('application', html.lower())
            self.assertIn('info@novanestholding.com', html)
            self.assertIn('Example Applicant', html)
            self.assertIn('Travel and tourism', html)
            self.assertIn('US$500,000', html)
            self.assertIn('Example Applicant', item.body)
            self.assertIn('Previously traveled to Canada: Yes', item.body)
            self.assertIn('Canadian visa previously rejected: No', item.body)
            self.assertNotIn('attacker@example.com', item.body)
        self.assertEqual(mail.outbox[0].reply_to, ['candidate@example.com'])
        self.assertEqual(mail.outbox[1].reply_to, ['candidate@example.com'])
        self.assertEqual(mail.outbox[2].reply_to, ['info@novanestholding.com'])
        self.assertNotIn('attacker@example.com', str(mail.outbox))

    def test_second_affiliate_routes_only_to_its_primary(self):
        response = self.submit(url='/affiliate-applications/gohar-afarinan-farda')
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(AffiliateApplication.objects.get().partner_primary_email, 'info@goharafarinan.com')
        self.assertEqual(mail.outbox[1].to, ['info@goharafarinan.com'])

    def test_persian_applicant_confirmation_with_english_staff_notices(self):
        response = self.submit(data={**self.payload, 'language': 'fa'})
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(AffiliateApplication.objects.get().submission_language, 'fa')
        self.assertIn('New affiliate application', mail.outbox[0].subject)
        self.assertIn('Application through your affiliate', mail.outbox[1].alternatives[0][0])
        self.assertIn('تأیید دریافت درخواست', mail.outbox[2].subject)
        self.assertIn('شماره پیگیری', mail.outbox[2].body)
        self.assertIn('۵۰۰ هزار تا یک میلیون', mail.outbox[2].alternatives[0][0])
        self.assertIn('dir="rtl"', mail.outbox[2].alternatives[0][0])

    def test_unknown_slug_is_rejected(self):
        response = self.submit(url='/affiliate-applications/not-real')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(AffiliateApplication.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_refusal_yes_requires_no_details(self):
        response = self.submit(data={**self.payload, 'visa_rejected': True})
        self.assertEqual(response.status_code, 201, response.content)
        application = AffiliateApplication.objects.get()
        self.assertEqual(application.visa_rejection_details, '')
        self.assertIn('Canadian visa previously rejected: Yes', mail.outbox[0].body)

    def test_unrequested_fields_are_ignored(self):
        payload = {**self.payload, 'visa_rejected': True,
                   'visa_rejection_details': 'Do not email this',
                   'age': 38, 'country': 'Canada', 'city': 'Vancouver',
                   'work_experience': 'Legacy free text', 'ielts_score': '8.0',
                   'assets_amount': '999999999.00', 'assets_currency': 'CAD'}
        response = self.submit(data=payload)
        self.assertEqual(response.status_code, 201, response.content)
        application = AffiliateApplication.objects.get()
        self.assertIsNone(application.age)
        self.assertEqual(application.country, '')
        self.assertEqual(application.city, '')
        self.assertEqual(application.work_experience, '')
        self.assertIsNone(application.ielts_score)
        self.assertIsNone(application.assets_amount)
        for item in mail.outbox:
            self.assertNotIn('Do not email this', item.body)
            self.assertNotIn('Legacy free text', item.body)
            self.assertNotIn('IELTS score:', item.body)

    def test_no_fabricated_consent(self):
        response = self.submit()
        self.assertEqual(response.status_code, 201, response.content)
        self.assertIsNone(AffiliateApplication.objects.get().consented_at)
        for item in mail.outbox:
            self.assertNotIn('Consented to sharing', item.body)

    @patch('forms.affiliate_applications.EmailMultiAlternatives.send', side_effect=RuntimeError('SMTP down'))
    def test_smtp_outage_preserves_application_and_all_pending(self, mock_send):
        response = self.submit()
        self.assertEqual(response.status_code, 202, response.content)
        application = AffiliateApplication.objects.get()
        self.assertFalse(application.admin_notified)
        self.assertFalse(application.partner_notified)
        self.assertFalse(application.applicant_notified)
        self.assertEqual(application.notification_error, 'admin_notified,partner_notified,applicant_notified')
        self.assertEqual(mock_send.call_count, 3)

    def test_partial_failure_retry_only_resends_failed_role(self):
        with patch('forms.affiliate_applications.EmailMultiAlternatives.send',
                   side_effect=[1, RuntimeError('partner SMTP failure'), 1]) as send:
            response = self.submit()
            self.assertEqual(send.call_count, 3)
        self.assertEqual(response.status_code, 202)
        application = AffiliateApplication.objects.get()
        self.assertTrue(application.admin_notified)
        self.assertFalse(application.partner_notified)
        self.assertTrue(application.applicant_notified)
        self.assertEqual(application.notification_error, 'partner_notified')
        self.assertTrue(notify_application(application))
        application.refresh_from_db()
        self.assertTrue(application.partner_notified)
        self.assertEqual(application.notification_error, '')
        self.assertEqual([item.to for item in mail.outbox], [['info@samaowj.ir']])
        self.assertTrue(notify_application(application))
        self.assertEqual(len(mail.outbox), 1)

    def test_all_required_fields(self):
        for field in ('position', 'years_of_experience', 'industry_field', 'assets_range'):
            with self.subTest(field=field):
                response = self.submit(data={key: value for key, value in self.payload.items() if key != field})
                self.assertEqual(response.status_code, 400, response.content)
                self.assertIn(field, response.json())
        self.assertEqual(AffiliateApplication.objects.count(), 0)

    def test_choice_and_language_validation(self):
        for field, value in (
            ('position', 'invented_title'), ('years_of_experience', '0'),
            ('industry_field', '   '), ('assets_range', 'CAD'), ('language', 'invalid'),
            ('position', ''), ('years_of_experience', ''), ('assets_range', ''),
        ):
            with self.subTest(field=field, value=value):
                # Each invalid value is an independent validation scenario.
                # The real view throttles after 5 requests/hour; without a
                # cache reset, later scenarios incorrectly receive HTTP 429.
                cache.clear()
                response = self.submit(data={**self.payload, field: value})
                self.assertEqual(response.status_code, 400, response.content)
                self.assertIn(field, response.json())
        self.assertEqual(AffiliateApplication.objects.count(), 0)

    def test_throttle_still_blocks_the_sixth_request(self):
        # Keep the production throttle at 5/hour. All requests intentionally
        # fail validation, proving invalid requests count towards this limit.
        invalid = {**self.payload, 'position': 'invalid-position'}
        for attempt in range(5):
            with self.subTest(attempt=attempt + 1):
                response = self.submit(data=invalid)
                self.assertEqual(response.status_code, 400, response.content)
        response = self.submit(data=invalid)
        self.assertEqual(response.status_code, 429, response.content)
        self.assertEqual(AffiliateApplication.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_older_frontend_language_defaults_to_english(self):
        response = self.submit(data={key: value for key, value in self.payload.items() if key != 'language'})
        self.assertEqual(response.status_code, 201)
        self.assertEqual(AffiliateApplication.objects.get().submission_language, 'en')

    def test_html_escapes_untrusted_field_content(self):
        payload = {**self.payload, 'industry_field': '<script>alert(1)</script>'}
        response = self.submit(data=payload)
        self.assertEqual(response.status_code, 201, response.content)
        for item in mail.outbox:
            self.assertNotIn('<script>', item.alternatives[0][0])
            self.assertIn('&lt;script&gt;', item.alternatives[0][0])

    def test_historical_email_includes_legacy_details(self):
        from django.utils import timezone
        old = AffiliateApplication(
            affiliate_slug='sama-owj-middle-east', affiliate_name='Sama Owj Middle East',
            partner_primary_email='info@samaowj.ir', full_name='Historic Applicant',
            phone_number='+14165550123', email='historic@example.com',
            age=42, country='Canada', city='Vancouver',
            work_experience='Legacy record', education_degree='bachelor',
            language_level='advanced', ielts_score='7.5',
            assets_amount='450000.00', assets_currency='CAD',
            traveled_to_canada=True, visa_rejected=False, consented_at=timezone.now(),
        )
        content = delivery_body(old)
        self.assertIn('Work experience in last 5 years: Legacy record', content)
        self.assertIn('Provable assets: 450000.00 CAD', content)
        self.assertNotIn('Position:', content)
        self.assertIn('Consented to sharing:', content)

    def test_historical_record_does_not_receive_late_applicant_email(self):
        # Migration 0005 sets applicant_notified=True on all preexisting rows.
        self.submit()
        application = AffiliateApplication.objects.get()
        application.admin_notified = False
        application.partner_notified = True
        application.applicant_notified = True
        application.save(update_fields=['admin_notified', 'partner_notified', 'applicant_notified'])
        mail.outbox.clear()
        self.assertTrue(notify_application(application))
        self.assertEqual([item.to for item in mail.outbox], [['info@novanestholding.com']])
