from rest_framework import mixins, status, viewsets
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Count, Sum
from forum.models import ForumThread, ForumPost, ForumReaction
from users.models import CustomUser
from users.permissions import IsPlatformAdmin

from .models import ContactMessage, DisabilityType, Event, NewsArticle, Resource, Topic, Donation
from .serializers import (
    ContactMessageSerializer,
    DisabilityTypeSerializer,
    EventSerializer,
    NewsArticleSerializer,
    ResourceSerializer,
    TopicSerializer,
    DonationSerializer
)


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class DisabilityTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DisabilityType.objects.all()
    serializer_class = DisabilityTypeSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'


class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'resource_type']
    ordering_fields = ['published_at', 'download_count', 'title']
    ordering = ['-published_at']

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated:
            # Public users only see PUBLIC resources
            queryset = queryset.filter(access_level=Resource.AccessLevel.PUBLIC)
        return queryset

    @action(detail=True, methods=['post'], permission_classes=[AllowAny], url_path='download')
    def download(self, request, pk=None):  # noqa: ANN001
        resource = self.get_object()
        resource.download_count += 1
        resource.save(update_fields=['download_count', 'updated_at'])
        return Response({'status': 'download count incremented'})


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'excerpt', 'content']
    ordering_fields = ['published_at', 'title']
    ordering = ['-published_at']


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'event_type', 'location_type']
    ordering_fields = ['start_datetime', 'title']
    ordering = ['start_datetime']


class ContactMessageViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]


class PlatformAnalyticsView(APIView):
    permission_classes = [IsPlatformAdmin]

    def get(self, request):
        # Member Stats
        total_members = CustomUser.objects.count()
        verified_members = CustomUser.objects.filter(is_verified=True).count()
        approved_members = CustomUser.objects.filter(is_approved=True).count()
        
        # Content Stats
        total_resources = Resource.objects.count()
        public_resources = Resource.objects.filter(access_level=Resource.AccessLevel.PUBLIC).count()
        private_resources = Resource.objects.filter(access_level=Resource.AccessLevel.MEMBERS_ONLY).count()
        total_downloads = Resource.objects.aggregate(total=Sum('download_count'))['total'] or 0
        
        # Forum Stats
        total_threads = ForumThread.objects.count()
        total_posts = ForumPost.objects.count()
        total_reactions = ForumReaction.objects.count()
        
        # Regional Breakdown
        members_by_country = CustomUser.objects.values('country').annotate(count=Count('id')).order_by('-count')

        return Response({
            'members': {
                'total': total_members,
                'verified': verified_members,
                'approved': approved_members,
            },
            'content': {
                'resources': total_resources,
                'public_resources': public_resources,
                'private_resources': private_resources,
                'downloads': total_downloads,
            },
            'forum': {
                'threads': total_threads,
                'posts': total_posts,
                'reactions': total_reactions,
            },
            'regional': members_by_country
        })


class DonationViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Donation.objects.all()
        return Donation.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        serializer.save(user=user)
