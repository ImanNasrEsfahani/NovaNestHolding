from django.contrib import admin
from .models import SubmissionAudit


@admin.register(SubmissionAudit)
class SubmissionAuditAdmin(admin.ModelAdmin):
    list_display = ('id', 'form_key', 'record_id', 'language', 'source_path', 'utm_campaign', 'created_at')
    list_filter = ('form_key', 'language', 'utm_source', 'created_at')
    search_fields = ('source_path', 'referrer_host', 'utm_source', 'utm_campaign')
    readonly_fields = [f.name for f in SubmissionAudit._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

from .models import ContactUsIdentity


@admin.register(ContactUsIdentity)
class ContactUsIdentityAdmin(admin.ModelAdmin):
    list_display = ('id', 'contact_id', 'first_name', 'last_name', 'created_at')
    search_fields = ('first_name', 'last_name', 'contact__email')
    readonly_fields = [f.name for f in ContactUsIdentity._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False
