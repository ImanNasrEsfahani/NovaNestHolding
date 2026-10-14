"""Affiliate-specific application endpoint.

The partner and its notification recipient are resolved from a server-owned JSON
file mounted read-only from frontend/i18n; never accept recipient data from POST.
"""
import json
import logging
import os
import re
from pathlib import Path

from django.conf import settings
from django.core.mail import send_mail
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from django.core.validators import validate_email
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import AffiliateApplication

logger = logging.getLogger(__name__)
SLUG_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
REGISTRY_PATH = Path(os.getenv('AFFILIATE_REGISTRY_PATH', '/app/affiliate-registry/ourTeamAffiliates.json'))
EDUCATION = ('high_school', 'bachelor', 'master', 'phd')
LEVELS = ('none', 'basic', 'intermediate', 'advanced')


def resolve_affiliate(slug):
    """Trusted config lookup; no network call and no user-supplied email."""
    if not SLUG_RE.fullmatch(slug):
        return None
    with REGISTRY_PATH.open(encoding='utf-8') as fh:
        data = json.load(fh)
    for partner in data.get('affiliates', {}).get('partners', []):
        if partner.get('slug') != slug:
            continue
        primary = partner.get('primaryEmail', '').strip()
        valid_emails = [e.lower() for e in partner.get('emails', [])]
        if not primary or primary.lower() not in valid_emails:
            raise ValueError('Partner primaryEmail must be one of partner.emails')
        validate_email(primary)
        return {'slug': slug, 'name': partner['name'], 'primary_email': primary}
    return None


class AffiliateApplicationSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=180, trim_whitespace=True)
    phone_number = serializers.RegexField(r'^\+[1-9]\d{7,14}$', max_length=16,
        error_messages={'invalid': 'Use international format, e.g. +14165550123.'})
    email = serializers.EmailField(max_length=254)
    position = serializers.ChoiceField(choices=AffiliateApplication.POSITION_CHOICES)
    years_of_experience = serializers.ChoiceField(choices=AffiliateApplication.EXPERIENCE_CHOICES)
    industry_field = serializers.CharField(max_length=180, trim_whitespace=True, allow_blank=False)
    assets_range = serializers.ChoiceField(choices=AffiliateApplication.ASSETS_RANGE_CHOICES)
    education_degree = serializers.ChoiceField(choices=EDUCATION)
    language_level = serializers.ChoiceField(choices=LEVELS)
    traveled_to_canada = serializers.BooleanField()
    visa_rejected = serializers.BooleanField()
    visa_rejection_details = serializers.CharField(max_length=1800, allow_blank=True, required=False)
    consent_to_share = serializers.BooleanField()

    def validate(self, attrs):
        if not attrs['consent_to_share']:
            raise serializers.ValidationError({'consent_to_share': 'Consent is required.'})
        if attrs['visa_rejected'] and not attrs.get('visa_rejection_details', '').strip():
            raise serializers.ValidationError({'visa_rejection_details': 'Please provide the visa refusal details.'})
        if not attrs['visa_rejected']:
            attrs['visa_rejection_details'] = ''
        return attrs


class AffiliateApplicationThrottle(AnonRateThrottle):
    rate = '5/hour'


def delivery_body(application):
    pairs = [
        ('Application ID', str(application.pk)),
        ('Affiliate', application.affiliate_name),
        ('Affiliate slug', application.affiliate_slug),
        ('Full name', application.full_name),
        ('Phone', application.phone_number),
        ('Email', application.email),
    ]
    # Keep older submissions readable if their pending email is retried from Admin.
    # Age, location, free-form experience and IELTS are not accepted by the new API.
    if application.position:
        pairs.extend([
            ('Position', application.get_position_display()),
            ('Years of professional experience', application.get_years_of_experience_display()),
            ('Industry / field of work', application.industry_field),
        ])
    else:
        pairs.extend([
            ('Age', str(application.age) if application.age is not None else 'Not provided'),
            ('Country', application.country),
            ('City', application.city),
            ('Work experience in last 5 years', application.work_experience),
        ])
    pairs.extend([
        ('Education', application.get_education_degree_display()),
        ('Language level', application.get_language_level_display()),
    ])
    if application.position:
        pairs.append(('Provable assets (USD)', application.get_assets_range_display()))
    else:
        pairs.extend([
            ('IELTS score', str(application.ielts_score) if application.ielts_score is not None else 'Not provided'),
            ('Provable assets', f'{application.assets_amount} {application.assets_currency}'),
        ])
    pairs.extend([
        ('Previously traveled to Canada', 'Yes' if application.traveled_to_canada else 'No'),
        ('Canadian visa previously rejected', 'Yes' if application.visa_rejected else 'No'),
        ('Visa refusal details', application.visa_rejection_details or '—'),
        ('Consented to sharing', application.consented_at.isoformat()),
    ])
    return '\n'.join(f'{label}: {value}' for label, value in pairs)


def notify_application(application):
    """Send independent email messages; keep per-recipient delivery state for retries."""
    admins = [v.strip() for v in os.getenv('AFFILIATE_APPLICATION_ADMIN_EMAILS', 'info@novanestholding.com').split(',') if v.strip()]
    recipients = [('admin_notified', admins), ('partner_notified', [application.partner_primary_email])]
    message = delivery_body(application)
    subject = f'[NovaNest] New affiliate application: {application.affiliate_name} (#{application.pk})'
    failed = []
    for field, addresses in recipients:
        if getattr(application, field):
            continue
        try:
            if not addresses:
                raise ValueError('No recipient configured')
            sent = send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, addresses, fail_silently=False)
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
        values.pop('consent_to_share')
        application = AffiliateApplication.objects.create(
            affiliate_slug=affiliate['slug'], affiliate_name=affiliate['name'],
            partner_primary_email=affiliate['primary_email'], consented_at=timezone.now(), **values,
        )
        delivered = notify_application(application)
        # Always preserve the valid submission even if SMTP is unavailable.
        return Response({
            'reference': application.pk,
            'message': ('Application received. Notifications sent.' if delivered
                        else 'Application received. Email notifications are pending; please do not submit again.'),
            'notifications_sent': delivered,
        }, status=status.HTTP_201_CREATED if delivered else status.HTTP_202_ACCEPTED)
