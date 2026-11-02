# Additive migration: no RunPython destructive operations, no table/column deletions.
from django.db import migrations, models


def common_fields():
    return [
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('submission_language', models.CharField(choices=[('en', 'English'), ('fa', 'Persian')], default='en', max_length=2)),
        ('applicant_notified', models.BooleanField(default=False)),
        ('admin_notified', models.BooleanField(default=False)),
        ('notification_error', models.CharField(blank=True, max_length=200)),
        ('firstName', models.CharField(max_length=150)),
        ('lastName', models.CharField(max_length=150)),
        ('email', models.EmailField(max_length=254)),
        ('phoneNumber', models.CharField(max_length=50)),
    ]


def places():
    return [
        ('countryOfResidence', models.CharField(blank=True, max_length=300)),
        ('cityOfResidence', models.CharField(blank=True, max_length=300)),
    ]


class Migration(migrations.Migration):
    dependencies = [('forms', '0010_partner_membership_data_integrity')]

    operations = [
        migrations.AlterField(
            model_name='investorregistration', name='preferredAreas',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='investorregistration', name='howDidYouKnowUs',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='investorregistration', name='phoneNumber',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='investorregistration', name='birthDate',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='investorregistration', name='submission_language',
            field=models.CharField(choices=[('en', 'English'), ('fa', 'Persian')], default='en', max_length=2),
        ),
        migrations.AddField(
            model_name='investorregistration', name='applicant_notified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='investorregistration', name='admin_notified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='investorregistration', name='notification_error',
            field=models.CharField(blank=True, max_length=200),
        ),
        migrations.CreateModel(
            name='JoinOurTeamApplication',
            fields=common_fields() + places() + [
                ('typeOfCollaboration', models.CharField(blank=True, max_length=200)),
                ('fieldOfExpert', models.CharField(blank=True, max_length=300)),
                ('fieldOfExpertOther', models.CharField(blank=True, max_length=300)),
                ('birthDate', models.DateField(blank=True, null=True)),
                ('educationLevel', models.CharField(blank=True, max_length=300)),
                ('educationField', models.CharField(blank=True, max_length=300)),
                ('workHistorySummary', models.TextField(blank=True)),
                ('cvFile', models.FileField(blank=True, null=True, upload_to='public-applications/jobs/cv/')),
            ],
        ),
        migrations.CreateModel(
            name='MentorRegistration',
            fields=common_fields() + places() + [
                ('birthDate', models.DateField(blank=True, null=True)),
                ('website', models.CharField(blank=True, max_length=500)),
                ('linkedin', models.CharField(blank=True, max_length=500)),
                ('instagram', models.CharField(blank=True, max_length=500)),
                ('ExpertiesAreas', models.TextField(blank=True)),
                ('howDidYouKnowUs', models.TextField(blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='TraineeRegistration',
            fields=common_fields() + places() + [
                ('birthDate', models.DateField(blank=True, null=True)),
                ('fieldOfExpert', models.CharField(blank=True, max_length=300)),
                ('fieldOfExpertOther', models.CharField(blank=True, max_length=300)),
                ('tellUsAboutYourself', models.TextField(blank=True)),
                ('cvFile', models.FileField(blank=True, null=True, upload_to='public-applications/trainees/cv/')),
            ],
        ),
        migrations.CreateModel(
            name='ProfileContact',
            fields=common_fields() + [
                ('profileSlug', models.SlugField(blank=True, max_length=150)),
                ('subject', models.CharField(blank=True, max_length=300)),
                ('message', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='WorkWithUsRegistration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('submission_language', models.CharField(choices=[('en', 'English'), ('fa', 'Persian')], default='en', max_length=2)),
                ('applicant_notified', models.BooleanField(default=False)),
                ('admin_notified', models.BooleanField(default=False)),
                ('notification_error', models.CharField(blank=True, max_length=200)),
                ('your_position', models.CharField(blank=True, max_length=200)),
                ('type_of_contract', models.CharField(blank=True, max_length=200)),
                ('uni', models.CharField(blank=True, max_length=300)),
                ('your_first_name', models.CharField(max_length=150)),
                ('your_last_name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254)),
                ('phone_number', models.CharField(max_length=50)),
                ('your_field_of_study', models.CharField(blank=True, max_length=300)),
                ('your_subfield', models.CharField(blank=True, max_length=300)),
                ('langLevel', models.CharField(blank=True, max_length=200)),
                ('cvFile', models.FileField(blank=True, null=True, upload_to='public-applications/work-with-us/cv/')),
                ('firstName', models.CharField(blank=True, max_length=150)),
                ('lastName', models.CharField(blank=True, max_length=150)),
                ('phoneNumber', models.CharField(blank=True, max_length=50)),
                ('countryOfResidence', models.CharField(blank=True, max_length=300)),
                ('cityOfResidence', models.CharField(blank=True, max_length=300)),
                ('typeOfCollaboration', models.CharField(blank=True, max_length=200)),
                ('fieldOfExpert', models.CharField(blank=True, max_length=300)),
                ('fieldOfExpertOther', models.CharField(blank=True, max_length=300)),
                ('birthDate', models.DateField(blank=True, null=True)),
                ('educationLevel', models.CharField(blank=True, max_length=300)),
                ('educationField', models.CharField(blank=True, max_length=300)),
                ('workHistorySummary', models.TextField(blank=True)),
            ],
        ),
    ]
