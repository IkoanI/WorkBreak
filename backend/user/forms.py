from django import forms

from django.contrib.auth.models import User

from user.models import UserProfile


class UpdateUserForm(forms.ModelForm):
    username = forms.CharField(max_length=150, required=True,)

    class Meta:
        model = User
        fields = ['username']


class UpdateProfileForm(forms.ModelForm):
    image = forms.ImageField(required=True)

    class Meta:
        model = UserProfile
        fields = ['image']