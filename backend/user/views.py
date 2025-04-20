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

class UpdateUserProfileAPIView(APIView):
    permission_classes = (IsAuthenticated, )
    parser_classes = [MultiPartParser, FileUploadParser]

    def post(self, request):
        user_profile = UserProfile.objects.get(user=request.user)
        serializer = UserProfileSerializer(instance=user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=200)

        print(serializer.errors)
        return Response(data=serializer.errors, status=500)

