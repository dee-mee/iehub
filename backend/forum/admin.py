from django.contrib import admin
from modeltranslation.admin import TranslationAdmin
from .models import (
    ForumCategory, ForumThread, ForumPost, ForumReaction, 
    ForumTag, UserReputation, ReputationLog, Badge, UserBadge,
    ForumReport, ModerationAction, ThreadSubscription, ForumNotification,
    ForumStats, PrivateMessage, DeletedContent
)

@admin.register(ForumCategory)
class ForumCategoryAdmin(TranslationAdmin):
    list_display = ('name', 'category_type', 'is_private', 'order', 'thread_count', 'post_count')
    list_filter = ('category_type', 'is_private', 'is_archived')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}
    filter_horizontal = ('moderators',)


class ForumPostInline(admin.TabularInline):
    model = ForumPost
    extra = 0
    readonly_fields = ('author', 'content', 'created_at')
    can_delete = True


@admin.register(ForumThread)
class ForumThreadAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'status', 'is_pinned', 'is_featured', 'reply_count', 'view_count', 'last_activity')
    list_filter = ('category', 'status', 'is_pinned', 'is_featured', 'is_announcement', 'is_approved')
    search_fields = ('title', 'slug', 'author__username', 'author__email')
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ('tags',)
    inlines = [ForumPostInline]


@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'thread', 'author', 'approval_status', 'is_flagged', 'created_at')
    list_filter = ('approval_status', 'is_edited', 'is_flagged', 'created_at')
    search_fields = ('content', 'author__username', 'author__email', 'thread__title')
    actions = ['approve_posts', 'reject_posts']

    def approve_posts(self, request, queryset):
        queryset.update(approval_status=ForumPost.ApprovalStatus.APPROVED, is_flagged=False)
    approve_posts.short_description = "Approve selected posts"

    def reject_posts(self, request, queryset):
        queryset.update(approval_status=ForumPost.ApprovalStatus.REJECTED)
    reject_posts.short_description = "Reject selected posts"


@admin.register(ForumReaction)
class ForumReactionAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'reaction_type', 'created_at')
    list_filter = ('reaction_type', 'created_at')


@admin.register(ForumTag)
class ForumTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'thread_count', 'color')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(UserReputation)
class UserReputationAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'threads_created', 'posts_created', 'solutions_provided', 'is_moderator')
    list_filter = ('is_moderator', 'is_banned')
    search_fields = ('user__username', 'user__email')


@admin.register(ReputationLog)
class ReputationLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'points', 'action_type', 'created_at')
    list_filter = ('action_type', 'created_at')
    search_fields = ('user__username', 'user__email', 'reason')


@admin.register(Badge)
class BadgeAdmin(admin.ModelAdmin):
    list_display = ('name', 'required_points', 'required_posts', 'is_hidden', 'order')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(UserBadge)
class UserBadgeAdmin(admin.ModelAdmin):
    list_display = ('user', 'badge', 'earned_at')
    list_filter = ('badge', 'earned_at')


@admin.register(ForumReport)
class ForumReportAdmin(admin.ModelAdmin):
    list_display = ('reason', 'post', 'reported_by', 'status', 'created_at')
    list_filter = ('status', 'reason', 'created_at')
    search_fields = ('description', 'reported_by__username', 'post__content')


@admin.register(ModerationAction)
class ModerationActionAdmin(admin.ModelAdmin):
    list_display = ('action_type', 'moderator', 'user', 'created_at')
    list_filter = ('action_type', 'created_at')


@admin.register(ThreadSubscription)
class ThreadSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'thread', 'notification_level', 'subscribed_at')
    list_filter = ('notification_level', 'subscribed_at')


@admin.register(ForumNotification)
class ForumNotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'notification_type', 'is_read', 'created_at')
    list_filter = ('notification_type', 'is_read', 'created_at')


@admin.register(ForumStats)
class ForumStatsAdmin(admin.ModelAdmin):
    list_display = ('date', 'new_threads', 'new_posts', 'total_views', 'active_users')


@admin.register(PrivateMessage)
class PrivateMessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'subject', 'is_read', 'created_at')
    list_filter = ('is_read', 'created_at')
    search_fields = ('subject', 'body', 'sender__username', 'recipient__username')


@admin.register(DeletedContent)
class DeletedContentAdmin(admin.ModelAdmin):
    list_display = ('content_type', 'original_author', 'reason_deleted', 'deleted_at')
    list_filter = ('content_type', 'deleted_at')
