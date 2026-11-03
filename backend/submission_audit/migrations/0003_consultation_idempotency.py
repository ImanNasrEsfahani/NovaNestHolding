from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ('submission_audit', '0002_contactusidentity'),
        ('forms', '0008_consultationrequest'),
    ]

    operations = [
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
