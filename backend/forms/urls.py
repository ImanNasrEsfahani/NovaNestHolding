from django.urls import path
from .views import StartUpsFormView, ContactUsView, PartnerMembershipView, InvestorRegistrationView, CSRFTokenView, EntrepreneurView
from .affiliate_applications import AffiliateApplicationView
from .affiliate_inquiries import AffiliateInquiryView

app_name = 'forms'
urlpatterns = [
    path('startups-form', StartUpsFormView.as_view(), name='startups-form'),
    path('contactUs-form', ContactUsView.as_view(), name='contactus-form'),
    path('partner-membership', PartnerMembershipView.as_view(), name='partner-membership'),
    path('investor-registration', InvestorRegistrationView.as_view(), name='investor-registration'),
    path('entrepreuneur-form', EntrepreneurView.as_view(), name='entrepreuneur-form'),
    path('get-csrf-token', CSRFTokenView.as_view(), name='get_csrf_token'),
    path('affiliate-applications/<slug:slug>', AffiliateApplicationView.as_view(), name='affiliate-application'),
    path('affiliate-inquiries/<slug:slug>', AffiliateInquiryView.as_view(), name='affiliate-inquiry'),
]
