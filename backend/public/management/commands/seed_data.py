from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from public.models import Resource, NewsArticle, Event, Topic, DisabilityType
import random


class Command(BaseCommand):
    help = 'Seed the database with initial content for soft launch'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial content...')

        # Create Topics
        topics_data = [
            {'name': 'Policy and Advocacy', 'slug': 'policy-advocacy', 'description': 'Policy frameworks and advocacy resources', 'icon': '📜'},
            {'name': 'Teacher Training', 'slug': 'teacher-training', 'description': 'Teacher capacity building resources', 'icon': '👨‍🏫'},
            {'name': 'Assistive Technology', 'slug': 'assistive-technology', 'description': 'Assistive technology tools and guides', 'icon': '🔧'},
            {'name': 'Research and Evidence', 'slug': 'research-evidence', 'description': 'Research findings and evidence-based resources', 'icon': '📊'},
            {'name': 'Gender and Inclusion', 'slug': 'gender-inclusion', 'description': 'Gender-responsive inclusive education', 'icon': '⚧'},
            {'name': 'Education in Emergencies', 'slug': 'education-emergencies', 'description': 'Education in emergency situations', 'icon': '🚨'},
            {'name': 'Early Childhood', 'slug': 'early-childhood', 'description': 'Early childhood inclusive education', 'icon': '👶'},
            {'name': 'OPD Collaboration', 'slug': 'opd-collaboration', 'description': 'Organizations of Persons with Disabilities collaboration', 'icon': '🤝'},
            {'name': 'Resource Sharing', 'slug': 'resource-sharing', 'description': 'Shared resources and toolkits', 'icon': '📚'},
        ]

        for topic_data in topics_data:
            topic, created = Topic.objects.get_or_create(
                slug=topic_data['slug'],
                defaults=topic_data
            )
            if created:
                self.stdout.write(f'Created topic: {topic.name}')
            else:
                self.stdout.write(f'Topic already exists: {topic.name}')

        # Create Disability Types
        disability_types_data = [
            {'name': 'Visual Impairment', 'slug': 'visual-impairment'},
            {'name': 'Hearing Impairment', 'slug': 'hearing-impairment'},
            {'name': 'Mobility Impairment', 'slug': 'mobility-impairment'},
            {'name': 'Intellectual Disability', 'slug': 'intellectual-disability'},
            {'name': 'Autism Spectrum', 'slug': 'autism-spectrum'},
            {'name': 'Learning Disabilities', 'slug': 'learning-disabilities'},
            {'name': 'Albinism', 'slug': 'albinism'},
            {'name': 'Cerebral Palsy', 'slug': 'cerebral-palsy'},
        ]

        for dt_data in disability_types_data:
            dt, created = DisabilityType.objects.get_or_create(
                slug=dt_data['slug'],
                defaults=dt_data
            )
            if created:
                self.stdout.write(f'Created disability type: {dt.name}')
            else:
                self.stdout.write(f'Disability type already exists: {dt.name}')

        # Create Resources (20+ for soft launch)
        resources_data = [
            {
                'title': 'Inclusive Education Policy Framework for Africa',
                'description': 'Comprehensive policy framework for implementing inclusive education across African countries.',
                'resource_type': 'POLICY_BRIEF',
                'language': 'en',
                'external_url': 'https://example.com/policy-framework',
            },
            {
                'title': 'Teacher Training Guide for Inclusive Classrooms',
                'description': 'Practical guide for teachers on creating inclusive learning environments.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/teacher-guide',
            },
            {
                'title': 'Assistive Technology Assessment Toolkit',
                'description': 'Tools and guidelines for assessing assistive technology needs.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/at-toolkit',
            },
            {
                'title': 'Research Report: Disability Inclusion in Education',
                'description': 'Research findings on disability inclusion in education across 11 African countries.',
                'resource_type': 'RESEARCH',
                'language': 'en',
                'external_url': 'https://example.com/research-report',
            },
            {
                'title': 'Gender-Responsive Inclusive Education Guide',
                'description': 'Guide for implementing gender-responsive inclusive education programs.',
                'resource_type': 'PUBLICATION',
                'language': 'en',
                'external_url': 'https://example.com/gender-guide',
            },
            {
                'title': 'Education in Emergencies: Disability Inclusion',
                'description': 'Guidelines for including children with disabilities in emergency education programs.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/emergency-guide',
            },
            {
                'title': 'Early Childhood Development for Children with Disabilities',
                'description': 'Resources for early childhood development programs focused on disability inclusion.',
                'resource_type': 'PUBLICATION',
                'language': 'en',
                'external_url': 'https://example.com/ecd-guide',
            },
            {
                'title': 'OPD Collaboration Framework',
                'description': 'Framework for effective collaboration with Organizations of Persons with Disabilities.',
                'resource_type': 'POLICY_BRIEF',
                'language': 'en',
                'external_url': 'https://example.com/opd-framework',
            },
            {
                'title': 'Braille Literacy Teaching Methods',
                'description': 'Effective methods for teaching Braille literacy to visually impaired students.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/braille-guide',
            },
            {
                'title': 'Sign Language in Education: Best Practices',
                'description': 'Best practices for incorporating sign language in educational settings.',
                'resource_type': 'PUBLICATION',
                'language': 'en',
                'external_url': 'https://example.com/sign-language',
            },
            {
                'title': 'Universal Design for Learning Implementation',
                'description': 'Guide to implementing Universal Design for Learning in African classrooms.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/udl-guide',
            },
            {
                'title': 'Disability Inclusion Assessment Tool',
                'description': 'Tool for assessing disability inclusion in educational institutions.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/assessment-tool',
            },
            {
                'title': 'Parent Engagement in Inclusive Education',
                'description': 'Guide for engaging parents of children with disabilities in education.',
                'resource_type': 'PUBLICATION',
                'language': 'en',
                'external_url': 'https://example.com/parent-guide',
            },
            {
                'title': 'Inclusive Education Financing Guide',
                'description': 'Guide on financing inclusive education programs in Africa.',
                'resource_type': 'POLICY_BRIEF',
                'language': 'en',
                'external_url': 'https://example.com/financing-guide',
            },
            {
                'title': 'Community-Based Rehabilitation in Education',
                'description': 'Integration of community-based rehabilitation approaches in education.',
                'resource_type': 'RESEARCH',
                'language': 'en',
                'external_url': 'https://example.com/cbr-education',
            },
            {
                'title': 'Accessible Teaching Materials Development',
                'description': 'Guide for developing accessible teaching materials for diverse learners.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/accessible-materials',
            },
            {
                'title': 'Inclusive Education Monitoring and Evaluation',
                'description': 'Framework for monitoring and evaluating inclusive education programs.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/m-e-framework',
            },
            {
                'title': 'Transition Planning for Students with Disabilities',
                'description': 'Guide for transition planning from school to adulthood for students with disabilities.',
                'resource_type': 'PUBLICATION',
                'language': 'en',
                'external_url': 'https://example.com/transition-guide',
            },
            {
                'title': 'Inclusive Education Advocacy Toolkit',
                'description': 'Toolkit for advocating for inclusive education policies and practices.',
                'resource_type': 'TOOLKIT',
                'language': 'en',
                'external_url': 'https://example.com/advocacy-toolkit',
            },
            {
                'title': 'Teacher Professional Development for Inclusion',
                'description': 'Framework for professional development of teachers in inclusive education.',
                'resource_type': 'PUBLICATION',
                'language': 'en',
                'external_url': 'https://example.com/pd-framework',
            },
            {
                'title': 'Coteaching Models for Inclusive Classrooms',
                'description': 'Various coteaching models and their application in inclusive settings.',
                'resource_type': 'PUBLICATION',
                'language': 'en',
                'external_url': 'https://example.com/coteaching-models',
            },
        ]

        all_topics = list(Topic.objects.all())
        all_disability_types = list(DisabilityType.objects.all())

        for i, resource_data in enumerate(resources_data):
            # Check if resource already exists by title
            if Resource.objects.filter(title=resource_data['title']).exists():
                self.stdout.write(f'Resource already exists: {resource_data["title"]}')
                continue

            # Assign random topics and disability types
            resource_data['published_at'] = timezone.now() - timedelta(days=random.randint(1, 365))
            resource = Resource.objects.create(**resource_data)
            
            # Add 1-3 random topics
            random_topics = random.sample(all_topics, min(3, len(all_topics)))
            resource.topics.set(random_topics)
            
            # Add 1-2 random disability types
            random_dts = random.sample(all_disability_types, min(2, len(all_disability_types)))
            resource.disability_types.set(random_dts)
            
            self.stdout.write(f'Created resource {i+1}: {resource.title}')

        # Create News Articles
        news_data = [
            {
                'title': 'IE Hub Launches Platform for Inclusive Education in Africa',
                'slug': 'ie-hub-launch',
                'excerpt': 'The Inclusive Education Hub for Africa launches its digital platform to connect practitioners across the continent.',
                'content': 'The Inclusive Education Hub for Africa is proud to announce the launch of its digital platform...',
                'category': 'NEWS',
                'author_name': 'IE Hub Team',
                'published_at': timezone.now() - timedelta(days=7),
            },
            {
                'title': 'New Policy Framework for Inclusive Education Released',
                'slug': 'new-policy-framework',
                'excerpt': 'A comprehensive policy framework for inclusive education has been released by the steering committee.',
                'content': 'The steering committee has released a new policy framework that provides guidance...',
                'category': 'PRESS_RELEASE',
                'author_name': 'IE Hub Team',
                'published_at': timezone.now() - timedelta(days=14),
            },
        ]

        for news_item in news_data:
            if not NewsArticle.objects.filter(slug=news_item['slug']).exists():
                NewsArticle.objects.create(**news_item)
                self.stdout.write(f'Created news article: {news_item["title"]}')
            else:
                self.stdout.write(f'News article already exists: {news_item["title"]}')

        # Create Events
        events_data = [
            {
                'title': 'Inclusive Education Webinar Series',
                'description': 'Monthly webinar series on inclusive education topics.',
                'event_type': 'WEBINAR',
                'start_datetime': timezone.now() + timedelta(days=30),
                'end_datetime': timezone.now() + timedelta(days=30, hours=2),
                'location_type': 'ONLINE',
                'online_link': 'https://example.com/webinar',
                'is_members_only': False,
            },
            {
                'title': 'Regional Training Workshop: East Africa',
                'description': 'Face-to-face training workshop for East Africa region.',
                'event_type': 'WORKSHOP',
                'start_datetime': timezone.now() + timedelta(days=60),
                'end_datetime': timezone.now() + timedelta(days=62),
                'location_type': 'IN_PERSON',
                'location_address': 'Nairobi, Kenya',
                'is_members_only': True,
            },
        ]

        for event_item in events_data:
            if not Event.objects.filter(title=event_item['title']).exists():
                Event.objects.create(**event_item)
                self.stdout.write(f'Created event: {event_item["title"]}')
            else:
                self.stdout.write(f'Event already exists: {event_item["title"]}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded initial content!'))
