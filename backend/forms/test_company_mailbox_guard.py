"""Regression tests for canonical NovaNest Contact Us admin routing.

Run: python manage.py test forms.test_company_mailbox_guard
"""
from django.core import mail
from django.test import TestCase, override_settings

from .contact_us_notifications import notify_contact_us
from .models import ContactUs


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='info@novanestholding.com',
    COMPANY_NOTIFICATION_EMAIL='info@novanestholding.com',
)
class CompanyMailboxTests(TestCase):
    def test_legacy_env_recipient_is_not_used(self):
        with override_settings(MAILGUN_ADMIN_RECIPIENTS=['info@novanestventure.com']):
            entry = ContactUs.objects.create(
                name='Example User', email='visitor@example.org',
                number='+16045550101', subject='Contact Us', message='Hello',
            )
            self.assertTrue(notify_contact_us(entry))
        self.assertEqual(len(mail.outbox), 2)
        self.assertEqual(mail.outbox[0].to, ['visitor@example.org'])
        self.assertEqual(mail.outbox[1].to, ['info@novanestholding.com'])
        entry.refresh_from_db()
        self.assertTrue(entry.admin_notified)
        self.assertTrue(entry.visitor_notified)

    def test_additional_valid_admin_and_primary_included(self):
        with override_settings(MAILGUN_ADMIN_RECIPIENTS=[
            'info@novanestventure.com', 'manager@example.org',
        ]):
            entry = ContactUs.objects.create(
                name='Example User', email='visitor@example.org',
                number='+16045550101', subject='Contact Us', message='Hello',
            )
            self.assertTrue(notify_contact_us(entry))
        self.assertEqual(mail.outbox[1].to,
                         ['info@novanestholding.com', 'manager@example.org'])

    def test_retry_skips_previously_accepted(self):
        entry = ContactUs.objects.create(
            name='Example User', email='visitor@example.org',
            number='+16045550101', subject='Contact Us', message='Hello',
        )
        self.assertTrue(notify_contact_us(entry))
        self.assertTrue(notify_contact_us(entry))
        self.assertEqual(len(mail.outbox), 2)


class OtherAdminMailboxesTests(TestCase):
    def test_registration_notifier_keeps_company_inbox_even_with_stale_env(self):
        import os
        from unittest.mock import patch
        from .registration_notifications import admin_recipients
        with patch.dict(os.environ, {
            'REGISTRATION_ADMIN_EMAILS': 'info@novanestventure.com,manager@example.org',
        }):
            self.assertEqual(admin_recipients(), [
                'info@novanestholding.com', 'manager@example.org',
            ])

    def test_public_affiliate_rejects_retired_mailbox(self):
        import os
        from unittest.mock import patch
        from .partner_membership_notifications import admin_recipients
        with patch.dict(os.environ, {
            'AFFILIATE_MEMBERSHIP_ADMIN_EMAILS': 'info@novanestventure.com,manager@example.org',
        }):
            self.assertEqual(admin_recipients(), [
                'info@novanestholding.com', 'manager@example.org',
            ])
