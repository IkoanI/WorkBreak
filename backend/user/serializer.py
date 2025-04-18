from django.contrib.auth import get_user_model
from rest_framework import serializers

from user.models import UserProfile

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    creator = serializers.ReadOnlyField(source='user.username')
    image = serializers.ImageField(read_only=False)

    class Meta:
        model = UserProfile
        fields = '__all__'