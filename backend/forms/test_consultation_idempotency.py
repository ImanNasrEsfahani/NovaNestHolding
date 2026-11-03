"""Regression tests: retry after timeout must not create duplicate enquiries.

Run: python manage.py test forms.test_consultation_idempotency
All outbound mail uses Django's in-memory test backend.
"""
from uuid import uuid4
from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.core.mail import EmailMultiAlternatives
from django.test import TestCase, override_settings

from submission_audit.models import ConsultationIdempotencyRecord
from .consultation_requests import notify_consultation
from .models import ConsultationRequest


@override_settings(
    EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
    DEFAULT_FROM_EMAIL='info@novanestholding.com',
)
class ConsultationIdempotencyTests(TestCase):
    URL = '/small-reservation'

    def setUp(self):
        cache.clear()
        self.key = str(uuid4())
        self.data = {
            'service': 'investment',
            'first_name': 'Nadia',
            'last_name': 'Rostami',
            'email': 'nadia@example.com',
            'phone_number': '+17785550124',
            'language': 'en',
            'idempotency_key': self.key,
        }

    def submit(self, **changes):
        return self.client.post(self.URL, {**self.data, **changes},
                                content_type='application/json')

    def test_retry_returns_same_reference_without_second_email(self):
        first = self.submit()
        self.assertEqual(first.status_code, 201, first.content)
        second = self.submit()
        self.assertEqual(second.status_code, 201, second.content)
        self.assertEqual(second.json()['reference'], first.json()['reference'])
        self.assertTrue(second.json()['already_processed'])
        self.assertEqual(ConsultationRequest.objects.count(), 1)
        self.assertEqual(ConsultationIdempotencyRecord.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 2)

    def test_collision_with_different_data_is_rejected(self):
        first = self.submit()
        second = self.submit(first_name='Different')
        self.assertEqual(first.status_code, 201)
        self.assertEqual(second.status_code, 409)
        self.assertIn('idempotency_key', second.json())
        self.assertEqual(ConsultationRequest.objects.count(), 1)
        self.assertEqual(len(mail.outbox), 2)

    def test_unaccepted_mail_keeps_reference_and_does_not_resend_on_retry(self):
        with patch.object(EmailMultiAlternatives, 'send', side_effect=[1, RuntimeError('Graph offline')]):
            first = self.submit()
        self.assertEqual(first.status_code, 202)
        reference = first.json()['reference']
        retry = self.submit()
        self.assertEqual(retry.status_code, 202)
        self.assertEqual(retry.json()['reference'], reference)
        self.assertEqual(ConsultationRequest.objects.count(), 1)
        # Original applicant notification was already accepted and is not
        # resent; only a privileged admin retry can send the missing role.
        self.assertEqual(len(mail.outbox), 0)
        enquiry = ConsultationRequest.objects.get(pk=reference)
        self.assertTrue(enquiry.visitor_notified)
        self.assertFalse(enquiry.admin_notified)
        self.assertTrue(notify_consultation(enquiry))
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, ['info@novanestholding.com'])

    def test_invalid_uuid_is_rejected_without_storage(self):
        response = self.submit(idempotency_key='not-a-uuid')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(ConsultationRequest.objects.count(), 0)
        self.assertEqual(ConsultationIdempotencyRecord.objects.count(), 0)

    def test_legacy_clients_remain_compatible(self):
        legacy = dict(self.data)
        legacy.pop('idempotency_key')
        response = self.client.post(self.URL, legacy, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ConsultationRequest.objects.count(), 1)
        self.assertEqual(ConsultationIdempotencyRecord.objects.count(), 0)
