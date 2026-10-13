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
            'email': 'candidate@example.com', 'age': 35,
            'country': 'Canada', 'city': 'Vancouver',
            'work_experience': 'Developer for five years',
            'education_degree': 'bachelor', 'language_level': 'advanced',
            'ielts_score': '7.5', 'assets_amount': '200000.00', 'assets_currency': 'CAD',
            'traveled_to_canada': True, 'visa_rejected': False,
            'visa_rejection_details': '', 'consent_to_share': True,
            'primaryEmail': 'attacker@example.com',  # deliberately forged: never authoritative
        }

    def test_saves_and_notifies_two_distinct_recipients(self):
        response = self.client.post(self.url, data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual(AffiliateApplication.objects.count(), 1)
        application = AffiliateApplication.objects.get()
        self.assertEqual(application.partner_primary_email, 'contact@partner.example')
        self.assertTrue(application.admin_notified)
        self.assertTrue(application.partner_notified)
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, ['info@novanestholding.com'])
        self.assertEqual(mail.outbox[1].to, ['contact@partner.example'])
        self.assertNotIn('attacker@example.com', str(mail.outbox))

    def test_unknown_slug_is_rejected(self):
        response = self.client.post('/affiliate-applications/not-real', data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(AffiliateApplication.objects.count(), 0)

    def test_refusal_requires_details(self):
        self.payload['visa_rejected'] = True
        response = self.client.post(self.url, data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('visa_rejection_details', response.json())

    def test_consent_required(self):
        self.payload['consent_to_share'] = False
        response = self.client.post(self.url, data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(AffiliateApplication.objects.count(), 0)

    @patch('forms.affiliate_applications.send_mail', side_effect=RuntimeError('smtp down'))
    def test_email_failure_preserves_record_for_admin_retry(self, _):
        response = self.client.post(self.url, data=self.payload, content_type='application/json')
        self.assertEqual(response.status_code, 202)
        application = AffiliateApplication.objects.get()
        self.assertFalse(application.admin_notified)
        self.assertFalse(application.partner_notified)
        self.assertTrue(application.notification_error)
