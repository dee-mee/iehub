from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone
from django.utils.text import slugify

from public.models import DisabilityType, Event, NewsArticle, Resource, Topic, Donation
from users.models import ExpertiseTag


class Command(BaseCommand):
    help = 'Seed starter data for public website APIs.'

    def handle(self, *args, **options):  # noqa: ANN002, ANN003
        now = timezone.now()

        # 0. Seed Expertise Tags
        expertise_data = [
            'Inclusive Pedagogy', 'UDL Implementation', 'Policy Development',
            'Assistive Technology', 'Disability Rights', 'Sign Language',
            'Braille Literacy', 'Community-Based Rehabilitation',
            'Education in Emergencies', 'Early Childhood Development',
            'Monitoring & Evaluation', 'Grant Writing', 'Teacher Training'
        ]
        for tag_name in expertise_data:
            ExpertiseTag.objects.get_or_create(
                slug=slugify(tag_name),
                defaults={'name': tag_name}
            )
        self.stdout.write(self.style.SUCCESS('Expertise tags seeded.'))

        # 1. Seed Topics
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

        topic_objects = {}
        for topic_data in topics_data:
            topic, _ = Topic.objects.update_or_create(
                slug=topic_data['slug'],
                defaults=topic_data
            )
            topic_objects[topic.name] = topic

        # 2. Seed Disability Types
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

        dt_objects = {}
        for dt_data in disability_types_data:
            dt, _ = DisabilityType.objects.update_or_create(
                slug=dt_data['slug'],
                defaults=dt_data
            )
            dt_objects[dt.name] = dt

        # 3. Seed Resources
        resources_data = [
            {
                'title': 'Inclusive Education Policy Framework for Africa',
                'description': 'A comprehensive reference for ministries and educational bodies developing inclusive education policies across the continent.',
                'resource_type': Resource.ResourceType.POLICY_BRIEF,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Policy and Advocacy'],
                'disability_types': [],
                'published_at': now - timedelta(days=40),
                'download_count': 342,
                'is_featured': True,
            },
            {
                'title': 'Teacher Toolkit: Universal Design for Learning (UDL)',
                'description': 'Practical classroom strategies, lesson plans, and case studies from East Africa on implementing UDL.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Teacher Training'],
                'disability_types': ['Learning Disabilities'],
                'published_at': now - timedelta(days=60),
                'download_count': 518,
                'is_featured': True,
            },
            {
                'title': 'Regional Inclusive Education Strategy (Internal)',
                'description': 'Internal coordination strategy for steering committee members and LM country offices.',
                'resource_type': Resource.ResourceType.REPORT,
                'access_level': Resource.AccessLevel.MEMBERS_ONLY,
                'language': 'en',
                'topics': ['Policy and Advocacy'],
                'disability_types': [],
                'published_at': now - timedelta(days=10),
                'download_count': 12,
                'is_featured': False,
            },
            {
                'title': 'Assistive Technology in Low-Resource Settings',
                'description': 'A guide to affordable assistive technology solutions for schools in sub-Saharan Africa.',
                'resource_type': Resource.ResourceType.RESEARCH,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Assistive Technology'],
                'disability_types': ['Visual Impairment', 'Hearing Impairment', 'Mobility Impairment'],
                'published_at': now - timedelta(days=15),
                'download_count': 125,
                'is_featured': False,
            },
            {
                'title': 'Gender-Responsive Inclusive Education Toolkit',
                'description': 'Ensuring girls with disabilities have equal access to quality education.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Gender and Inclusion'],
                'disability_types': [],
                'published_at': now - timedelta(days=25),
                'download_count': 89,
                'is_featured': False,
            },
            {
                'title': 'Education in Emergencies: Inclusive Approaches',
                'description': 'Best practices for ensuring education for children with disabilities in conflict and disaster zones.',
                'resource_type': Resource.ResourceType.REPORT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Education in Emergencies'],
                'disability_types': [],
                'published_at': now - timedelta(days=5),
                'download_count': 45,
                'is_featured': True,
            },
            {
                'title': 'Early Childhood Inclusive Education: A Guide for Parents',
                'description': 'Resources and guidance for parents of young children with disabilities.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Early Childhood'],
                'disability_types': ['Autism Spectrum', 'Cerebral Palsy'],
                'published_at': now - timedelta(days=50),
                'download_count': 210,
                'is_featured': False,
            },
            {
                'title': 'OPD-Government Collaboration Framework',
                'description': 'How Organizations of Persons with Disabilities can effectively partner with governments.',
                'resource_type': Resource.ResourceType.POLICY_BRIEF,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['OPD Collaboration'],
                'disability_types': [],
                'published_at': now - timedelta(days=30),
                'download_count': 67,
                'is_featured': False,
            },
            {
                'title': 'African Research on Sign Language in Schools',
                'description': 'Evidence-based research on the impact of sign language instruction in primary schools.',
                'resource_type': Resource.ResourceType.RESEARCH,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Research and Evidence'],
                'disability_types': ['Hearing Impairment'],
                'published_at': now - timedelta(days=12),
                'download_count': 156,
                'is_featured': False,
            },
            {
                'title': 'Accessible Web Design for Educational Platforms',
                'description': 'Guidelines for creating accessible digital learning materials.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Assistive Technology'],
                'disability_types': ['Visual Impairment', 'Learning Disabilities'],
                'published_at': now - timedelta(days=22),
                'download_count': 92,
                'is_featured': False,
            },
            {
                'title': 'Advocacy for Inclusive Education Funding',
                'description': 'A toolkit for CSOs to advocate for increased budget allocation for inclusive education.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Policy and Advocacy'],
                'disability_types': [],
                'published_at': now - timedelta(days=18),
                'download_count': 78,
                'is_featured': False,
            },
            {
                'title': 'Supporting Students with Albinism in the Classroom',
                'description': 'Practical tips for teachers to support students with albinism.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Teacher Training'],
                'disability_types': ['Albinism', 'Visual Impairment'],
                'published_at': now - timedelta(days=45),
                'download_count': 134,
                'is_featured': False,
            },
            {
                'title': 'Inclusive Sport and Physical Education',
                'description': 'Ensuring students with mobility impairments can participate in sports.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Teacher Training'],
                'disability_types': ['Mobility Impairment'],
                'published_at': now - timedelta(days=55),
                'download_count': 42,
                'is_featured': False,
            },
            {
                'title': 'Braille Literacy Program: Best Practices',
                'description': 'Review of successful Braille literacy programs in Southern Africa.',
                'resource_type': Resource.ResourceType.REPORT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Resource Sharing'],
                'disability_types': ['Visual Impairment'],
                'published_at': now - timedelta(days=35),
                'download_count': 88,
                'is_featured': False,
            },
            {
                'title': 'Mental Health and Well-being in Inclusive Schools',
                'description': 'Strategies for supporting the mental health of students with disabilities.',
                'resource_type': Resource.ResourceType.REPORT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Early Childhood', 'Teacher Training'],
                'disability_types': ['Intellectual Disability', 'Autism Spectrum'],
                'published_at': now - timedelta(days=8),
                'download_count': 56,
                'is_featured': False,
            },
            {
                'title': 'Global Monitoring Report on Inclusive Education',
                'description': 'Africa chapter of the 2025 global report on inclusive education progress.',
                'resource_type': Resource.ResourceType.PUBLICATION,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Research and Evidence'],
                'disability_types': [],
                'published_at': now - timedelta(days=100),
                'download_count': 842,
                'is_featured': False,
            },
            {
                'title': 'Teacher Training Curriculum for Inclusive Education',
                'description': 'Standardized curriculum for pre-service teacher training in West Africa.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Teacher Training'],
                'disability_types': [],
                'published_at': now - timedelta(days=70),
                'download_count': 234,
                'is_featured': False,
            },
            {
                'title': 'Community-Based Rehabilitation and Education',
                'description': 'Linking community health services with local schools for better inclusion.',
                'resource_type': Resource.ResourceType.REPORT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Early Childhood', 'OPD Collaboration'],
                'disability_types': ['Mobility Impairment', 'Cerebral Palsy'],
                'published_at': now - timedelta(days=65),
                'download_count': 112,
                'is_featured': False,
            },
            {
                'title': 'Inclusive Vocational Training Guide',
                'description': 'Preparing youth with disabilities for the workforce through inclusive TVET.',
                'resource_type': Resource.ResourceType.TOOLKIT,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Gender and Inclusion', 'Resource Sharing'],
                'disability_types': ['Intellectual Disability', 'Hearing Impairment'],
                'published_at': now - timedelta(days=42),
                'download_count': 95,
                'is_featured': False,
            },
            {
                'title': 'The Economic Impact of Inclusive Education',
                'description': 'Research paper on the long-term economic benefits of investing in inclusive education.',
                'resource_type': Resource.ResourceType.RESEARCH,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Research and Evidence', 'Policy and Advocacy'],
                'disability_types': [],
                'published_at': now - timedelta(days=28),
                'download_count': 178,
                'is_featured': False,
            },
            {
                'title': 'Video: Inclusive Education in Action - Case Study Chad',
                'description': 'A short documentary showing a successful inclusive school in Chad.',
                'resource_type': Resource.ResourceType.VIDEO,
                'access_level': Resource.AccessLevel.PUBLIC,
                'language': 'en',
                'topics': ['Research and Evidence'],
                'disability_types': [],
                'published_at': now - timedelta(days=3),
                'download_count': 25,
                'is_featured': False,
            },
        ]

        for data in resources_data:
            topics_names = data.pop('topics', [])
            dt_names = data.pop('disability_types', [])
            
            resource, created = Resource.objects.update_or_create(
                title=data['title'],
                defaults=data,
            )
            
            if topics_names:
                topics = [topic_objects[name] for name in topics_names if name in topic_objects]
                resource.topics.set(topics)
            
            if dt_names:
                dts = [dt_objects[name] for name in dt_names if name in dt_objects]
                resource.disability_types.set(dts)

        # 4. Seed News Articles
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
        ]

        for article in articles:
            slug = slugify(article['title'])
            NewsArticle.objects.update_or_create(
                slug=slug,
                defaults=article,
            )

        # 5. Seed Donations
        donations = [
            {'full_name': 'Global Education Trust', 'email': 'info@globaledu.org', 'amount': 1500, 'status': Donation.Status.SUCCESS, 'ref': 'SEED-001'},
            {'full_name': 'Anonymous Donor', 'email': 'donor@example.com', 'amount': 50, 'status': Donation.Status.SUCCESS, 'ref': 'SEED-002', 'anon': True},
            {'full_name': 'Local Business Group', 'email': 'csr@localbiz.co.ke', 'amount': 250, 'status': Donation.Status.SUCCESS, 'ref': 'SEED-003'},
        ]

        for don in donations:
            Donation.objects.get_or_create(
                transaction_reference=don['ref'],
                defaults={
                    'full_name': don['full_name'],
                    'email': don['email'],
                    'amount': don['amount'],
                    'currency': 'USD',
                    'status': don['status'],
                    'is_anonymous': don.get('anon', False)
                }
            )

        self.stdout.write(self.style.SUCCESS('Public website seed data refreshed with members-only content and donations.'))
