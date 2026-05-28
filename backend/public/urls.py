from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ContactMessageViewSet, EventViewSet, NewsArticleViewSet, ResourceViewSet

router = DefaultRouter()
router.register(r'resources', ResourceViewSet, basename='resource')
router.register(r'news', NewsArticleViewSet, basename='news-article')
router.register(r'events', EventViewSet, basename='event')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-message')

urlpatterns = [
    path('', include(router.urls)),
]
