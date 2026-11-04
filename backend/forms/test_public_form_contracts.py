"""Regression tests for every newly introduced public form endpoint.

Run from backend/: python manage.py test forms.test_public_form_contracts
"""
from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.test import TestCase, override_settings
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

from .models import (InvestorRegistration, JoinOurTeamApplication,
                     MentorRegistration, TraineeRegistration, ProfileContact,
                     WorkWithUsRegistration)


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend',
                   DEFAULT_FROM_EMAIL='info@novanestholding.com')
class FormContractTests(TestCase):
    def setUp(self):
        # Avoid unrelated tests exhausting the shared anonymous throttle.
        # Throttling stays enabled and unchanged for real requests.
        cache.clear()

    basics = {'firstName': 'Test', 'lastName': 'Applicant',
              'email': 'applicant@example.org', 'phoneNumber': '+16045550100'}

    def assert_record_saved(self, response, model, expected):
        self.assertEqual(response.status_code, 201, response.content)
        self.assertTrue(response.data['notifications_sent'])
        saved = model.objects.get(pk=response.data['reference'])
        for name, value in expected.items():
            self.assertEqual(getattr(saved, name), value, name)
        self.assertTrue(saved.admin_notified)
        self.assertTrue(saved.applicant_notified)
        expected_email_count = 3 if model is ProfileContact else 2
        if model is ProfileContact:
            self.assertTrue(saved.mentor_notified)
        self.assertEqual(len(mail.outbox), expected_email_count)
        admin = next(item for item in mail.outbox if 'info@novanestholding.com' in item.to)
        for name, value in expected.items():
            if value:
                self.assertIn(str(value), admin.body, name)
        return saved

    def test_investor_all_visible_fields_saved_and_emailed(self):
        data = {**self.basics, 'countryOfResidence': 'Canada',
                'investmentCeiling': '100000', 'preferredAreas': 'AI and clean energy',
                'howDidYouKnowUs': 'LinkedIn'}
        response = self.client.post(reverse('forms:investor-registration'), data)
        self.assert_record_saved(response, InvestorRegistration, data)

    def test_mentor_fields_and_date_saved(self):
        data = {**self.basics, 'countryOfResidence': 'Canada',
                'cityOfResidence': 'Vancouver', 'birthDate': '1990-06-21',
                'website': 'https://example.org', 'linkedin': 'https://linkedin.com/in/example',
                'instagram': 'https://instagram.com/example',
                'ExpertiesAreas': 'Software architecture', 'howDidYouKnowUs': 'Website'}
        response = self.client.post(reverse('forms:join-as-mentor'), data)
        expected = {k: v for k, v in data.items() if k != 'birthDate'}
        saved = self.assert_record_saved(response, MentorRegistration, expected)
        self.assertEqual(saved.birthDate.isoformat(), data['birthDate'])

    def test_join_our_team_and_cv_saved(self):
        data = {**self.basics, 'countryOfResidence': 'Canada', 'cityOfResidence': 'Victoria',
                'typeOfCollaboration': 'Full-time', 'fieldOfExpert': 'Engineering',
                'fieldOfExpertOther': '', 'educationLevel': 'Bachelor',
                'educationField': 'Computer Science', 'workHistorySummary': 'Five years'}
        cv = SimpleUploadedFile('resume.pdf', b'%PDF-1.4 minimal test', content_type='application/pdf')
        response = self.client.post(reverse('forms:join-our-team'), {**data, 'cvFile': cv})
        self.assertEqual(response.status_code, 201, response.content)
        saved = JoinOurTeamApplication.objects.get(pk=response.data['reference'])
        self.assertIn('resume', saved.cvFile.name)
        self.assertEqual(saved.educationField, data['educationField'])
        self.assertEqual(len(mail.outbox), 2)
        saved.cvFile.delete(save=False)

    def test_trainee_all_fields_saved(self):
        data = {**self.basics, 'countryOfResidence': 'Canada', 'cityOfResidence': 'Burnaby',
                'fieldOfExpert': 'Marketing', 'fieldOfExpertOther': '',
                'birthDate': '1990-02-15', 'tellUsAboutYourself': 'I enjoy learning.'}
        response = self.client.post(reverse('forms:join-as-a-trainee'), data)
        expected = {k: v for k, v in data.items() if k != 'birthDate'}
        saved = self.assert_record_saved(response, TraineeRegistration, expected)
        self.assertEqual(saved.birthDate.isoformat(), data['birthDate'])

    def test_profile_contact_identifies_profile(self):
        data = {**self.basics, 'profileSlug': 'majid-soltanzadeh', 'subject': 'Partnership',
                'message': 'I would like to connect.'}
        response = self.client.post(reverse('forms:contact-profile'), data)
        self.assert_record_saved(response, ProfileContact, data)
        mentor = next(item for item in mail.outbox if 'jobdata@gmail.com' in item.to)
        self.assertEqual(mentor.reply_to, ['applicant@example.org'])

    def test_work_with_us_snake_case_fields_saved(self):
        data = {
            'your_first_name': 'Ali', 'your_last_name': 'Example',
            'email': 'applicant@example.org', 'phone_number': '+16045550100',
            'your_position': 'Student', 'type_of_contract': 'Internship',
            'uni': 'UBC', 'your_field_of_study': 'Engineering',
            'your_subfield': 'Software', 'langLevel': 'Advanced',
        }
        response = self.client.post(reverse('forms:work-with-us'), data)
        self.assert_record_saved(response, WorkWithUsRegistration, data)

    def test_email_failure_cannot_erase_saved_investor_record(self):
        with patch('forms.registration_notifications.EmailMultiAlternatives.send', side_effect=RuntimeError('Microsoft 365 down')):
            response = self.client.post(reverse('forms:investor-registration'), {**self.basics})
        self.assertEqual(response.status_code, 202)
        self.assertEqual(InvestorRegistration.objects.count(), 1)
        entry = InvestorRegistration.objects.get(pk=response.data['reference'])
        self.assertFalse(entry.admin_notified)
        self.assertFalse(entry.applicant_notified)
        self.assertTrue(entry.notification_error)

    def test_unexpected_input_is_rejected_not_silently_dropped(self):
        response = self.client.post(reverse('forms:join-as-mentor'),
                                    {**self.basics, 'secretUnmappedField': 'must not silently disappear'})
        self.assertEqual(response.status_code, 400)
        self.assertEqual(MentorRegistration.objects.count(), 0)
