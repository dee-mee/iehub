from django.core.management.base import BaseCommand
from django.utils.text import slugify
from forum.models import ForumCategory
from users.models import Country
from public.models import Topic

class Command(BaseCommand):
    help = 'Seed forum categories.'

    def handle(self, *args, **options):
        # 1. General Categories
        general_categories = [
            {'name': 'Announcements', 'description': 'Official updates from IE Hub Secretariat.', 'type': ForumCategory.CategoryType.ANNOUNCEMENT, 'icon': '📢', 'order': 1, 'private': False},
            {'name': 'General Discussion', 'description': 'Introduce yourself and discuss anything related to inclusive education.', 'type': ForumCategory.CategoryType.GENERAL, 'icon': '💬', 'order': 2, 'private': True},
            {'name': 'Success Stories', 'description': 'Share positive impacts and case studies from the field.', 'type': ForumCategory.CategoryType.GENERAL, 'icon': '🌟', 'order': 3, 'private': True},
        ]

        for cat in general_categories:
            ForumCategory.objects.update_or_create(
                slug=slugify(cat['name']),
                defaults={
                    'name': cat['name'],
                    'description': cat['description'],
                    'category_type': cat['type'],
                    'icon': cat['icon'],
                    'order': cat['order'],
                    'is_private': cat['private']
                }
            )
            self.stdout.write(f"Created/Updated general category: {cat['name']}")

        # 2. Country Groups
        countries = Country.objects.filter(name__in=[
            'Kenya', 'Uganda', 'Tanzania', 'Sudan', 'South Sudan', 
            'Ethiopia', 'Democratic Republic of the Congo', 'Somalia', 
            'Burundi', 'Rwanda', 'Chad'
        ])
        
        for i, country in enumerate(countries):
            name = f"{country.name} Group"
            ForumCategory.objects.update_or_create(
                slug=slugify(name),
                defaults={
                    'name': name,
                    'description': f"Discussion group for practitioners in {country.name}.",
                    'category_type': ForumCategory.CategoryType.COUNTRY,
                    'country': country,
                    'icon': country.flag_emoji or '📍',
                    'order': 10 + i,
                    'is_private': True
                }
            )
            self.stdout.write(f"Created/Updated country group: {name}")

        # 3. Thematic Groups
        topics = Topic.objects.all()
        for i, topic in enumerate(topics):
            name = f"{topic.name} Community"
            ForumCategory.objects.update_or_create(
                slug=slugify(name),
                defaults={
                    'name': name,
                    'description': f"Technical discussions regarding {topic.name}.",
                    'category_type': ForumCategory.CategoryType.THEMATIC,
                    'topic': topic,
                    'icon': topic.icon or '🎯',
                    'order': 50 + i,
                    'is_private': True
                }
            )
            self.stdout.write(f"Created/Updated thematic group: {name}")

        self.stdout.write(self.style.SUCCESS('Forum categories seeded successfully.'))
