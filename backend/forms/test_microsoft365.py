"""Microsoft Graph OAuth transport regression tests: never access the network."""
import base64
from email import policy
from email.parser import BytesParser
from unittest.mock import Mock, patch

from django.core.mail import EmailMultiAlternatives
from django.test import SimpleTestCase, override_settings

from .microsoft365 import Microsoft365MailError

SENDER = 'info@novanestholding.com'


def graph_result(status, payload=None):
    response = Mock()
    response.status_code = status
    response.json.return_value = payload or {}
    return response


@override_settings(
    EMAIL_BACKEND='forms.microsoft365.Microsoft365EmailBackend',
    MS365_TENANT_ID='11111111-1111-4111-8111-111111111111',
    MS365_CLIENT_ID='22222222-2222-4222-8222-222222222222',
    MS365_CLIENT_SECRET='dummy-secret-for-tests',
    MS365_SENDER_EMAIL=SENDER,
    DEFAULT_FROM_EMAIL=SENDER,
)
class Microsoft365BackendTests(SimpleTestCase):
    def make_email(self):
        msg = EmailMultiAlternatives(
            'Trial', 'Hello in plaintext', SENDER, ['test@example.com'],
            reply_to=['help@example.com'],
        )
        msg.attach_alternative('<p>Hello <b>HTML</b></p>', 'text/html')
        return msg

    @patch('forms.microsoft365.requests.post')
    def test_client_credentials_graph_mime_has_two_alternatives(self, post):
        post.side_effect = [
            graph_result(200, {'access_token': 'test-token'}),
            graph_result(202),
        ]
        self.assertEqual(self.make_email().send(), 1)
        self.assertEqual(post.call_count, 2)
        token_call, graph_call = post.call_args_list
        self.assertIn('/oauth2/v2.0/token', token_call.args[0])
        self.assertEqual(token_call.kwargs['data']['scope'],
                         'https://graph.microsoft.com/.default')
        self.assertIn('/v1.0/users/info%40novanestholding.com/sendMail', graph_call.args[0])
        self.assertEqual(graph_call.kwargs['headers']['Content-Type'], 'text/plain')
        mime = base64.b64decode(graph_call.kwargs['data'], validate=True)
        parsed = BytesParser(policy=policy.default).parsebytes(mime)
        self.assertEqual(parsed['Subject'], 'Trial')
        self.assertEqual(parsed['To'], 'test@example.com')
        self.assertEqual(parsed['Reply-To'], 'help@example.com')
        self.assertIn('text/plain', [part.get_content_type() for part in parsed.walk()])
        self.assertIn('text/html', [part.get_content_type() for part in parsed.walk()])
        self.assertIn('Hello in plaintext', mime.decode('utf-8', errors='replace') if b'Hello in plaintext' in mime else
                      ''.join(p.get_content() for p in parsed.walk() if p.get_content_type() == 'text/plain'))

    @patch('forms.microsoft365.requests.post')
    def test_send_rejected(self, post):
        post.side_effect = [graph_result(200, {'access_token': 'test-token'}),
                            graph_result(403, {'error': {'code': 'ErrorAccessDenied'}})]
        with self.assertRaisesRegex(Microsoft365MailError, 'HTTP 403'):
            self.make_email().send()

    @patch('forms.microsoft365.requests.post')
    def test_token_rejected(self, post):
        post.return_value = graph_result(401, {'error': 'invalid_client'})
        with self.assertRaisesRegex(Microsoft365MailError, 'authentication failed'):
            self.make_email().send()

    @patch('forms.microsoft365.requests.post')
    def test_mail_from_must_match_configured_mailbox(self, post):
        msg = self.make_email()
        msg.from_email = 'someone@example.com'
        with self.assertRaisesRegex(Microsoft365MailError, 'MS365_SENDER_EMAIL'):
            msg.send()
        post.assert_not_called()

    @patch('forms.microsoft365.requests.post')
    def test_bcc_routed_in_mime(self, post):
        post.side_effect = [graph_result(200, {'access_token': 'test-token'}),
                            graph_result(202)]
        msg = self.make_email()
        msg.bcc = ['hidden@example.com']
        self.assertEqual(msg.send(), 1)
        mime = base64.b64decode(post.call_args.kwargs['data'])
        parsed = BytesParser(policy=policy.default).parsebytes(mime)
        self.assertEqual(parsed['Bcc'], 'hidden@example.com')

    @override_settings(MS365_CLIENT_SECRET='')
    @patch('forms.microsoft365.requests.post')
    def test_missing_secret_fails_closed_without_network(self, post):
        with self.assertRaisesRegex(Microsoft365MailError, 'MS365_CLIENT_SECRET'):
            self.make_email().send()
        post.assert_not_called()
