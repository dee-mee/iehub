from django.contrib.auth import get_user_model
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Country, CustomUser, ExpertiseTag, Notification
from .serializers import (
    CountrySerializer,
    RegisterSerializer, UserMeSerializer, UserUpdateSerializer,
    ExpertiseTagSerializer, NotificationSerializer
)
from .permissions import IsPlatformAdmin

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):  # noqa: ANN001
        serializer = UserMeSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(UserMeSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token_uuid = request.data.get('token')
        if not token_uuid:
            return Response({'error': 'Token is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            verification_token = EmailVerificationToken.objects.get(token=token_uuid)
            if not verification_token.is_valid():
                return Response({'error': 'Token has expired'}, status=status.HTTP_400_BAD_REQUEST)
            
            user = verification_token.user
            user.is_verified = True
            user.save()
            
            # Delete token after successful verification
            verification_token.delete()
            
            return Response({'message': 'Email verified successfully'}, status=status.HTTP_200_OK)
        except EmailVerificationToken.DoesNotExist:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class ResendVerificationView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(email=email)
            if user.is_verified:
                return Response({'message': 'Email is already verified'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Delete old token if exists
            EmailVerificationToken.objects.filter(user=user).delete()
            
            # Create new token
            EmailVerificationToken.objects.create(user=user)
            
            # TODO: Send email here using Celery
            
            return Response({'message': 'Verification email resent'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'message': 'If an account exists with this email, a verification link has been sent'}, status=status.HTTP_200_OK)
"""


class PendingMembersView(generics.ListAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [IsPlatformAdmin]

    def get_queryset(self):
        return User.objects.filter(is_approved=False).order_by('-date_joined')


class ApproveMemberView(APIView):
    permission_classes = [IsPlatformAdmin]

    def post(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
            action = request.data.get('action')
            
            if action == 'approve':
                user.is_approved = True
                user.save()
                
                # Create notification
                Notification.objects.create(
                    user=user,
                    notification_type=Notification.NotificationType.MEMBER_APPROVAL,
                    title="Account Approved!",
                    message="Welcome to the Community of Practice! Your account has been approved.",
                    link="/dashboard"
                )
                
                return Response({'message': f'Member {user.email} approved successfully'}, status=status.HTTP_200_OK)
            elif action == 'reject':
                user.delete()
                return Response({'message': f'Member registration rejected'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid action. Use "approve" or "reject"'}, status=status.HTTP_400_BAD_REQUEST)
                
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class MemberListView(generics.ListAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['country', 'organization_type', 'role']
    search_fields = ['first_name', 'last_name', 'organization', 'professional_title']
    ordering_fields = ['first_name', 'last_name', 'date_joined']

    def get_queryset(self):
        # Only approved members who want to be visible
        return User.objects.filter(
            is_approved=True,
            profile__is_visible_in_directory=True
        ).select_related('profile', 'country').order_by('first_name')


class MemberDetailView(generics.RetrieveAPIView):
    serializer_class = UserMeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(is_approved=True).select_related('profile', 'country')


class ExpertiseTagListView(generics.ListAPIView):
    queryset = ExpertiseTag.objects.all()
    serializer_class = ExpertiseTagSerializer
    permission_classes = [permissions.AllowAny]


class NotificationViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        count = self.get_queryset().filter(is_read=False).count()
        return Response({'count': count})

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        return Response({'status': 'marked as read'})


class CountryListView(generics.ListAPIView):
    """Public endpoint — lists all seeded African countries."""
    serializer_class = CountrySerializer
    queryset = Country.objects.all().order_by('name')
    permission_classes = []  # public, no auth required
