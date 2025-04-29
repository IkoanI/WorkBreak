from django.urls import path
from django_nextjs.views import nextjs_page
from . import views

urlpatterns = [
    path("<slug:slug>/", nextjs_page(), name="restaurants.page"),
    path("discover/", nextjs_page(), name="restaurants.discover"),
    path("api/<slug:slug>/", views.get_restaurant, name="restaurants.api.get_restaurant"),
    path("api/<slug:slug>/create_review/", views.create_review, name="restaurants.api.create_review"),
    path("api/<slug:slug>/<str:place_id>/reviews/", views.get_reviews, name="restaurants.api.get_reviews"),
    path("api/<slug:slug>/<str:place_id>/reply_review/<int:review_id>/", views.reply_review, name="restaurants.api.reply_review"),
    path("api/tripadvisor_search/<str:name>/<str:lat>/<str:lng>/", views.tripadvisor_search, name="restaurants.api.tripadvisor_search"),
    path("api/tripadvisor_reviews/<str:location_id>/", views.tripadvisor_reviews, name="restaurants.api.tripadvisor_reviews"),
]
