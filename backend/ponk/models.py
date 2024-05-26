from enum import Enum
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone

DEFAULT_AVATAR = "/assets/sheldon.png"


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
    last_online = models.DateTimeField(default=timezone.now)
    citation = models.CharField(default="", max_length=256)
    bonk_token = models.CharField(default="")

    def __str__(self):
        return f"User(avatar={self.avatar}, auth_method={self.auth_method}, level={self.level})"


class GameHistory(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="game_history"
    )
    game = models.CharField(max_length=32)
    score = ArrayField(models.PositiveIntegerField(), size=2)
    win = models.BooleanField()
    xp = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.game} - {'Win' if self.win else 'Loss'}"


class Image(models.Model):
    image = models.ImageField(upload_to="assets/avatars/")

    def __str__(self):
        return self.name
class BonkEvent(models.Model):
    game_id = models.PositiveIntegerField(default=0)
    users = ArrayField(models.CharField())
    created_at = models.DateTimeField(auto_now_add=True)
    
