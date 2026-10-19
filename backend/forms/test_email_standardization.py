"""Shared email layout and legacy-form regression tests (network-free)."""
from types import SimpleNamespace
from unittest.mock import patch

from django.test import SimpleTestCase, override_settings

from .email_service import render_standard_email
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


@override_settings(MAILGUN_ADMIN_RECIPIENTS=['admin@example.com'])
class LegacySerializerEmailTests(SimpleTestCase):
    def setUp(self):
        self.example = SimpleNamespace(
            firstName='Amir', lastName='Example', name='Amir Example',
            email='example@sample.test', phone_number='+17789865432',
            productName='Demo Startup', subject='Inquiry', message='Hello!',
            companyName='Demo Company', pk=3,
        )

    def test_all_legacy_forms_use_shared_sender(self):
        for serializer_class, expected_calls in (
            (StartupFormSerializer, 2),
            (ContactUsSerializer, 1),
            (PartnerMembershipSerializer, 1),
            (InvestorRegistrationSerializer, 1),
            (EntrepreneurSerializer, 1),
        ):
            with self.subTest(serializer=serializer_class.__name__):
                with patch('rest_framework.serializers.ModelSerializer.create', return_value=self.example):
                    with patch('forms.serializers.send_branded_brevo_email', return_value=True) as sender:
                        serializer_class().create({})
                        self.assertEqual(sender.call_count, expected_calls)
                        for args, kwargs in sender.call_args_list:
                            self.assertTrue(kwargs['subject'])
                            self.assertTrue(kwargs['title'])
                            self.assertNotIn('html', kwargs)


@override_settings(
    BREVO_SMTP_HOST='example.invalid', BREVO_SMTP_PORT=587,
    BREVO_SMTP_LOGIN='smtp-login@example.com',
    BREVO_SMTP_PASSWORD='placeholder-test-password',
    BREVO_FROM_EMAIL='sender@example.com',
    MAILGUN_DOMAIN='example.invalid',
    MAILGUN_API_KEY='placeholder-test-key',
    MAILGUN_FROM_EMAIL='sender@example.com',
)
class TransportFallbackTests(SimpleTestCase):
    def test_brevo_direct_calls_without_html_use_shared_template(self):
        from .brevo import send_brevo_email
        with patch('forms.brevo.smtplib.SMTP') as smtp:
            self.assertTrue(send_brevo_email('recipient@example.com', 'Test', 'Hi'))
            sent = smtp.return_value.__enter__.return_value.send_message.call_args[0][0]
            body = sent.get_body(preferencelist=('html',))
            self.assertIsNotNone(body)
            self.assertIn('Synergy of energy', body.get_content())

    def test_mailgun_direct_calls_without_html_use_shared_template(self):
        from .mailgun import send_mailgun_message
        with patch('forms.mailgun.requests.post') as sender:
            sender.return_value.status_code = 200
            result = send_mailgun_message('recipient@example.com', 'Test', 'Hi')
            self.assertIs(result, sender.return_value)
            data = sender.call_args.kwargs['data']
            self.assertIn('Synergy of energy', data['html'])
            self.assertEqual(data['text'], 'Hi')
