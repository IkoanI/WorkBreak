import json
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from restaurants.models import Restaurant, UserReview

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

    return JsonResponse({'error': 'Invalid request method.'}, status=405)
