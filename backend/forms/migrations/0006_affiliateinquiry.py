"""Separate affiliate profile inquiries from the longer Apply form."""
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('forms', '0005_affiliateapplication_three_email_notifications')]

    operations = [
        migrations.CreateModel(
            name='AffiliateInquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('affiliate_slug', models.SlugField(db_index=True, max_length=100)),
                ('affiliate_name', models.CharField(max_length=250)),
                ('partner_primary_email', models.EmailField(max_length=254)),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=50)),
                ('message', models.TextField(max_length=1300)),
                ('submission_language', models.CharField(choices=[('en', 'English'), ('fa', 'Persian')], default='en', max_length=2)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('admin_notified', models.BooleanField(default=False)),
                ('partner_notified', models.BooleanField(default=False)),
                ('applicant_notified', models.BooleanField(default=False)),
                ('notification_error', models.CharField(blank=True, max_length=200)),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
