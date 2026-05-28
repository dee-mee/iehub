from django.contrib import admin
from .models import ForumCategory, ForumThread, ForumPost, ForumReaction

@admin.register(ForumCategory)
class ForumCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'category_type', 'is_private', 'order')
    list_filter = ('category_type', 'is_private')
    search_fields = ('name', 'slug', 'description')
    prepopulated_fields = {'slug': ('name',)}


class ForumPostInline(admin.TabularInline):
    model = ForumPost
    extra = 0
    readonly_fields = ('author', 'content', 'created_at')


@admin.register(ForumThread)
class ForumThreadAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'is_pinned', 'is_locked', 'last_activity')
    list_filter = ('category', 'is_pinned', 'is_locked', 'is_announcement')
    search_fields = ('title', 'slug', 'author__username', 'author__email')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ForumPostInline]


@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    list_display = ('thread', 'author', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'is_edited')
    search_fields = ('content', 'author__username', 'author__email', 'thread__title')
    actions = ['approve_posts', 'unapprove_posts']

    def approve_posts(self, request, queryset):
        queryset.update(is_approved=True)
    approve_posts.short_description = "Approve selected posts"

    def unapprove_posts(self, request, queryset):
        queryset.update(is_approved=False)
    unapprove_posts.short_description = "Unapprove selected posts"


@admin.register(ForumReaction)
class ForumReactionAdmin(admin.ModelAdmin):
    list_display = ('post', 'user', 'reaction_type', 'created_at')
    list_filter = ('reaction_type', 'created_at')
