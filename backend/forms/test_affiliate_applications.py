import json
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from .models import AffiliateApplication


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
                   DEFAULT_FROM_EMAIL='noreply@novanestholding.com')
class AffiliateApplicationTests(TestCase):
    def setUp(self):
        cache.clear()
        self.temp = TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        registry = Path(self.temp.name) / 'ourTeamAffiliates.json'
        registry.write_text(json.dumps({
            'affiliates': {'partners': [{
                'slug': 'sama-owj-middle-east',
                'name': 'Sama Owj Middle East',
                'emails': ['contact@partner.example', 'info@partner.example'],
                'primaryEmail': 'contact@partner.example',
            }]}
        }), encoding='utf-8')
        self.patcher = patch('forms.affiliate_applications.REGISTRY_PATH', registry)
        self.patcher.start()
        self.addCleanup(self.patcher.stop)
        self.url = '/affiliate-applications/sama-owj-middle-east'
        self.payload = {
            'full_name': 'Example Applicant', 'phone_number': '+14165550123',
            'email': 'candidate@example.com',
            'position': 'owner_ceo', 'years_of_experience': '10_20',
            'industry_field': 'Travel and tourism', 'assets_range': '500k_1m',
            'education_degree': 'bachelor', 'language_level': 'advanced',
            'traveled_to_canada': True, 'visa_rejected': False,
            'visa_rejection_details': '',
            'primaryEmail': 'attacker@example.com',  # deliberately forged: never authoritative
        }

    def test_saves_and_notifies_two_distinct_recipients(self):
        response = self.client.post(self.url, data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(AffiliateApplication.objects.count(), 1)
        application = AffiliateApplication.objects.get()
        self.assertEqual(application.partner_primary_email, 'contact@partner.example')
        self.assertEqual(application.position, 'owner_ceo')
        self.assertEqual(application.years_of_experience, '10_20')
        self.assertEqual(application.industry_field, 'Travel and tourism')
        self.assertEqual(application.assets_range, '500k_1m')
        self.assertIsNone(application.age)
        self.assertEqual(application.country, '')
        self.assertEqual(application.work_experience, '')
        self.assertTrue(application.admin_notified)
        self.assertTrue(application.partner_notified)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, ['info@novanestholding.com'])
        self.assertEqual(mail.outbox[1].to, ['contact@partner.example'])
        self.assertNotIn('attacker@example.com', str(mail.outbox))
        self.assertIn('Owner & CEO', mail.outbox[0].body)
        self.assertIn('US$500,000–US$1 million', mail.outbox[0].body)
        self.assertNotIn('IELTS score:', mail.outbox[0].body)
        self.assertNotIn('Work experience in last 5 years:', mail.outbox[0].body)

    def test_unknown_slug_is_rejected(self):
        response = self.client.post('/affiliate-applications/not-real', data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(AffiliateApplication.objects.count(), 0)

    def test_refusal_requires_details(self):
        self.payload['visa_rejected'] = True
        response = self.client.post(self.url, data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('visa_rejection_details', response.json())

    def test_submission_does_not_require_or_fabricate_consent(self):
        response = self.client.post(self.url, data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 201, response.content)
        application = AffiliateApplication.objects.get()
        self.assertIsNone(application.consented_at)
        self.assertNotIn('Consented to sharing', mail.outbox[0].body)
        self.assertNotIn('Consented to sharing', mail.outbox[1].body)

    @patch('forms.affiliate_applications.send_mail', side_effect=RuntimeError('smtp down'))
    def test_email_failure_preserves_record_for_admin_retry(self, _):
        response = self.client.post(self.url, data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 202)
        application = AffiliateApplication.objects.get()
        self.assertFalse(application.admin_notified)
        self.assertFalse(application.partner_notified)
        self.assertTrue(application.notification_error)

    def test_structured_fields_are_required(self):
        for field in ('position', 'years_of_experience', 'industry_field', 'assets_range'):
            with self.subTest(field=field):
                data = {k: v for k, v in self.payload.items() if k != field}
                response = self.client.post(self.url, data=data, content_type='application/json')
                self.assertEqual(response.status_code, 400, response.content)
                self.assertIn(field, response.json())
        self.assertEqual(AffiliateApplication.objects.count(), 0)

    def test_structured_fields_reject_invalid_values(self):
        for field, value in (
            ('position', 'invented_title'),
            ('years_of_experience', '0'),
            ('industry_field', '   '),
            ('assets_range', 'CAD'),
        ):
            with self.subTest(field=field):
                data = {**self.payload, field: value}
                response = self.client.post(self.url, data=data, content_type='application/json')
                self.assertEqual(response.status_code, 400, response.content)
                self.assertIn(field, response.json())
        self.assertEqual(AffiliateApplication.objects.count(), 0)

    def test_legacy_payload_keys_are_not_stored_or_emailed(self):
        data = {**self.payload, 'age': 38, 'country': 'Canada', 'city': 'Vancouver',
                'work_experience': 'Legacy free text', 'ielts_score': '8.0',
                'assets_amount': '999999999.00', 'assets_currency': 'CAD'}
        response = self.client.post(self.url, data=data, content_type='application/json')
        self.assertEqual(response.status_code, 201, response.content)
        application = AffiliateApplication.objects.get()
        self.assertIsNone(application.age)
        self.assertEqual(application.country, '')
        self.assertEqual(application.city, '')
        self.assertEqual(application.work_experience, '')
        self.assertIsNone(application.ielts_score)
        self.assertIsNone(application.assets_amount)
        self.assertEqual(application.assets_currency, '')
        self.assertNotIn('Legacy free text', mail.outbox[0].body)

    def test_select_placeholders_cannot_be_submitted(self):
        for field in ('position', 'years_of_experience', 'assets_range'):
            with self.subTest(field=field):
                data = {**self.payload, field: ''}
                response = self.client.post(self.url, data=data, content_type='application/json')
                self.assertEqual(response.status_code, 400, response.content)
                self.assertIn(field, response.json())
        self.assertEqual(AffiliateApplication.objects.count(), 0)

    def test_pending_legacy_email_retains_historical_details(self):
        from django.utils import timezone
        from .affiliate_applications import delivery_body
        old = AffiliateApplication(
            affiliate_slug='sama-owj-middle-east', affiliate_name='Sama Owj Middle East',
            partner_primary_email='contact@partner.example', full_name='Historic Applicant',
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
