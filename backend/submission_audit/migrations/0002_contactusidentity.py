from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('submission_audit', '0001_initial'),
        ('forms', '0011_investor_and_public_form_fields'),
    ]

    operations = [
        migrations.CreateModel(
            name='ContactUsIdentity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=250)),
                ('last_name', models.CharField(max_length=250)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('contact', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE,
                                                 related_name='submitted_identity', to='forms.contactus')),
            ],
        ),
    ]
