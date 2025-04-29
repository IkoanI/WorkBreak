import json
import requests
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST
from rest_framework import status
from rest_framework.decorators import api_view
from dotenv import dotenv_values

from accounts.models import WorkBreakUser
from restaurants.models import Restaurant, UserReview
from user.models import RestaurantProfile

dotenv = dotenv_values(".env.local")


def get_restaurant(request, slug):
    restaurant = get_object_or_404(Restaurant, slug=slug)
    return JsonResponse({
        'name': restaurant.name,
        'description': restaurant.description,
        'slug': restaurant.slug
    })


def get_reviews(request, slug, place_id):
    """
    GET /api/<slug>/<place_id>/reviews/
    Returns all WorkBreak reviews for this restaurant+place_id, including id+reply.
    """
    restaurant = get_object_or_404(Restaurant, slug=slug)

    qs = UserReview.objects.filter(
        restaurant_name=restaurant.name
    ).order_by("-created_at")

    reviews = []
    for r in qs:
        owner_marker = ""
        try:
            prof = RestaurantProfile.objects.get(user=r.user, place_id=place_id)
            owner_marker = " (Owner)"
        except RestaurantProfile.DoesNotExist:
            pass

        reviews.append({
            "id": r.id,
            "user": r.user.username + owner_marker,
            "rating": r.rating,
            "comment": r.comment,
            "created_at": r.created_at.isoformat(),
            "reply": r.reply,  
        })

    return JsonResponse({"reviews": reviews}, status=200)


@login_required
@require_POST
def create_review(request, slug):
    data = json.loads(request.body or "{}")
    restaurant, _ = Restaurant.objects.get_or_create(
        slug=slug,
        defaults={
            "name": slug.replace("-", " ").title(),
            "description": "Auto-generated restaurant."
        }
    )

    user_review = UserReview.objects.create(
        user=request.user,
        restaurant_name=restaurant.name,
        rating=data.get('rating', 5),
        comment=data.get('comment', '')
    )

    return JsonResponse({
        "id": user_review.id,
        "user": user_review.user.username,
        "rating": user_review.rating,
        "comment": user_review.comment,
        "created_at": user_review.created_at.isoformat(),
        "reply": user_review.reply,
    }, status=200)

@login_required
@require_POST
def edit_review(request):
    data = json.loads(request.body)
    review = get_object_or_404(UserReview, id=data['id'])
    if request.user != review.user:
        return JsonResponse({"error": "You cannot edit this review."}, status=403)

    review.comment = data["comment"]
    review.save()
    return JsonResponse({"message":"Review updated successfully"}, status=200)


@login_required
@require_POST
def reply_review(request, slug, place_id, review_id):
    restaurant = get_object_or_404(Restaurant, slug=slug)

    get_object_or_404(RestaurantProfile, user=request.user, place_id=place_id)

    review = get_object_or_404(UserReview, id=review_id, restaurant_name=restaurant.name)
    data = json.loads(request.body or "{}")
    review.reply = data.get("reply", "").strip()
    review.save()

    return JsonResponse({"id": review.id, "reply": review.reply}, status=200)


@api_view(["GET"])
def tripadvisor_search(request, name, lat, lng):
    # Load the TripAdvisor API key from environment
    api_key = dotenv_values(".env.local")['TRIPADVISOR_API_KEY']
    if not api_key:
        return JsonResponse({"error": "TripAdvisor API key not configured"}, status=500)

    # TripAdvisor API endpoint
    url = 'https://api.content.tripadvisor.com/api/v1/location/search'
    params = {'key': api_key, 'searchQuery': name, 'latLong': f'{lat},{lng}', 'category' : 'restaurant'}
    headers = {"accept": "application/json", "Referer": request.headers['Referer']}

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
    headers = {"accept": "application/json", "Referer": request.headers['Referer']}

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return JsonResponse(response.json(), status=200)
    except requests.RequestException as e:
        return JsonResponse({"error": str(e)}, status=401)
