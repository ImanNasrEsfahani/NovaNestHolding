from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('forms', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='profilecontact',
            name='mentor_notified',
            field=models.BooleanField(default=False),
        ),
    ]
