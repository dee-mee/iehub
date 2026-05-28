from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'role', 'is_verified', 'is_approved', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_approved', 'is_staff', 'is_superuser')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'organization', 'country')
    ordering = ('email',)

    fieldsets = UserAdmin.fieldsets + (
        (
            'IE Hub',
            {
                'fields': ('role', 'country', 'organization', 'is_verified', 'is_approved'),
            },
        ),
    )
