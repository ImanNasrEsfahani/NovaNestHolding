"""Server-side contracts for the conditional fields in the public forms.

Keep the original serializers/views intact: each validated view is wired in
forms/urls.py and preserves the existing database inserts and notification flow.
The browser is never the only enforcement point for required conditional data.
"""
from datetime import date

from rest_framework import serializers

from .public_form_views import (
    JoinOurTeamSerializer,
    JoinOurTeamView as BaseJoinOurTeamView,
    MentorRegistrationSerializer,
    MentorRegistrationView as BaseMentorRegistrationView,
    TraineeRegistrationSerializer,
    TraineeRegistrationView as BaseTraineeRegistrationView,
)
from .work_with_us_cv import (
    WorkWithUsCVSerializer,
    WorkWithUsCVView as BaseWorkWithUsCVView,
)


def _old_enough(value, minimum_age):
    """Compare calendar birthdays (including leap years), not approximate days."""
    if not isinstance(value, date):
        return False
    today = date.today()
    years = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
    return years >= minimum_age


def _trimmed(value):
    return str(value or '').strip()


def _normalize_expertise_other(attrs):
    expertise = _trimmed(attrs.get('fieldOfExpert'))
    if not expertise:
        raise serializers.ValidationError({'fieldOfExpert': ['Please select an area of expertise.']})
    if expertise.casefold() == 'other':
        if not _trimmed(attrs.get('fieldOfExpertOther')):
            raise serializers.ValidationError({'fieldOfExpertOther': ['Please specify your area of expertise.']})
    else:
        # The hidden input can retain a previous choice in React Hook Form.
        attrs['fieldOfExpertOther'] = ''


class MentorValidatedSerializer(MentorRegistrationSerializer):
    def validate(self, attrs):
        attrs = super().validate(attrs)
        birthday = attrs.get('birthDate')
        if not birthday:
            raise serializers.ValidationError({'birthDate': ['Birth date is required.']})
        if not _old_enough(birthday, 18):
            raise serializers.ValidationError({'birthDate': ['You must be at least 18 years old.']})
        return attrs


class TraineeValidatedSerializer(TraineeRegistrationSerializer):
    def validate(self, attrs):
        attrs = super().validate(attrs)
        _normalize_expertise_other(attrs)
        if attrs.get('cvFile'):
            # CV mode imposes no alternate-field requirements. The browser
            # omits the hidden fields; explicit legacy API values are preserved.
            return attrs
        birthday = attrs.get('birthDate')
        if not birthday:
            raise serializers.ValidationError({'birthDate': ['Birth date is required when no CV is uploaded.']})
        if not _old_enough(birthday, 14):
            raise serializers.ValidationError({'birthDate': ['You must be at least 14 years old.']})
        if not _trimmed(attrs.get('tellUsAboutYourself')):
            raise serializers.ValidationError({'tellUsAboutYourself': ['Please tell us about yourself when no CV is uploaded.']})
        return attrs


class JoinOurTeamValidatedSerializer(JoinOurTeamSerializer):
    def validate(self, attrs):
        attrs = super().validate(attrs)
        _normalize_expertise_other(attrs)
        if attrs.get('cvFile'):
            # No alternate-field requirement in CV mode. The browser omits
            # hidden values; explicitly supplied legacy values remain valid.
            return attrs
        errors = {}
        birthday = attrs.get('birthDate')
        if not birthday:
            errors['birthDate'] = ['Birth date is required when no CV is uploaded.']
        elif not _old_enough(birthday, 14):
            errors['birthDate'] = ['You must be at least 14 years old.']
        for name in ('educationLevel', 'educationField', 'workHistorySummary'):
            if not _trimmed(attrs.get(name)):
                errors[name] = ['This field is required when no CV is uploaded.']
        if errors:
            raise serializers.ValidationError(errors)
        return attrs


PROFESSOR_POSITIONS = frozenset(('Professor', 'استاد دانشگاه'))
STUDENT_POSITIONS = frozenset(('student', 'Student', 'دانشجو'))
PROFESSOR_CONTRACTS = frozenset(('professional Consultation', 'مشاوره تخصصی'))
STUDENT_CONTRACTS = frozenset(('hiring', 'استخدام', 'Internship', 'UniversityInternship'))


class WorkWithUsValidatedSerializer(WorkWithUsCVSerializer):
    def validate(self, attrs):
        # Retain CV enforcement from work_with_us_cv.py for both languages.
        attrs = super().validate(attrs)
        position = _trimmed(attrs.get('your_position'))
        contract = _trimmed(attrs.get('type_of_contract'))
        if contract and position in PROFESSOR_POSITIONS and contract not in PROFESSOR_CONTRACTS:
            raise serializers.ValidationError({'type_of_contract': ['The selected contract does not match the Professor position.']})
        if contract and position in STUDENT_POSITIONS and contract not in STUDENT_CONTRACTS:
            raise serializers.ValidationError({'type_of_contract': ['The selected contract does not match the Student position.']})
        return attrs


class MentorRegistrationView(BaseMentorRegistrationView):
    serializer_class = MentorValidatedSerializer


class TraineeRegistrationView(BaseTraineeRegistrationView):
    serializer_class = TraineeValidatedSerializer


class JoinOurTeamView(BaseJoinOurTeamView):
    serializer_class = JoinOurTeamValidatedSerializer


class WorkWithUsCVView(BaseWorkWithUsCVView):
    serializer_class = WorkWithUsValidatedSerializer
