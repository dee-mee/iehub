from rest_framework import serializers

from .models import ContactMessage, Event, NewsArticle, Resource


class ResourceSerializer(serializers.ModelSerializer):
    countries = serializers.SerializerMethodField()
    topics = serializers.SerializerMethodField()

    class Meta:
        model = Resource
        fields = [
            'id',
            'title',
            'description',
            'resource_type',
            'language',
            'countries',
            'topics',
            'file_url',
            'external_url',
            'published_at',
            'download_count',
            'is_featured',
        ]

    def get_countries(self, obj: Resource) -> list[str]:
        return [item.strip() for item in obj.countries.split(',') if item.strip()]

    def get_topics(self, obj: Resource) -> list[str]:
        return [item.strip() for item in obj.topics.split(',') if item.strip()]


class NewsArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsArticle
        fields = [
            'id',
            'title',
            'slug',
            'excerpt',
            'content',
            'category',
            'author_name',
            'published_at',
            'is_featured',
        ]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'id',
            'title',
            'description',
            'event_type',
            'start_datetime',
            'end_datetime',
            'location_type',
            'location_address',
            'online_link',
            'registration_link',
            'is_members_only',
        ]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = [
            'id',
            'full_name',
            'email',
            'organization',
            'subject',
            'message',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
