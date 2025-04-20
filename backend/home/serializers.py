from rest_framework import serializers
from .models import Visit, UserReview, Restaurant

class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ['id', 'restaurant_name', 'visited_at']

class UserReviewsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserReview
        # add created at?
        fields = ['user', 'restaurant_name', 'rating', 'comment', 'created_at']
