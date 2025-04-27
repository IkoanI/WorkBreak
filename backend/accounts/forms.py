from django.contrib.auth.forms import UserCreationForm, PasswordResetForm
from django import forms
from django.db import transaction
from django.db.models.signals import post_save

from accounts.models import WorkBreakUser
from user.models import create_or_update_user_profile, RestaurantProfile


class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField()
    is_restaurant = forms.BooleanField(required=False)
    restaurant_name = forms.CharField(max_length=255, required=False)
    place_id = forms.CharField(max_length=255, required=False)

    class Meta:
        model = WorkBreakUser
        fields = ('username', 'email', 'password1', 'password2', 'is_restaurant', 'restaurant_name', 'place_id')
        unique_together = ('email', 'username')

    def clean_email(self):
        email = self.cleaned_data["email"]

        if WorkBreakUser.objects.filter(email=email).exists():
            raise forms.ValidationError("Account with this email already exists")

        return email

    def clean_place_id(self):
        place_id = self.cleaned_data["place_id"]
        if self.cleaned_data["is_restaurant"] and place_id == "":
            raise forms.ValidationError("Enter a restaurant")

        if RestaurantProfile.objects.filter(place_id=place_id).exists():
            raise forms.ValidationError("Account for this restaurant already exists")

        return place_id

    @transaction.atomic
    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.restaurant_name = self.cleaned_data['restaurant_name']
            user.place_id = self.cleaned_data['place_id']
            user.save()
            post_save.connect(create_or_update_user_profile, sender=user, weak=False)

        return user