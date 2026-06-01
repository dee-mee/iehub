"""
Forum API Views - Complete REST endpoints for forum functionality
Includes permissions, filtering, real-time updates, and moderation actions
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Q, F, Count, Avg
from datetime import timedelta

from .models import (
    ForumCategory, ForumThread, ForumPost, ForumTag, ForumReaction,
    UserReputation, Badge, UserBadge, ForumReport, ModerationAction,
    ThreadSubscription, ForumNotification, ForumStats, DeletedContent,
    PrivateMessage,
)
from .serializers import (
    ForumCategorySerializer, ForumThreadListSerializer, ForumThreadDetailSerializer,
    ForumPostListSerializer, ForumPostDetailSerializer, ForumTagSerializer,
    ForumReactionSerializer, UserReputationSerializer, BadgeSerializer,
    ForumReportSerializer, ModerationActionSerializer, ForumNotificationSerializer,
    ThreadSubscriptionSerializer, ForumStatsSerializer, PrivateMessageSerializer,
)
from .access import filter_categories_for_user, user_can_access_category, user_is_approved_member
from .permissions import (
    IsApprovedMember,
    IsApprovedMemberOrReadOnly,
    IsPlatformModerator,
    CanModifyOwnContent,
)


# ============================================================================
# PAGINATION
# ============================================================================

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 500


# ============================================================================
# CATEGORY VIEWSET
# ============================================================================

class ForumCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Forum categories with subcategory support"""
    
    queryset = ForumCategory.objects.filter(is_archived=False).prefetch_related('moderators')
    serializer_class = ForumCategorySerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['category_type', 'country', 'topic']
    ordering_fields = ['order', 'name', '-last_activity']
    ordering = ['order', 'name']
    permission_classes = [IsApprovedMemberOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        return filter_categories_for_user(queryset, self.request.user)

    @action(detail=True, methods=['get'])
    def threads(self, request, pk=None):
        """Get threads in this category"""
        category = self.get_object()
        threads = category.threads.filter(is_approved=True).order_by('-is_pinned', '-last_activity')
        
        serializer = ForumThreadListSerializer(
            threads, many=True, context={'request': request}
        )
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def popular(self, request):
        """Get popular categories by activity"""
        categories = self.get_queryset().annotate(
            recent_activity=Count('threads__posts', filter=Q(
                threads__posts__created_at__gte=timezone.now() - timedelta(days=7)
            ))
        ).order_by('-recent_activity')[:10]
        
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)


# ============================================================================
# THREAD VIEWSET
# ============================================================================

