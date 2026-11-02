"""Public Affiliate Registration must not lose stored input when email fails."""
from unittest.mock import patch

from django.test import override_settings
from rest_framework.test import APITestCase

from .models import PartnerMembership


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='info@novanestholding.com',
)
class PartnerMembershipSubmissionTests(APITestCase):
    url = '/partner-membership'
    payload = {
        'firstName': 'Test',
        'lastName': 'Affiliate',
        'email': 'test@example.org',
        'phoneNumber': '+16045550123',
        'countryOfResidence': 'Canada',
        'cityOfResidence': 'Vancouver',
        'companyName': 'Test Example Ltd',
        'website': 'https://example.org',
        'linkedin': 'https://linkedin.com/company/example',
        'briefIntroduction': 'Long introduction about collaboration and services.',
        'howDidYouKnowUs': 'A' * 1100,
        'language': 'en',
    }

    def test_records_all_fields_and_sends_both_emails(self):
        from django.core import mail

        response = self.client.post(self.url, self.payload, format='multipart')
        self.assertEqual(response.status_code, 201, response.data)
        entry = PartnerMembership.objects.get(pk=response.data['reference'])
        self.assertTrue(entry.applicant_notified)
        self.assertTrue(entry.admin_notified)
        self.assertTrue(response.data['notifications_sent'])
        self.assertIsNone(entry.birthDate)  # Not displayed in the public form.
        for field in (
            'firstName', 'lastName', 'email', 'phoneNumber', 'countryOfResidence',
            'cityOfResidence', 'companyName', 'website', 'linkedin',
            'briefIntroduction', 'howDidYouKnowUs',
        ):
            self.assertEqual(getattr(entry, field), self.payload[field])
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, ['test@example.org'])
        self.assertEqual(mail.outbox[1].to, ['info@novanestholding.com'])

    def test_email_failure_never_discards_saved_registration(self):
        with patch(
            'forms.partner_membership_notifications.build_registration_email',
            side_effect=RuntimeError('Simulated Graph outage'),
        ):
            response = self.client.post(self.url, self.payload, format='multipart')
        self.assertEqual(response.status_code, 202, response.data)
        self.assertFalse(response.data['notifications_sent'])
        entry = PartnerMembership.objects.get(pk=response.data['reference'])
        self.assertEqual(entry.email, self.payload['email'])
        self.assertEqual(entry.briefIntroduction, self.payload['briefIntroduction'])
        self.assertFalse(entry.applicant_notified)
        self.assertFalse(entry.admin_notified)
        self.assertIn('applicant_notified', entry.notification_error)

    def test_invalid_email_does_not_create_partial_registration(self):
        payload = {**self.payload, 'email': 'not-an-email'}
        response = self.client.post(self.url, payload, format='multipart')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(PartnerMembership.objects.count(), 0)
