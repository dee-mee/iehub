from django.db import models
from django.conf import settings
from public.models import TimestampedModel, Topic
from users.models import Country
from django_ckeditor_5.fields import CKEditor5Field

class ForumCategory(TimestampedModel):
    class CategoryType(models.TextChoices):
        COUNTRY = 'COUNTRY', 'Country Group'
        THEMATIC = 'THEMATIC', 'Thematic Group'
        GENERAL = 'GENERAL', 'General Group'
        ANNOUNCEMENT = 'ANNOUNCEMENT', 'Announcement'

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True, default='')
    category_type = models.CharField(max_length=32, choices=CategoryType.choices)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True, related_name='forum_categories')
    topic = models.ForeignKey(Topic, on_delete=models.SET_NULL, null=True, blank=True, related_name='forum_categories')
    icon = models.CharField(max_length=50, blank=True, default='')
    order = models.PositiveIntegerField(default=0)
    is_private = models.BooleanField(default=True) # Members only by default
    moderators = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name='moderated_categories')

    class Meta:
        verbose_name_plural = 'forum categories'
        ordering = ['order', 'name']

    def __str__(self) -> str:
        return self.name


class ForumThread(TimestampedModel):
    category = models.ForeignKey(ForumCategory, on_delete=models.CASCADE, related_name='threads')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_threads')
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    is_announcement = models.BooleanField(default=False)
    view_count = models.PositiveIntegerField(default=0)
    last_activity = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_pinned', '-last_activity']

    def __str__(self) -> str:
        return self.title


class ForumPost(TimestampedModel):
    thread = models.ForeignKey(ForumThread, on_delete=models.CASCADE, related_name='posts')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_posts')
    content = CKEditor5Field('Content', config_name='extends')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies')
    is_approved = models.BooleanField(default=True)
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    edited_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='edited_posts')

    class Meta:
        ordering = ['created_at']

    def __str__(self) -> str:
        return f"Post by {self.author.username} in {self.thread.title}"


class ForumReaction(models.Model):
    class ReactionType(models.TextChoices):
        LIKE = 'LIKE', 'Like'
        INSIGHTFUL = 'INSIGHTFUL', 'Insightful'
        HELPFUL = 'HELPFUL', 'Helpful'
        CELEBRATE = 'CELEBRATE', 'Celebrate'

    post = models.ForeignKey(ForumPost, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='forum_reactions')
    reaction_type = models.CharField(max_length=32, choices=ReactionType.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user', 'reaction_type')

    def __str__(self) -> str:
        return f"{self.user.username} - {self.reaction_type}"
