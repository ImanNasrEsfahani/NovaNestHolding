"""Persist Startup Validation form details and independent email-delivery statuses."""
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('forms', '0008_consultationrequest')]

    operations = [
        migrations.AlterField('StartUpsForm', 'birthDate', models.DateField(blank=True, null=True)),
        migrations.AddField('StartUpsForm', 'phoneNumber', models.CharField(max_length=50, blank=True)),
        migrations.AddField('StartUpsForm', 'cityOfResidence', models.CharField(max_length=300, blank=True)),
        migrations.AddField('StartUpsForm', 'startupType', models.CharField(max_length=100, blank=True)),
        migrations.AddField('StartUpsForm', 'uniqueValueProposition', models.TextField(blank=True)),
        migrations.AddField('StartUpsForm', 'technologyReadinessLevel', models.CharField(max_length=200, blank=True)),
        migrations.AddField('StartUpsForm', 'howDidYouKnowUs', models.TextField(blank=True)),
        migrations.AddField('StartUpsForm', 'submission_language', models.CharField(
            max_length=2, choices=[('en', 'English'), ('fa', 'Persian')], default='en')),
        migrations.AddField('StartUpsForm', 'applicant_notified', models.BooleanField(default=False)),
        migrations.AddField('StartUpsForm', 'admin_notified', models.BooleanField(default=False)),
        migrations.AddField('StartUpsForm', 'notification_error', models.CharField(max_length=200, blank=True)),
    ]
