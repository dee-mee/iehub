from django.contrib import admin
from .models import ContactMessage, DisabilityType, Event, NewsArticle, Resource, Topic


@admin.register(Topic)
class TopicAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'icon')
    list_editable = ('icon',)
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name', 'description')
    ordering = ('name',)


@admin.register(DisabilityType)
class DisabilityTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ('title', 'resource_type', 'language', 'published_at', 'download_count', 'is_featured')
    list_filter = ('resource_type', 'language', 'is_featured', 'topics', 'disability_types', 'published_at')
    search_fields = ('title', 'description')
    filter_horizontal = ('topics', 'disability_types')
    list_editable = ('is_featured',)
    readonly_fields = ('download_count', 'created_at', 'updated_at')
    date_hierarchy = 'published_at'
    ordering = ('-published_at',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'resource_type', 'language')
        }),
        ('Files', {
            'fields': ('file', 'external_url', 'thumbnail')
        }),
        ('Classification', {
            'fields': ('topics', 'disability_types')
        }),
        ('Publication', {
            'fields': ('published_at', 'is_featured')
        }),
        ('Statistics', {
            'fields': ('download_count', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(NewsArticle)
class NewsArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author_name', 'published_at', 'is_featured')
    list_filter = ('category', 'is_featured', 'published_at')
    search_fields = ('title', 'excerpt', 'content', 'author_name')
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ('is_featured',)
    date_hierarchy = 'published_at'
    ordering = ('-published_at',)
    fieldsets = (
        ('Content', {
            'fields': ('title', 'slug', 'excerpt', 'content', 'category')
        }),
        ('Publication', {
            'fields': ('author_name', 'published_at', 'is_featured')
        }),
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'event_type', 'start_datetime', 'end_datetime', 'location_type', 'is_members_only')
    list_filter = ('event_type', 'location_type', 'is_members_only', 'start_datetime')
    search_fields = ('title', 'description')
    date_hierarchy = 'start_datetime'
    ordering = ('start_datetime',)
    fieldsets = (
        ('Event Details', {
            'fields': ('title', 'description', 'event_type')
        }),
        ('Schedule', {
            'fields': ('start_datetime', 'end_datetime')
        }),
        ('Location', {
            'fields': ('location_type', 'location_address', 'online_link', 'registration_link')
        }),
        ('Settings', {
            'fields': ('is_members_only',)
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'subject', 'created_at', 'is_resolved')
    list_filter = ('is_resolved', 'created_at')
    search_fields = ('full_name', 'email', 'subject', 'message')
