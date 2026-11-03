"""API regression checks for English and Persian professor CV requirement."""
from unittest.mock import patch
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.cache import cache
from django.test import TestCase
from django.urls import reverse
from forms.models import WorkWithUsRegistration


class WorkWithUsCVContractTests(TestCase):
    def setUp(self):
        # Isolate the per-IP throttling cache between tests, not in production.
        cache.clear()
        self.url = reverse('forms:work-with-us')
        self.base = {
            'your_first_name': 'Test',
            'your_last_name': 'Applicant',
            'email': 'cvtest@example.com',
            'phone_number': '+16045550123',
        }

    def test_professor_requires_cv_in_both_languages(self):
        for position in ('Professor', 'استاد دانشگاه'):
            with self.subTest(position=position):
                response = self.client.post(self.url, {**self.base, 'your_position': position})
                self.assertEqual(response.status_code, 400, response.content)
                self.assertIn('cvFile', response.data)
        self.assertEqual(WorkWithUsRegistration.objects.count(), 0)

    @patch('forms.public_form_views.notify_registration', return_value=False)
    def test_non_professor_can_submit_without_cv(self, _notify):
        response = self.client.post(self.url, {**self.base, 'your_position': 'Student', 'language': 'fa'})
        self.assertEqual(response.status_code, 202, response.content)
        saved = WorkWithUsRegistration.objects.get(pk=response.data['reference'])
        self.assertEqual(saved.submission_language, 'fa')
        self.assertFalse(bool(saved.cvFile))

    @patch('forms.public_form_views.notify_registration', return_value=False)
    def test_professor_can_submit_with_cv(self, _notify):
        cv = SimpleUploadedFile('professor-cv.pdf', b'%PDF-1.4 test cv', content_type='application/pdf')
        response = self.client.post(self.url, {**self.base, 'your_position': 'Professor', 'cvFile': cv})
        self.assertEqual(response.status_code, 202, response.content)
        self.assertIn('professor-cv', WorkWithUsRegistration.objects.get(pk=response.data['reference']).cvFile.name)
