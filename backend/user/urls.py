from django.urls import path
from django_nextjs.views import nextjs_page

from user import views

urlpatterns = [
    path("profile", views.profile, name="user.profile"),
    path("api/update_profile", views.update_profile, name="user.update_profile"),
]
