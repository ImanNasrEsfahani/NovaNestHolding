from django.db import models


class SubmissionAudit(models.Model):
    """Optional context for a confirmed database insert in one of the public forms.

    Applicant data remains in the original form tables; this model references
    the table and primary key without a cross-table foreign-key dependency.
    """
    form_key = models.CharField(max_length=60, db_index=True)
    record_id = models.PositiveBigIntegerField()
    language = models.CharField(max_length=2, choices=(('en', 'English'), ('fa', 'Persian')), blank=True, default='')
    source_path = models.CharField(max_length=500, blank=True)
    referrer_host = models.CharField(max_length=250, blank=True)
    timezone = models.CharField(max_length=100, blank=True)
    utm_source = models.CharField(max_length=160, blank=True)
    utm_medium = models.CharField(max_length=160, blank=True)
    utm_campaign = models.CharField(max_length=160, blank=True)
    utm_content = models.CharField(max_length=160, blank=True)
    utm_term = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=['form_key', 'record_id'], name='unique_submission_audit_ref')]
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.form_key} #{self.record_id}'


class ContactUsIdentity(models.Model):
    """Separately preserves the first and last name collected by Contact Us.

    The pre-existing ContactUs.name column stays intact for legacy rows and
    notifications. No existing contact data is changed or deleted.
    """
    contact = models.OneToOneField('forms.ContactUs', on_delete=models.CASCADE, related_name='submitted_identity')
    first_name = models.CharField(max_length=250)
    last_name = models.CharField(max_length=250)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'.strip()
