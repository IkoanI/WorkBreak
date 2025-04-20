from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from .models import Visit, Restaurant, UserReview
from .serializers import VisitSerializer, UserReviewsSerializer
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse


# New API view for user visits
@api_view(['GET'])
def user_visits(request):
    user = request.user
    visits = Visit.objects.filter(user=user)
    serializer = VisitSerializer(visits, many=True)
    return Response(serializer.data)

def restaurants(request, slug):
    restaurant = get_object_or_404(Restaurant, slug=slug)
    return render(request, 'restaurants.html', {'restaurant': restaurant})

# um
def get_restaurant(request, slug):
    restaurant = get_object_or_404(Restaurant, slug=slug)
    return JsonResponse({
        'name': restaurant.name,
        'description': restaurant.description,
        'slug': restaurant.slug
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_reviews(request):
    retaurant = get_object_or_404(Restaurant, slug=request.data.get('restaurant_name'))

    if request.method == 'GET':
        qs = UserReview.objects.filter(restaurant_name=restaurants.name).order_by('-created_at')
        serializer = UserReviewsSerializer(qs, many=True)
        return Response(serializer.data)

    data = request.data.copy()
    data['restaurant_name'] = restaurants.name
    serializer = UserReviewsSerializer(data=data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)