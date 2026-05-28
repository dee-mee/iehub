from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Country

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    country = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Country.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'password',
            'first_name',
            'last_name',
            'organization',
            'organization_type',
            'professional_title',
            'bio',
            'how_heard',
            'country',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True
        user.is_verified = False
        user.is_approved = False
        user.save()
        return user


class UserMeSerializer(serializers.ModelSerializer):
    country = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Country.objects.all(),
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'last_name',
            'role',
            'country',
            'organization',
            'organization_type',
            'professional_title',
            'bio',
            'how_heard',
            'is_verified',
            'is_approved',
        ]
