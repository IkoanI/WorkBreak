import os

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from accounts.models import WorkBreakUser


def get_upload_path(instance, filename):
    return '{user}/{filename}'.format(user=instance.user.username, filename=filename)
# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(default="workbreak.png", upload_to=get_upload_path, blank=True)
    cuisines = models.JSONField(default=list, blank=True)
    budget = models.CharField(max_length=255, blank=False, default="INEXPENSIVE")

    def __str__(self):
        return self.user.username + " Profile"


class RestaurantProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    place_id = models.CharField(max_length=255)
    restaurant_name = models.CharField(max_length=255, blank=False)

    def __str__(self):
        return self.user.username + " Profile"

@receiver(post_save, sender=WorkBreakUser)  # new
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created and instance.is_restaurant:
        RestaurantProfile.objects.get_or_create(user=instance, restaurant_name=instance.restaurant_name, place_id=instance.place_id)
    elif not instance.is_restaurant:
        UserProfile.objects.get_or_create(user=instance)
