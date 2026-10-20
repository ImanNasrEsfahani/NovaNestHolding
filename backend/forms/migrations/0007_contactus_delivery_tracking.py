"""Track two independent Contact Us notifications without emailing old records."""
from django.db import migrations, models


def mark_existing_contacts_as_notified(apps, schema_editor):
    # Existing contacts predate the new two-email delivery system; never send
    # unexpected historical messages from the Django Admin retry action.
    apps.get_model('forms', 'ContactUs').objects.all().update(
        visitor_notified=True, admin_notified=True,
    )


class Migration(migrations.Migration):
    dependencies = [('forms', '0006_affiliateinquiry')]

    operations = [
        migrations.AddField(
            model_name='contactus', name='visitor_notified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='contactus', name='admin_notified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='contactus', name='notification_error',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.AddField(
            model_name='contactus', name='submission_language',
            field=models.CharField(max_length=2, default='en', choices=[('en', 'English'), ('fa', 'Persian')]),
        ),
        migrations.RunPython(mark_existing_contacts_as_notified, migrations.RunPython.noop),
    ]
