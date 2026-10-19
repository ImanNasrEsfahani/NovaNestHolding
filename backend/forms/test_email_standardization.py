"""Unified HTML mail formatting and serializer tests; all tests are network-free."""
from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase, override_settings

from .email_service import render_standard_email, send_branded_email
from .serializers import (
    ContactUsSerializer, EntrepreneurSerializer, InvestorRegistrationSerializer,
    PartnerMembershipSerializer, StartupFormSerializer,
)


class SharedEmailTemplateTests(SimpleTestCase):
    def test_shared_layout_has_brand_footer_and_plaintext(self):
        text, html = render_standard_email(
            title='Application received', intro='Thank you',
            rows=[('Name', 'Test User'), ('Reference', 123)],
        )
        self.assertIn('Name: Test User', text)
        self.assertIn('Reference: 123', text)
        self.assertIn('novanest-email-mark.png', html)
        self.assertIn('Synergy of energy', html)
        self.assertIn('info@novanestholding.com', html)
        self.assertIn('3833 Evergreen', html)
        self.assertIn('Application received', html)

    def test_form_values_are_html_escaped(self):
        text, html = render_standard_email(
            title='Test', rows=[('Comment', '<script>alert(1)</script>')],
        )
        self.assertIn('<script>', text)
        self.assertNotIn('<script>', html)
        self.assertIn('&lt;script&gt;', html)

    def test_farsi_layout(self):
        _, html = render_standard_email(title='درخواست شما', language='fa')
        self.assertIn('lang="fa"', html)
        self.assertIn('dir="rtl"', html)


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='test-sender@example.com',
)
class UnifiedMailTests(SimpleTestCase):
    def test_shared_sender_attaches_html_and_plaintext(self):
        from django.core import mail
        mail.outbox = []
        self.assertTrue(send_branded_email(
            'recipient@example.com', subject='Test', title='Sample',
            intro='Hello', rows=[('Reference', 123)],
        ))
        self.assertEqual(len(mail.outbox), 1)
        message = mail.outbox[0]
        self.assertEqual(message.from_email, 'test-sender@example.com')
        self.assertEqual(message.to, ['recipient@example.com'])
        self.assertIn('Reference: 123', message.body)
        self.assertIn('Synergy of energy', message.alternatives[0][0])
        self.assertEqual(message.alternatives[0][1], 'text/html')


@override_settings(MAILGUN_ADMIN_RECIPIENTS=['admin@example.com'])
class LegacySerializerEmailTests(SimpleTestCase):
    def setUp(self):
        self.example = SimpleNamespace(
            firstName='Amir', lastName='Example', name='Amir Example',
            email='example@sample.test', phone_number='+17789865432',
            productName='Demo Startup', subject='Inquiry', message='Hello!',
            companyName='Demo Company', pk=3,
        )

    def test_all_existing_forms_use_shared_sender(self):
        for serializer_class, expected_calls in (
            (StartupFormSerializer, 2),
            (ContactUsSerializer, 1),
            (PartnerMembershipSerializer, 1),
            (InvestorRegistrationSerializer, 1),
            (EntrepreneurSerializer, 1),
        ):
            with self.subTest(serializer=serializer_class.__name__):
                with patch('rest_framework.serializers.ModelSerializer.create', return_value=self.example):
                    with patch('forms.serializers.send_branded_email', return_value=True) as sender:
                        serializer_class().create({})
                        self.assertEqual(sender.call_count, expected_calls)
                        for args, kwargs in sender.call_args_list:
                            self.assertTrue(kwargs['subject'])
                            self.assertTrue(kwargs['title'])
                            self.assertNotIn('html', kwargs)
