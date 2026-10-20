"""One validated consultation endpoint and two separately tracked branded emails.

Never accept a destination email or source URL from the browser. The server
resolves the service/page from a fixed whitelist. Actual delivery goes via the
configured Microsoft Graph backend; each stored flag means provider accepted
that one email, not that it reached the recipient's inbox.
"""
import logging
import os
from datetime import timezone as datetime_timezone

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.core.validators import validate_email
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .email_service import render_standard_email
from .models import ConsultationRequest

logger = logging.getLogger(__name__)

# This is also the authoritative allowlist for the submitted 'service' field.
SERVICE_LABELS = {
    'investment': ('Investment', 'مشاوره سرمایه‌گذاری'),
    'acceleration': ('Acceleration', 'مشاوره شتاب‌دهی کسب‌وکار'),
    'entrepreneur-pnp': ('Entrepreneur PNP', 'مشاوره برنامه کارآفرینی استانی کانادا (PNP)'),
    'startup': ('Startup Visa', 'مشاوره استارتاپ ویزا'),  # Also uses the same component.
}


class ConsultationRequestSerializer(serializers.Serializer):
    service = serializers.ChoiceField(choices=ConsultationRequest.SERVICE_CHOICES)
    first_name = serializers.CharField(max_length=150, trim_whitespace=True)
    last_name = serializers.CharField(max_length=150, trim_whitespace=True)
    email = serializers.EmailField(max_length=254)
    phone_number = serializers.CharField(max_length=50, trim_whitespace=True)
    language = serializers.ChoiceField(choices=('en', 'fa'), default='en', required=False)
    # Client-provided admin recipients, notification flags, URLs and IDs are ignored.


def consultation_source(request):
    return f'/{request.submission_language}/{request.service}' if request.service != 'entrepreneur-pnp' else f'/{request.submission_language}/pnp'


def email_content(request, role):
    service_en, service_fa = SERVICE_LABELS[request.service]
    reference = f'#{request.pk}'
    name = f'{request.first_name} {request.last_name}'.strip()
    submitted = request.created_at.astimezone(datetime_timezone.utc).strftime('%Y-%m-%d %H:%M UTC')
    if role == 'admin':
        subject = f'[NovaNest Holding] New {service_en} consultation request {reference}'
        title = 'New consultation request'
        intro = f'A visitor submitted a consultation request for {service_en} on the NovaNest Holding website.'
        rows = [
            ('Reference', reference), ('Service', service_en), ('Full name', name),
            ('Email', request.email), ('Phone', request.phone_number),
            ('Source', consultation_source(request)), ('Submitted at', submitted),
        ]
        note = 'For internal review. Handle applicant information confidentially.'
        language = 'en'
        reply_to = [request.email]
    elif role == 'visitor' and request.submission_language == 'fa':
        subject = f'نووانست هلدینگ | دریافت درخواست {service_fa} {reference}'
        title = 'درخواست مشاوره شما دریافت شد'
        intro = (f'{name} عزیز، از درخواست {service_fa} از نووانست هلدینگ سپاسگزاریم. '
                 f'درخواست شما با شماره پیگیری {reference} ثبت شد. '
                 'تیم ما آن را بررسی می‌کند و برای مراحل بعدی با شما تماس خواهد گرفت.')
        rows = [
            ('شماره پیگیری', reference), ('نوع خدمت', service_fa),
            ('نام و نام خانوادگی', name), ('ایمیل', request.email),
            ('شماره تماس', request.phone_number), ('زمان ثبت (UTC)', submitted),
        ]
        note = 'این ایمیل صرفاً تأیید دریافت درخواست است و به معنای تأیید رزرو زمان مشاوره یا پذیرش نهایی نیست.'
        language = 'fa'
        reply_to = ['info@novanestholding.com']
    elif role == 'visitor':
        subject = f'[NovaNest Holding] Your {service_en} consultation request was received {reference}'
        title = 'We received your consultation request'
        intro = (f'Dear {request.first_name}, thank you for requesting a {service_en} consultation '
                 f'with NovaNest Holding. Your request has been registered as {reference}. '
                 'Our team will review it and contact you regarding the next steps.')
        rows = [
            ('Reference', reference), ('Service', service_en), ('Full name', name),
            ('Email', request.email), ('Phone', request.phone_number),
            ('Submitted at', submitted),
        ]
        note = ('This email only confirms that we received your request. '
                'No consultation appointment or final approval has been confirmed.')
        language = 'en'
        reply_to = ['info@novanestholding.com']
    else:
        raise ValueError('Unknown consultation email role')
    plain, html = render_standard_email(
        title=title, intro=intro, rows=rows, note=note,
        language=language, preheader=subject,
    )
    return {'subject': subject, 'reply_to': reply_to, 'language': language}, plain, html


def build_consultation_email(request, role, recipients):
    spec, plain, html = email_content(request, role)
    email = EmailMultiAlternatives(
        subject=spec['subject'], body=plain, from_email=settings.DEFAULT_FROM_EMAIL,
        to=recipients, reply_to=spec['reply_to'],
    )
    email.attach_alternative(html, 'text/html')
    return email


def consultation_admin_recipients():
    """The recipient is server-owned, and defaults to the NovaNest inbox.

    No .env change is necessary. CONSULTATION_ADMIN_EMAILS can be used to
    configure additional authorized administrators later.
    """
    configured = os.getenv('CONSULTATION_ADMIN_EMAILS', 'info@novanestholding.com')
    addresses = list(dict.fromkeys(v.strip() for v in configured.split(',') if v.strip()))
    for address in addresses:
        validate_email(address)
    return addresses


def notify_consultation(request):
    """Send both roles independently and resend ONLY a previously failed role."""
    try:
        admins = consultation_admin_recipients()
    except Exception:
        logger.exception('Consultation %s: invalid administrator recipient setting', request.pk)
        admins = []
    deliveries = (
        ('visitor_notified', 'visitor', [request.email]),
        ('admin_notified', 'admin', admins),
    )
    failed = []
    for field, role, addresses in deliveries:
        if getattr(request, field):
            continue
        try:
            if not addresses:
                raise ValueError('No configured recipient for consultation email')
            sent = build_consultation_email(request, role, addresses).send(fail_silently=False)
            if sent != 1:
                raise RuntimeError('Email provider did not accept the consultation email')
            setattr(request, field, True)
            request.save(update_fields=[field])
        except Exception:
            logger.exception('Consultation %s: %s notification failed', request.pk, role)
            failed.append(field)
    request.notification_error = ','.join(failed)
    request.save(update_fields=['notification_error'])
    return not failed


class ConsultationThrottle(AnonRateThrottle):
    scope = 'consultation_request'
    rate = '20/hour'


class SmallReservationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [ConsultationThrottle]
    http_method_names = ['post', 'options']

    def post(self, request):
        serializer = ConsultationRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        fields = dict(serializer.validated_data)
        language = fields.pop('language', 'en')
        enquiry = ConsultationRequest.objects.create(
            submission_language=language, **fields,
        )
        delivered = notify_consultation(enquiry)
        return Response({
            'reference': enquiry.pk,
            'notifications_sent': delivered,
            'message': ('Consultation request saved and notifications accepted.' if delivered else
                        'Consultation request saved. Some emails are pending; please do not submit again.'),
        }, status=status.HTTP_201_CREATED if delivered else status.HTTP_202_ACCEPTED)
