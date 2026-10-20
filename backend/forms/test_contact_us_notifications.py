"""Contact Us API and two independent Graph-style email notifications.

All tests use Django locmem email and an isolated test database. No network.
"""
from unittest.mock import patch

from django.core import mail
from django.core.mail.message import EmailMultiAlternatives
from django.test import TestCase, override_settings

from .contact_us_notifications import notify_contact_us
from .models import ContactUs


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='info@novanestholding.com',
    MAILGUN_ADMIN_RECIPIENTS=['info@novanestholding.com'],
)
class ContactUsNotificationTests(TestCase):
    URL = '/contactUs-form'

    def setUp(self):
        self.payload = {
            'name': 'Mina Karimi',
            'email': 'mina@example.com',
            'number': '+17785550123',
            'subject': 'Contact Us',
            'message': 'I would like information about NovaNest in Canada.',
            'language': 'en',
        }

    def submit(self, **changes):
        return self.client.post(self.URL, data={**self.payload, **changes})

    def test_two_distinct_emails_with_full_admin_details(self):
        response = self.submit()
        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(response.json()['notifications_sent'])
        contact = ContactUs.objects.get()
        self.assertEqual(contact.name, 'Mina Karimi')
        self.assertEqual(contact.number, '+17785550123')
        self.assertTrue(contact.visitor_notified)
        self.assertTrue(contact.admin_notified)
        self.assertEqual(contact.notification_error, '')
        self.assertEqual([msg.to for msg in mail.outbox], [
            ['mina@example.com'], ['info@novanestholding.com'],
        ])
        visitor, admin = mail.outbox
        self.assertEqual(visitor.subject, 'Thanks for contacting NovaNest Holding')
        self.assertEqual(visitor.reply_to, ['info@novanestholding.com'])
        self.assertIn('Hello Mina Karimi,', visitor.body)
        self.assertIn('Our team will get back to you as soon as possible.', visitor.body)
        self.assertIn('I would like information', visitor.body)
        self.assertEqual(admin.reply_to, ['mina@example.com'])
        self.assertIn('New Contact Us message', admin.subject)
        for expected in ('Mina Karimi', '+17785550123', 'mina@example.com',
                         'Contact Us', 'I would like information', 'Submission ID:',
                         'Submitted at:', 'Source: Contact Us'):
            self.assertIn(expected, admin.body)
        for item in mail.outbox:
            self.assertEqual(item.from_email, 'info@novanestholding.com')
            self.assertEqual(item.alternatives[0][1], 'text/html')
            self.assertIn('novanest-email-mark.png', item.alternatives[0][0])
            self.assertIn('Synergy of energy', item.alternatives[0][0])

    def test_persian_submission_receives_farsi_confirmation_only(self):
        response = self.submit(language='fa')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactUs.objects.get().submission_language, 'fa')
        self.assertIn('پیام شما دریافت شد', mail.outbox[0].subject)
        self.assertIn('dir="rtl"', mail.outbox[0].alternatives[0][0])
        self.assertIn('New Contact Us message', mail.outbox[1].subject)

    def test_invalid_fields_rejected_before_save_or_email(self):
        for changes in ({'email': 'invalid'}, {'name': ' '}, {'number': ''},
                        {'message': ' '}, {'language': 'es'}):
            with self.subTest(changes=changes):
                response = self.submit(**changes)
                self.assertEqual(response.status_code, 400, response.content)
        self.assertEqual(ContactUs.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_blank_subject_uses_safe_default(self):
        response = self.submit(subject='')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ContactUs.objects.get().subject, 'Contact Us')

    def test_one_delivery_failure_keeps_saved_contact_and_other_email(self):
        # Fail the visitor, deliver the admin; do not prompt user to resubmit.
        with patch.object(EmailMultiAlternatives, 'send', side_effect=[RuntimeError('offline'), 1]):
            response = self.submit()
        self.assertEqual(response.status_code, 202, response.content)
        self.assertFalse(response.json()['notifications_sent'])
        contact = ContactUs.objects.get()
        self.assertFalse(contact.visitor_notified)
        self.assertTrue(contact.admin_notified)
        self.assertEqual(contact.notification_error, 'visitor_notified')
        self.assertTrue(notify_contact_us(contact))
        contact.refresh_from_db()
        self.assertTrue(contact.visitor_notified)
        self.assertTrue(contact.admin_notified)
        self.assertEqual([msg.to for msg in mail.outbox], [['mina@example.com']])
        self.assertEqual(contact.notification_error, '')
        self.assertTrue(notify_contact_us(contact))
        self.assertEqual(len(mail.outbox), 1)

    def test_both_fail_can_be_retried_and_preserve_record(self):
        with patch.object(EmailMultiAlternatives, 'send', side_effect=RuntimeError('offline')):
            response = self.submit()
        self.assertEqual(response.status_code, 202)
        contact = ContactUs.objects.get()
        self.assertFalse(contact.visitor_notified)
        self.assertFalse(contact.admin_notified)
        self.assertEqual(contact.notification_error, 'visitor_notified,admin_notified')
        self.assertTrue(notify_contact_us(contact))
        self.assertEqual([msg.to for msg in mail.outbox], [
            ['mina@example.com'], ['info@novanestholding.com'],
        ])

    def test_untrusted_browser_admin_email_is_ignored(self):
        response = self.submit(admin_email='intruder@example.com',
                               visitor_notified=True, admin_notified=True)
        self.assertEqual(response.status_code, 201, response.content)
        self.assertNotIn('intruder@example.com', str([m.to for m in mail.outbox]))
        self.assertEqual(mail.outbox[1].to, ['info@novanestholding.com'])

    def test_html_escaping_of_untrusted_message(self):
        response = self.submit(message='<script>alert(1)</script>')
        self.assertEqual(response.status_code, 201)
        for item in mail.outbox:
            html = item.alternatives[0][0]
            self.assertNotIn('<script>', html)
            self.assertIn('&lt;script&gt;', html)
