from django.urls import path
from django.views.generic import RedirectView
from django_nextjs.views import nextjs_page
from .views import user_visits, get_restaurant
from . import views

urlpatterns = [
    path("", RedirectView.as_view(permanent=False, url='/home')),
    path("home", nextjs_page(), name="home.index"),
    path("about", nextjs_page(), name="home.about"),
    path("api/user_visits", user_visits, name="user_visits"),
    path("api/restaurants/<slug:slug>/", get_restaurant, name="get_restaurant"),
    path("restaurants/<slug:slug>", nextjs_page(), name="restaurants.page"),
]
