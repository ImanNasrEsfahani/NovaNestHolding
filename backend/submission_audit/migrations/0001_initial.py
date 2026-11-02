from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name='SubmissionAudit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('form_key', models.CharField(max_length=60, db_index=True)),
                ('record_id', models.PositiveBigIntegerField()),
                ('language', models.CharField(max_length=2, choices=[('en', 'English'), ('fa', 'Persian')], blank=True, default='')),
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
            options={'ordering': ['-created_at']},
        ),
        migrations.AddConstraint(
            model_name='submissionaudit',
            constraint=models.UniqueConstraint(fields=('form_key', 'record_id'), name='unique_submission_audit_ref'),
        ),
    ]
