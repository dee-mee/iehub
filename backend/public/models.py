from django.db import models
from django.conf import settings


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Topic(TimestampedModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True, default='')
    icon = models.CharField(max_length=50, blank=True, default='')

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class DisabilityType(TimestampedModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name


class Resource(TimestampedModel):
    class ResourceType(models.TextChoices):
        REPORT = 'REPORT', 'Report'
        PUBLICATION = 'PUBLICATION', 'Publication'
        TOOLKIT = 'TOOLKIT', 'Toolkit'
        POLICY_BRIEF = 'POLICY_BRIEF', 'Policy Brief'
        RESEARCH = 'RESEARCH', 'Research'
        VIDEO = 'VIDEO', 'Video'
        AUDIO = 'AUDIO', 'Audio'
        OTHER = 'OTHER', 'Other'

    class AccessLevel(models.TextChoices):
        PUBLIC = 'PUBLIC', 'Public'
        MEMBERS_ONLY = 'MEMBERS_ONLY', 'Members Only'

    title = models.CharField(max_length=255)
    description = models.TextField()
    resource_type = models.CharField(max_length=32, choices=ResourceType.choices)
    access_level = models.CharField(max_length=32, choices=AccessLevel.choices, default=AccessLevel.PUBLIC)
    file = models.FileField(upload_to='resources/', blank=True, null=True)
    external_url = models.URLField(blank=True, default='')
    thumbnail = models.ImageField(upload_to='resource_thumbnails/', blank=True, null=True)
    language = models.CharField(max_length=16, default='en')
    topics = models.ManyToManyField(Topic, blank=True, related_name='resources')
    disability_types = models.ManyToManyField(DisabilityType, blank=True, related_name='resources')
    published_at = models.DateTimeField()
    download_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    class Meta:
        ordering = ['-published_at']

    def __str__(self) -> str:
        return self.title


class ResourceFile(TimestampedModel):
    """Allows attaching multiple files (PDFs, videos, etc.) to a single Resource."""

    class FileType(models.TextChoices):
        PDF = 'PDF', 'PDF'
        VIDEO = 'VIDEO', 'Video'
        AUDIO = 'AUDIO', 'Audio'
        IMAGE = 'IMAGE', 'Image'
        DOCUMENT = 'DOCUMENT', 'Document'
        OTHER = 'OTHER', 'Other'

    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='resource_files/')
    file_type = models.CharField(max_length=16, choices=FileType.choices, default=FileType.OTHER)
    label = models.CharField(
        max_length=255,
        blank=True,
        default='',
        help_text='Optional display label, e.g. "English PDF" or "Intro Video"',
    )
    order = models.PositiveSmallIntegerField(default=0, help_text='Display order (lower = first)')

    class Meta:
        ordering = ['order', 'created_at']

    def __str__(self) -> str:
        return f'{self.resource.title} — {self.label or self.file_type}'


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


class Donation(TimestampedModel):
    class Currency(models.TextChoices):
        USD = 'USD', 'US Dollar'
        EUR = 'EUR', 'Euro'
        KES = 'KES', 'Kenya Shilling'
        UGX = 'UGX', 'Uganda Shilling'
        TZS = 'TZS', 'Tanzania Shilling'

    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        SUCCESS = 'SUCCESS', 'Success'
        FAILED = 'FAILED', 'Failed'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, choices=Currency.choices, default=Currency.USD)
    transaction_reference = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    is_anonymous = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f'{self.full_name} - {self.amount} {self.currency} ({self.status})'
