from django.urls import path
from django_nextjs.views import nextjs_page
from .views import get_restaurant, create_review, get_reviews

urlpatterns = [
    path("<slug:slug>", nextjs_page(), name="restaurants.page"),
    path("discover", nextjs_page(), name="restaurants.discover"),
    path("api/<slug:slug>/", get_restaurant, name="restaurants.api.get_restaurant"),
    path("api/<slug:slug>/create_review/", create_review, name="restaurants.api.create_review"),
    path("api/<slug:slug>/reviews/", get_reviews, name="restaurants.api.get_reviews"),
]
