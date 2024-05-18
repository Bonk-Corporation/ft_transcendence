# Generated by Django 5.0.4 on 2024-05-19 18:18

import django.contrib.auth.validators
import django.contrib.postgres.fields
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("ponk", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="ShopItems",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=92)),
                ("price", models.DecimalField(decimal_places=2, max_digits=8)),
                (
                    "images",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.URLField(), size=3
                    ),
                ),
            ],
        ),
        migrations.RemoveField(
            model_name="user",
            name="display_name",
        ),
        migrations.AddField(
            model_name="user",
            name="avatar",
            field=models.URLField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="user",
            name="friend_requests",
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name="user",
            name="friends",
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name="user",
            name="level",
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name="user",
            name="level_percentage",
            field=models.PositiveIntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="user",
            name="email",
            field=models.EmailField(max_length=254),
        ),
        migrations.AlterField(
            model_name="user",
            name="username",
            field=models.CharField(
                error_messages={"unique": "A user with that username already exists."},
                help_text="Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only.",
                max_length=150,
                unique=True,
                validators=[django.contrib.auth.validators.UnicodeUsernameValidator()],
                verbose_name="username",
            ),
        ),
        migrations.CreateModel(
            name="GameHistory",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("game", models.CharField(max_length=32)),
                (
                    "score",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.PositiveIntegerField(), size=2
                    ),
                ),
                ("win", models.BooleanField()),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="game_history",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
    ]
