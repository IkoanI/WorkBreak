from django.contrib.auth.decorators import login_required
import json
from django_nextjs.render import render_nextjs_page
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser

from user.forms import UpdateUserForm
from user.models import UserProfile
from user.serializer import UserProfileSerializer


# Create your views here.
@login_required
async def profile(request):
    return await render_nextjs_page(request)


@login_required
def update_profile(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = UpdateUserForm(data, instance=request.user)
        if not form.is_valid():
            return JsonResponse(form.errors, status=400)

        form.save()
        return JsonResponse({'message': 'User successfully updated'}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    parser_classes = (MultiPartParser, FormParser)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

