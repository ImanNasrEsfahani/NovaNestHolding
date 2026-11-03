"""Canonical initial audit schema. For empty databases only."""
from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    initial = True
    dependencies = [('forms', '0001_initial')]
    operations = [
        migrations.CreateModel(
            name='SubmissionAudit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form_key', models.CharField(max_length=60, db_index=True)),
                ('record_id', models.PositiveBigIntegerField()),
                ('language', models.CharField(max_length=2, choices=[('en','English'),('fa','Persian')], blank=True, default='')),
                ('source_path', models.CharField(max_length=500, blank=True)),
                ('referrer_host', models.CharField(max_length=250, blank=True)),
                ('timezone', models.CharField(max_length=100, blank=True)),
                ('utm_source', models.CharField(max_length=160, blank=True)),
                ('utm_medium', models.CharField(max_length=160, blank=True)),
                ('utm_campaign', models.CharField(max_length=160, blank=True)),
                ('utm_content', models.CharField(max_length=160, blank=True)),
                ('utm_term', models.CharField(max_length=160, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'ordering': ['-created_at'],
                'constraints': [models.UniqueConstraint(fields=('form_key', 'record_id'), name='unique_submission_audit_ref')],
            },
        ),
        migrations.CreateModel(
            name='ContactUsIdentity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('contact', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='submitted_identity', to='forms.contactus')),
                ('first_name', models.CharField(max_length=250)),
                ('last_name', models.CharField(max_length=250)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ConsultationIdempotencyRecord',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('key', models.UUIDField(editable=False, unique=True)),
                ('payload_digest', models.CharField(editable=False, max_length=64)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('consultation', models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name='idempotency_record',
                    null=True, blank=True, to='forms.consultationrequest',
                )),
            ],
        ),
    ]
