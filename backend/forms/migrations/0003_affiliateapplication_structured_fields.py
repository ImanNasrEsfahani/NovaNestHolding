"""Switch new affiliate submissions to structured experience and asset ranges.

Historical values in obsolete columns remain available in the database and admin
so existing applications do not lose data. The public API no longer accepts them.
"""
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [('forms', '0002_affiliateapplication')]

    operations = [
        migrations.AlterField(
            model_name='affiliateapplication', name='age',
            field=models.PositiveSmallIntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='affiliateapplication', name='country',
            field=models.CharField(max_length=100, blank=True),
        ),
        migrations.AlterField(
            model_name='affiliateapplication', name='city',
            field=models.CharField(max_length=100, blank=True),
        ),
        migrations.AlterField(
            model_name='affiliateapplication', name='work_experience',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='affiliateapplication', name='assets_amount',
            field=models.DecimalField(max_digits=17, decimal_places=2, blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='affiliateapplication', name='assets_currency',
            field=models.CharField(max_length=8, blank=True),
        ),
        migrations.AddField(
            model_name='affiliateapplication', name='position',
            field=models.CharField(choices=[
                ('owner', 'Owner'), ('owner_ceo', 'Owner & CEO'),
                ('ceo', 'CEO'), ('senior_manager', 'Senior Manager'), ('other', 'Other'),
            ], max_length=20, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='affiliateapplication', name='years_of_experience',
            field=models.CharField(choices=[
                ('under_5', 'Less than 5 years'), ('5_10', '5–10 years'),
                ('10_20', '10–20 years'), ('20_plus', '20+ years'),
            ], max_length=20, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='affiliateapplication', name='industry_field',
            field=models.CharField(max_length=180, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='affiliateapplication', name='assets_range',
            field=models.CharField(choices=[
                ('under_300k', 'Less than US$300,000'),
                ('300k_500k', 'US$300,000–US$500,000'),
                ('500k_1m', 'US$500,000–US$1 million'),
                ('1m_plus', 'US$1 million or more'),
            ], max_length=20, default=''),
            preserve_default=False,
        ),
    ]
