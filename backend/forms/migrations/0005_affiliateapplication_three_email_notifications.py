"""Track applicant confirmations separately; never surprise old applicants on retry."""
from django.db import migrations, models


def mark_historical_applicants_as_notified(apps, schema_editor):
    # Existing records predate applicant confirmations. Do not send a late
    # confirmation to them when Django Admin retries other unsent notifications.
    apps.get_model('forms', 'AffiliateApplication').objects.all().update(applicant_notified=True)


class Migration(migrations.Migration):
    dependencies = [('forms', '0004_affiliateapplication_optional_historical_consent')]

    operations = [
        migrations.AddField(
            model_name='affiliateapplication', name='applicant_notified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='affiliateapplication', name='submission_language',
            field=models.CharField(max_length=2, choices=[('en', 'English'), ('fa', 'Persian')], default='en'),
        ),
        migrations.RunPython(mark_historical_applicants_as_notified, migrations.RunPython.noop),
    ]
