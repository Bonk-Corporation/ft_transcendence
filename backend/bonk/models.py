from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=8, unique=True)
    display_name = models.CharField(max_length=96)
