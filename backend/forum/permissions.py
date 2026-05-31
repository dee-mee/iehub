"""
Forum Permission Classes - Custom permissions for forum access and moderation
"""

from django.utils import timezone
from rest_framework import permissions

from .access import user_can_access_category, user_is_approved_member, user_is_platform_admin


class IsApprovedMember(permissions.BasePermission):
    """Approved, verified members (and platform admins) may use the forum."""

    message = 'Your membership must be approved before you can access the forum.'

    def has_permission(self, request, view):
        return user_is_approved_member(request.user)


class IsApprovedMemberOrReadOnly(permissions.BasePermission):
    """Public read for open content; writes require approved membership."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return user_is_approved_member(request.user)


class IsModeratorOrReadOnly(permissions.BasePermission):
    """Only moderators of a category can edit or delete it."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'moderators'):
            return obj.moderators.filter(id=request.user.id).exists() or request.user.is_staff
        return request.user.is_staff


class CanModifyOwnContent(permissions.BasePermission):
    """Users can modify their own forum content."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff


class CanDeleteOwnPost(permissions.BasePermission):
    """Users can delete their own posts; staff can delete any."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if obj.author == request.user:
            return True
        return request.user.is_staff or request.user.is_superuser


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Only owners may edit their content."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user or request.user.is_staff


class IsPlatformModerator(permissions.BasePermission):
    """Staff or platform admin roles."""

    def has_permission(self, request, view):
        return user_is_platform_admin(request.user)


class CanPostInCategory(permissions.BasePermission):
    """Respect archived, private, banned, and expertise-only categories."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return user_can_access_category(request.user, obj)
        if obj.is_archived:
            return False
        if not user_is_approved_member(request.user):
            return False
        if not user_can_access_category(request.user, obj):
            return False
        if request.user.is_staff:
            return True
        try:
            reputation = request.user.forum_reputation
            if reputation.is_banned:
                if reputation.ban_until and reputation.ban_until < timezone.now():
                    return True
                return False
        except Exception:
            pass
        return True


class CanApproveContent(permissions.BasePermission):
    """Category moderators and staff may approve content."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'category'):
            return obj.category.moderators.filter(id=request.user.id).exists() or request.user.is_staff
        if hasattr(obj, 'thread'):
            return obj.thread.category.moderators.filter(id=request.user.id).exists() or request.user.is_staff
        return request.user.is_staff
