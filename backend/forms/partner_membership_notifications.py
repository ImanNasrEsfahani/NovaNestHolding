"""Reliable email notifications for the PUBLIC Affiliate Registration page.

Separate from partner-specific AffiliateApplication / AffiliateInquiry flows.
Database storage is authoritative; each message's provider acceptance is tracked
independently. A failed recipient can be retried without resending accepted mail.
"""
import logging
import os
from datetime import timezone as datetime_timezone

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email

from .email_service import render_standard_email

logger = logging.getLogger(__name__)


def admin_recipients():
    # Dedicated public-form recipient; no environment variable change needed.
    configured = os.getenv('AFFILIATE_MEMBERSHIP_ADMIN_EMAILS', 'info@novanestholding.com')
    addresses = list(dict.fromkeys(item.strip() for item in configured.split(',') if item.strip()))
    for address in addresses:
        validate_email(address)
    return addresses


def registration_rows(entry):
    return [
        ('Reference', f'#{entry.pk}'),
        ('First name', entry.firstName),
        ('Last name', entry.lastName),
        ('Email', entry.email),
        ('Phone number', entry.phoneNumber),
        ('Country of residence', entry.countryOfResidence),
        ('Province of residence', entry.provinceOfResidence),
        ('City of residence', entry.cityOfResidence),
        ('Company name', entry.companyName),
        ('Website', entry.website),
        ('LinkedIn', entry.linkedin),
        ('Brief introduction', entry.briefIntroduction),
        ('How did you know us?', entry.howDidYouKnowUs),
        ('Submitted (UTC)', entry.createdAt.astimezone(datetime_timezone.utc).strftime('%Y-%m-%d %H:%M UTC')),
    ]


def build_registration_email(entry, role, addresses):
    reference = f'#{entry.pk}'
    if role == 'admin':
        subject = f'[NovaNest Holding] New Affiliate Registration {reference}'
        title = 'New affiliate registration'
        intro = f'A new public affiliate application was received from {entry.firstName} {entry.lastName}.'
        message = 'The submitted information is shown below for your review.'
        rows = registration_rows(entry)
        note = 'Internal review only; keep applicant information confidential.'
        reply_to = [entry.email]
    elif role == 'applicant':
        subject = 'Thanks for joining our partner network'
        title = 'Partner registration received'
        intro = f'Hello {entry.firstName}, thank you for your interest in the NovaNest Holding partner network.'
        message = f'Our partnerships team will review your registration (reference {reference}).'
        rows = [
            ('Reference', reference),
            ('Applicant', f'{entry.firstName} {entry.lastName}'.strip()),
            ('Email', entry.email),
            ('Company', entry.companyName),
        ]
        note = 'This message confirms receipt of your registration, not acceptance.'
        reply_to = ['info@novanestholding.com']
    else:
        raise ValueError('Unknown affiliate registration email role')
    plain, html = render_standard_email(
        title=title, intro=intro, message=message, rows=rows, note=note,
        language='en', preheader=subject,
    )
    email = EmailMultiAlternatives(
        subject=subject, body=plain, from_email=settings.DEFAULT_FROM_EMAIL,
        to=addresses, reply_to=reply_to,
    )
    email.attach_alternative(html, 'text/html')
    return email


def notify_partner_membership(entry):
    """Return True only if Microsoft Graph accepted both messages.

    The request record exists before this function is called. Preserve it even
    when Microsoft Graph is unavailable. Existing 'sent' flags survive retry.
    """
    try:
        admins = admin_recipients()
    except Exception:
        logger.exception('Affiliate registration %s: invalid admin recipient setting', entry.pk)
        admins = []
    messages = (
        ('applicant_notified', 'applicant', [entry.email]),
        ('admin_notified', 'admin', admins),
    )
    failed = []
    for field, role, addresses in messages:
        if getattr(entry, field):
            continue
        try:
            if not addresses:
                raise ValueError('Affiliate registration email has no recipient')
            count = build_registration_email(entry, role, addresses).send(fail_silently=False)
            if count != 1:
                raise RuntimeError('Email provider did not accept affiliate registration notification')
            setattr(entry, field, True)
            entry.save(update_fields=[field])
        except Exception:
            logger.exception('Affiliate registration %s: %s notification pending', entry.pk, role)
            failed.append(field)
    entry.notification_error = ','.join(failed)
    entry.save(update_fields=['notification_error'])
    return not failed
