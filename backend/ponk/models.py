from enum import Enum
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField

DEFAULT_AVATAR = "https://cdn.intra.42.fr/product/image/995/Visuels_newsletter__51_.png"


class AuthMethod(models.IntegerChoices):
    BASIC = 1
    FT = 2


class User(AbstractUser):
    friends = models.ManyToManyField("self", symmetrical=True, blank=True)
    friend_requests = models.ManyToManyField("self", symmetrical=False, blank=True)
    level = models.PositiveIntegerField(default=0)
    level_percentage = models.PositiveIntegerField(default=0)
    avatar = models.URLField(default=DEFAULT_AVATAR)
    skins = ArrayField(models.CharField(), default=list)
    selected_skin = models.CharField(default="")
    auth_method = models.IntegerField(choices=AuthMethod.choices)

    def __str__(self):
        return f"User(avatar={self.avatar}, auth_method={self.auth_method}, level={self.level})"


class GameHistory(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="game_history"
    )
    game = models.CharField(max_length=32)
    score = ArrayField(models.PositiveIntegerField(), size=2)
    win = models.BooleanField()

    def __str__(self):
        return f"{self.game} - {'Win' if self.win else 'Loss'}"


# Endpoint - shop


class ShopItems(models.Model):
    name = models.CharField(max_length=92)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    images = ArrayField(models.URLField(), size=3)

    def __str__(self):
        return self.name()
