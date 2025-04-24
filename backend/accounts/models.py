# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class WorkBreakUser(AbstractUser):
    is_restaurant = models.BooleanField(default=False)