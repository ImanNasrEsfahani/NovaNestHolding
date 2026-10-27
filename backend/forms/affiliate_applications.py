"""Affiliate-specific application endpoint and three independent HTML emails.

The affiliate recipient is resolved only from a server-owned, read-only JSON
registry. Never trust a recipient supplied in the POST body.
"""
import json
import logging
import os
import re
from datetime import timezone as datetime_timezone
from pathlib import Path

from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .email_service import render_standard_email
from .models import AffiliateApplication

logger = logging.getLogger(__name__)
SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
REGISTRY_PATH = Path(os.getenv('AFFILIATE_REGISTRY_PATH', '/app/affiliate-registry/ourTeamAffiliates.json'))
EDUCATION = ('high_school', 'bachelor', 'master', 'phd')
LEVELS = ('none', 'basic', 'intermediate', 'advanced')


def resolve_affiliate(slug):
    """Resolve a trusted partner and verified primary email from the server registry."""
    if not SLUG_RE.fullmatch(slug):
        return None
    with REGISTRY_PATH.open(encoding='utf-8') as fh:
        data = json.load(fh)
    for partner in data.get('affiliates', {}).get('partners', []):
        if partner.get('slug') != slug:
            continue
        primary = partner.get('primaryEmail', '').strip()
        if not primary:
            raise ValueError('Partner primaryEmail is required')
        validate_email(primary)
        return {'slug': slug, 'name': partner['name'], 'primary_email': primary}
    return None


class AffiliateApplicationSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=180, trim_whitespace=True)
    phone_number = serializers.RegexField(
        r'^\+[1-9]\d{7,14}$', max_length=16,
        error_messages={'invalid': 'Use international format, e.g. +14165550123.'},
    )
    email = serializers.EmailField(max_length=254)
    position = serializers.ChoiceField(choices=AffiliateApplication.POSITION_CHOICES)
    years_of_experience = serializers.ChoiceField(choices=AffiliateApplication.EXPERIENCE_CHOICES)
    industry_field = serializers.CharField(max_length=180, trim_whitespace=True, allow_blank=False)
    assets_range = serializers.ChoiceField(choices=AffiliateApplication.ASSETS_RANGE_CHOICES)
    education_degree = serializers.ChoiceField(choices=EDUCATION)
    language_level = serializers.ChoiceField(choices=LEVELS)
    traveled_to_canada = serializers.BooleanField()
    visa_rejected = serializers.BooleanField()
    # Optional for older clients. This is the UI language, not a recipient setting.
    language = serializers.ChoiceField(choices=('en', 'fa'), default='en', required=False)
    # Historical refusal details and consent are deliberately not accepted.


