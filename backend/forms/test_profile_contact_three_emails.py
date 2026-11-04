"""Profile-contact email routing, delivery state and retry regression tests.

Run from backend/: python manage.py test forms.test_profile_contact_three_emails
"""
from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.core.mail.message import EmailMultiAlternatives
from django.test import TestCase, override_settings
from django.urls import reverse

from .models import ProfileContact
from .profile_mentor_recipients import profile_mentor_recipient
from .registration_notifications import notify_registration


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
                   DEFAULT_FROM_EMAIL='info@novanestholding.com')
class ProfileContactThreeEmailsTests(TestCase):
    def setUp(self):
        cache.clear()

    def form(self, slug='pouya-azadeh', language='en'):
        return {
            'profileSlug': slug,
            'language': language,
            'firstName': 'Sample',
            'lastName': 'Visitor',
            'email': 'visitor@example.org',
            'phoneNumber': '+16045550100',
            'subject': 'Contact',
            'message': 'Please contact me about a project.',
        }

    def test_three_independent_recipients_and_reply_to(self):
        response = self.client.post(reverse('forms:contact-profile'), self.form())
        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(response.data['notifications_sent'])
        self.assertEqual(len(mail.outbox), 3)
        recipients = {tuple(message.to) for message in mail.outbox}
        self.assertEqual(recipients, {
            ('info@novanestholding.com',),
            ('visitor@example.org',),
            ('Pouyaazadeh36@gmail.com',),
        })
        mentor = next(msg for msg in mail.outbox if 'Pouyaazadeh36@gmail.com' in msg.to)
        self.assertEqual(mentor.reply_to, ['visitor@example.org'])
        self.assertIn('Please contact me about a project.', mentor.body)
        applicant = next(msg for msg in mail.outbox if 'visitor@example.org' in msg.to)
        self.assertEqual(applicant.reply_to, ['info@novanestholding.com'])
        saved = ProfileContact.objects.get(pk=response.data['reference'])
        self.assertTrue(saved.admin_notified)
        self.assertTrue(saved.applicant_notified)
        self.assertTrue(saved.mentor_notified)
        self.assertEqual(saved.notification_error, '')

    def test_persian_message_routes_to_radan(self):
        response = self.client.post(reverse('forms:contact-profile'),
                                    self.form(slug='arvin-radan', language='fa'))
        self.assertEqual(response.status_code, 201, response.content)
        mentor = next(msg for msg in mail.outbox if 'Info@radinsight.ca' in msg.to)
        self.assertIn('پیام جدید', mentor.subject)
        self.assertEqual(mentor.reply_to, ['visitor@example.org'])

    def test_all_current_mentor_recipients(self):
        expected = {
            'rasoul-moradimehr': 'Rasoul@novanestholding.com',
            'majid-soltanzadeh': 'jobdata@gmail.com',
            'arvin-radan': 'Info@radinsight.ca',
            'professor-radan': 'Info@radinsight.ca',
            'avesta-narimani': 'Rasnarim@gmail.com',
            'alireza-mobini': 'ar_mobini2009@yahoo.com',
            'pouya-azadeh': 'Pouyaazadeh36@gmail.com',
        }
        for slug, email in expected.items():
            with self.subTest(slug=slug):
                self.assertEqual(profile_mentor_recipient(slug)[1], email)

    def test_missing_and_unknown_profile_rejected_without_sending(self):
        for invalid in ('', 'missing-profile', 'soroush-azani'):
            data = self.form(invalid)
            if not invalid:
                data.pop('profileSlug')
            response = self.client.post(reverse('forms:contact-profile'), data)
            self.assertEqual(response.status_code, 400)
        self.assertEqual(ProfileContact.objects.count(), 0)
        self.assertEqual(len(mail.outbox), 0)

    def test_user_cannot_set_notification_status(self):
        response = self.client.post(reverse('forms:contact-profile'), {
            **self.form(), 'mentor_notified': 'true',
        })
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ProfileContact.objects.count(), 0)

    def test_only_failed_mentor_delivery_retries(self):
        original_send = EmailMultiAlternatives.send

        def fail_mentor_only(message, *args, **kwargs):
            if message.to == ['jobdata@gmail.com']:
                raise RuntimeError('Temporary mentor mailbox failure')
            return original_send(message, *args, **kwargs)

        with patch('forms.registration_notifications.EmailMultiAlternatives.send',
                   autospec=True, side_effect=fail_mentor_only):
            response = self.client.post(reverse('forms:contact-profile'),
                                        self.form('majid-soltanzadeh'))
        self.assertEqual(response.status_code, 202)
        self.assertFalse(response.data['notifications_sent'])
        saved = ProfileContact.objects.get(pk=response.data['reference'])
        self.assertTrue(saved.admin_notified)
        self.assertTrue(saved.applicant_notified)
        self.assertFalse(saved.mentor_notified)
        self.assertIn('mentor_notified', saved.notification_error)
        self.assertEqual(len(mail.outbox), 2)

        self.assertTrue(notify_registration(saved, 'Profile contact inquiry'))
        saved.refresh_from_db()
        self.assertTrue(saved.mentor_notified)
        self.assertEqual(saved.notification_error, '')
        self.assertEqual(len(mail.outbox), 3)
        self.assertEqual(mail.outbox[-1].to, ['jobdata@gmail.com'])

        self.assertTrue(notify_registration(saved, 'Profile contact inquiry'))
        self.assertEqual(len(mail.outbox), 3)
