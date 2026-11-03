"""Regression tests for the four frontend/backend conditional form contracts.

Run from backend/: python manage.py test forms.test_form_conditional_contracts
"""
from datetime import date, timedelta
from unittest.mock import patch

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from .models import JoinOurTeamApplication, MentorRegistration, TraineeRegistration, WorkWithUsRegistration


@patch('forms.public_form_views.notify_registration', return_value=False)
class ConditionalFormContractTests(TestCase):
    basics = {
        'firstName': 'Nadia', 'lastName': 'Example',
        'email': 'nadia@example.com', 'phoneNumber': '+16045550111',
    }

    def _post(self, form_name, data):
        return self.client.post(reverse('forms:' + form_name), data)

    def test_mentor_birth_date_required(self, _notify):
        response = self._post('join-as-mentor', self.basics)
        self.assertEqual(response.status_code, 400, response.content)
        self.assertIn('birthDate', response.data)
        self.assertFalse(MentorRegistration.objects.exists())

    def test_mentor_rejects_under_18(self, _notify):
        young = date.today() - timedelta(days=365 * 17)
        response = self._post('join-as-mentor', {**self.basics, 'birthDate': young.isoformat()})
        self.assertEqual(response.status_code, 400, response.content)
        self.assertIn('birthDate', response.data)

    def test_mentor_accepts_adult(self, _notify):
        response = self._post('join-as-mentor', {**self.basics, 'birthDate': '1990-01-15'})
        self.assertEqual(response.status_code, 202, response.content)
        self.assertEqual(MentorRegistration.objects.count(), 1)

    def test_trainee_without_cv_requires_alternate_fields(self, _notify):
        data = {**self.basics, 'fieldOfExpert': 'Marketing'}
        response = self._post('join-as-a-trainee', data)
        self.assertEqual(response.status_code, 400, response.content)
        self.assertIn('birthDate', response.data)
        data['birthDate'] = '1990-01-15'
        response = self._post('join-as-a-trainee', data)
        self.assertEqual(response.status_code, 400, response.content)
        self.assertIn('tellUsAboutYourself', response.data)

    def test_trainee_other_expertise_requires_description(self, _notify):
        data = {**self.basics, 'fieldOfExpert': 'Other', 'birthDate': '1990-01-15',
                'tellUsAboutYourself': 'I would like to learn.'}
        response = self._post('join-as-a-trainee', data)
        self.assertEqual(response.status_code, 400, response.content)
        self.assertIn('fieldOfExpertOther', response.data)

    def test_trainee_non_other_discards_stale_description(self, _notify):
        data = {**self.basics, 'fieldOfExpert': 'Marketing',
                'fieldOfExpertOther': 'Old other choice',
                'birthDate': '1990-01-15', 'tellUsAboutYourself': 'I like to learn.'}
        response = self._post('join-as-a-trainee', data)
        self.assertEqual(response.status_code, 202, response.content)
        self.assertEqual(TraineeRegistration.objects.get().fieldOfExpertOther, '')

    def test_trainee_cv_does_not_require_alternate_fields(self, _notify):
        cv = SimpleUploadedFile('trainee.pdf', b'%PDF-1.4 example', content_type='application/pdf')
        response = self._post('join-as-a-trainee', {**self.basics, 'fieldOfExpert': 'Marketing', 'cvFile': cv})
        self.assertEqual(response.status_code, 202, response.content)
        saved = TraineeRegistration.objects.get()
        self.assertIsNone(saved.birthDate)
        self.assertEqual(saved.tellUsAboutYourself, '')
        saved.cvFile.delete(save=False)

    def test_join_our_team_without_cv_requires_alternate_fields(self, _notify):
        data = {**self.basics, 'fieldOfExpert': 'Developer'}
        response = self._post('join-our-team', data)
        self.assertEqual(response.status_code, 400, response.content)
        for field in ('birthDate', 'educationLevel', 'educationField', 'workHistorySummary'):
            self.assertIn(field, response.data)
        self.assertFalse(JoinOurTeamApplication.objects.exists())

    def test_join_our_team_with_cv_still_accepts_legacy_details(self, _notify):
        cv = SimpleUploadedFile('team.pdf', b'%PDF-1.4 example', content_type='application/pdf')
        response = self._post('join-our-team', {
            **self.basics, 'fieldOfExpert': 'Developer', 'cvFile': cv,
            'educationField': 'Computer Science',
        })
        self.assertEqual(response.status_code, 202, response.content)
        saved = JoinOurTeamApplication.objects.get()
        self.assertEqual(saved.educationField, 'Computer Science')
        saved.cvFile.delete(save=False)

    def test_join_our_team_without_cv_accepts_complete_alternates(self, _notify):
        data = {**self.basics, 'fieldOfExpert': 'Developer', 'birthDate': '1990-01-15',
                'educationLevel': 'Bachelor', 'educationField': 'Computer Science',
                'workHistorySummary': 'Three years of software experience'}
        response = self._post('join-our-team', data)
        self.assertEqual(response.status_code, 202, response.content)
        self.assertEqual(JoinOurTeamApplication.objects.count(), 1)

    def test_professor_contract_must_match_position(self, _notify):
        data = {'your_first_name': 'Nadia', 'your_last_name': 'Example',
                'email': 'nadia@example.com', 'phone_number': '+16045550111',
                'your_position': 'Professor', 'type_of_contract': 'Internship'}
        cv = SimpleUploadedFile('professor.pdf', b'%PDF-1.4 sample', content_type='application/pdf')
        response = self._post('work-with-us', {**data, 'cvFile': cv})
        self.assertEqual(response.status_code, 400, response.content)
        self.assertIn('type_of_contract', response.data)
        self.assertFalse(WorkWithUsRegistration.objects.exists())

    def test_student_contract_must_match_position(self, _notify):
        data = {'your_first_name': 'Nadia', 'your_last_name': 'Example',
                'email': 'nadia@example.com', 'phone_number': '+16045550111',
                'your_position': 'student', 'type_of_contract': 'professional Consultation'}
        response = self._post('work-with-us', data)
        self.assertEqual(response.status_code, 400, response.content)
        self.assertIn('type_of_contract', response.data)

    def test_work_with_us_compatible_contract_is_saved(self, _notify):
        data = {'your_first_name': 'Nadia', 'your_last_name': 'Example',
                'email': 'nadia@example.com', 'phone_number': '+16045550111',
                'your_position': 'Student', 'type_of_contract': 'Internship'}
        response = self._post('work-with-us', data)
        self.assertEqual(response.status_code, 202, response.content)
        self.assertEqual(WorkWithUsRegistration.objects.get().type_of_contract, 'Internship')
