from django.contrib.auth.models import User
from django.db import models

from accounts.models import WorkBreakUser


# Create your models here.
class UserReview(models.Model):
    user = models.ForeignKey(WorkBreakUser, on_delete=models.CASCADE, related_name='reviews')
    restaurant_name = models.CharField(max_length=255)
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])  # 1 to 5 stars
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.restaurant_name} ({self.rating}★)"


class Restaurant(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name