from django.contrib.auth.decorators import login_required
import json

from django_nextjs.render import render_nextjs_page
from django.http import JsonResponse
from rest_framework.parsers import MultiPartParser, FileUploadParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from user.forms import UpdateUserForm
from user.models import UserProfile
from user.serializer import UserProfileSerializer


# Create your views here.
@login_required
async def profile(request):
    return await render_nextjs_page(request)


@login_required
def update_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = request.user
        form = UpdateUserForm(data, instance=user)
        if not form.is_valid():
            return JsonResponse(form.errors, status=400)

        form.save()
        return JsonResponse({'message': 'User successfully updated'}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


def add_history(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_profile = UserProfile.objects.get(user=request.user)
        if len(user_profile.history) >= 10:
            user_profile.history.pop(0)

        for history in user_profile.history:
            if history['place_id'] == data['place_id']:
                user_profile.history.remove(history)

        user_profile.history.append({"place_id": data['place_id'], "slug": data['slug'], "restaurant_name": data['restaurant_name']})
        user_profile.save()
        return JsonResponse({'message': 'History successfully updated'}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

def get_history(request):
    if request.method == 'GET':
        user_profile = UserProfile.objects.get(user=request.user)
        return JsonResponse({'history': user_profile.history[::-1]}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

class UpdateUserProfileAPIView(APIView):
    permission_classes = (IsAuthenticated, )
    parser_classes = [MultiPartParser, FileUploadParser]

    def post(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(instance=user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=200)

        return Response(data=serializer.errors, status=500)

