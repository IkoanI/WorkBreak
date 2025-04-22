from django.urls import path
from django_nextjs.views import nextjs_page
from .views import get_restaurant, create_review
urlpatterns = [
    path("<slug:slug>", nextjs_page(), name="restaurants.page"),
    path("api/<slug:slug>/", get_restaurant, name="restaurants.get_restaurant"),
    path("api/<slug:slug>/create_review", create_review, name="restaurants.api.create_review"),
]