from django.urls import path, include
from . import views
from django_nextjs.views import nextjs_page
urlpatterns = [
    path('signup', nextjs_page(), name='accounts.signup'),
    path('api/signup', views.signup, name='accounts.api.signup'),
    path('login', nextjs_page(), name='accounts.login'),
    path('api/login', views.login, name='accounts.api.login'),
    path('logout', views.logout, name='accounts.logout'),
    path('api/check_auth', views.check_auth, name='accounts.api.check_auth'),
    path("", include("django.contrib.auth.urls")),
]