from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField


class User(AbstractUser):
    name = models.CharField(max_length=96, unique=True)
    email = models.EmailField()
    friends = models.ManyToManyField("self")
    level = models.PositiveIntegerField()
    level_percentage = models.PositiveIntegerField()
    avatar = models.URLField()

    def __str__(self):
        return self.name


class GameHistory(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="game_history"
    )
    game = models.CharField(max_length=32)
    # score = models.ArrayField(models.PositiveIntegerField(), size=2)
    win = models.BooleanField()

    def __str__(self):
        return f"{self.game} - {'Win' if self.win else 'Loss'}"


# Endpoint - shop


class ShopItems(models.Model):
    name = models.CharField(max_length=92)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    # images = models.ArrayField(models.URLField(), size=3)

    def __str__(self):
        return self.name()
