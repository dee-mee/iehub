from django.contrib import admin
from .models import ContactMessage, Event, NewsArticle, Resource


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'resource_type', 'language', 'published_at', 'is_featured')
    list_filter = ('resource_type', 'language', 'is_featured')
    search_fields = ('title', 'description', 'topics', 'countries')


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author_name', 'published_at', 'is_featured')
    list_filter = ('category', 'is_featured')
    search_fields = ('title', 'excerpt', 'content', 'author_name')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_type', 'start_datetime', 'location_type', 'is_members_only')
    list_filter = ('event_type', 'location_type', 'is_members_only')
    search_fields = ('title', 'description')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'subject', 'created_at', 'is_resolved')
    list_filter = ('is_resolved', 'created_at')
    search_fields = ('full_name', 'email', 'subject', 'message')
