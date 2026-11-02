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
    # Company inbox is mandatory even when extra admins are configured.
    configured = os.getenv('AFFILIATE_MEMBERSHIP_ADMIN_EMAILS', '')
    extras = [item.strip() for item in configured.split(',') if item.strip()]
    addresses = ['info@novanestholding.com']
    for address in extras:
        if address.lower().endswith('@novanestventure.com'):
            continue
        try:
            validate_email(address)
        except Exception:
            logger.warning('Ignoring invalid extra affiliate admin recipient')
            continue
        if address not in addresses:
            addresses.append(address)
    return addresses


AFFILIATE_FIELDS = (
    ('firstName', 'First name', 'نام'),
    ('lastName', 'Last name', 'نام خانوادگی'),
    ('email', 'Email', 'ایمیل'),
    ('phoneNumber', 'Phone number', 'شماره تماس'),
    ('countryOfResidence', 'Country of residence', 'کشور محل اقامت'),
    ('provinceOfResidence', 'Province of residence', 'استان محل اقامت'),
    ('cityOfResidence', 'City of residence', 'شهر محل اقامت'),
    ('companyName', 'Company name', 'نام شرکت'),
    ('website', 'Website', 'وب‌سایت'),
    ('linkedin', 'LinkedIn', 'لینکدین'),
    ('briefIntroduction', 'Brief introduction', 'معرفی کوتاه'),
    ('howDidYouKnowUs', 'How did you hear about us?', 'نحوه آشنایی با ما'),
    # Historical fields are shown when populated, preserving older records.
    ('birthDate', 'Birth date', 'تاریخ تولد'),
    ('investmentCeiling', 'Maximum investment', 'سقف سرمایه‌گذاری'),
)


def registration_rows(entry, language=None):
    """Render all saved nonempty inputs for both recipients; no blank placeholders."""
    language = language or ('fa' if entry.submission_language == 'fa' else 'en')
    fa = language == 'fa'
    rows = [('شماره پیگیری' if fa else 'Reference', f'#{entry.pk}')]
    for attribute, english, persian in AFFILIATE_FIELDS:
        value = getattr(entry, attribute, '')
        if value is None:
            continue
        shown = str(value).strip()
        if shown:
            rows.append((persian if fa else english, shown))
    rows.append((
        'زمان ثبت (UTC)' if fa else 'Submitted at (UTC)',
        entry.createdAt.astimezone(datetime_timezone.utc).strftime('%Y-%m-%d %H:%M UTC'),
    ))
    return rows


def build_registration_email(entry, role, addresses):
    reference = f'#{entry.pk}'
    language = 'fa' if entry.submission_language == 'fa' else 'en'
    fa = language == 'fa'
    full_name = f'{entry.firstName} {entry.lastName}'.strip()

    if role == 'admin':
        if fa:
            subject = f'[NovaNest Holding] درخواست جدید همکاری {reference}'
            title = 'درخواست جدید همکاری'
            intro = 'یک درخواست همکاری جدید دریافت شد. اطلاعات ثبت‌شده در ادامه آمده است.'
            note = 'فقط برای بررسی داخلی.'
        else:
            subject = f'[NovaNest Holding] New affiliate registration {reference}'
            title = 'New affiliate registration'
            intro = 'A new affiliate registration was received. Submitted details follow.'
            note = 'For internal review only.'
        reply_to = [entry.email]
    elif role == 'applicant':
        if fa:
            subject = f'نووانست هلدینگ | تأیید دریافت درخواست همکاری {reference}'
            title = 'درخواست همکاری دریافت شد'
            intro = f'{full_name} گرامی، درخواست همکاری شما با شماره پیگیری {reference} ثبت شد و بررسی خواهد شد.'
            note = 'این پیام صرفاً تأیید دریافت درخواست است و به معنی پذیرش نهایی نیست.'
        else:
            subject = f'NovaNest Holding | Affiliate registration received {reference}'
            title = 'Affiliate registration received'
            intro = f'Dear {full_name}, we received your affiliate registration ({reference}) and will review it.'
            note = 'This confirms receipt only, not acceptance.'
        reply_to = ['info@novanestholding.com']
    else:
        raise ValueError('Unknown affiliate registration email role')

    plain, html = render_standard_email(
        title=title, intro=intro, rows=registration_rows(entry, language),
        note=note, language=language, preheader=subject,
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
