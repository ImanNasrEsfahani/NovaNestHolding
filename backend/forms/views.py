from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from django.middleware.csrf import get_token
from rest_framework.response import Response
from rest_framework.parsers import FormParser,MultiPartParser
from rest_framework import status
from .models import StartUpsForm,ContactUs,PartnerMembership,InvestorRegistration, Entrepreneur
from .serializers import StartupFormSerializer,ContactUsSerializer,PartnerMembershipSerializer,InvestorRegistrationSerializer, EntrepreneurSerializer
# Create your views here.

class StartUpsFormView(CreateAPIView):
    queryset = StartUpsForm.objects.all()
    serializer_class = StartupFormSerializer
    parser_classes = [FormParser,MultiPartParser]
    http_method_names = ['post']

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
    queryset = PartnerMembership.objects.all()
    serializer_class = PartnerMembershipSerializer
    http_method_names = ['post']

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
