"""Allow new affiliate submissions without a consent checkbox.

The previous consented_at values are retained for historical applications.
New applications will have consented_at=NULL rather than a fabricated consent.
"""
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('forms', '0003_affiliateapplication_structured_fields')]

    operations = [
        migrations.AlterField(
            model_name='affiliateapplication',
            name='consented_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
