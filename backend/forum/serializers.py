"""
Forum API Serializers - Complete REST API serialization
Handles nested relationships, permissions, and real-world data representation
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    ForumCategory, ForumThread, ForumPost, ForumTag, ForumReaction,
    UserReputation, Badge, UserBadge, ForumReport, ModerationAction,
    ThreadSubscription, ForumNotification, ForumStats, DeletedContent,
    PrivateMessage,
)
from .access import user_can_access_category

User = get_user_model()


# ============================================================================
# USER-RELATED SERIALIZERS
# ============================================================================

class UserBriefSerializer(serializers.ModelSerializer):
    """Minimal user info for forum displays"""
    
    reputation_points = serializers.SerializerMethodField()
    user_level = serializers.SerializerMethodField()
    badge_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'reputation_points', 'user_level', 'badge_count']
        read_only_fields = fields

    def get_reputation_points(self, obj):
        try:
            return obj.forum_reputation.points
        except:
            return 0

    def get_user_level(self, obj):
        try:
            return obj.forum_reputation.get_level()
        except:
            return 'Newcomer'

    def get_badge_count(self, obj):
        return obj.user_badges.count()


class UserReputationSerializer(serializers.ModelSerializer):
    """User reputation and level information"""
    
    user = UserBriefSerializer(read_only=True)
    level = serializers.SerializerMethodField()

    class Meta:
        model = UserReputation
        fields = [
            'user', 'points', 'level', 'helpful_received', 'solutions_provided',
            'posts_created', 'threads_created', 'current_streak', 'longest_streak'
        ]
        read_only_fields = fields

    def get_level(self, obj):
        return obj.get_level()


class BadgeSerializer(serializers.ModelSerializer):
    """Badge information"""
    
    class Meta:
        model = Badge
        fields = ['id', 'name', 'slug', 'description', 'icon', 'color']
        read_only_fields = fields


class UserBadgeSerializer(serializers.ModelSerializer):
    """User's earned badges"""
    
    badge = BadgeSerializer(read_only=True)

    class Meta:
        model = UserBadge
        fields = ['badge', 'earned_at']
        read_only_fields = fields


# ============================================================================
# FORUM TAG SERIALIZERS
# ============================================================================

class ForumTagSerializer(serializers.ModelSerializer):
    """Forum tags for thread categorization"""
    
    class Meta:
        model = ForumTag
        fields = ['id', 'name', 'slug', 'description', 'color', 'icon', 'thread_count']
        read_only_fields = ['thread_count']


# ============================================================================
# REACTION SERIALIZERS
# ============================================================================

