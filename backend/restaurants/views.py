import json
import os

import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view

from restaurants.models import Restaurant, UserReview
from dotenv import load_dotenv, dotenv_values


# Create your views here.
def get_restaurant(request, slug):
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

@api_view(['GET'])
def tripadvisor_search(request, name, lat, lng):
    # Load the TripAdvisor API key from environment
    api_key = dotenv_values(".env.local")['TRIPADVISOR_API_KEY']
    if not api_key:
        return JsonResponse({"error": "TripAdvisor API key not configured"}, status=500)

    # TripAdvisor API endpoint
    url = 'https://api.content.tripadvisor.com/api/v1/location/search'
    params = {'key': api_key, 'searchQuery': name, 'latLong': f'{lat},{lng}', 'category' : 'restaurant'}
    headers = {"accept": "application/json"}

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return JsonResponse(response.json(), status=200)
    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=401)

def tripadvisor_reviews(request, location_id):
    api_key = dotenv_values(".env.local")['TRIPADVISOR_API_KEY']
    if not api_key:
        return JsonResponse({"error": "TripAdvisor API key not configured"}, status=500)

    # TripAdvisor API endpoint
    url = f'https://api.content.tripadvisor.com/api/v1/location/{location_id}/reviews'
    params = {'key': api_key,}
    headers = {"accept": "application/json"}

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return JsonResponse(response.json(), status=200)
    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=401)
