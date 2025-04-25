import os
import requests
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Visit
from .serializers import VisitSerializer


# API view for user visits
@api_view(['GET'])
def user_visits(request):
    user = request.user
    visits = Visit.objects.filter(user=user)
    serializer = VisitSerializer(visits, many=True)
    return Response(serializer.data)

# API view to fetch details for a specific location using the TripAdvisor API
@api_view(['GET'])
def location_details(request, location_id):
    # Load the TripAdvisor API key from environment
    api_key = os.environ.get('Tripadvisor_API_KEY')

    if not api_key:
        return Response({"error": "TripAdvisor API key not configured"}, status=500)

    # TripAdvisor API endpoint
    url = f'https://api.tripadvisor.com/api/partner/2.0/location/{location_id}'

    try:
        response = requests.get(url, headers={'Authorization': f'Bearer {api_key}'})
        response.raise_for_status()
        return Response(response.json())
    except requests.RequestException as e:
        return Response({"error": str(e)}, status=response.status_code)

@ensure_csrf_cookie
def get_csrf_token(request):
    return HttpResponse("CSRF cookie set")
