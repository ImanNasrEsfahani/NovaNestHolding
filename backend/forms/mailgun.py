"""Mailgun HTTP transport with the same default NovaNest email template.

Maintains the existing API and returns a requests.Response or None. Any caller
which omits HTML gets the shared branded HTML automatically.
"""
import logging
from typing import Iterable, Optional, Union

import requests
from django.conf import settings
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def _get_mailgun_config():
    domain = getattr(settings, 'MAILGUN_DOMAIN', None)
    api_key = getattr(settings, 'MAILGUN_API_KEY', None)
    from_email = getattr(settings, 'MAILGUN_FROM_EMAIL', None)
    return domain, api_key, from_email


def send_mailgun_message(
    to: Union[str, Iterable[str]],
    subject: str,
    text: str,
    html: Optional[str] = None,
    from_email: Optional[str] = None,
    cc: Optional[Union[str, Iterable[str]]] = None,
    bcc: Optional[Union[str, Iterable[str]]] = None,
    timeout: int = 10,
) -> Optional[requests.Response]:
    domain, api_key, default_from = _get_mailgun_config()
    if not domain or not api_key:
        logger.error('Mailgun not configured: MAILGUN_DOMAIN or MAILGUN_API_KEY missing')
        return None
    from_email = from_email or default_from
    if not from_email:
        logger.error('Mailgun from address not configured (MAILGUN_FROM_EMAIL)')
        return None

    def _norm(items):
        if items is None:
            return None
        if isinstance(items, str):
            return [v.strip() for v in items.replace(';', ',').split(',') if v.strip()]
        return list(items)

    to_list = _norm(to)
    if not to_list:
        logger.error('Mailgun recipients not configured')
        return None
    cc_list = _norm(cc)
    bcc_list = _norm(bcc)
    if html is None:
        html = render_to_string('default_email.html', {
            'title': subject, 'message': text, 'preheader': subject, 'language': 'en',
        })

    data = {
        'from': from_email,
        'to': to_list,
        'subject': subject,
        'text': text,
        'html': html,
    }
    if cc_list:
        data['cc'] = cc_list
    if bcc_list:
        data['bcc'] = bcc_list

    url = f'https://api.mailgun.net/v3/{domain}/messages'
    try:
        resp = requests.post(url, auth=('api', api_key), data=data, timeout=timeout)
        resp.raise_for_status()
        logger.info('Mailgun message sent to %s (subject=%s) status=%s', to_list, subject, resp.status_code)
        return resp
    except requests.RequestException:
        logger.exception('Mailgun send failed (subject=%s)', subject)
        return None


def send_simple_message():
    domain, api_key, from_email = _get_mailgun_config()
    if not domain or not api_key or not from_email:
        logger.error('Mailgun configuration incomplete for send_simple_message')
        return None
    admin_recipients = getattr(settings, 'MAILGUN_ADMIN_RECIPIENTS', None)
    if not admin_recipients:
        logger.error('MAILGUN_ADMIN_RECIPIENTS not set; cannot send_simple_message')
        return None
    return send_mailgun_message(
        to=admin_recipients,
        subject='Hello NovaNestVenture',
        text='Congratulations NovaNestVenture, you just sent an email with Mailgun! You are truly awesome!',
        from_email=from_email,
    )


__all__ = ['send_mailgun_message', 'send_simple_message']
