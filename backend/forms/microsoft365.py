"""Microsoft 365 / Microsoft Graph mail backend, with OAuth2 app credentials.

Uses Graph v1.0 sendMail with RFC 5322 MIME base64 so each Django
EmailMultiAlternatives retains its HTML and plain-text alternatives, reply-to,
and any attachments. A 202 response means *accepted*, not necessarily delivered.

Permissions: Microsoft Graph -> Application permission Mail.Send; admin consent.
Restrict this application's mailbox access using Exchange application RBAC.
"""

import base64
import logging
from email.policy import SMTP
from email.utils import getaddresses
from uuid import UUID
from urllib.parse import quote

import requests
from django.conf import settings
from django.core.mail.backends.base import BaseEmailBackend
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

logger = logging.getLogger(__name__)

TOKEN_TIMEOUT = (10, 20)
SEND_TIMEOUT = (10, 30)


class Microsoft365MailError(RuntimeError):
    """A Microsoft 365 configuration, authentication, or send failure."""


def _configuration():
    tenant = str(getattr(settings, 'MS365_TENANT_ID', '') or '').strip()
    client_id = str(getattr(settings, 'MS365_CLIENT_ID', '') or '').strip()
    client_secret = str(getattr(settings, 'MS365_CLIENT_SECRET', '') or '').strip()
    sender = str(getattr(settings, 'MS365_SENDER_EMAIL', '') or '').strip()
    missing = [name for name, value in (
        ('MS365_TENANT_ID', tenant),
        ('MS365_CLIENT_ID', client_id),
        ('MS365_CLIENT_SECRET', client_secret),
        ('MS365_SENDER_EMAIL', sender),
    ) if not value]
    if missing:
        raise Microsoft365MailError('Microsoft 365 settings missing: ' + ', '.join(missing))
    try:
        UUID(tenant)
        UUID(client_id)
        validate_email(sender)
    except (ValueError, ValidationError) as exc:
        raise Microsoft365MailError('Invalid Microsoft 365 tenant/client ID or sender email') from exc
    return tenant, client_id, client_secret, sender


def _graph_error(response):
    """Limit error text to status and error code, never disclose response body or tokens."""
    code = ''
    try:
        result = response.json()
        if isinstance(result, dict):
            err = result.get('error', '')
            code = err.get('code', '') if isinstance(err, dict) else str(err)
    except (ValueError, TypeError):
        pass
    return f'HTTP {response.status_code}' + (f' ({str(code)[:70]})' if code else '')


def _access_token(tenant, client_id, client_secret):
    url = f'https://login.microsoftonline.com/{quote(tenant, safe="")}/oauth2/v2.0/token'
    try:
        response = requests.post(
            url,
            data={
                'client_id': client_id,
                'client_secret': client_secret,
                'grant_type': 'client_credentials',
                'scope': 'https://graph.microsoft.com/.default',
            },
            timeout=TOKEN_TIMEOUT,
            allow_redirects=False,
        )
    except requests.RequestException as exc:
        raise Microsoft365MailError('Microsoft 365 token endpoint unreachable') from exc
    if response.status_code != 200:
        raise Microsoft365MailError('Microsoft 365 authentication failed: ' + _graph_error(response))
    try:
        token = response.json().get('access_token', '')
    except (ValueError, AttributeError) as exc:
        raise Microsoft365MailError('Microsoft 365 returned an invalid token response') from exc
    if not isinstance(token, str) or not token:
        raise Microsoft365MailError('Microsoft 365 returned no access token')
    return token


def _send_one(message):
    tenant, client_id, client_secret, sender = _configuration()
    # Using an arbitrary From address would impersonate a mailbox. Require
    # the configured Microsoft 365 sender for ALL backend email paths.
    if (message.from_email or '').strip().casefold() != sender.casefold():
        raise Microsoft365MailError(
            'Message From must equal MS365_SENDER_EMAIL. '
            'Check DEFAULT_FROM_EMAIL and any explicit from_email arguments.'
        )

    recipient_fields = [getattr(message, key, None) or [] for key in ('to', 'cc', 'bcc')]
    recipients = [addr for group in recipient_fields for _, addr in getaddresses(group)]
    if not recipients:
        raise Microsoft365MailError('At least one recipient email is required')
    try:
        for recipient in recipients:
            validate_email(recipient)
    except ValidationError as exc:
        raise Microsoft365MailError('Invalid recipient address') from exc

    mime = message.message()
    # Django's SMTP backend passes Bcc in the envelope, not MIME. Graph's
    # MIME-only endpoint needs Bcc in the RFC 5322 message for routing.
    if message.bcc:
        mime['Bcc'] = ', '.join(message.bcc)
    raw = mime.as_bytes(policy=SMTP)
    payload = base64.b64encode(raw).decode('ascii')
    token = _access_token(tenant, client_id, client_secret)
    url = f'https://graph.microsoft.com/v1.0/users/{quote(sender, safe="")}/sendMail'
    try:
        response = requests.post(
            url,
            headers={
                'Authorization': f'Bearer {token}',
                'Content-Type': 'text/plain',  # Graph's MIME base64 mode
            },
            data=payload,
            timeout=SEND_TIMEOUT,
            allow_redirects=False,
        )
    except requests.RequestException as exc:
        # Ambiguous: Graph may have accepted the request before the timeout.
        # Caller should check Sent Items before reattempting to avoid duplicates.
        raise Microsoft365MailError(
            'Microsoft Graph send request failed; delivery state may be unknown'
        ) from exc
    if response.status_code != 202:
        raise Microsoft365MailError('Microsoft Graph sendMail rejected request: ' + _graph_error(response))
    logger.info('Microsoft Graph accepted email (subject=%s; recipients=%s)',
                message.subject, len(recipients))
    return 1


class Microsoft365EmailBackend(BaseEmailBackend):
    """Drop-in replacement for Django's SMTP EmailBackend using Graph OAuth2."""

    def send_messages(self, email_messages):
        if not email_messages:
            return 0
        sent = 0
        for message in email_messages:
            try:
                sent += _send_one(message)
            except Exception:
                if not self.fail_silently:
                    raise
                logger.exception('Microsoft 365 email could not be accepted')
        return sent
