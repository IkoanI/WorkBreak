from django.contrib.auth import login as auth_login, authenticate, logout as auth_logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
import json
from user.models import UserProfile, RestaurantProfile
from .forms import CustomUserCreationForm
from django.views.decorators.csrf import get_token

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

    return JsonResponse({'error': 'Invalid request method'}, status=405)

@login_required
def logout(request):
    try:
        auth_logout(request)
        return JsonResponse({'message': 'User logged out successfully'}, status=200)
    except:
        return JsonResponse({'error': 'Logout failed!'}, status=400)

@ensure_csrf_cookie
def check_auth(request):
    response = {"token":get_token(request),}
    if not request.user.is_authenticated:
        return JsonResponse(response, status=400)

    user = request.user
    response['username'] = user.get_username()
    if user.is_restaurant:
        restaurant_profile = RestaurantProfile.objects.get(user=user)
        response['is_restaurant'] = True
        response['restaurant_name'] = restaurant_profile.restaurant_name
        response['place_id'] = restaurant_profile.place_id
    else:
        user_profile = UserProfile.objects.get(user=user)
        response['is_restaurant'] = False
        response['image'] = user_profile.image.url
        response['cuisines'] = user_profile.cuisines

    return JsonResponse(response, status=200)