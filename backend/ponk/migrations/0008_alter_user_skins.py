# Generated by Django 5.0.4 on 2024-05-22 22:38

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ponk", "0007_alter_user_skins"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="skins",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(), default=list, size=None
            ),
        ),
    ]