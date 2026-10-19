"""Form serializers using one shared NovaNest HTML email layout.

Delivery uses the same Brevo SMTP configuration as before; only presentation
is centralized. Each email has its own wording, but the shared template
provides a consistent header, footer, responsive styling, and plaintext copy.
"""
import logging

from django.conf import settings
from rest_framework import serializers

from .email_service import send_branded_brevo_email
from .models import ContactUs, Entrepreneur, InvestorRegistration, PartnerMembership, StartUpsForm

logger = logging.getLogger(__name__)


class StartupFormSerializer(serializers.ModelSerializer):
    financialModelFile = serializers.FileField(required=False)
    financialFile = serializers.FileField(required=False)
    pitchDeckFile = serializers.FileField(required=False)
    businessPlanFile = serializers.FileField(required=False)

    class Meta:
        model = StartUpsForm
        fields = '__all__'
        read_only_fields = ['id', 'createdAt']

    def create(self, validated_data):
        instance = super().create(validated_data)
        name = f'{instance.firstName} {instance.lastName}'.strip()
        send_branded_brevo_email(
            instance.email,
            subject='Thank you for registering your startup',
            title='Startup registration received',
            intro=f'Hello {instance.firstName}, thank you for registering your startup with NovaNest Holding.',
            message='Our team will review your submission and contact you if further information is needed.',
            rows=[('Applicant', name), ('Email', instance.email), ('Startup / product', instance.productName)],
            note='This email confirms receipt of your registration, not approval.',
        )

        # Keep the existing internal-notification recipient setting and behavior.
        admin_list = getattr(settings, 'MAILGUN_ADMIN_RECIPIENTS', [])
        if admin_list:
            send_branded_brevo_email(
                admin_list,
                subject=f'New startup registration: {name}',
                title='New startup registration',
                intro='A new startup registration was submitted to NovaNest Holding.',
                rows=[('Applicant', name), ('Email', instance.email),
                      ('Startup / product', instance.productName), ('Submission ID', instance.pk)],
                note='Internal notification. Handle applicant information confidentially.',
            )
        return instance


class ContactUsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactUs
        fields = '__all__'
        read_only_fields = ['id', 'createdAt']

    def create(self, validated_data):
        instance = super().create(validated_data)
        send_branded_brevo_email(
            instance.email,
            subject='Thanks for contacting NovaNest Holding',
            title='We received your message',
            intro=f'Hello {instance.name}, thank you for contacting NovaNest Holding.',
            message='Our team will get back to you as soon as possible.',
            rows=[('Subject', instance.subject), ('Your message', instance.message)],
            note='This is an automated acknowledgement of your message.',
        )
        return instance


class PartnerMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartnerMembership
        fields = '__all__'
        read_only_fields = ['id', 'createdAt']

    def create(self, validated_data):
        instance = super().create(validated_data)
        send_branded_brevo_email(
            instance.email,
            subject='Thanks for joining our partner network',
            title='Partner registration received',
            intro=f'Hello {instance.firstName}, thank you for your interest in the NovaNest Holding partner network.',
            message='Our partnerships team will review the information you submitted.',
            rows=[('Applicant', f'{instance.firstName} {instance.lastName}'.strip()),
                  ('Email', instance.email), ('Company', instance.companyName)],
            note='This message confirms receipt of your registration, not acceptance.',
        )
        return instance


class InvestorRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestorRegistration
        fields = '__all__'
        read_only_fields = ['id', 'createdAt']

    def create(self, validated_data):
        instance = super().create(validated_data)
        send_branded_brevo_email(
            instance.email,
            subject='Thank you for registering as an investor',
            title='Investor registration received',
            intro=f'Hello {instance.firstName}, thank you for registering as an investor with NovaNest Holding.',
            message='Our team will review your registration and contact you when appropriate.',
            rows=[('Applicant', f'{instance.firstName} {instance.lastName}'.strip()),
                  ('Email', instance.email), ('Company', instance.companyName)],
            note='This message confirms receipt of your registration, not approval.',
        )
        return instance


class EntrepreneurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrepreneur
        fields = '__all__'
        read_only_fields = ['id', 'createdAt']

    def create(self, validated_data):
        instance = super().create(validated_data)
        send_branded_brevo_email(
            instance.email,
            subject='Thank you for registering as an entrepreneur',
            title='Entrepreneur registration received',
            intro=f'Hello {instance.firstName}, thank you for registering as an entrepreneur with NovaNest Holding.',
            message='Our team will review your registration and follow up when appropriate.',
            rows=[('Applicant', f'{instance.firstName} {instance.lastName}'.strip()),
                  ('Email', instance.email), ('Company', instance.companyName)],
            note='This message confirms receipt of your registration, not approval.',
        )
        return instance
