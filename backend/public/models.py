from django.db import models


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Resource(TimestampedModel):
    class ResourceType(models.TextChoices):
        REPORT = 'REPORT', 'Report'
        PUBLICATION = 'PUBLICATION', 'Publication'
        TOOLKIT = 'TOOLKIT', 'Toolkit'
        POLICY_BRIEF = 'POLICY_BRIEF', 'Policy Brief'
        RESEARCH = 'RESEARCH', 'Research'
        VIDEO = 'VIDEO', 'Video'
        OTHER = 'OTHER', 'Other'

    title = models.CharField(max_length=255)
    description = models.TextField()
    resource_type = models.CharField(max_length=32, choices=ResourceType.choices)
    language = models.CharField(max_length=16, default='en')
    countries = models.CharField(max_length=255, blank=True, default='')
    topics = models.CharField(max_length=255, blank=True, default='')
    file_url = models.URLField(blank=True, default='')
    external_url = models.URLField(blank=True, default='')
    published_at = models.DateTimeField()
    download_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-published_at']

    def __str__(self) -> str:
        return self.title


class NewsArticle(TimestampedModel):
    class Category(models.TextChoices):
        NEWS = 'NEWS', 'News'
        BLOG = 'BLOG', 'Blog'
        PRESS_RELEASE = 'PRESS_RELEASE', 'Press Release'
        STORY = 'STORY', 'Story'

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    excerpt = models.TextField()
    content = models.TextField()
    category = models.CharField(max_length=32, choices=Category.choices, default=Category.NEWS)
    author_name = models.CharField(max_length=255)
    published_at = models.DateTimeField()
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-published_at']

    def __str__(self) -> str:
        return self.title


class Event(TimestampedModel):
    class EventType(models.TextChoices):
        WEBINAR = 'WEBINAR', 'Webinar'
        WORKSHOP = 'WORKSHOP', 'Workshop'
        CONFERENCE = 'CONFERENCE', 'Conference'
        TRAINING = 'TRAINING', 'Training'
        OTHER = 'OTHER', 'Other'

    class LocationType(models.TextChoices):
        ONLINE = 'ONLINE', 'Online'
        IN_PERSON = 'IN_PERSON', 'In Person'
        HYBRID = 'HYBRID', 'Hybrid'

    title = models.CharField(max_length=255)
    description = models.TextField()
    event_type = models.CharField(max_length=32, choices=EventType.choices)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    location_type = models.CharField(max_length=16, choices=LocationType.choices)
    location_address = models.CharField(max_length=255, blank=True, default='')
    online_link = models.URLField(blank=True, default='')
    registration_link = models.URLField(blank=True, default='')
    is_members_only = models.BooleanField(default=False)

    class Meta:
        ordering = ['start_datetime']

    def __str__(self) -> str:
        return self.title


class ContactMessage(TimestampedModel):
    full_name = models.CharField(max_length=120)
    email = models.EmailField()
    organization = models.CharField(max_length=255, blank=True, default='')
    subject = models.CharField(max_length=120)
    message = models.TextField()
    is_resolved = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.full_name} - {self.subject}'
