from django.urls import path
from .views import (StartUpsFormView, ContactUsView, PartnerMembershipView,
                    InvestorRegistrationView, CSRFTokenView, EntrepreneurView)
from .affiliate_applications import AffiliateApplicationView
from .affiliate_inquiries import AffiliateInquiryView
from .consultation_requests import SmallReservationView
from .public_form_views import (JoinOurTeamView, MentorRegistrationView,
                                TraineeRegistrationView, ProfileContactView)
from .work_with_us_cv import WorkWithUsCVView

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
    path('small-reservation', SmallReservationView.as_view(), name='small-reservation'),
    path('join-our-team', JoinOurTeamView.as_view(), name='join-our-team'),
    path('join-as-mentor', MentorRegistrationView.as_view(), name='join-as-mentor'),
    path('join-as-a-trainee', TraineeRegistrationView.as_view(), name='join-as-a-trainee'),
    path('contact-profile', ProfileContactView.as_view(), name='contact-profile'),
    path('work-with-us', WorkWithUsCVView.as_view(), name='work-with-us'),
]
