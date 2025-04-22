import json

from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status

from restaurants.models import Restaurant, UserReview


# Create your views here.
def get_restaurant(request, slug):
    print(slug)
    restaurant = get_object_or_404(Restaurant, slug=slug)
    return JsonResponse({
        'name': restaurant.name,
        'description': restaurant.description,
        'slug': restaurant.slug
    })

@login_required
def create_review(request, slug):
    if request.method == 'POST':
        data = json.loads(request.body)
        restaurant = get_object_or_404(Restaurant, slug=slug)
        user_review = UserReview()
        user_review.user = request.user
        user_review.restaurant_name = restaurant.name
        user_review.rating = data['rating']
        user_review.comment = data['comment']
        user_review.save()
        return JsonResponse({"user": user_review.user.username,
                             "restaurant_name": user_review.restaurant_name,
                             "rating": user_review.rating,
                             "comment": user_review.comment,
                             "created_at": user_review.created_at}, status=status.HTTP_200_OK)

    return JsonResponse({'error': 'Invalid request method'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)