from django import forms

from accounts.models import WorkBreakUser
from user.models import UserProfile, RestaurantProfile


class UpdateUserForm(forms.ModelForm):
    username = forms.CharField(max_length=150, required=True,)

    class Meta:
        model = WorkBreakUser
        fields = ['username']


class UpdateProfileForm(forms.ModelForm):
    image = forms.ImageField(required=True)

    class Meta:
        model = UserProfile
        fields = ['image']