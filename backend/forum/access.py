"""Forum access helpers — approval, roles, and expertise-based categories."""

from django.db.models import Q


def user_is_platform_admin(user) -> bool:
    if not user.is_authenticated:
        return False
    if user.is_staff or user.is_superuser:
        return True
    return user.role in ('SUPER_ADMIN', 'STEERING_COMMITTEE', 'REGIONAL_ADMIN')


def user_is_approved_member(user) -> bool:
    if not user.is_authenticated:
        return False
    if user_is_platform_admin(user):
        return True
    return bool(user.is_verified and user.is_approved)


def user_expertise_slugs(user) -> set[str]:
    if not user.is_authenticated or not hasattr(user, 'profile'):
        return set()
    return set(user.profile.expertise_areas.values_list('slug', flat=True))


def user_can_access_category(user, category) -> bool:
    """Whether the user may view/post in a category."""
    if category.is_archived:
        return user_is_platform_admin(user)

    if not category.is_private:
        if category.category_type != category.CategoryType.EXPERT_ONLY:
            return True
    elif not user.is_authenticated:
        return False

    if not user_is_approved_member(user):
        return False

    if category.category_type == category.CategoryType.EXPERT_ONLY:
        if user_is_platform_admin(user):
            return True
        slugs = user_expertise_slugs(user)
        if not slugs:
            return False
        return category.slug in slugs or any(
            slug in category.slug or category.slug in slug for slug in slugs
        )

    return True


def filter_categories_for_user(queryset, user):
    if not user.is_authenticated:
        return queryset.filter(is_private=False).exclude(
            category_type='EXPERT_ONLY'
        )

    if user_is_platform_admin(user):
        return queryset

    if not user_is_approved_member(user):
        return queryset.none()

    allowed_ids = [c.id for c in queryset if user_can_access_category(user, c)]
    return queryset.filter(id__in=allowed_ids)
