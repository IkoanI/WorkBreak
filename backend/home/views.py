from django.shortcuts import render
from django_nextjs.render import render_nextjs_page
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Visit
from .serializers import VisitSerializer

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
