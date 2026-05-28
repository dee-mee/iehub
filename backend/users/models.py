import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from public.models import TimestampedModel


class Country(models.Model):
    class Region(models.TextChoices):
        EAST_AFRICA = 'EAST_AFRICA', 'East Africa'
        WEST_AFRICA = 'WEST_AFRICA', 'West Africa'
        CENTRAL_AFRICA = 'CENTRAL_AFRICA', 'Central Africa'
        NORTH_AFRICA = 'NORTH_AFRICA', 'North Africa'
        SOUTHERN_AFRICA = 'SOUTHERN_AFRICA', 'Southern Africa'

    code = models.CharField(max_length=2, unique=True)
    name = models.CharField(max_length=100)
    name_fr = models.CharField(max_length=100, blank=True, default='')
    name_ar = models.CharField(max_length=100, blank=True, default='')
    name_pt = models.CharField(max_length=100, blank=True, default='')
    name_sw = models.CharField(max_length=100, blank=True, default='')
    region = models.CharField(max_length=32, choices=Region.choices)
    lm_office = models.BooleanField(default=False)
    flag_emoji = models.CharField(max_length=16, blank=True, default='')

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name_plural = 'countries'
        ordering = ['name']


class CustomUser(AbstractUser):
    class Role(models.TextChoices):
        SUPER_ADMIN = 'SUPER_ADMIN', 'Super Admin'
        STEERING_COMMITTEE = 'STEERING_COMMITTEE', 'Steering Committee'
        REGIONAL_ADMIN = 'REGIONAL_ADMIN', 'Regional Admin'
        MEMBER = 'MEMBER', 'Member'
        PUBLIC = 'PUBLIC', 'Public'

    class OrgType(models.TextChoices):
        OPD = 'OPD', 'OPD (Organization of Persons with Disabilities)'
        CSO = 'CSO', 'CSO (Civil Society Organization)'
        FBO = 'FBO', 'FBO (Faith Based Organization)'
        GOVERNMENT = 'GOVERNMENT', 'Government'
        ACADEMIC = 'ACADEMIC', 'Academic / Researcher'
        PRIVATE = 'PRIVATE', 'Private Sector'
        INDIVIDUAL = 'INDIVIDUAL', 'Individual'

    email = models.EmailField(unique=True)
    role = models.CharField(max_length=32, choices=Role.choices, default=Role.MEMBER)
    country = models.ForeignKey(Country, on_delete=models.SET_NULL, null=True, blank=True, related_name='users')
    organization = models.CharField(max_length=255, blank=True, default='')
    organization_type = models.CharField(max_length=32, choices=OrgType.choices, blank=True, default='')
    professional_title = models.CharField(max_length=255, blank=True, default='')
    bio = models.TextField(blank=True, default='')
    how_heard = models.TextField(blank=True, default='')
    is_verified = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self) -> str:
        return self.email


class ExpertiseTag(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        ordering = ['name']


class MemberProfile(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='profile')
    linkedin_url = models.URLField(blank=True, default='')
    twitter_url = models.URLField(blank=True, default='')
    website_url = models.URLField(blank=True, default='')
    is_visible_in_directory = models.BooleanField(default=True)
    expertise_areas = models.ManyToManyField(ExpertiseTag, blank=True, related_name='profiles')
    countries_of_work = models.ManyToManyField(Country, blank=True, related_name='working_profiles')

    def __str__(self) -> str:
        return f"Profile of {self.user.email}"


@receiver(post_save, sender=CustomUser)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        MemberProfile.objects.get_or_create(user=instance)


@receiver(post_save, sender=CustomUser)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'profile'):
        instance.profile.save()
    else:
        MemberProfile.objects.get_or_create(user=instance)


class EmailVerificationToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='verification_token')
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self) -> bool:
        # Token is valid for 24 hours
        return (timezone.now() - self.created_at).total_seconds() < 24 * 3600

    def __str__(self) -> str:
        return f"Token for {self.user.email}"


class Notification(TimestampedModel):
    class NotificationType(models.TextChoices):
        SYSTEM = 'SYSTEM', 'System'
        FORUM_REPLY = 'FORUM_REPLY', 'Forum Reply'
        MEMBER_APPROVAL = 'MEMBER_APPROVAL', 'Member Approval'
        NEW_RESOURCE = 'NEW_RESOURCE', 'New Resource'

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=32, choices=NotificationType.choices, default=NotificationType.SYSTEM)
    title = models.CharField(max_length=255)
    message = models.TextField()
    link = models.CharField(max_length=255, blank=True, default='')
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"Notification for {self.user.username}: {self.title}"
