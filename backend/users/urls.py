from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.routers import DefaultRouter

from .views import (
    MeView, RegisterView,
    PendingMembersView, ApproveMemberView,
    MemberListView, MemberDetailView, ExpertiseTagListView,
    NotificationViewSet, CountryListView,
)

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='auth-register'),
    # path('verify-email/', VerifyEmailView.as_view(), name='auth-verify-email'),
    # path('resend-verification/', ResendVerificationView.as_view(), name='auth-resend-verification'),
    path('login/', TokenObtainPairView.as_view(), name='auth-login'),
    path('refresh/', TokenRefreshView.as_view(), name='auth-refresh'),
    path('me/', MeView.as_view(), name='auth-me'),

    # Public lookup lists
    path('countries/', CountryListView.as_view(), name='country-list'),
    path('expertise-tags/', ExpertiseTagListView.as_view(), name='expertise-tags'),

    # Directory endpoints
    path('directory/', MemberListView.as_view(), name='member-directory'),
    path('directory/<int:pk>/', MemberDetailView.as_view(), name='member-detail'),

    # Admin endpoints
    path('admin/pending/', PendingMembersView.as_view(), name='admin-pending-members'),
    path('admin/approve/<int:pk>/', ApproveMemberView.as_view(), name='admin-approve-member'),
]
