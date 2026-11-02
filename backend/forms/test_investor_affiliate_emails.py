"""Two recipients, short distinct copy, complete submitted data, and safe retries.

Run from backend/: python manage.py test forms.test_investor_affiliate_emails
No real email is sent: Django's in-memory email backend is used.
"""
import os
from unittest.mock import patch

from django.core import mail
from django.test import TestCase, override_settings

from .models import InvestorRegistration, PartnerMembership
from .partner_membership_notifications import notify_partner_membership
from .registration_notifications import notify_registration

ADMIN = 'info@novanestholding.com'
APPLICANT = 'applicant@example.org'


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL=ADMIN,
)
class InvestorAndAffiliateEmailTests(TestCase):
    def make_investor(self, language='en'):
        return InvestorRegistration.objects.create(
            firstName='Mina', lastName='Example', email=APPLICANT,
            phoneNumber='+16045550123', countryOfResidence='Canada',
            provinceOfResidence='British Columbia', companyName='Example Investments',
            investmentCeiling='150000', preferredAreas='Energy and AI',
            howDidYouKnowUs='LinkedIn', submission_language=language,
        )

    def make_affiliate(self, language='en'):
        return PartnerMembership.objects.create(
            firstName='Mina', lastName='Example', email=APPLICANT,
            phoneNumber='+16045550123', countryOfResidence='Canada',
            provinceOfResidence='British Columbia', cityOfResidence='Vancouver',
            companyName='Example Partners', website='https://example.org',
            linkedin='https://linkedin.com/company/example',
            briefIntroduction='Business development and referrals',
            howDidYouKnowUs='From a colleague', submission_language=language,
        )

    def assert_two_independent_messages(self, entry, fields, language):
        entry.refresh_from_db()
        self.assertTrue(entry.applicant_notified)
        self.assertTrue(entry.admin_notified)
        self.assertEqual(entry.notification_error, '')
        self.assertEqual(len(mail.outbox), 2)

        admin = next(msg for msg in mail.outbox if ADMIN in msg.to)
        applicant = next(msg for msg in mail.outbox if msg.to == [APPLICANT])
        self.assertNotEqual(admin.subject, applicant.subject)
        self.assertIn(f'#{entry.pk}', admin.body)
        self.assertIn(f'#{entry.pk}', applicant.body)
        for value in fields:
            self.assertIn(value, admin.body)
            self.assertIn(value, applicant.body)
        self.assertEqual(admin.reply_to, [APPLICANT])
        self.assertEqual(applicant.reply_to, [ADMIN])
        self.assertNotEqual(admin.body, applicant.body)
        self.assertTrue(admin.alternatives)
        self.assertTrue(applicant.alternatives)
        self.assertIn(f'lang="{language}"', admin.alternatives[0][0])
        self.assertIn(f'lang="{language}"', applicant.alternatives[0][0])
        self.assertLess(len(admin.body.split('\n\n')[1]), 260)
        self.assertLess(len(applicant.body.split('\n\n')[1]), 300)

    def test_investor_both_emails_english(self):
        entry = self.make_investor()
        with patch.dict(os.environ, {'REGISTRATION_ADMIN_EMAILS': 'extra@example.org'}):
            self.assertTrue(notify_registration(entry, 'Investor Registration'))
        self.assert_two_independent_messages(
            entry, ['Mina', APPLICANT, '+16045550123', 'Canada',
                    'Example Investments', '150000', 'Energy and AI', 'LinkedIn'], 'en',
        )

    def test_investor_both_emails_persian(self):
        entry = self.make_investor('fa')
        self.assertTrue(notify_registration(entry, 'Investor Registration'))
        self.assert_two_independent_messages(
            entry, ['Mina', APPLICANT, 'Example Investments', 'Energy and AI'], 'fa',
        )
        self.assertIn('ثبت‌نام سرمایه‌گذار', mail.outbox[0].body)

    def test_affiliate_both_emails_english(self):
        entry = self.make_affiliate()
        with patch.dict(os.environ, {'AFFILIATE_MEMBERSHIP_ADMIN_EMAILS': 'extra@example.org'}):
            self.assertTrue(notify_partner_membership(entry))
        self.assert_two_independent_messages(
            entry, ['Mina', APPLICANT, '+16045550123', 'Vancouver',
                    'Example Partners', 'https://example.org',
                    'https://linkedin.com/company/example',
                    'Business development and referrals', 'From a colleague'], 'en',
        )

    def test_affiliate_both_emails_persian(self):
        entry = self.make_affiliate('fa')
        self.assertTrue(notify_partner_membership(entry))
        self.assert_two_independent_messages(
            entry, ['Mina', APPLICANT, 'Example Partners', 'Business development and referrals'], 'fa',
        )
        self.assertIn('درخواست همکاری', mail.outbox[0].body)

    def test_investor_retry_sends_only_pending_role(self):
        entry = self.make_investor()
        with patch('forms.registration_notifications.EmailMultiAlternatives.send',
                   side_effect=[RuntimeError('Temporary mail outage'), 1]) as sender:
            self.assertFalse(notify_registration(entry, 'Investor Registration'))
            self.assertEqual(sender.call_count, 2)
        entry.refresh_from_db()
        self.assertFalse(entry.admin_notified)
        self.assertTrue(entry.applicant_notified)
        self.assertIn('admin_notified', entry.notification_error)
        self.assertTrue(notify_registration(entry, 'Investor Registration'))
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(ADMIN, mail.outbox[0].to)
        self.assertEqual(InvestorRegistration.objects.count(), 1)

    def test_affiliate_retry_sends_only_pending_role(self):
        entry = self.make_affiliate()
        with patch('forms.partner_membership_notifications.EmailMultiAlternatives.send',
                   side_effect=[1, RuntimeError('Temporary mail outage')]) as sender:
            self.assertFalse(notify_partner_membership(entry))
            self.assertEqual(sender.call_count, 2)
        entry.refresh_from_db()
        self.assertTrue(entry.applicant_notified)
        self.assertFalse(entry.admin_notified)
        self.assertTrue(notify_partner_membership(entry))
        self.assertEqual(len(mail.outbox), 1)
        self.assertIn(ADMIN, mail.outbox[0].to)
        self.assertEqual(PartnerMembership.objects.count(), 1)

    def test_retry_when_all_sent_does_not_duplicate_emails(self):
        investor = self.make_investor()
        affiliate = self.make_affiliate()
        self.assertTrue(notify_registration(investor, 'Investor Registration'))
        self.assertTrue(notify_partner_membership(affiliate))
        self.assertEqual(len(mail.outbox), 4)
        self.assertTrue(notify_registration(investor, 'Investor Registration'))
        self.assertTrue(notify_partner_membership(affiliate))
        self.assertEqual(len(mail.outbox), 4)
