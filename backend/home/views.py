from django.shortcuts import render
from django_nextjs.render import render_nextjs_page
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Visit
from .serializers import VisitSerializer
import requests  # Import the requests library for API calls

# Existing async view
async def home(request):
    # Your custom logic
    return await render_nextjs_page(request)

# New API view for user visits
@api_view(['GET'])
def user_visits(request):
    user = request.user
    visits = Visit.objects.filter(user=user)
    serializer = VisitSerializer(visits, many=True)
    return Response(serializer.data)

# New view to fetch details for a specific location using the TripAdvisor API
@api_view(['GET'])
def location_details(request, location_id):
    # Fetch the TripAdvisor API key from the environment or settings
    api_key = '315A69F0DA7141ABBBBCF867351E293E'

    # Construct the API URL for fetching location details
    url = f'https://api.tripadvisor.com/api/partner/2.0/location/{location_id}'

    # Make the API request to TripAdvisor
    response = requests.get(url, headers={'Authorization': f'Bearer {api_key}'})

    # Check if the request was successful
    if response.status_code == 200:
        location_data = response.json()
        return Response(location_data)
    else:
        return Response({"error": "Unable to fetch location details"}, status=response.status_code)

