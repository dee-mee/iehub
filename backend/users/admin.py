from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Country, CustomUser, ExpertiseTag, MemberProfile, PendingMember


@admin.register(Country)
class CountryAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'region', 'lm_office', 'flag_emoji')
    list_filter = ('region', 'lm_office')
    search_fields = ('name', 'code')
    ordering = ('name',)


@admin.register(ExpertiseTag)
class ExpertiseTagAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


class MemberProfileInline(admin.StackedInline):
    model = MemberProfile
    can_delete = False
    verbose_name_plural = 'Member Profile'
    filter_horizontal = ('expertise_areas', 'countries_of_work')


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ('email', 'username', 'role', 'country', 'is_verified', 'is_approved', 'is_staff')
    list_filter = ('role', 'is_verified', 'is_approved', 'is_staff', 'is_superuser', 'country')
    search_fields = ('email', 'username', 'first_name', 'last_name', 'organization')
    actions = ['approve_members', 'reject_members']
    ordering = ('email',)
    inlines = (MemberProfileInline,)

    # Fields shown when EDITING an existing user
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name')}),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('IE Hub Profile', {
            'fields': (
                'role', 'country', 'organization', 'organization_type',
                'professional_title', 'bio', 'how_heard', 'is_verified', 'is_approved',
            ),
        }),
    )

    # Fields shown when ADDING a new user — email is the USERNAME_FIELD so must be here
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'first_name', 'last_name', 'password1', 'password2'),
        }),
        ('IE Hub Profile', {
            'classes': ('wide',),
            'fields': ('role', 'country', 'organization', 'is_verified', 'is_approved'),
        }),
    )

    def approve_members(self, request, queryset):
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} members successfully approved.")
    approve_members.short_description = "Approve selected members"

    def reject_members(self, request, queryset):
        updated = queryset.update(is_approved=False)
        self.message_user(request, f"{updated} members successfully rejected/suspended.")
    reject_members.short_description = "Reject/Suspend selected members"


@admin.register(PendingMember)
class PendingMemberAdmin(CustomUserAdmin):
    """Dedicated view for unapproved members."""
    def get_queryset(self, request):
        return super().get_queryset(request).filter(is_approved=False, is_superuser=False)

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['title'] = 'Pending Member Approvals'
        return super().changelist_view(request, extra_context=extra_context)


@admin.register(MemberProfile)
class MemberProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_visible_in_directory')
    list_filter = ('is_visible_in_directory', 'expertise_areas', 'countries_of_work')
    search_fields = ('user__email', 'user__username')
    filter_horizontal = ('expertise_areas', 'countries_of_work')
