"""Reliable, independently retriable Contact Us notifications.

The company mailbox is compulsory even if the deployed environment still
contains the retired novanestventure.com address.
"""
import logging
from datetime import timezone as datetime_timezone

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email

from .email_service import render_standard_email

logger = logging.getLogger(__name__)


def build_contact_us_email(contact, role, recipients):
    """Render the existing common HTML/alternative with role-specific content."""
    reference = f'#{contact.pk}'
    if role == 'visitor':
        if contact.submission_language == 'fa':
            subject = 'نووانست هلدینگ | پیام شما دریافت شد'
            title = 'پیام شما دریافت شد'
            intro = f'{contact.name} عزیز، از تماس شما با نووانست هلدینگ سپاسگزاریم.'
            message = 'تیم ما در اولین فرصت با شما تماس خواهد گرفت.'
            rows = [('موضوع', contact.subject), ('پیام شما', contact.message)]
            note = 'این پیام به‌صورت خودکار برای تأیید دریافت درخواست شما ارسال شده است.'
            language = 'fa'
        else:
            subject = 'Thanks for contacting NovaNest Holding'
            title = 'We received your message'
            intro = f'Hello {contact.name}, thank you for contacting NovaNest Holding.'
            message = 'Our team will get back to you as soon as possible.'
            rows = [('Subject', contact.subject), ('Your message', contact.message)]
            note = 'This is an automated acknowledgement of your message.'
            language = 'en'
        reply_to = [settings.DEFAULT_FROM_EMAIL]
    elif role == 'admin':
        subject = f'[NovaNest Holding] New Contact Us message {reference}'
        title = 'New Contact Us message'
        intro = 'A visitor submitted the Contact Us form on the NovaNest Holding website.'
        message = ''
        date = contact.createdAt.astimezone(datetime_timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
        rows = [
            ('Submission ID', contact.pk),
            ('Name', contact.name),
            ('Email', contact.email),
            ('Phone number', contact.number),
            ('Subject', contact.subject),
            ('Message', contact.message),
            ('Submitted at', date),
            ('Source', 'Contact Us — About Us'),
        ]
        note = 'Internal notification. Please handle personal information confidentially.'
        language = 'en'
        reply_to = [contact.email]
    else:
        raise ValueError('Unknown Contact Us recipient role')

    plain, html = render_standard_email(
        title=title, intro=intro, message=message, rows=rows,
        note=note, language=language, preheader=subject,
    )
    email = EmailMultiAlternatives(
        subject=subject,
        body=plain,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=list(recipients),
        reply_to=reply_to,
    )
    email.attach_alternative(html, 'text/html')
    return email


def contact_admin_recipients():
    """Always notify the live company mailbox, ignoring the retired domain.

    Extra explicitly configured admin mailboxes are retained. Invalid extras
    are skipped so one stale configuration cannot suppress the company alert.
    """
    primary = getattr(settings, 'COMPANY_NOTIFICATION_EMAIL', 'info@novanestholding.com')
    recipients = [primary]
    for address in getattr(settings, 'MAILGUN_ADMIN_RECIPIENTS', []) or []:
        address = str(address).strip()
        if not address or address.lower().endswith('@novanestventure.com'):
            continue
        try:
            validate_email(address)
        except Exception:
            logger.warning('Contact Us: invalid additional admin email ignored')
            continue
        if address.lower() not in [value.lower() for value in recipients]:
            recipients.append(address)
    return recipients


def notify_contact_us(contact):
    """Attempt both roles independently, retrying only unsent messages.

    Provider acceptance is not final mailbox delivery; flags record acceptance.
    """
    deliveries = (
        ('visitor_notified', 'visitor', [contact.email]),
        ('admin_notified', 'admin', contact_admin_recipients()),
    )
    failed = []
    for field, role, addresses in deliveries:
        if getattr(contact, field):
            continue
        try:
            if not addresses:
                raise ValueError('No Contact Us recipient configured')
            accepted = build_contact_us_email(contact, role, addresses).send(fail_silently=False)
            if accepted != 1:
                raise RuntimeError('Email provider did not accept the Contact Us message')
            setattr(contact, field, True)
            contact.save(update_fields=[field])
        except Exception:
            logger.exception('Contact Us message %s: %s notification failed', contact.pk, role)
            failed.append(field)
    contact.notification_error = ','.join(failed)
    contact.save(update_fields=['notification_error'])
    return not failed
