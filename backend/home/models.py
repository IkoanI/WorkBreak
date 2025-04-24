from django.contrib.auth.models import User
from django.db import models

from accounts.models import WorkBreakUser


class Visit(models.Model):
    user = models.ForeignKey(WorkBreakUser, on_delete=models.CASCADE)
    restaurant_name = models.CharField(max_length=200)
    visited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.restaurant_name}"

