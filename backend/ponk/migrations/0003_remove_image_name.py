# Generated by Django 5.0.4 on 2024-05-30 13:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("ponk", "0002_image"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="image",
            name="name",
        ),
    ]