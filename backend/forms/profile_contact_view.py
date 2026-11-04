"""Validated contact endpoint for published mentor profiles.

Reuses the existing saved-first workflow and its response contract, while
rejecting missing/unknown profile slugs before creating a database record.
"""
from rest_framework import serializers

from .profile_mentor_recipients import profile_mentor_recipient
from .public_form_views import ProfileContactSerializer, ProfileContactView as BaseProfileContactView


class RoutedProfileContactSerializer(ProfileContactSerializer):
    class Meta(ProfileContactSerializer.Meta):
        # Notification status is server-owned, never editable by the visitor.
        read_only_fields = [*ProfileContactSerializer.Meta.read_only_fields, 'mentor_notified']

    profileSlug = serializers.SlugField(max_length=150, required=True, allow_blank=False)

    def validate(self, attrs):
        if 'mentor_notified' in self.initial_data:
            raise serializers.ValidationError({'mentor_notified': 'This field cannot be submitted.'})
        return super().validate(attrs)

    def validate_profileSlug(self, value):
        if profile_mentor_recipient(value) is None:
            raise serializers.ValidationError('This profile does not have a configured contact recipient.')
        return value


class ProfileContactView(BaseProfileContactView):
    serializer_class = RoutedProfileContactSerializer

    def post(self, request):
        response = super().post(request)
        if response.status_code == 201:
            response.data['message'] = 'Submission saved and all three notifications accepted.'
        elif response.status_code == 202:
            response.data['message'] = 'Submission saved; at least one of the three email notifications is pending. Do not resubmit.'
        return response
