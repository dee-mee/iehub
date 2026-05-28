from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import ContactMessage, DisabilityType, Event, NewsArticle, Resource, Topic
from .serializers import (
    ContactMessageSerializer,
    DisabilityTypeSerializer,
    EventSerializer,
    NewsArticleSerializer,
    ResourceSerializer,
    TopicSerializer,
)


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name']
    ordering = ['name']


class DisabilityTypeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DisabilityType.objects.all()
    serializer_class = DisabilityTypeSerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name']
    ordering_fields = ['name']
    ordering = ['name']


class ResourceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Resource.objects.all()
    serializer_class = ResourceSerializer
    permission_classes = [AllowAny]
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'description', 'resource_type']
    ordering_fields = ['published_at', 'download_count', 'title']
    ordering = ['-published_at']

    @action(detail=True, methods=['post'], permission_classes=[AllowAny], url_path='download')
    def download(self, request, pk=None):  # noqa: ANN001
        resource = self.get_object()
        resource.download_count += 1
        resource.save(update_fields=['download_count', 'updated_at'])
        return Response(
            {
                'id': resource.id,
                'download_count': resource.download_count,
                'file_url': resource.file.url if resource.file else None,
                'external_url': resource.external_url,
            },
            status=status.HTTP_200_OK,
        )


class NewsArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = NewsArticle.objects.all()
    serializer_class = NewsArticleSerializer
    permission_classes = [AllowAny]
    lookup_field = 'slug'
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['title', 'excerpt', 'content', 'category']
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
