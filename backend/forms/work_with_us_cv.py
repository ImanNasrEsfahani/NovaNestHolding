"""Enforce position-dependent CV requirements for public Work With Us requests."""
from rest_framework import serializers
from .public_form_views import WorkWithUsSerializer, WorkWithUsView


PROFESSOR_POSITIONS = frozenset(('Professor', 'استاد دانشگاه'))


class WorkWithUsCVSerializer(WorkWithUsSerializer):
    def validate(self, attrs):
        attrs = super().validate(attrs)
        position = str(attrs.get('your_position') or '').strip()
        if position in PROFESSOR_POSITIONS and not attrs.get('cvFile'):
            raise serializers.ValidationError({
                'cvFile': ['CV is required for the Professor position.'],
            })
        return attrs


class WorkWithUsCVView(WorkWithUsView):
    serializer_class = WorkWithUsCVSerializer
