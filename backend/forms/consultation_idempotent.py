"""Idempotent consultation creation, retaining existing form validation and emails.

A browser retry after a proxy / Microsoft Graph timeout MUST return the first
confirmed database reference, not create a second consultation or send another
pair of emails. Old clients without an idempotency key remain supported.
"""
import hashlib
import json

from django.db import transaction
from rest_framework import serializers, status
from rest_framework.response import Response

from submission_audit.models import ConsultationIdempotencyRecord
from .consultation_requests import (
    ConsultationRequestSerializer, SmallReservationView, notify_consultation,
)
from .models import ConsultationRequest


class KeyedConsultationSerializer(ConsultationRequestSerializer):
    idempotency_key = serializers.UUIDField(required=False)


def fingerprint(validated):
    """Hash the canonical validated payload; never store another copy of PII."""
    canon = {k: str(v).strip() for k, v in validated.items() if k != 'idempotency_key'}
    if 'email' in canon:
        canon['email'] = canon['email'].lower()
    return hashlib.sha256(json.dumps(canon, sort_keys=True, ensure_ascii=False).encode('utf-8')).hexdigest()


def response_for(enquiry, *, duplicate=False):
    sent = enquiry.visitor_notified and enquiry.admin_notified
    return Response({
        'reference': enquiry.pk,
        'notifications_sent': sent,
        'already_processed': duplicate,
        'message': (
            'Consultation request was already saved; no duplicate emails were sent.'
            if duplicate else
            'Consultation request saved and notifications accepted.' if sent else
            'Consultation request saved. Some emails are pending; do not submit again.'
        ),
    }, status=status.HTTP_201_CREATED if sent else status.HTTP_202_ACCEPTED)


class IdempotentSmallReservationView(SmallReservationView):
    """Keep existing throttle/permissions and the exact public API URL."""

    def post(self, request):
        # The field is optional so older clients keep working. A UUID is
        # validated before opening a database transaction.
        serializer = KeyedConsultationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        validated = dict(serializer.validated_data)
        key = validated.pop('idempotency_key', None)
        language = validated.pop('language', 'en')

        if key is None:
            # Backwards compatibility for old frontend versions: their form
            # still works, but only keyed clients get retry protection.
            enquiry = ConsultationRequest.objects.create(
                submission_language=language, **validated,
            )
            notify_consultation(enquiry)
            return response_for(enquiry)

        # Canonicalize the complete stored data, including language.
        canonical = {**validated, 'language': language}
        payload_digest = fingerprint(canonical)
        with transaction.atomic():
            # A unique UUID reserved inside this transaction makes concurrent
            # retries wait for the first transaction to commit. There is no
            # window in which a committed reservation lacks its consultation.
            record, created = ConsultationIdempotencyRecord.objects.get_or_create(
                key=key, defaults={'payload_digest': payload_digest},
            )
            if not created:
                if record.payload_digest != payload_digest:
                    return Response({
                        'idempotency_key': ['This key already belongs to different consultation details.'],
                    }, status=status.HTTP_409_CONFLICT)
                if record.consultation_id is None:
                    # Defensive guard for unexpected pre-existing corrupt rows.
                    return Response({
                        'detail': 'Original consultation is still being prepared. Retry later.',
                    }, status=status.HTTP_503_SERVICE_UNAVAILABLE)
                # Return the exact original database ID; never resend emails.
                return response_for(record.consultation, duplicate=True)

            enquiry = ConsultationRequest.objects.create(
                submission_language=language, **validated,
            )
            record.consultation = enquiry
            record.save(update_fields=['consultation'])

        # Email happens outside the transaction so network latency does not
        # hold database locks. A concurrent retry sees the existing reference
        # without generating another email pair.
        notify_consultation(enquiry)
        return response_for(enquiry)
