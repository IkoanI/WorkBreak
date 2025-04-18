import os

from django.conf import settings
from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

def get_upload_path(instance, filename):
    return '{user}/{filename}'.format(user=instance.user.username, filename=filename)
# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    image = models.ImageField(default="workbreak.png", upload_to=get_upload_path, blank=True)
    cuisines = models.JSONField(default=list, blank=True)

    def __str__(self):
        return self.user.username + " Profile"

@receiver(post_save, sender=User)  # new
def create_or_update_user_profile(sender, instance, created, **kwargs):
    UserProfile.objects.get_or_create(user=instance)
