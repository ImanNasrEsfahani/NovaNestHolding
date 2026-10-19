"""Affiliate profile contact inquiries: three distinct emails, one shared template.

The partner name and email are resolved from the server-owned registry. Never
trust recipient addresses or partner names sent by the browser. Save the inquiry
before attempting mail and track all three delivery statuses independently.
"""
import json
import logging
import os
from datetime import timezone as datetime_timezone

from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.mail import EmailMultiAlternatives
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .affiliate_applications import resolve_affiliate
from .email_service import render_standard_email
from .models import AffiliateInquiry

logger = logging.getLogger(__name__)


class AffiliateInquirySerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, trim_whitespace=True)
    last_name = serializers.CharField(max_length=150, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    phone_number = serializers.CharField(max_length=50, trim_whitespace=True)
    message = serializers.CharField(max_length=1300, trim_whitespace=True)
    language = serializers.ChoiceField(choices=('en', 'fa'), required=False, default='en')


def inquiry_rows(inquiry):
    rows = [
        ('Inquiry ID', str(inquiry.pk)),
        ('Affiliate', inquiry.affiliate_name),
        ('Affiliate slug', inquiry.affiliate_slug),
        ('First name', inquiry.first_name),
        ('Last name', inquiry.last_name),
        ('Email', inquiry.email),
        ('Phone', inquiry.phone_number),
        ('Message', inquiry.message),
    ]
    if inquiry.created_at:
        rows.append(('Submitted at', inquiry.created_at.astimezone(datetime_timezone.utc).strftime('%Y-%m-%d %H:%M UTC')))
    return rows


FA_LABELS = {
    'Inquiry ID': 'شماره پیگیری',
    'Affiliate': 'همکار معرفی‌کننده',
    'Affiliate slug': 'شناسه همکار',
    'First name': 'نام',
    'Last name': 'نام خانوادگی',
    'Email': 'ایمیل',
    'Phone': 'تلفن',
    'Message': 'پیام',
    'Submitted at': 'زمان ثبت (UTC)',
}


def inquiry_email(inquiry, role):
    reference = f'#{inquiry.pk}'
    if role == 'admin':
        spec = {
            'subject': f'[NovaNest Holding] New affiliate profile inquiry {reference}',
            'title': 'New affiliate profile inquiry',
            'intro': f'A new message was sent through the profile of {inquiry.affiliate_name}.',
            'note': 'Internal review only. Handle contact details confidentially.',
            'language': 'en',
            'reply_to': [inquiry.email],
        }
    elif role == 'partner':
        spec = {
            'subject': f'[NovaNest Holding] Inquiry through your profile {reference}',
            'title': 'New inquiry through your affiliate profile',
            'intro': f'A visitor contacted NovaNest Holding through the profile of {inquiry.affiliate_name}.',
            'note': 'Provided to the authorized affiliate contact only. Please treat the message confidentially.',
            'language': 'en',
            'reply_to': [inquiry.email],
        }
    elif role == 'applicant' and inquiry.submission_language == 'fa':
        spec = {
            'subject': f'نووانست هلدینگ | تأیید دریافت پیام {reference}',
            'title': 'پیام شما دریافت شد',
            'intro': f'{inquiry.first_name} {inquiry.last_name} عزیز، پیام شما از طریق صفحه {inquiry.affiliate_name} ثبت شد. شماره پیگیری: {reference}.',
            'note': 'این پیام فقط تأیید دریافت است. در صورت نیاز با شما تماس می‌گیریم.',
            'language': 'fa',
            'reply_to': [settings.DEFAULT_FROM_EMAIL],
        }
    elif role == 'applicant':
        spec = {
            'subject': f'[NovaNest Holding] We received your inquiry {reference}',
            'title': 'We received your message',
            'intro': f'Dear {inquiry.first_name} {inquiry.last_name}, we received your message through {inquiry.affiliate_name}. Your reference number is {reference}.',
            'note': 'This confirms receipt of your inquiry, not a commitment to any service. We will follow up if appropriate.',
            'language': 'en',
            'reply_to': [settings.DEFAULT_FROM_EMAIL],
        }
    else:
        raise ValueError('Unknown inquiry recipient role')
    rows = inquiry_rows(inquiry)
    if spec['language'] == 'fa':
        rows = [(FA_LABELS.get(label, label), value) for label, value in rows]
    plain, html = render_standard_email(
        title=spec['title'], intro=spec['intro'], note=spec['note'],
        rows=rows, language=spec['language'], preheader=spec['subject'],
    )
    return spec, plain, html


def build_inquiry_email(inquiry, role, addresses):
    spec, plain, html = inquiry_email(inquiry, role)
    email = EmailMultiAlternatives(
        subject=spec['subject'], body=plain, from_email=settings.DEFAULT_FROM_EMAIL,
        to=addresses, reply_to=spec['reply_to'],
    )
    email.attach_alternative(html, 'text/html')
    return email


def notify_inquiry(inquiry):
    """Send each role only once on retry, maintaining flags for successful sends."""
    admins = [item.strip() for item in os.getenv(
        'AFFILIATE_APPLICATION_ADMIN_EMAILS', 'info@novanestholding.com'
    ).split(',') if item.strip()]
    recipients = (
        ('admin_notified', 'admin', admins),
        ('partner_notified', 'partner', [inquiry.partner_primary_email]),
        ('applicant_notified', 'applicant', [inquiry.email]),
    )
    failures = []
    for field, role, addresses in recipients:
        if getattr(inquiry, field):
            continue
        try:
            if not addresses:
                raise ValueError('No recipient configured for inquiry role')
            count = build_inquiry_email(inquiry, role, addresses).send(fail_silently=False)
            if count != 1:
                raise RuntimeError('Email delivery provider did not accept the message')
            setattr(inquiry, field, True)
            inquiry.save(update_fields=[field])
        except Exception:
            logger.exception('Affiliate inquiry %s: %s notification failed', inquiry.pk, role)
            failures.append(field)
    inquiry.notification_error = ','.join(failures)
    inquiry.save(update_fields=['notification_error'])
    return not failures


class AffiliateInquiryThrottle(AnonRateThrottle):
    # Separate per-IP quota for the short affiliate profile contact form.
    scope = 'affiliate_inquiry'
    rate = '20/hour'


class AffiliateInquiryView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [AffiliateInquiryThrottle]
    http_method_names = ['post', 'options']

    def post(self, request, slug):
        try:
            affiliate = resolve_affiliate(slug)
        except (OSError, ValueError, KeyError, json.JSONDecodeError, DjangoValidationError):
            logger.exception('Affiliate inquiry registry configuration failed')
            return Response({'message': 'Inquiry service is temporarily unavailable.'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if affiliate is None:
            return Response({'message': 'Unknown affiliate.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AffiliateInquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = dict(serializer.validated_data)
        language = data.pop('language', 'en')
        inquiry = AffiliateInquiry.objects.create(
            affiliate_slug=affiliate['slug'], affiliate_name=affiliate['name'],
            partner_primary_email=affiliate['primary_email'],
            submission_language=language, **data,
        )
        all_sent = notify_inquiry(inquiry)
        return Response({
            'reference': inquiry.pk,
            'notifications_sent': all_sent,
            'message': ('Inquiry received. Notifications sent.' if all_sent else
                        'Inquiry received. Some notifications are pending; please do not submit again.'),
        }, status=status.HTTP_201_CREATED if all_sent else status.HTTP_202_ACCEPTED)
