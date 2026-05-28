from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify

from public.models import Event, NewsArticle, Resource


class Command(BaseCommand):
    help = 'Seed starter data for public website APIs.'

    def handle(self, *args, **options):  # noqa: ANN002, ANN003
        now = timezone.now()

        resources = [
            {
                'title': 'Inclusive Education Policy Framework for Africa',
                'description': 'Reference for ministries developing inclusive education policies.',
                'resource_type': Resource.ResourceType.POLICY_BRIEF,
                'language': 'en',
                'countries': 'Kenya,Uganda,Tanzania',
                'topics': 'Policy and Advocacy',
                'published_at': now - timedelta(days=40),
                'download_count': 342,
                'is_featured': True,
            },
            {
                'title': 'Teacher Toolkit: Universal Design for Learning',
                'description': 'Practical classroom strategies and case studies from East Africa.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'language': 'en',
                'countries': 'Kenya,Ethiopia',
                'topics': 'Teacher Training and Capacity Building',
                'published_at': now - timedelta(days=60),
                'download_count': 518,
                'is_featured': True,
            },
            {
                'title': 'Assistive Devices in Low-Resource Schools',
                'description': 'Guidance on procurement and maintenance for assistive technology.',
                'resource_type': Resource.ResourceType.PUBLICATION,
                'language': 'fr',
                'countries': 'DRC,Chad',
                'topics': 'Assistive Technology',
                'published_at': now - timedelta(days=90),
                'download_count': 201,
                'is_featured': True,
            },
        ]

        for resource in resources:
            Resource.objects.update_or_create(
                title=resource['title'],
                defaults=resource,
            )

        articles = [
            {
                'title': 'IE Hub soft launch on Day of the African Child',
                'excerpt': 'Public library and member registration open across Africa.',
                'content': 'On 16 June 2026, IE Hub launches with public resources and community pathways.',
                'category': NewsArticle.Category.NEWS,
                'author_name': 'LM International',
                'published_at': now - timedelta(days=5),
                'is_featured': True,
            },
            {
                'title': 'Steering Committee agrees platform governance model',
                'excerpt': 'Thirteen partners confirmed rotating ownership and governance process.',
                'content': 'The committee finalized ownership and content approval structures.',
                'category': NewsArticle.Category.NEWS,
                'author_name': 'IE Hub Secretariat',
                'published_at': now - timedelta(days=20),
                'is_featured': False,
            },
        ]

        for article in articles:
            NewsArticle.objects.update_or_create(
                slug=slugify(article['title']),
                defaults={
                    **article,
                    'slug': slugify(article['title']),
                },
            )

        events = [
            {
                'title': 'IE Hub Soft Launch Webinar',
                'description': 'Introduction to the platform and public resource library.',
                'event_type': Event.EventType.WEBINAR,
                'start_datetime': now + timedelta(days=20),
                'end_datetime': now + timedelta(days=20, hours=2),
                'location_type': Event.LocationType.ONLINE,
                'online_link': 'https://example.com/register',
                'registration_link': 'https://example.com/register',
                'is_members_only': False,
            },
            {
                'title': 'East Africa Inclusive Education Forum',
                'description': 'Regional practitioners share lessons on policy implementation.',
                'event_type': Event.EventType.CONFERENCE,
                'start_datetime': now + timedelta(days=40),
                'end_datetime': now + timedelta(days=42),
                'location_type': Event.LocationType.HYBRID,
                'location_address': 'Nairobi, Kenya',
                'online_link': 'https://example.com/forum',
                'registration_link': 'https://example.com/forum',
                'is_members_only': False,
            },
        ]

        for event in events:
            Event.objects.update_or_create(
                title=event['title'],
                defaults=event,
            )

        self.stdout.write(self.style.SUCCESS('Public website seed data loaded successfully.'))
