from django.contrib import admin

from user.models import UserProfile, RestaurantProfile

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(RestaurantProfile)