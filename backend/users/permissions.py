from rest_framework import permissions
from .models import CustomUser

class IsSuperAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.Role.SUPER_ADMIN

class IsSteeringCommittee(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.Role.STEERING_COMMITTEE

class IsRegionalAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.Role.REGIONAL_ADMIN

class IsPlatformAdmin(permissions.BasePermission):
    """
    Allows access to Super Admin, Steering Committee, and Regional Admin.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        return request.user.role in [
            CustomUser.Role.SUPER_ADMIN,
            CustomUser.Role.STEERING_COMMITTEE,
            CustomUser.Role.REGIONAL_ADMIN,
        ]

class IsApprovedMember(permissions.BasePermission):
    """
    Allows access to approved and verified members, as well as platform admins.
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        if request.user.role in [
            CustomUser.Role.SUPER_ADMIN,
            CustomUser.Role.STEERING_COMMITTEE,
            CustomUser.Role.REGIONAL_ADMIN,
        ]:
            return True
        return request.user.is_verified and request.user.is_approved
