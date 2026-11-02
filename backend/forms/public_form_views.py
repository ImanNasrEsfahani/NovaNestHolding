"""Previously missing Django endpoints for four existing public Next.js forms.

Each submitted field maps to a named database column. Requests are saved before
mail is attempted. Never accept mail destinations from the browser.
"""
from rest_framework import serializers, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework.views import APIView

from .models import (JoinOurTeamApplication, MentorRegistration,
                     TraineeRegistration, ProfileContact, WorkWithUsRegistration)
from .registration_notifications import notify_registration


class PublicFormsThrottle(AnonRateThrottle):
    rate = '20/hour'


class PublicFormSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(max_length=150, trim_whitespace=True)
    lastName = serializers.CharField(max_length=150, trim_whitespace=True)
    email = serializers.EmailField()
    phoneNumber = serializers.CharField(max_length=50, trim_whitespace=True)
    language = serializers.ChoiceField(choices=('en', 'fa'), required=False,
                                       default='en', write_only=True)

    def validate(self, attrs):
        # Explicitly reject unknown user-provided fields: silently dropping
        # a misspelled/missing-column field causes irrecoverable data loss.
        allowed = set(self.fields)
        unexpected = set(self.initial_data.keys()) - allowed
        if unexpected:
            raise serializers.ValidationError({key: ['Unsupported field; please contact support.']
                                               for key in sorted(unexpected)})
        return super().validate(attrs)

    def validate_cvFile(self, value):
        if value and value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError('CV file must be 10 MB or smaller.')
        return value

    def create(self, validated_data):
        language = validated_data.pop('language', 'en')
        return super().create({**validated_data, 'submission_language': language})


class JoinOurTeamSerializer(PublicFormSerializer):
    cvFile = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = JoinOurTeamApplication
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'submission_language',
                            'applicant_notified', 'admin_notified', 'notification_error']


class MentorRegistrationSerializer(PublicFormSerializer):
    class Meta:
        model = MentorRegistration
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'submission_language',
                            'applicant_notified', 'admin_notified', 'notification_error']


class TraineeRegistrationSerializer(PublicFormSerializer):
    cvFile = serializers.FileField(required=False, allow_null=True)

    class Meta:
        model = TraineeRegistration
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'submission_language',
                            'applicant_notified', 'admin_notified', 'notification_error']


class ProfileContactSerializer(PublicFormSerializer):
    message = serializers.CharField(max_length=5000, trim_whitespace=True)

    class Meta:
        model = ProfileContact
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'submission_language',
                            'applicant_notified', 'admin_notified', 'notification_error']


class WorkWithUsSerializer(serializers.ModelSerializer):
    """The /join-us frontend has a different field naming convention."""
    your_first_name = serializers.CharField(max_length=150, trim_whitespace=True)
    your_last_name = serializers.CharField(max_length=150, trim_whitespace=True)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=50, trim_whitespace=True)
    cvFile = serializers.FileField(required=False, allow_null=True)
    language = serializers.ChoiceField(choices=('en', 'fa'), required=False,
                                       default='en', write_only=True)

    class Meta:
        model = WorkWithUsRegistration
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'submission_language',
                            'applicant_notified', 'admin_notified', 'notification_error']

    def validate(self, attrs):
        unexpected = set(self.initial_data.keys()) - set(self.fields)
        if unexpected:
            raise serializers.ValidationError({key: ['Unsupported field; please contact support.']
                                               for key in sorted(unexpected)})
        return attrs

    def validate_cvFile(self, value):
        if value and value.size > 10 * 1024 * 1024:
            raise serializers.ValidationError('CV file must be 10 MB or smaller.')
        return value

    def create(self, validated_data):
        language = validated_data.pop('language', 'en')
        return super().create({**validated_data, 'submission_language': language})


class PublicRegistrationView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    throttle_classes = [PublicFormsThrottle]
    parser_classes = [FormParser, MultiPartParser]
    http_method_names = ['post', 'options']
    serializer_class = None
    email_kind = None

    def post(self, request):
        # The pre-existing Join Our Team frontend can append cvFile twice:
        # a real multipart file, then a textual "[object File]" fallback.
        # Preserve the actual uploaded file, never overwrite it with the text.
        data = request.data.copy()
        file = request.FILES.get('cvFile')
        if file is not None:
            data.setlist('cvFile', [file])
        elif 'cvFile' in data and str(data.get('cvFile')) in ('', 'null', 'undefined', '[object File]'):
            data.pop('cvFile')
        serializer = self.serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        # Save before contacting Microsoft 365. A broken mail service is not
        # an unsuccessful registration and should not induce duplicate retries.
        instance = serializer.save()
        delivered = notify_registration(instance, self.email_kind)
        return Response({
            'reference': instance.pk,
            'notifications_sent': delivered,
            'message': ('Submission saved and both notifications accepted.' if delivered
                        else 'Submission saved; some emails are pending. Do not resubmit.'),
        }, status=status.HTTP_201_CREATED if delivered else status.HTTP_202_ACCEPTED)


class JoinOurTeamView(PublicRegistrationView):
    serializer_class = JoinOurTeamSerializer
    email_kind = 'Join Our Team application'


class MentorRegistrationView(PublicRegistrationView):
    serializer_class = MentorRegistrationSerializer
    email_kind = 'Mentor registration'


class TraineeRegistrationView(PublicRegistrationView):
    serializer_class = TraineeRegistrationSerializer
    email_kind = 'Trainee registration'


class ProfileContactView(PublicRegistrationView):
    serializer_class = ProfileContactSerializer
    email_kind = 'Profile contact inquiry'


class WorkWithUsView(PublicRegistrationView):
    serializer_class = WorkWithUsSerializer
    email_kind = 'Work With Us application'