class ForumReactionSerializer(serializers.ModelSerializer):
    """Post reactions"""
    
    user = UserBriefSerializer(read_only=True)

    class Meta:
        model = ForumReaction
        fields = ['id', 'user', 'reaction_type', 'created_at']
        read_only_fields = ['created_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


# ============================================================================
# POST SERIALIZERS
# ============================================================================

class ForumPostListSerializer(serializers.ModelSerializer):
    """Post list view (lighter weight)"""
    
    author = UserBriefSerializer(read_only=True)
    reaction_count = serializers.SerializerMethodField()
    user_reaction = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = [
            'id', 'author', 'content', 'created_at', 'is_edited', 'edited_at',
            'helpful_count', 'insightful_count', 'reaction_count', 'user_reaction',
            'approval_status'
        ]
        read_only_fields = ['created_at', 'edited_at', 'helpful_count', 'insightful_count']

    def get_reaction_count(self, obj):
        return obj.reactions.count()

    def get_user_reaction(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        
        reaction = obj.reactions.filter(user=request.user).first()
        if reaction:
            return reaction.reaction_type
        return None


class ForumPostDetailSerializer(serializers.ModelSerializer):
    """Post detail view with all information"""
    
    author = UserBriefSerializer(read_only=True)
    reactions = ForumReactionSerializer(many=True, read_only=True)
    reaction_summary = serializers.SerializerMethodField()
    replies = serializers.SerializerMethodField()
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = ForumPost
        fields = [
            'id', 'thread', 'author', 'content', 'parent', 'created_at',
            'is_edited', 'edited_at', 'edited_by', 'edit_reason',
            'approval_status', 'helpful_count', 'insightful_count',
            'reactions', 'reaction_summary', 'replies', 'is_owner',
            'is_flagged', 'flag_reason'
        ]
        read_only_fields = [
            'created_at', 'edited_at', 'approval_status', 'is_flagged'
        ]

    def get_reaction_summary(self, obj):
        reactions = obj.reactions.values('reaction_type').annotate(
            count=serializers.Count('reaction_type')
        )
        return {r['reaction_type']: r['count'] for r in reactions}

    def get_replies(self, obj):
        replies = obj.replies.filter(approval_status=ForumPost.ApprovalStatus.APPROVED)
        return ForumPostListSerializer(replies, many=True, context=self.context).data

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.author == request.user

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'content' in validated_data and validated_data['content'] != instance.content:
            instance.is_edited = True
            instance.edited_by = self.context['request'].user
        return super().update(instance, validated_data)


# ============================================================================
# THREAD SERIALIZERS
# ============================================================================

class ForumThreadListSerializer(serializers.ModelSerializer):
    """Thread list view"""
    
    author = UserBriefSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    post_count = serializers.SerializerMethodField()
    tags = ForumTagSerializer(many=True, read_only=True)
    last_activity_by = UserBriefSerializer(read_only=True)

    class Meta:
        model = ForumThread
        fields = [
            'id', 'title', 'slug', 'author', 'category', 'category_name',
            'status', 'tags', 'view_count', 'post_count', 'created_at',
            'last_activity', 'last_activity_by', 'is_pinned', 'is_featured',
            'is_announcement', 'is_approved'
        ]
        read_only_fields = ['created_at', 'last_activity', 'view_count']

    def get_post_count(self, obj):
        return obj.posts.filter(approval_status=ForumPost.ApprovalStatus.APPROVED).count()


class ForumThreadDetailSerializer(serializers.ModelSerializer):
    """Thread detail view with posts"""
    
    author = UserBriefSerializer(read_only=True)
    category_data = serializers.SerializerMethodField()
    posts = serializers.SerializerMethodField()
    tags = ForumTagSerializer(many=True, read_only=True)
    is_subscribed = serializers.SerializerMethodField()
    solution_post = ForumPostListSerializer(read_only=True)
    is_owner = serializers.SerializerMethodField()
    is_moderator = serializers.SerializerMethodField()

    class Meta:
        model = ForumThread
        fields = [
            'id', 'title', 'slug', 'description', 'author', 'category',
            'category_data', 'status', 'tags', 'view_count', 'reply_count',
            'created_at', 'last_activity', 'is_pinned', 'is_featured',
            'is_announcement', 'is_approved', 'solution_post', 'posts',
            'is_subscribed', 'is_owner', 'is_moderator'
        ]
        read_only_fields = ['created_at', 'last_activity', 'view_count', 'reply_count']

    def get_category_data(self, obj):
        return ForumCategorySerializer(obj.category).data

    def get_posts(self, obj):
        posts = obj.posts.filter(
            approval_status=ForumPost.ApprovalStatus.APPROVED
        ).select_related('author', 'edited_by').prefetch_related('reactions')
        return ForumPostDetailSerializer(
            posts, many=True, context=self.context
        ).data

    def get_is_subscribed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.subscribers.filter(user=request.user).exists()

    def get_is_owner(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.author == request.user

    def get_is_moderator(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.category.moderators.filter(id=request.user.id).exists()

    def create(self, validated_data):
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)


# ============================================================================
# CATEGORY SERIALIZERS
# ============================================================================

class ForumCategorySerializer(serializers.ModelSerializer):
    """Forum category with stats"""

    stats = serializers.SerializerMethodField()
    moderator_count = serializers.SerializerMethodField()
    thread_count = serializers.SerializerMethodField()
    can_access = serializers.SerializerMethodField()

    class Meta:
        model = ForumCategory
        fields = [
            'id', 'name', 'slug', 'description', 'category_type', 'icon',
            'color_tag', 'order', 'is_private', 'is_archived', 'stats',
            'moderator_count', 'thread_count', 'last_activity', 'can_access',
        ]
        read_only_fields = fields

    def get_stats(self, obj):
        return obj.get_stats()

    def get_moderator_count(self, obj):
        return obj.moderators.count()

    def get_thread_count(self, obj):
        return obj.threads.filter(is_approved=True).count()

    def get_can_access(self, obj):
        request = self.context.get('request')
        user = request.user if request else None
        if not user or not user.is_authenticated:
            return not obj.is_private and obj.category_type != ForumCategory.CategoryType.EXPERT_ONLY
        return user_can_access_category(user, obj)


class PrivateMessageSerializer(serializers.ModelSerializer):
    sender = UserBriefSerializer(read_only=True)
    recipient = UserBriefSerializer(read_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_approved=True),
        source='recipient',
        write_only=True,
    )

    class Meta:
        model = PrivateMessage
        fields = [
            'id', 'sender', 'recipient', 'recipient_id', 'subject', 'body',
            'is_read', 'read_at', 'created_at',
        ]
        read_only_fields = ['id', 'sender', 'is_read', 'read_at', 'created_at']

    def create(self, validated_data):
        validated_data['sender'] = self.context['request'].user
        return super().create(validated_data)


# ============================================================================
# MODERATION SERIALIZERS
# ============================================================================

class ForumReportSerializer(serializers.ModelSerializer):
    """Report submission and details"""
    
    reported_by = UserBriefSerializer(read_only=True)
    reviewed_by = UserBriefSerializer(read_only=True)
    post_preview = serializers.SerializerMethodField()

    class Meta:
        model = ForumReport
        fields = [
            'id', 'reason', 'description', 'status', 'post', 'post_preview',
            'reported_by', 'created_at', 'reviewed_by', 'review_notes',
            'action_taken', 'reviewed_at'
        ]
        read_only_fields = ['status', 'reviewed_by', 'review_notes', 'action_taken', 'reviewed_at']

    def get_post_preview(self, obj):
        return {
            'id': obj.post.id,
            'content': obj.post.content[:200] + '...',
            'author': obj.post.author.username
        }

    def create(self, validated_data):
        validated_data['reported_by'] = self.context['request'].user
        return super().create(validated_data)


class ModerationActionSerializer(serializers.ModelSerializer):
    """Moderation action log"""
    
    moderator = UserBriefSerializer(read_only=True)

    class Meta:
        model = ModerationAction
        fields = [
            'id', 'action_type', 'reason', 'moderator', 'user',
            'post', 'thread', 'duration', 'created_at'
        ]
        read_only_fields = fields


# ============================================================================
# NOTIFICATION SERIALIZERS
# ============================================================================

class ForumNotificationSerializer(serializers.ModelSerializer):
    """Forum notifications"""
    
    from_user = UserBriefSerializer(read_only=True)

    class Meta:
        model = ForumNotification
        fields = [
            'id', 'notification_type', 'title', 'message', 'is_read',
            'related_post', 'related_thread', 'from_user', 'created_at'
        ]
        read_only_fields = ['created_at']


class ThreadSubscriptionSerializer(serializers.ModelSerializer):
    """Thread subscriptions"""
    
    thread_title = serializers.CharField(source='thread.title', read_only=True)

    class Meta:
        model = ThreadSubscription
        fields = ['id', 'thread', 'thread_title', 'notification_level', 'subscribed_at']
        read_only_fields = ['subscribed_at']


# ============================================================================
# STATISTICS SERIALIZERS
# ============================================================================

class ForumStatsSerializer(serializers.ModelSerializer):
    """Forum statistics"""
    
    top_thread_title = serializers.CharField(source='top_thread.title', read_only=True)
    top_contributor_username = serializers.CharField(source='top_contributor.username', read_only=True)

    class Meta:
        model = ForumStats
        fields = [
            'date', 'new_threads', 'new_posts', 'total_views', 'active_users',
            'new_users', 'top_thread_title', 'top_contributor_username'
        ]
        read_only_fields = fields
