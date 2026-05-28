from rest_framework import viewsets, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import action
from django.db.models import Count, Max, Q
from django.utils.text import slugify
from django_filters.rest_framework import DjangoFilterBackend
import uuid

from .models import ForumCategory, ForumThread, ForumPost, ForumReaction
from .serializers import (
    ForumCategorySerializer, ForumThreadSerializer, 
    ForumPostSerializer, ForumReactionSerializer
)
from users.models import Notification

class ForumCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ForumCategory.objects.all()
    serializer_class = ForumCategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

    def get_queryset(self):
        return super().get_queryset().annotate(
            thread_count=Count('threads', distinct=True),
            post_count=Count('threads__posts', distinct=True)
        )


class ForumThreadViewSet(viewsets.ModelViewSet):
    queryset = ForumThread.objects.all()
    serializer_class = ForumThreadSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'category__slug']
    search_fields = ['title']
    ordering_fields = ['last_activity', 'created_at']
    ordering = ['-is_pinned', '-last_activity']

    def get_queryset(self):
        return super().get_queryset().annotate(
            post_count=Count('posts'),
            last_post_at=Max('posts__created_at')
        ).select_related('author', 'category')

    def perform_create(self, serializer):
        title = serializer.validated_data['title']
        slug = slugify(title)
        if ForumThread.objects.filter(slug=slug).exists():
            slug = f"{slug}-{uuid.uuid4().hex[:8]}"
        serializer.save(author=self.request.user, slug=slug)


class ForumPostViewSet(viewsets.ModelViewSet):
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['thread', 'thread__slug']
    search_fields = ['content']

    def get_queryset(self):
        return super().get_queryset().select_related('author', 'thread').prefetch_related('reactions')

    def perform_create(self, serializer):
        post = serializer.save(author=self.request.user)
        
        # Update thread activity
        thread = post.thread
        thread.last_activity = post.created_at
        thread.save(update_fields=['last_activity'])

        # Notify thread author
        user_display = self.request.user.first_name or self.request.user.username
        
        if thread.author != self.request.user:
            Notification.objects.create(
                user=thread.author,
                notification_type='FORUM_REPLY',
                title=f"New reply in: {thread.title}",
                message=f"{user_display} replied to your discussion.",
                link=f"/forum/t/{thread.slug}"
            )
        
        # If it's a direct reply to another post, notify that post's author too
        if post.parent and post.parent.author != self.request.user and post.parent.author != thread.author:
            Notification.objects.create(
                user=post.parent.author,
                notification_type='FORUM_REPLY',
                title=f"Direct reply to your post",
                message=f"{user_display} replied directly to your post in {thread.title}.",
                link=f"/forum/t/{thread.slug}"
            )

    @action(detail=True, methods=['post'])
    def react(self, request, pk=None):
        post = self.get_object()
        reaction_type = request.data.get('reaction_type')
        if not reaction_type:
            return Response({'error': 'reaction_type is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        existing = ForumReaction.objects.filter(post=post, user=request.user, reaction_type=reaction_type).first()
        if existing:
            existing.delete()
            return Response({'status': 'reaction removed'})
        else:
            ForumReaction.objects.filter(post=post, user=request.user).delete()
            ForumReaction.objects.create(post=post, user=request.user, reaction_type=reaction_type)
            return Response({'status': 'reaction added'})