class ForumThreadViewSet(viewsets.ModelViewSet):
    """Forum threads with search and filtering"""
    
    queryset = ForumThread.objects.filter(is_approved=True).select_related(
        'author', 'category', 'last_activity_by', 'solution_post'
    ).prefetch_related('tags', 'subscribers')
    serializer_class = ForumThreadListSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['category', 'status', 'is_pinned', 'is_announcement']
    search_fields = ['title', 'description', 'author__username']
    ordering_fields = ['created_at', 'view_count', 'last_activity']
    ordering = ['-is_pinned', '-is_featured', '-last_activity']
    permission_classes = [IsApprovedMemberOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ForumThreadDetailSerializer
        return ForumThreadListSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user
        if not user_is_approved_member(user):
            return queryset.filter(category__is_private=False).exclude(
                category__category_type=ForumCategory.CategoryType.EXPERT_ONLY
            )
        allowed_category_ids = list(
            filter_categories_for_user(
                ForumCategory.objects.filter(is_archived=False),
                user,
            ).values_list('id', flat=True)
        )
        return queryset.filter(category_id__in=allowed_category_ids)

    def perform_create(self, serializer):
        """Create thread and update stats"""
        category = serializer.validated_data['category']
        if not user_can_access_category(self.request.user, category):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('You do not have access to post in this category.')
        thread = serializer.save(author=self.request.user)
        
        # Update user reputation
        try:
            reputation = self.request.user.forum_reputation
            reputation.add_reputation(10, "Thread created")
            reputation.threads_created = F('threads_created') + 1
            reputation.update_streak()
        except:
            pass

    def retrieve(self, request, *args, **kwargs):
        """Increase view count when thread is retrieved"""
        thread = self.get_object()
        thread.increase_views(user=request.user)
        return super().retrieve(request, *args, **kwargs)

    @action(detail=True, methods=['get'])
    def posts(self, request, pk=None):
        """Get posts in thread with pagination"""
        thread = self.get_object()
        posts = thread.posts.filter(
            approval_status=ForumPost.ApprovalStatus.APPROVED
        ).select_related('author', 'edited_by').prefetch_related('reactions')
        
        paginator = StandardResultsSetPagination()
        page = paginator.paginate_queryset(posts, request)
        serializer = ForumPostDetailSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_solved(self, request, pk=None):
        """Mark a post as the solution"""
        thread = self.get_object()
        
        # Check permission
        if thread.author != request.user and not request.user.is_staff:
            return Response(
                {'detail': 'Only thread author can mark solution'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        post_id = request.data.get('post_id')
        try:
            post = ForumPost.objects.get(id=post_id, thread=thread)
            thread.mark_solved(post)
            return Response({'status': 'solution marked'})
        except ForumPost.DoesNotExist:
            return Response(
                {'detail': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def subscribe(self, request, pk=None):
        """Subscribe to thread updates"""
        thread = self.get_object()
        notification_level = request.data.get('notification_level', 'ALL')
        
        subscription, created = ThreadSubscription.objects.update_or_create(
            user=request.user,
            thread=thread,
            defaults={'notification_level': notification_level}
        )
        
        serializer = ThreadSubscriptionSerializer(subscription)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def unsubscribe(self, request, pk=None):
        """Unsubscribe from thread"""
        thread = self.get_object()
        ThreadSubscription.objects.filter(user=request.user, thread=thread).delete()
        return Response({'status': 'unsubscribed'})

    @action(detail=True, methods=['get'])
    def search_posts(self, request, pk=None):
        """Search posts within a thread"""
        thread = self.get_object()
        query = request.query_params.get('q', '')
        
        posts = thread.posts.filter(
            Q(content__icontains=query) |
            Q(author__username__icontains=query),
            approval_status=ForumPost.ApprovalStatus.APPROVED
        )
        
        serializer = ForumPostListSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


# ============================================================================
# POST VIEWSET
# ============================================================================

class ForumPostViewSet(viewsets.ModelViewSet):
    """Forum posts with rich editing and moderation"""
    
    queryset = ForumPost.objects.select_related(
        'author', 'thread', 'parent', 'edited_by'
    ).prefetch_related('reactions')
    serializer_class = ForumPostListSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['thread', 'approval_status']
    ordering_fields = ['created_at', 'helpful_count']
    ordering = ['created_at']
    permission_classes = [IsApprovedMemberOrReadOnly, CanModifyOwnContent]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ForumPostDetailSerializer
        return ForumPostListSerializer

    def perform_create(self, serializer):
        """Create post and update thread/user stats"""
        post = serializer.save(author=self.request.user)
        
        # Update thread
        thread = post.thread
        thread.reply_count = F('reply_count') + 1
        thread.last_activity = timezone.now()
        thread.last_activity_by = self.request.user
        thread.save()
        
        # Update user reputation
        try:
            reputation = self.request.user.forum_reputation
            reputation.add_reputation(5, "Post created")
            reputation.posts_created = F('posts_created') + 1
            reputation.update_streak()
        except:
            pass
        
        # Notify subscribers
        self._notify_subscribers(post)

    def perform_update(self, serializer):
        """Update post and log edit"""
        serializer.save(edited_by=self.request.user, is_edited=True)

    def perform_destroy(self, instance):
        """Soft delete - archive content"""
        DeletedContent.objects.create(
            content_type=DeletedContent.ContentType.POST,
            original_id=instance.id,
            original_author=instance.author.username,
            content=instance.content,
            reason_deleted='User deleted',
            deleted_by=self.request.user
        )
        instance.delete()

    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        """React to a post"""
        post = self.get_object()
        reaction_type = request.data.get('reaction_type')
        
        if reaction_type not in dict(ForumReaction.ReactionType.choices):
            return Response(
                {'detail': 'Invalid reaction type'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reaction, created = ForumReaction.objects.update_or_create(
            post=post,
            user=request.user,
            reaction_type=reaction_type
        )
        
        # Update post counts
        if reaction_type == ForumReaction.ReactionType.LIKE:
            post.helpful_count = F('helpful_count') + (1 if created else 0)
        elif reaction_type == ForumReaction.ReactionType.INSIGHTFUL:
            post.insightful_count = F('insightful_count') + (1 if created else 0)
        
        post.save()
        
        # Award reputation
        if created and reaction_type in [
            ForumReaction.ReactionType.LIKE,
            ForumReaction.ReactionType.INSIGHTFUL
        ]:
            try:
                reputation = post.author.forum_reputation
                points = 2 if reaction_type == ForumReaction.ReactionType.INSIGHTFUL else 1
                reputation.add_reputation(points, f"Post marked {reaction_type.lower()}")
            except:
                pass
        
        serializer = ForumReactionSerializer(reaction, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def unreact(self, request, pk=None):
        """Remove reaction from post"""
        post = self.get_object()
        reaction_type = request.data.get('reaction_type')
        
        ForumReaction.objects.filter(
            post=post,
            user=request.user,
            reaction_type=reaction_type
        ).delete()
        
        return Response({'status': 'reaction removed'})

    @action(detail=True, methods=['post'])
    def flag(self, request, pk=None):
        """Flag post for review"""
        post = self.get_object()
        reason = request.data.get('reason', 'Other')
        
        post.flag_for_review(reason, request.user)
        
        # Create report
        ForumReport.objects.create(
            post=post,
            reason=reason,
            description=request.data.get('description', ''),
            reported_by=request.user
        )
        
        return Response({'status': 'post flagged'})

    def _notify_subscribers(self, post):
        """Notify thread subscribers of new post"""
        thread = post.thread
        subscriptions = thread.subscribers.exclude(user=post.author)
        from django.conf import settings
        from .tasks import send_forum_reply_notification
        
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        thread_url = f"{frontend_url}/forum/t/{thread.slug}"

        for subscription in subscriptions:
            if subscription.notification_level == ThreadSubscription.NotificationLevel.ALL or \
               (subscription.notification_level == ThreadSubscription.NotificationLevel.REPLIES and not post.parent):
                
                ForumNotification.objects.create(
                    user=subscription.user,
                    notification_type=ForumNotification.NotificationType.NEW_REPLY,
                    title=f"New reply in {thread.title}",
                    message=f"{post.author.get_full_name() or post.author.username} replied",
                    related_post=post,
                    related_thread=thread,
                    from_user=post.author
                )

                # Send email notification
                send_forum_reply_notification.delay(
                    subscription.user.email,
                    subscription.user.first_name,
                    thread.title,
                    post.author.get_full_name() or post.author.username,
                    post.content[:200],
                    thread_url
                )


# ============================================================================
# TAG VIEWSET
# ============================================================================

class ForumTagViewSet(viewsets.ReadOnlyModelViewSet):
    """Forum tags for categorization"""
    
    queryset = ForumTag.objects.all().order_by('-thread_count')
    serializer_class = ForumTagSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [SearchFilter]
    search_fields = ['name', 'description']

    @action(detail=True, methods=['get'])
    def threads(self, request, pk=None):
        """Get threads with this tag"""
        tag = self.get_object()
        threads = tag.threads.filter(is_approved=True).order_by('-created_at')
        
        serializer = ForumThreadListSerializer(
            threads, many=True, context={'request': request}
        )
        return Response(serializer.data)


# ============================================================================
# REPUTATION VIEWSET
# ============================================================================

class UserReputationViewSet(viewsets.ReadOnlyModelViewSet):
    """User reputation and leaderboards"""
    
    queryset = UserReputation.objects.filter(is_banned=False).order_by('-points')
    serializer_class = UserReputationSerializer
    pagination_class = LargeResultsSetPagination
    filter_backends = [OrderingFilter]
    ordering_fields = ['points', 'solutions_provided', 'current_streak']

    @action(detail=False, methods=['get'])
    def leaderboard(self, request):
        """Top forum contributors"""
        top_users = self.get_queryset()[:10]
        serializer = self.get_serializer(top_users, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def my_reputation(self, request):
        """Get current user's reputation"""
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            reputation = request.user.forum_reputation
            serializer = self.get_serializer(reputation)
            return Response(serializer.data)
        except UserReputation.DoesNotExist:
            return Response(
                {'detail': 'Reputation not found'},
                status=status.HTTP_404_NOT_FOUND
            )


# ============================================================================
# BADGE VIEWSET
# ============================================================================

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    """Achievement badges"""
    
    queryset = Badge.objects.filter(is_hidden=False).order_by('order')
    serializer_class = BadgeSerializer

    @action(detail=False, methods=['get'])
    def user_badges(self, request):
        """Get badges earned by current user"""
        if not request.user.is_authenticated:
            return Response([])
        
        badges = request.user.user_badges.all()
        serializer = ThreadSubscriptionSerializer(badges, many=True)
        return Response(serializer.data)


# ============================================================================
# MODERATION VIEWSET
# ============================================================================

class ForumReportViewSet(viewsets.ModelViewSet):
    """Handle community reports"""
    
    queryset = ForumReport.objects.select_related(
        'post', 'reported_by', 'reviewed_by'
    ).order_by('-created_at')
    serializer_class = ForumReportSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['status', 'reason']
    ordering_fields = ['created_at', 'status']
    permission_classes = [IsApprovedMember]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return self.queryset
        return self.queryset.filter(reported_by=user)

    @action(detail=True, methods=['post'], permission_classes=[IsPlatformModerator])
    def review(self, request, pk=None):
        """Review and respond to report"""
        report = self.get_object()
        
        action_taken = request.data.get('action_taken')
        review_notes = request.data.get('review_notes', '')
        
        report.status = ForumReport.ReportStatus.RESOLVED
        report.reviewed_by = request.user
        report.review_notes = review_notes
        report.action_taken = action_taken
        report.reviewed_at = timezone.now()
        report.save()
        
        return Response(ForumReportSerializer(report).data)


# ============================================================================
# NOTIFICATION VIEWSET
# ============================================================================

class PrivateMessageViewSet(viewsets.ModelViewSet):
    """Direct messages between approved members."""

    serializer_class = PrivateMessageSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsApprovedMember]
    http_method_names = ['get', 'post', 'head', 'options']

    def get_queryset(self):
        user = self.request.user
        box = self.request.query_params.get('box', 'inbox')
        if box == 'sent':
            return PrivateMessage.objects.filter(sender=user).select_related('sender', 'recipient')
        return PrivateMessage.objects.filter(recipient=user).select_related('sender', 'recipient')

    def perform_create(self, serializer):
        message = serializer.save(sender=self.request.user)
        
        # Send email notification
        from django.conf import settings
        from .tasks import send_private_message_notification
        
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        messages_url = f"{frontend_url}/messages"
        
        send_private_message_notification.delay(
            message.recipient.email,
            message.recipient.first_name,
            message.sender.get_full_name() or message.sender.username,
            message.subject,
            message.body[:100],
            messages_url
        )

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        message = self.get_object()
        if message.recipient != request.user:
            return Response({'detail': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        message.is_read = True
        message.read_at = timezone.now()
        message.save(update_fields=['is_read', 'read_at'])
        return Response({'status': 'read'})


class ForumNotificationViewSet(viewsets.ModelViewSet):
    """Forum notifications"""
    
    serializer_class = ForumNotificationSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsApprovedMember]

    def get_queryset(self):
        return ForumNotification.objects.filter(
            user=self.request.user
        ).order_by('-created_at')

    @action(detail=False, methods=['get'])
    def unread(self, request):
        """Get unread notifications"""
        notifications = self.get_queryset().filter(is_read=False)
        serializer = self.get_serializer(notifications, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Mark notification as read"""
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Mark all notifications as read"""
        self.get_queryset().update(is_read=True)
        return Response({'status': 'all marked as read'})


# ============================================================================
# FORUM STATISTICS VIEWSET
# ============================================================================

class ForumStatsViewSet(viewsets.ReadOnlyModelViewSet):
    """Forum statistics and analytics"""
    
    queryset = ForumStats.objects.order_by('-date')
    serializer_class = ForumStatsSerializer
    pagination_class = LargeResultsSetPagination

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest forum stats"""
        latest = self.get_queryset().first()
        if latest:
            serializer = self.get_serializer(latest)
            return Response(serializer.data)
        return Response({})

    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get forum overview stats"""
        today = timezone.now().date()
        
        return Response({
            'total_threads': ForumThread.objects.count(),
            'total_posts': ForumPost.objects.count(),
            'total_users': UserReputation.objects.count(),
            'today_posts': ForumPost.objects.filter(created_at__date=today).count(),
            'today_threads': ForumThread.objects.filter(created_at__date=today).count(),
            'active_discussions': ForumThread.objects.filter(
                status=ForumThread.Status.OPEN,
                last_activity__gte=timezone.now() - timedelta(days=7)
            ).count()
        })
