from django.urls import path
from django.views.generic import RedirectView
from django_nextjs.views import nextjs_page

urlpatterns = [
    path("", RedirectView.as_view(permanent=False, url='/home')),
    path("home", nextjs_page(), name="home.index"),
    path("about", nextjs_page(), name="home.about"),
]
