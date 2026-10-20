from django.contrib import admin
from .models import InvestorRegistration, StartUpsForm, PartnerMembership, ContactUs, AffiliateApplication, AffiliateInquiry
from .affiliate_applications import notify_application
from .affiliate_inquiries import notify_inquiry
from .contact_us_notifications import notify_contact_us

admin.site.register(InvestorRegistration)
admin.site.register(StartUpsForm)
admin.site.register(PartnerMembership)


@admin.register(ContactUs)
class ContactUsAdmin(admin.ModelAdmin):
    list_display = ('id', 'createdAt', 'name', 'email', 'number',
                    'visitor_notified', 'admin_notified')
    list_filter = ('visitor_notified', 'admin_notified', 'createdAt')
    search_fields = ('name', 'email', 'number', 'subject', 'message')
    readonly_fields = [field.name for field in ContactUs._meta.fields]
    actions = ['retry_failed_contact_emails']

    def has_add_permission(self, request):
        return False

    @admin.action(description='Retry unsent Contact Us emails only')
    def retry_failed_contact_emails(self, request, queryset):
        complete = sum(1 for contact in queryset if notify_contact_us(contact))
        self.message_user(
            request, f'Both email notifications complete for {complete} of {queryset.count()} selected contacts.'
        )


@admin.register(AffiliateApplication)
class AffiliateApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'affiliate_slug', 'full_name', 'email',
                    'admin_notified', 'partner_notified', 'applicant_notified')
    list_filter = ('affiliate_slug', 'admin_notified', 'partner_notified',
                   'applicant_notified', 'created_at')
    search_fields = ('full_name', 'email', 'affiliate_slug')
    readonly_fields = [field.name for field in AffiliateApplication._meta.fields]
    actions = ['retry_failed_notifications']

    def has_add_permission(self, request):
        return False

    @admin.action(description='Retry unsent email notifications')
    def retry_failed_notifications(self, request, queryset):
        delivered = 0
        for application in queryset:
            if notify_application(application):
                delivered += 1
        self.message_user(request, f'Email delivery complete for {delivered} of {queryset.count()} selected applications.')


@admin.register(AffiliateInquiry)
class AffiliateInquiryAdmin(admin.ModelAdmin):
    list_display = ('id', 'created_at', 'affiliate_slug', 'first_name', 'last_name',
                    'email', 'admin_notified', 'partner_notified', 'applicant_notified')
    list_filter = ('affiliate_slug', 'admin_notified', 'partner_notified',
                   'applicant_notified', 'created_at')
    search_fields = ('first_name', 'last_name', 'email', 'affiliate_slug')
    readonly_fields = [field.name for field in AffiliateInquiry._meta.fields]
    actions = ['retry_failed_inquiry_notifications']

    def has_add_permission(self, request):
        return False

    @admin.action(description='Retry unsent affiliate inquiry notifications')
    def retry_failed_inquiry_notifications(self, request, queryset):
        complete = 0
        for inquiry in queryset:
            if notify_inquiry(inquiry):
                complete += 1
        self.message_user(
            request,
            f'Email delivery complete for {complete} of {queryset.count()} selected inquiries.'
        )
