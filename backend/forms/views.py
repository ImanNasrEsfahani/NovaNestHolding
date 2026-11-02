from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.parsers import FormParser,MultiPartParser
from rest_framework import status
from .models import StartUpsForm,ContactUs,PartnerMembership,InvestorRegistration, Entrepreneur
from .serializers import StartupFormSerializer,ContactUsSerializer,PartnerMembershipSerializer,InvestorRegistrationSerializer, EntrepreneurSerializer
from .partner_membership_notifications import notify_partner_membership
# Create your views here.

class StartUpsFormView(CreateAPIView):
    queryset = StartUpsForm.objects.all()
    serializer_class = StartupFormSerializer
    parser_classes = [FormParser, MultiPartParser]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        startup = serializer.instance
        accepted = startup.applicant_notified and startup.admin_notified
        return Response({
            'reference': startup.pk,
            'notifications_sent': accepted,
            'message': ('Startup application saved; both email notifications accepted.'
                        if accepted else 'Startup application saved; email delivery pending. Do not resubmit.'),
        }, status=status.HTTP_201_CREATED if accepted else status.HTTP_202_ACCEPTED)

class ContactUsView(CreateAPIView):
    queryset = ContactUs.objects.all()
    serializer_class = ContactUsSerializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        contact = serializer.instance
        delivered = contact.visitor_notified and contact.admin_notified
        return Response({
            'reference': contact.pk,
            'notifications_sent': delivered,
            'message': ('Message received. Both notifications sent.' if delivered
                        else 'Message saved. Email notifications pending; do not resubmit.'),
        }, status=status.HTTP_201_CREATED if delivered else status.HTTP_202_ACCEPTED)

class PartnerMembershipView(CreateAPIView):
    """The public Affiliate Registration endpoint (not partner-specific Apply)."""
    queryset = PartnerMembership.objects.all()
    serializer_class = PartnerMembershipSerializer
    parser_classes = [FormParser, MultiPartParser]
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        entry = serializer.instance  # Saved BEFORE either email is attempted.
        delivered = notify_partner_membership(entry)
        return Response({
            'reference': entry.pk,
            'notifications_sent': delivered,
            'message': ('Affiliate registration saved and notifications accepted.'
                        if delivered else
                        'Affiliate registration saved; email notifications pending. Do not resubmit.'),
        }, status=status.HTTP_201_CREATED if delivered else status.HTTP_202_ACCEPTED)

class InvestorRegistrationView(CreateAPIView):
    queryset = InvestorRegistration.objects.all()
    serializer_class = InvestorRegistrationSerializer
    http_method_names = ['post']

class EntrepreneurView(CreateAPIView):
    queryset = Entrepreneur.objects.all()
    serializer_class = EntrepreneurSerializer
    http_method_names = ['post']

# csrf token 
class CSRFTokenView(APIView):
    def get(self, request, format=None):
        token = get_token(request)
        return Response({'csrfToken': token})
