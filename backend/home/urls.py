from django.urls import path
from django_nextjs.views import nextjs_page

urlpatterns = [
    path("", nextjs_page(), name="home.index"),
    path("about", nextjs_page(), name="home.about"),
]
