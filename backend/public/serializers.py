from rest_framework import serializers

from .models import ContactMessage, DisabilityType, Event, NewsArticle, Resource, Topic, Donation


class TopicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topic
        fields = ['id', 'name', 'slug', 'description', 'icon']


class DisabilityTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisabilityType
        fields = ['id', 'name', 'slug']


class ResourceSerializer(serializers.ModelSerializer):
    topics = TopicSerializer(many=True, read_only=True)
    disability_types = DisabilityTypeSerializer(many=True, read_only=True)
    topic_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    disability_type_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Resource
        fields = [
            'id',
            'title',
            'description',
            'resource_type',
            'access_level',
            'file',
            'external_url',
            'thumbnail',
            'language',
            'topics',
            'disability_types',
            'topic_ids',
            'disability_type_ids',
            'published_at',
            'download_count',
            'is_featured',
        ]

    def create(self, validated_data):
        topic_ids = validated_data.pop('topic_ids', [])
        disability_type_ids = validated_data.pop('disability_type_ids', [])
        resource = Resource.objects.create(**validated_data)
        if topic_ids:
            resource.topics.set(topic_ids)
        if disability_type_ids:
            resource.disability_types.set(disability_type_ids)
        return resource

    def update(self, instance, validated_data):
        topic_ids = validated_data.pop('topic_ids', None)
        disability_type_ids = validated_data.pop('disability_type_ids', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        if topic_ids is not None:
            instance.topics.set(topic_ids)
        if disability_type_ids is not None:
            instance.disability_types.set(disability_type_ids)
        
        return instance


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


class DonationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Donation
        fields = [
            'id', 'full_name', 'email', 'amount', 'currency', 
            'transaction_reference', 'status', 'is_anonymous', 'created_at'
        ]
        read_only_fields = ['id', 'status', 'created_at']
