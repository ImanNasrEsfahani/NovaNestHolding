from django.db import models

# Existing models preserved from GitHub main.
class StartUpsForm(models.Model):
  firstName=models.CharField(max_length=300,blank=True)
  lastName=models.CharField(max_length=300,blank=True)
  birthDate=models.DateField(blank=True)
  email=models.EmailField(blank=True)
  countryOfResidence=models.CharField(max_length=300,blank=True)
  provinceOfResidence=models.CharField(max_length=300,blank=True)
  type=models.CharField(max_length=300,blank=True)
  ideaExplanation=models.CharField(max_length=300,blank=True)
  getToKnowUs=models.CharField(max_length=300,blank=True)
  pitchDeckFile=models.FileField(upload_to='pitchdeckfile',null=True,blank=True,editable=True)
  businessPlanFile=models.FileField(upload_to='businessPlan',null=True,blank=True,editable=True)
  productName=models.CharField(max_length=500,blank=True)
  siteAddress=models.CharField(max_length=500,blank=True)
  customerProblem=models.TextField(blank=True)
  solution=models.TextField(blank=True)
  productLevel=models.CharField(max_length=200,blank=True)
  scalable=models.TextField(blank=True)
  monetizationOfYourPlan=models.TextField(blank=True)
  structureOfYourSales=models.TextField(blank=True)
  financialModelFile=models.FileField(upload_to='financialModelFile',null=True,blank=True,editable=True)
  cooperatedWithInvestors=models.TextField(blank=True)
  financialFile=models.FileField(upload_to='financialFile',null=True,blank=True,editable=True)
  customerCharacteristic=models.TextField(blank=True)
  currentCustomers=models.TextField(blank=True)
  estimatedMarketSize=models.TextField(blank=True)
  totalTamSamSom=models.TextField(blank=True)
  startupRevenue=models.TextField(blank=True)
  monthlyIncome=models.TextField(blank=True)
  currentInterestRate=models.TextField(blank=True)
  currentRaisedFunding=models.TextField(blank=True)
  neededCapital=models.TextField(blank=True)
  createdAt=models.DateTimeField(auto_now_add=True,blank=True)
  updatedAt=models.DateTimeField(auto_now=True,blank=True)

class ContactUs(models.Model):
  name=models.CharField(max_length=250,blank=True)
  email=models.EmailField(blank=True)
  number=models.CharField(max_length=250,blank=True)
  subject=models.CharField(max_length=500,blank=True)
  message=models.TextField(blank=True)
  createdAt=models.DateTimeField(auto_now_add=True,blank=True)

class PartnerMembership(models.Model):
  firstName=models.CharField(max_length=500,blank=True)
  lastName=models.CharField(max_length=500,blank=True)
  birthDate=models.DateField(blank=True)
  email=models.EmailField(blank=True)
  countryOfResidence=models.CharField(max_length=500,blank=True)
  provinceOfResidence=models.CharField(max_length=500,blank=True)
  companyName=models.CharField(max_length=500,blank=True)
  investmentCeiling=models.CharField(max_length=500,blank=True)
  howDidYouKnowUs=models.CharField(max_length=500,blank=True)
  createdAt=models.DateTimeField(auto_now_add=True)
  updatedAt=models.DateTimeField(auto_now=True)

class InvestorRegistration(models.Model):
  firstName=models.CharField(max_length=500,blank=True)
  lastName=models.CharField(max_length=500,blank=True)
  email=models.EmailField(blank=True)
  birthDate=models.DateField(blank=True)
  countryOfResidence=models.CharField(max_length=500,blank=True)
  provinceOfResidence=models.CharField(max_length=500,blank=True)
  companyName=models.CharField(max_length=500,blank=True)
  investmentCeiling=models.CharField(max_length=500,blank=True)
  preferredAreas=models.CharField(max_length=500,blank=True)
  howDidYouKnowUs=models.CharField(max_length=500,blank=True)
  createdAt=models.DateTimeField(auto_now_add=True)
  updatedAt=models.DateTimeField(auto_now=True)

class Entrepreneur(models.Model):
  firstName=models.CharField(max_length=500,blank=True)
  lastName=models.CharField(max_length=500,blank=True)
  email=models.EmailField(blank=True)
  birthDate=models.DateField(blank=True)
  countryOfResidence=models.CharField(max_length=500,blank=True)
  provinceOfResidence=models.CharField(max_length=500,blank=True)
  companyName=models.CharField(max_length=500,blank=True)
  investmentCeiling=models.CharField(max_length=500,blank=True)
  preferredAreas=models.CharField(max_length=500,blank=True)
  howDidYouKnowUs=models.CharField(max_length=500,blank=True)

class AffiliateApplication(models.Model):
  EDUCATION_CHOICES = [('high_school','High school'), ('bachelor','Bachelor'), ('master','Master'), ('phd','PhD')]
  LANGUAGE_CHOICES = [('none','None'), ('basic','Basic'), ('intermediate','Intermediate'), ('advanced','Advanced')]
  POSITION_CHOICES = [
    ('owner', 'Owner'), ('owner_ceo', 'Owner & CEO'), ('ceo', 'CEO'),
    ('senior_manager', 'Senior Manager'), ('other', 'Other'),
  ]
  EXPERIENCE_CHOICES = [
    ('under_5', 'Less than 5 years'), ('5_10', '5–10 years'),
    ('10_20', '10–20 years'), ('20_plus', '20+ years'),
  ]
  ASSETS_RANGE_CHOICES = [
    ('under_300k', 'Less than US$300,000'),
    ('300k_500k', 'US$300,000–US$500,000'),
    ('500k_1m', 'US$500,000–US$1 million'),
    ('1m_plus', 'US$1 million or more'),
  ]
  affiliate_slug = models.SlugField(max_length=100, db_index=True)
  affiliate_name = models.CharField(max_length=250)
  partner_primary_email = models.EmailField()
  full_name = models.CharField(max_length=180)
  phone_number = models.CharField(max_length=16)
  email = models.EmailField()
  # Deprecated fields stay nullable/optional to preserve historic submissions.
  age = models.PositiveSmallIntegerField(null=True, blank=True)
  country = models.CharField(max_length=100, blank=True)
  city = models.CharField(max_length=100, blank=True)
  work_experience = models.TextField(blank=True)
  position = models.CharField(max_length=20, choices=POSITION_CHOICES)
  years_of_experience = models.CharField(max_length=20, choices=EXPERIENCE_CHOICES)
  industry_field = models.CharField(max_length=180)
  assets_range = models.CharField(max_length=20, choices=ASSETS_RANGE_CHOICES)
  education_degree = models.CharField(max_length=20, choices=EDUCATION_CHOICES)
  language_level = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
  ielts_score = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True)
  assets_amount = models.DecimalField(max_digits=17, decimal_places=2, null=True, blank=True)
  assets_currency = models.CharField(max_length=8, blank=True)
  traveled_to_canada = models.BooleanField()
  visa_rejected = models.BooleanField()
  visa_rejection_details = models.TextField(blank=True)
  consented_at = models.DateTimeField(null=True, blank=True)
  created_at = models.DateTimeField(auto_now_add=True)
  admin_notified = models.BooleanField(default=False)
  partner_notified = models.BooleanField(default=False)
  applicant_notified = models.BooleanField(default=False)
  submission_language = models.CharField(max_length=2, choices=[('en', 'English'), ('fa', 'Persian')], default='en')
  notification_error = models.CharField(max_length=200, blank=True)

  class Meta:
    ordering = ['-created_at']
