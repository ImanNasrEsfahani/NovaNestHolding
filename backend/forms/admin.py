from django.contrib import admin
from .models import InvestorRegistration, StartUpsForm, PartnerMembership, ContactUs, AffiliateApplication
from .affiliate_applications import notify_application

admin.site.register(InvestorRegistration)
admin.site.register(StartUpsForm)
admin.site.register(PartnerMembership)
admin.site.register(ContactUs)


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
