from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Visit, Restaurant
from .serializers import VisitSerializer
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
