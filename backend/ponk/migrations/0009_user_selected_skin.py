# Generated by Django 5.0.4 on 2024-05-23 21:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ponk", "0009_gamehistory_xp"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="selected_skin",
            field=models.CharField(default="", max_length=128),
        ),
    ]