"""
Forum URL Configuration - REST API endpoint routing
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for viewsets
router = DefaultRouter()
router.register(r'categories', views.ForumCategoryViewSet, basename='category')
router.register(r'threads', views.ForumThreadViewSet, basename='thread')
router.register(r'posts', views.ForumPostViewSet, basename='post')
router.register(r'tags', views.ForumTagViewSet, basename='tag')
router.register(r'reputation', views.UserReputationViewSet, basename='reputation')
router.register(r'badges', views.BadgeViewSet, basename='badge')
router.register(r'reports', views.ForumReportViewSet, basename='report')
router.register(r'notifications', views.ForumNotificationViewSet, basename='notification')
router.register(r'messages', views.PrivateMessageViewSet, basename='message')
router.register(r'stats', views.ForumStatsViewSet, basename='stats')

app_name = 'forum'

urlpatterns = [
    path('', include(router.urls)),
]

"""
API ENDPOINTS REFERENCE:

CATEGORIES:
  GET  /api/forum/categories/                    - List all categories
  POST /api/forum/categories/                    - Create category (staff only)
  GET  /api/forum/categories/{id}/               - Category details
  GET  /api/forum/categories/{id}/threads/       - Threads in category
  GET  /api/forum/categories/popular/            - Popular categories

THREADS:
  GET  /api/forum/threads/                       - List threads (with filtering)
  POST /api/forum/threads/                       - Create thread
  GET  /api/forum/threads/{id}/                  - Thread details
  PUT  /api/forum/threads/{id}/                  - Update thread (owner)
  DELETE /api/forum/threads/{id}/                - Delete thread (owner/staff)
  GET  /api/forum/threads/{id}/posts/            - Get posts in thread
  POST /api/forum/threads/{id}/mark_solved/      - Mark post as solution
  POST /api/forum/threads/{id}/subscribe/        - Subscribe to thread
  POST /api/forum/threads/{id}/unsubscribe/      - Unsubscribe from thread
  GET  /api/forum/threads/{id}/search_posts/     - Search posts in thread

POSTS:
  GET  /api/forum/posts/                         - List posts
  POST /api/forum/posts/                         - Create post
  GET  /api/forum/posts/{id}/                    - Post details
  PUT  /api/forum/posts/{id}/                    - Edit post
  DELETE /api/forum/posts/{id}/                  - Delete post
  POST /api/forum/posts/{id}/react/              - Add reaction (like/insightful/etc)
  POST /api/forum/posts/{id}/unreact/            - Remove reaction
  POST /api/forum/posts/{id}/flag/               - Flag post for review

TAGS:
  GET  /api/forum/tags/                          - List all tags
  GET  /api/forum/tags/{id}/                     - Tag details
  GET  /api/forum/tags/{id}/threads/             - Threads with tag

REPUTATION:
  GET  /api/forum/reputation/                    - All users leaderboard
  GET  /api/forum/reputation/leaderboard/        - Top 10 users
  GET  /api/forum/reputation/my_reputation/      - Current user's reputation

BADGES:
  GET  /api/forum/badges/                        - All available badges
  GET  /api/forum/badges/{id}/                   - Badge details
  GET  /api/forum/badges/user_badges/            - Current user's badges

REPORTS:
  GET  /api/forum/reports/                       - List reports
  POST /api/forum/reports/                       - Create report
  GET  /api/forum/reports/{id}/                  - Report details
  POST /api/forum/reports/{id}/review/           - Review report (mod)

NOTIFICATIONS:
  GET  /api/forum/notifications/                 - All notifications
  GET  /api/forum/notifications/unread/          - Unread notifications
  POST /api/forum/notifications/{id}/mark_read/  - Mark as read
  POST /api/forum/notifications/mark_all_read/   - Mark all as read

STATS:
  GET  /api/forum/stats/                         - All stats
  GET  /api/forum/stats/latest/                  - Latest day stats
  GET  /api/forum/stats/overview/                - Forum overview

QUERY PARAMETERS:

Categories:
  - category_type: COUNTRY, THEMATIC, GENERAL, ANNOUNCEMENT, EXPERT_ONLY
  - country: Country ID
  - topic: Topic ID
  - ordering: order, name, -last_activity

Threads:
  - category: Category ID
  - status: OPEN, CLOSED, SOLVED, LOCKED, ARCHIVED
  - is_pinned: true/false
  - is_announcement: true/false
  - search: Search in title/description/author
  - ordering: created_at, view_count, -last_activity
  - page: Page number
  - page_size: Items per page (default 20)

Posts:
  - thread: Thread ID
  - approval_status: PENDING, APPROVED, REJECTED, FLAGGED
  - ordering: created_at, helpful_count
  - page: Page number

Reputation:
  - ordering: -points, solutions_provided, current_streak

Reports:
  - status: PENDING, INVESTIGATING, RESOLVED, DISMISSED, ESCALATED
  - reason: SPAM, HARASSMENT, MISINFORMATION, OFFENSIVE, COPYRIGHT, OTHER

Notifications:
  - page: Page number
  - page_size: Items per page

EXAMPLE USAGE:

# Get active discussions from last 7 days
GET /api/forum/threads/?status=OPEN&ordering=-last_activity

# Search for threads about Python
GET /api/forum/threads/?search=Python&category=2

# Get a user's leaderboard position
GET /api/forum/reputation/leaderboard/

# Create a new thread
POST /api/forum/threads/
{
  "title": "Best practices for forum moderation",
  "description": "Discussion about...",
  "category": 1,
  "tags": [1, 3, 5]
}

# React to a post
POST /api/forum/posts/42/react/
{
  "reaction_type": "INSIGHTFUL"
}

# Flag a post for review
POST /api/forum/posts/42/flag/
{
  "reason": "HARASSMENT",
  "description": "This post contains offensive language"
}

# Subscribe to thread updates
POST /api/forum/threads/1/subscribe/
{
  "notification_level": "ALL"
}

# Mark a post as the solution
POST /api/forum/threads/1/mark_solved/
{
  "post_id": 42
}
"""
