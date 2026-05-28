from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    ContactMessageViewSet,
    DisabilityTypeViewSet,
    EventViewSet,
    NewsArticleViewSet,
    ResourceViewSet,
    TopicViewSet,
    PlatformAnalyticsView,
    DonationViewSet
)

router = DefaultRouter()
router.register(r'topics', TopicViewSet, basename='topic')
router.register(r'disability-types', DisabilityTypeViewSet, basename='disability-type')
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'news', NewsArticleViewSet, basename='news-article')
router.register(r'events', EventViewSet, basename='event')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')
router.register(r'donations', DonationViewSet, basename='donation')

urlpatterns = [
    path('analytics/', PlatformAnalyticsView.as_view(), name='platform-analytics'),
    path('', include(router.urls)),
]
