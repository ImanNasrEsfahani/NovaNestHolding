"""Brevo SMTP transport for NovaNest Holding emails.

A message without supplied HTML is wrapped in default_email.html, so calling
this transport directly cannot accidentally generate an unbranded plain email.
"""
from __future__ import annotations

import logging
import os
import smtplib
from email.message import EmailMessage
from typing import Iterable, Optional, Union

from django.conf import settings
from django.template.loader import render_to_string

logger = logging.getLogger(__name__)


def _get_smtp_config() -> tuple[str, int, Optional[str], Optional[str], Optional[str]]:
    host = getattr(settings, 'BREVO_SMTP_HOST', None) or os.getenv('BREVO_SMTP_HOST', 'smtp-relay.brevo.com')
    port = int(getattr(settings, 'BREVO_SMTP_PORT', os.getenv('BREVO_SMTP_PORT', 587)))
    login = getattr(settings, 'BREVO_SMTP_LOGIN', None) or os.getenv('BREVO_SMTP_LOGIN')
    password = getattr(settings, 'BREVO_SMTP_PASSWORD', None) or os.getenv('BREVO_SMTP_PASSWORD')
    default_from = getattr(settings, 'BREVO_FROM_EMAIL', None) or os.getenv('BREVO_FROM_EMAIL')
    return host, port, login, password, default_from


def _normalize_list(x: Optional[Union[str, Iterable[str]]]) -> list[str]:
    if not x:
        return []
    if isinstance(x, str):
        return [p.strip() for p in x.replace(';', ',').split(',') if p.strip()]
    return list(x)


def send_brevo_email(
    to: Union[str, Iterable[str]],
    subject: str,
    text: str,
    html: Optional[str] = None,
    from_email: Optional[str] = None,
    cc: Optional[Union[str, Iterable[str]]] = None,
    bcc: Optional[Union[str, Iterable[str]]] = None,
    timeout: int = 10,
) -> bool:
    """Send a multipart text/HTML message through the existing Brevo settings."""
    host, port, login, password, default_from = _get_smtp_config()
    if not login or not password:
        logger.error('Brevo SMTP credentials not configured (BREVO_SMTP_LOGIN/BREVO_SMTP_PASSWORD)')
        raise RuntimeError('Brevo SMTP credentials not configured')

    from_addr = from_email or default_from or login
    to_list = _normalize_list(to)
    cc_list = _normalize_list(cc)
    bcc_list = _normalize_list(bcc)
    if not to_list:
        raise ValueError('No recipients provided for send_brevo_email')

    if html is None:
        html = render_to_string('default_email.html', {
            'title': subject, 'message': text, 'preheader': subject, 'language': 'en',
        })

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = ', '.join(to_list)
    if cc_list:
        msg['Cc'] = ', '.join(cc_list)
    msg.set_content(text)
    msg.add_alternative(html, subtype='html')

    all_recipients = to_list + cc_list + bcc_list
    logger.debug('Sending Brevo SMTP message from %s to %s via %s:%s', from_addr, all_recipients, host, port)
    with smtplib.SMTP(host, port, timeout=timeout) as smtp:
        smtp.ehlo()
        if port == 587:
            smtp.starttls()
            smtp.ehlo()
        smtp.login(login, password)
        smtp.send_message(msg, from_addr=from_addr, to_addrs=all_recipients)
    logger.info('Brevo email sent to %s (subject=%s)', all_recipients, subject)
    return True


__all__ = ['send_brevo_email']
