from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Country, EmailVerificationToken, ExpertiseTag, MemberProfile, Notification

User = get_user_model()


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'link', 'is_read', 'created_at']
        read_only_fields = ['id', 'notification_type', 'title', 'message', 'link', 'created_at']


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'code', 'name', 'region', 'flag_emoji']


class ExpertiseTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpertiseTag
        fields = ['id', 'name', 'slug']


class MemberProfileSerializer(serializers.ModelSerializer):
    expertise_areas = ExpertiseTagSerializer(many=True, read_only=True)
    expertise_area_ids = serializers.PrimaryKeyRelatedField(
        many=True, write_only=True, queryset=ExpertiseTag.objects.all(), source='expertise_areas'
    )
    countries_of_work = serializers.SlugRelatedField(
        many=True, slug_field='name', queryset=Country.objects.all()
    )

    class Meta:
        model = MemberProfile
        fields = [
            'linkedin_url',
            'twitter_url',
            'website_url',
            'is_visible_in_directory',
            'expertise_areas',
            'expertise_area_ids',
            'countries_of_work',
        ]


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

    def validate_country(self, value):
        """
        value is already a Country instance resolved by SlugRelatedField.
        This validator is a no-op but gives a clear error message if the
        Country table is empty (seed hasn't run).
        """
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.is_active = True
        user.is_verified = False
        user.is_approved = False
        user.save()

        EmailVerificationToken.objects.get_or_create(user=user)

        return user


class UserMeSerializer(serializers.ModelSerializer):
    country = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Country.objects.all(),
        required=False,
        allow_null=True
    )
    country_detail = CountrySerializer(read_only=True, source='country')
    profile = MemberProfileSerializer(read_only=True)

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
            'country_detail',
            'organization',
            'organization_type',
            'professional_title',
            'bio',
            'how_heard',
            'is_verified',
            'is_approved',
            'profile',
        ]


class UserUpdateSerializer(serializers.ModelSerializer):
    country = serializers.SlugRelatedField(
        slug_field='name',
        queryset=Country.objects.all(),
        required=False,
        allow_null=True
    )
    country_detail = CountrySerializer(read_only=True, source='country')
    profile = MemberProfileSerializer(required=False)

    class Meta:
        model = User
        fields = [
            'first_name',
            'last_name',
            'country',
            'country_detail',
            'organization',
            'organization_type',
            'professional_title',
            'bio',
            'profile',
        ]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if profile_data:
            profile = instance.profile
            for attr, value in profile_data.items():
                if attr == 'expertise_areas':
                    profile.expertise_areas.set(value)
                else:
                    setattr(profile, attr, value)
            profile.save()

        return instance
