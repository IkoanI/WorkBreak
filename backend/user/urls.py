from django.urls import path
from django_nextjs.views import nextjs_page

from user import views
from user.views import UpdateUserProfileAPIView

urlpatterns = [
    path("profile", views.profile, name="user.profile"),
    path("api/update_user", views.update_user, name="user.update_user"),
    path("api/update_profile", UpdateUserProfileAPIView.as_view(), name="user.update_profile"),
]
