from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.db.models import Count
from .models import ForumCategory, ForumThread, ForumPost, ForumReaction
from users.serializers import UserMeSerializer

User = get_user_model()

class ForumCategorySerializer(serializers.ModelSerializer):
    thread_count = serializers.IntegerField(read_only=True)
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ForumCategory
        fields = [
            'id', 'name', 'slug', 'description', 'category_type', 
            'icon', 'order', 'is_private', 'thread_count', 'post_count'
        ]


class ForumThreadSerializer(serializers.ModelSerializer):
    author = UserMeSerializer(read_only=True)
    post_count = serializers.IntegerField(read_only=True)
    last_post_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = ForumThread
        fields = [
            'id', 'category', 'title', 'slug', 'author', 
            'is_pinned', 'is_locked', 'is_announcement', 
            'view_count', 'last_activity', 'post_count', 'last_post_at'
        ]
        read_only_fields = ['author', 'slug', 'view_count', 'last_activity']


class ForumPostSerializer(serializers.ModelSerializer):
    author = UserMeSerializer(read_only=True)
    reaction_counts = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = [
            'id', 'thread', 'author', 'content', 'parent', 
            'is_approved', 'is_edited', 'edited_at', 
            'created_at', 'updated_at', 'reaction_counts', 'user_reaction'
        ]
        read_only_fields = ['author', 'is_approved', 'is_edited', 'edited_at']

    def get_reaction_counts(self, obj):
        counts = obj.reactions.values('reaction_type').annotate(count=Count('reaction_type'))
        return {item['reaction_type']: item['count'] for item in counts}

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            reaction = obj.reactions.filter(user=request.user).first()
            return reaction.reaction_type if reaction else None
        return None


class ForumReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumReaction
        fields = ['id', 'post', 'user', 'reaction_type', 'created_at']
        read_only_fields = ['user']
