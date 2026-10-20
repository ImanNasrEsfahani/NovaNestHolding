"""Network-free tests for bilingual Startup Validation emails and safe retry."""
from unittest.mock import patch

from django.core import mail
from django.core.mail.message import EmailMultiAlternatives
from django.test import TestCase, override_settings

from .models import StartUpsForm
from .startup_validation_notifications import (
    notify_startup_validation, startup_validation_email,
)


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='info@novanestholding.com',
    MAILGUN_ADMIN_RECIPIENTS=['legacy-admin@example.com'],
)
class StartupValidationNotificationTests(TestCase):
    URL = '/startups-form'

    def setUp(self):
        self.payload = {
            'firstName': 'Nadia', 'lastName': 'Rostami',
            'email': 'nadia@example.com', 'phoneNumber': '+17785550124',
            'countryOfResidence': 'Canada', 'cityOfResidence': 'Vancouver',
            'startupType': 'MVP', 'productName': 'MapleFlow AI',
            'customerProblem': 'Manual workflow costs time',
            'uniqueValueProposition': 'Automated, secure workflows',
            'technologyReadinessLevel': 'TRL 5',
            'monetizationOfYourPlan': 'Monthly subscription',
            'neededCapital': 'CAD 250,000',
            'howDidYouKnowUs': 'Our website',
            'language': 'en',
        }

    def submit(self, **changes):
        return self.client.post(self.URL, data={**self.payload, **changes})

    def test_english_submission_sends_exactly_two_emails_and_saves_details(self):
        response = self.submit()
        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(response.json()['notifications_sent'])
        saved = StartUpsForm.objects.get()
        self.assertEqual(saved.submission_language, 'en')
        self.assertEqual(saved.phoneNumber, '+17785550124')
        self.assertEqual(saved.cityOfResidence, 'Vancouver')
        self.assertEqual(saved.uniqueValueProposition, 'Automated, secure workflows')
        self.assertTrue(saved.applicant_notified and saved.admin_notified)
        self.assertEqual([m.to for m in mail.outbox], [
            ['nadia@example.com'], ['info@novanestholding.com'],
        ])
        applicant, admin = mail.outbox
        self.assertEqual(applicant.from_email, 'info@novanestholding.com')
        self.assertEqual(applicant.reply_to, ['info@novanestholding.com'])
        self.assertIn('Startup validation', applicant.subject)
        self.assertIn('Nadia Rostami', applicant.body)
        self.assertIn('MapleFlow AI', applicant.body)
        self.assertIn('New startup validation', admin.subject)
        self.assertEqual(admin.reply_to, ['nadia@example.com'])
        for text in ('Nadia', 'Rostami', '+17785550124', 'Vancouver',
                     'MVP', 'MapleFlow AI', 'Automated, secure workflows',
                     'TRL 5', 'Monthly subscription', 'CAD 250,000',
                     'Our website', 'Submission reference'):
            self.assertIn(text, admin.body)
        for message in mail.outbox:
            self.assertEqual(message.alternatives[0][1], 'text/html')
            self.assertIn('Synergy of energy', message.alternatives[0][0])
            self.assertIn('novanest-email-mark.png', message.alternatives[0][0])

    def test_farsi_submission_produces_two_farsi_messages(self):
        response = self.submit(language='fa')
        self.assertEqual(response.status_code, 201, response.content)
        applicant, admin = mail.outbox
        for m in (applicant, admin):
            self.assertIn('نووانست', m.subject)
            self.assertIn('dir="rtl"', m.alternatives[0][0])
        self.assertIn('درخواست ارزیابی استارتاپ', applicant.body)
        self.assertIn('شماره تماس', admin.body)
        self.assertIn('ارزش پیشنهادی', admin.body)
        self.assertEqual(admin.to, ['info@novanestholding.com'])
        self.assertEqual(StartUpsForm.objects.get().submission_language, 'fa')

    def test_invalid_submission_does_not_save_or_send(self):
        for payload in (
            {'email': 'not-an-email'}, {'firstName': '  '},
            {'lastName': ''}, {'phoneNumber': ''},
            {'startupType': ''}, {'language': 'invalid'},
        ):
            with self.subTest(payload=payload):
                response = self.submit(**payload)
                self.assertEqual(response.status_code, 400, response.content)
        self.assertEqual(StartUpsForm.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_one_failed_email_does_not_block_other_and_retry_only_failed(self):
        with patch.object(EmailMultiAlternatives, 'send', side_effect=[RuntimeError('offline'), 1]):
            response = self.submit()
        self.assertEqual(response.status_code, 202, response.content)
        self.assertFalse(response.json()['notifications_sent'])
        saved = StartUpsForm.objects.get()
        self.assertFalse(saved.applicant_notified)
        self.assertTrue(saved.admin_notified)
        self.assertEqual(saved.notification_error, 'applicant_notified')
        self.assertTrue(notify_startup_validation(saved))
        self.assertEqual([m.to for m in mail.outbox], [['nadia@example.com']])
        self.assertTrue(saved.applicant_notified)
        self.assertEqual(saved.notification_error, '')
        self.assertTrue(notify_startup_validation(saved))
        self.assertEqual(len(mail.outbox), 1)

    def test_both_failed_can_be_retried_independently(self):
        with patch.object(EmailMultiAlternatives, 'send', side_effect=RuntimeError('offline')):
            response = self.submit()
        self.assertEqual(response.status_code, 202, response.content)
        saved = StartUpsForm.objects.get()
        self.assertFalse(saved.admin_notified)
        self.assertFalse(saved.applicant_notified)
        self.assertTrue(notify_startup_validation(saved))
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(saved.notification_error, '')

    def test_browser_cannot_set_admin_email_or_delivery_flags(self):
        response = self.submit(admin_email='attacker@example.com',
                               admin_notified=True, applicant_notified=True)
        self.assertEqual(response.status_code, 201, response.content)
        self.assertEqual([m.to for m in mail.outbox], [
            ['nadia@example.com'], ['info@novanestholding.com']])

    def test_untrusted_html_is_escaped_and_filenames_are_not_attachments(self):
        response = self.submit(customerProblem='<script>alert(1)</script>')
        self.assertEqual(response.status_code, 201)
        for m in mail.outbox:
            html = m.alternatives[0][0]
            self.assertNotIn('<script>', html)
        self.assertIn('&lt;script&gt;', mail.outbox[1].alternatives[0][0])
        startup = StartUpsForm.objects.get()
        startup.pitchDeckFile.name = 'pitchdeckfile/my-pitch.pdf'
        generated = startup_validation_email(startup, 'admin', ['info@novanestholding.com'])
        self.assertIn('my-pitch.pdf', generated.body)
        self.assertFalse(generated.attachments)
