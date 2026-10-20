"""Save consultation requests from Investment, Acceleration, PNP and Startup pages."""
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('forms', '0007_contactus_delivery_tracking')]

    operations = [
        migrations.CreateModel(
            name='ConsultationRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('service', models.CharField(db_index=True, max_length=30, choices=[
                    ('investment', 'Investment'),
                    ('acceleration', 'Acceleration'),
                    ('entrepreneur-pnp', 'Entrepreneur PNP'),
                    ('startup', 'Startup Visa'),
                ])),
                ('first_name', models.CharField(max_length=150)),
                ('last_name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=50)),
                ('submission_language', models.CharField(max_length=2, choices=[
                    ('en', 'English'), ('fa', 'Persian'),
                ], default='en')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('visitor_notified', models.BooleanField(default=False)),
                ('admin_notified', models.BooleanField(default=False)),
                ('notification_error', models.CharField(blank=True, max_length=200)),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
