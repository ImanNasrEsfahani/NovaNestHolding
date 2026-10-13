from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('forms', '0001_initial')]

    operations = [
        migrations.CreateModel(
            name='AffiliateApplication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('affiliate_slug', models.SlugField(max_length=100, db_index=True)),
                ('affiliate_name', models.CharField(max_length=250)),
                ('partner_primary_email', models.EmailField(max_length=254)),
                ('full_name', models.CharField(max_length=180)),
                ('phone_number', models.CharField(max_length=16)),
                ('email', models.EmailField(max_length=254)),
                ('age', models.PositiveSmallIntegerField()),
                ('country', models.CharField(max_length=100)),
                ('city', models.CharField(max_length=100)),
                ('work_experience', models.TextField()),
                ('education_degree', models.CharField(max_length=20, choices=[('high_school','High school'), ('bachelor','Bachelor'), ('master','Master'), ('phd','PhD')])),
                ('language_level', models.CharField(max_length=20, choices=[('none','None'), ('basic','Basic'), ('intermediate','Intermediate'), ('advanced','Advanced')])),
                ('ielts_score', models.DecimalField(max_digits=2, decimal_places=1, blank=True, null=True)),
                ('assets_amount', models.DecimalField(max_digits=17, decimal_places=2)),
                ('assets_currency', models.CharField(max_length=8)),
                ('traveled_to_canada', models.BooleanField()),
                ('visa_rejected', models.BooleanField()),
                ('visa_rejection_details', models.TextField(blank=True)),
                ('consented_at', models.DateTimeField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('admin_notified', models.BooleanField(default=False)),
                ('partner_notified', models.BooleanField(default=False)),
                ('notification_error', models.CharField(blank=True, max_length=200)),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]
