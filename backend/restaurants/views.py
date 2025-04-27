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

def get_restaurant(request, slug):
    restaurant = get_object_or_404(Restaurant, slug=slug)
    return JsonResponse({
        'name': restaurant.name,
        'description': restaurant.description,
        'slug': restaurant.slug
    })

def get_reviews(request, slug):
    restaurant = get_object_or_404(Restaurant, slug=slug)
    user_reviews = UserReview.objects.filter(restaurant_name=restaurant.name).order_by('-created_at')

    reviews_data = [{
        "user": review.user.username,
        "rating": review.rating,
        "comment": review.comment,
        "created_at": review.created_at
    } for review in user_reviews]

    return JsonResponse({"reviews": reviews_data}, status=200)

@login_required
def create_review(request, slug):
    if request.method == 'POST':
        data = json.loads(request.body)
        restaurant, _ = Restaurant.objects.get_or_create(
            slug=slug,
            defaults={"name": slug.replace("-", " ").title(), "description": "Auto-generated restaurant."}
        )

        user_review = UserReview.objects.create(
            user=request.user,
            restaurant_name=restaurant.name,
            rating=data.get('rating', 5),
            comment=data.get('comment', '')
        )

        return JsonResponse({
            "user": user_review.user.username,
            "rating": user_review.rating,
            "comment": user_review.comment,
            "created_at": user_review.created_at
        }, status=200)

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

    return JsonResponse({'error': 'Invalid request method.'}, status=405)
