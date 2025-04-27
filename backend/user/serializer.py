from rest_framework import serializers
from user.models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['image', 'cuisines', 'budget']

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)
        instance.cuisines = validated_data.get('cuisines', instance.cuisines)
        instance.budget = validated_data.get('budget', instance.budget)
        instance.save()
        return instance