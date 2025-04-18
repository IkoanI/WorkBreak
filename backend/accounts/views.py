from django.shortcuts import redirect
from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
import json
from user.models import UserProfile
from .forms import CustomUserCreationForm
# Create your views here.
def signup(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        form = CustomUserCreationForm(data)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'User created successfully'}, status=201)
        else:
            return JsonResponse(form.errors, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)

def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = authenticate(
            request,
            username = data['username'],
            password = data['password']
        )
        if user is None:
            return JsonResponse({'error': 'Invalid username or password'}, status=401)
        else:
            auth_login(request, user)
            return JsonResponse({'message': 'User logged in successfully'}, status=200)

@login_required
def logout(request):
    auth_logout(request)
    return redirect('home.index')

@login_required
def check_auth(request):
    user = request.user
    userprofile = UserProfile.objects.get(user=user)
    response = {'username': user.get_username(),
                'image': userprofile.image.url,
                'cuisines': userprofile.cuisines,}

    return JsonResponse(response, status=200)
