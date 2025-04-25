from django.urls import path
from django.views.generic import RedirectView
from django_nextjs.views import nextjs_page
from .views import user_visits, location_details, get_csrf_token

urlpatterns = [
    path("", RedirectView.as_view(permanent=False, url='/home')),
    path("home", nextjs_page(), name="home.index"),
    path("about", nextjs_page(), name="home.about"),
    path("api/user_visits", user_visits, name="user_visits"),
    path("api/location/<str:location_id>", location_details, name="location_details"),

    path("api/get_csrf_token", get_csrf_token, name="get_csrf_token"),
]