def application_details(application):
    """Single source of truth for all submitted fields, including legacy retries."""
    rows = [
        ('Application ID', str(application.pk)),
        ('Affiliate', application.affiliate_name),
        ('Affiliate slug', application.affiliate_slug),
        ('Full name', application.full_name),
        ('Phone', application.phone_number),
        ('Email', application.email),
    ]
    # Preserve legacy columns in emails retried from Django Admin.
    if application.position:
        rows.extend([
            ('Position', application.get_position_display()),
            ('Years of professional experience', application.get_years_of_experience_display()),
            ('Industry / field of work', application.industry_field),
        ])
    else:
        rows.extend([
            ('Age', str(application.age) if application.age is not None else 'Not provided'),
            ('Country', application.country),
            ('City', application.city),
            ('Work experience in last 5 years', application.work_experience),
        ])
    rows.extend([
        ('Education', application.get_education_degree_display()),
        ('Language level', application.get_language_level_display()),
    ])
    if application.position:
        rows.append(('Provable assets (USD)', application.get_assets_range_display()))
    else:
        rows.extend([
            ('IELTS score', str(application.ielts_score) if application.ielts_score is not None else 'Not provided'),
            ('Provable assets', f'{application.assets_amount} {application.assets_currency}'),
        ])
    rows.extend([
        ('Previously traveled to Canada', 'Yes' if application.traveled_to_canada else 'No'),
        ('Canadian visa previously rejected', 'Yes' if application.visa_rejected else 'No'),
    ])
    if application.visa_rejection_details:
        rows.append(('Visa refusal details', application.visa_rejection_details))
    if application.consented_at is not None:
        rows.append(('Consented to sharing', application.consented_at.isoformat()))
    if application.created_at is not None:
        submitted = application.created_at.astimezone(datetime_timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
        rows.append(('Submitted at', submitted))
    return rows


def delivery_body(application):
    """Keep a readable plaintext equivalent of the full application."""
    return '\n'.join(f'{label}: {value}' for label, value in application_details(application))


FA_LABELS = {
    'Application ID': 'شماره پیگیری',
    'Affiliate': 'افیلیت معرفی‌کننده',
    'Affiliate slug': 'شناسه افیلیت',
    'Full name': 'نام و نام خانوادگی',
    'Phone': 'شماره تماس',
    'Email': 'ایمیل',
    'Position': 'سمت شغلی',
    'Years of professional experience': 'سابقه حرفه‌ای',
    'Industry / field of work': 'حوزه فعالیت',
    'Education': 'تحصیلات',
    'Language level': 'سطح زبان',
    'Provable assets (USD)': 'دارایی قابل اثبات (دلار آمریکا)',
    'Previously traveled to Canada': 'سابقه سفر به کانادا',
    'Canadian visa previously rejected': 'سابقه ریجکتی ویزای کانادا',
    'Submitted at': 'زمان ثبت (UTC)',
    'Age': 'سن',
    'Country': 'کشور',
    'City': 'شهر',
    'Work experience in last 5 years': 'سوابق کاری در پنج سال گذشته',
    'IELTS score': 'نمره آیلتس',
    'Provable assets': 'دارایی قابل اثبات',
    'Visa refusal details': 'جزئیات ریجکتی ویزا',
    'Consented to sharing': 'زمان ثبت رضایت',
}
FA_VALUES = {
    'Yes': 'بله', 'No': 'خیر', 'Not provided': 'ثبت نشده',
    'Owner': 'مالک', 'Owner & CEO': 'مالک و مدیرعامل', 'CEO': 'مدیرعامل',
    'Senior Manager': 'مدیر ارشد', 'Other': 'سایر',
    'Less than 5 years': 'کمتر از ۵ سال', '5–10 years': '۵ تا ۱۰ سال',
    '10–20 years': '۱۰ تا ۲۰ سال', '20+ years': 'بیش از ۲۰ سال',
    'High school': 'دیپلم', 'Bachelor': 'کارشناسی', 'Master': 'کارشناسی ارشد',
    'PhD': 'دکتری', 'None': 'بدون مهارت', 'Basic': 'مقدماتی',
    'Intermediate': 'متوسط', 'Advanced': 'پیشرفته',
    'Less than US$300,000': 'کمتر از ۳۰۰ هزار دلار آمریکا',
    'US$300,000–US$500,000': '۳۰۰ تا ۵۰۰ هزار دلار آمریکا',
    'US$500,000–US$1 million': '۵۰۰ هزار تا یک میلیون دلار آمریکا',
    'US$1 million or more': 'یک میلیون دلار آمریکا یا بیشتر',
}


def message_spec(application, recipient_type):
    """Three distinct branded messages; applicant receives the form's language."""
    number = f'#{application.pk}'
    if recipient_type == 'admin':
        return {
            'subject': f'[NovaNest Holding] New affiliate application {number}',
            'title': 'New affiliate application',
            'intro': f'A new application was submitted through {application.affiliate_name}. The full submission is recorded below.',
            'note': 'For internal review. Please handle applicant information confidentially.',
            'language': 'en',
        }
    if recipient_type == 'partner':
        return {
            'subject': f'[NovaNest Holding] Affiliate application received {number}',
            'title': 'Application through your affiliate link',
            'intro': f'A new applicant has submitted a request to NovaNest Holding through {application.affiliate_name}. The complete application appears below.',
            'note': 'This information is provided for the authorized affiliate contact only. Please treat it confidentially.',
            'language': 'en',
        }
    if application.submission_language == 'fa':
        return {
            'subject': f'نووانست هلدینگ | تأیید دریافت درخواست {number}',
            'title': 'درخواست شما دریافت شد',
            'intro': f'{application.full_name} عزیز، درخواست شما از طریق {application.affiliate_name} با موفقیت ثبت شد. شماره پیگیری شما {number} است. نسخه‌ای از اطلاعات ثبت‌شده در ادامه آمده است.',
            'note': 'این ایمیل تأیید دریافت درخواست است و به معنی پذیرش یا تأیید نهایی نیست. برای پیگیری می‌توانید با info@novanestholding.com تماس بگیرید.',
            'language': 'fa',
        }
    return {
        'subject': f'[NovaNest Holding] We received your application {number}',
        'title': 'Your application has been received',
        'intro': f'Dear {application.full_name}, thank you for applying to NovaNest Holding through {application.affiliate_name}. Your reference number is {number}. A copy of your submitted information is below.',
        'note': 'This message confirms receipt, not acceptance or approval. For questions, contact info@novanestholding.com.',
        'language': 'en',
    }


def build_email(application, recipient_type, addresses, reply_to):
    spec = message_spec(application, recipient_type)
    localized = spec['language'] == 'fa'
    rows = application_details(application)
    if localized:
        rows = [(FA_LABELS.get(label, label), FA_VALUES.get(str(value), str(value))) for label, value in rows]
    plaintext, html = render_standard_email(
        title=spec['title'],
        intro=spec['intro'],
        rows=rows,
        note=spec['note'],
        language=spec['language'],
        preheader=spec['subject'],
    )
    email = EmailMultiAlternatives(
        subject=spec['subject'],
        body=plaintext,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=addresses,
        reply_to=reply_to,
    )
    email.attach_alternative(html, 'text/html')
    return email


def notify_application(application):
    """Send three independent messages with per-recipient flags and safe retries."""
    admins = [v.strip() for v in os.getenv(
        'AFFILIATE_APPLICATION_ADMIN_EMAILS', 'info@novanestholding.com'
    ).split(',') if v.strip()]
    # Every role receives its own message. Never include applicants as CC/BCC.
    recipients = [
        ('admin_notified', 'admin', admins, [application.email]),
        ('partner_notified', 'partner', [application.partner_primary_email], [application.email]),
        ('applicant_notified', 'applicant', [application.email], admins[:1] or ['info@novanestholding.com']),
    ]
    failed = []
    for field, recipient_type, addresses, reply_to in recipients:
        if getattr(application, field):
            continue
        try:
            if not addresses:
                raise ValueError('No recipient configured')
            sent = build_email(application, recipient_type, addresses, reply_to).send(fail_silently=False)
            if sent != 1:
                raise RuntimeError('SMTP did not accept the message')
            setattr(application, field, True)
            application.save(update_fields=[field])
        except Exception:
            logger.exception('Affiliate application %s notification to %s failed', application.pk, field)
            failed.append(field)
    application.notification_error = ','.join(failed)
    application.save(update_fields=['notification_error'])
    return not failed


class AffiliateApplicationThrottle(AnonRateThrottle):
    # Independent per-IP quota for affiliate application submissions.
    scope = 'affiliate_application'
    rate = '20/hour'


class AffiliateApplicationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AffiliateApplicationThrottle]
    http_method_names = ['post', 'options']

    def post(self, request, slug):
        try:
            affiliate = resolve_affiliate(slug)
        except (OSError, ValueError, KeyError, json.JSONDecodeError, DjangoValidationError):
            logger.exception('Affiliate application registry configuration error')
            return Response({'message': 'Application service is temporarily unavailable.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if affiliate is None:
            return Response({'message': 'Unknown affiliate.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AffiliateApplicationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        values = dict(serializer.validated_data)
        language = values.pop('language', 'en')
        application = AffiliateApplication.objects.create(
            affiliate_slug=affiliate['slug'], affiliate_name=affiliate['name'],
            partner_primary_email=affiliate['primary_email'],
            submission_language=language, **values,
        )
        delivered = notify_application(application)
        # Keep the valid application even if email delivery fails; never prompt resubmission.
        return Response({
            'reference': application.pk,
            'message': ('Application received. Notifications sent.' if delivered
                        else 'Application received. Email notifications are pending; please do not submit again.'),
            'notifications_sent': delivered,
        }, status=status.HTTP_201_CREATED if delivered else status.HTTP_202_ACCEPTED)
