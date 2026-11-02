"""Verify the complete Contact Us frontend -> serializer -> database contract."""
from unittest.mock import patch

from django.test import TestCase
from django.urls import reverse

from forms.models import ContactUs
from submission_audit.models import ContactUsIdentity


class ContactUsIdentityTests(TestCase):
    @patch('forms.serializers.notify_contact_us', return_value=False)
    def test_name_components_and_ui_language_are_saved(self, _send):
        response = self.client.post(reverse('forms:contactus-form'), {
            'firstName': 'Nadia', 'lastName': 'Rostami',
            'name': 'Nadia Rostami', 'email': 'nadia@example.org',
            'number': '+17785550123', 'message': 'Hello', 'language': 'fa',
        })
        self.assertEqual(response.status_code, 202, response.content)
        contact = ContactUs.objects.get(pk=response.data['reference'])
        self.assertEqual(contact.submission_language, 'fa')
        self.assertEqual(contact.name, 'Nadia Rostami')
        identity = ContactUsIdentity.objects.get(contact=contact)
        self.assertEqual(identity.first_name, 'Nadia')
        self.assertEqual(identity.last_name, 'Rostami')

    @patch('forms.serializers.notify_contact_us', return_value=False)
    def test_existing_legacy_clients_remain_compatible(self, _send):
        response = self.client.post(reverse('forms:contactus-form'), {
            'name': 'Old Customer', 'email': 'old@example.org',
            'number': '+16045550000', 'message': 'Legacy form',
        })
        self.assertEqual(response.status_code, 202, response.content)
        contact = ContactUs.objects.get(pk=response.data['reference'])
        self.assertEqual(contact.name, 'Old Customer')
        self.assertFalse(ContactUsIdentity.objects.filter(contact=contact).exists())
