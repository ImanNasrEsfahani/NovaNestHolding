"""Preserve the additional fields entered in public Affiliate Registration.

Only additive fields, nullable birthDate and a widening of howDidYouKnowUs.
Never delete existing records or existing data.
"""
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('forms', '0009_startup_validation_notification_tracking'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnermembership',
            name='birthDate',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='partnermembership',
            name='howDidYouKnowUs',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='phoneNumber',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='cityOfResidence',
            field=models.CharField(blank=True, max_length=300),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='website',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='linkedin',
            field=models.CharField(blank=True, max_length=500),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='briefIntroduction',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='submission_language',
            field=models.CharField(
                max_length=2, choices=[('en', 'English'), ('fa', 'Persian')], default='en',
            ),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='applicant_notified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='admin_notified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='partnermembership',
            name='notification_error',
            field=models.CharField(blank=True, max_length=200),
        ),
    ]
