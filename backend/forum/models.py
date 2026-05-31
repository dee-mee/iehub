"""
Production-Ready Forum System - Enhanced Models
Includes: Badges, Reputation, Moderation, Time-based Events, Analytics
Built for real-world use cases with event tracking and actions
"""

from django.db import models
from django.conf import settings
from django.utils import timezone
from django.db.models import Q, F, Count
from public.models import TimestampedModel, Topic
from users.models import Country
from django_ckeditor_5.fields import CKEditor5Field
from django.core.validators import MinValueValidator, MaxValueValidator
from datetime import timedelta


# ============================================================================
# 1. FORUM CATEGORIES & SECTIONS
# ============================================================================

class ForumCategory(TimestampedModel):
    """Main forum categories with moderation and access control"""
    
    class CategoryType(models.TextChoices):
        COUNTRY = 'COUNTRY', 'Country Group'
        THEMATIC = 'THEMATIC', 'Thematic Group'
        GENERAL = 'GENERAL', 'General Group'
        ANNOUNCEMENT = 'ANNOUNCEMENT', 'Announcement'
        EXPERT_ONLY = 'EXPERT_ONLY', 'Expert Discussion'

    # Basic Info
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True, default='')
    category_type = models.CharField(max_length=32, choices=CategoryType.choices)
    
    # Relations
    country = models.ForeignKey(
        Country, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='forum_categories'
    )
    topic = models.ForeignKey(
        Topic, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='forum_categories'
    )
    parent_category = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='subcategories'
    )
    
    # Display
    icon = models.CharField(max_length=50, blank=True, default='')
    order = models.PositiveIntegerField(default=0)
    color_tag = models.CharField(max_length=7, default='#007bff')  # Hex color
    
    # Access Control
    is_private = models.BooleanField(default=True)  # Members only
    requires_approval = models.BooleanField(default=False)  # Posts need approval
    is_archived = models.BooleanField(default=False)  # Read-only
    moderators = models.ManyToManyField(
        settings.AUTH_USER_MODEL, 
        blank=True, 
        related_name='moderated_categories'
    )
    
    # Analytics
    thread_count = models.PositiveIntegerField(default=0)
    post_count = models.PositiveIntegerField(default=0)
    last_activity = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name_plural = 'forum categories'
        ordering = ['order', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category_type']),
            models.Index(fields=['-last_activity']),
        ]

    def __str__(self) -> str:
        return self.name

    def get_stats(self):
        """Get category statistics"""
        return {
            'threads': self.threads.count(),
            'posts': self.threads.aggregate(Count('posts'))['posts__count'] or 0,
            'views': self.threads.aggregate(models.Sum('view_count'))['view_count__sum'] or 0,
        }


# ============================================================================
# 2. FORUM THREADS & POSTS
# ============================================================================

class ForumThread(TimestampedModel):
    """Discussion threads with enhanced tracking"""
    
    class Status(models.TextChoices):
        OPEN = 'OPEN', 'Open'
        CLOSED = 'CLOSED', 'Closed'
        SOLVED = 'SOLVED', 'Solved'
        LOCKED = 'LOCKED', 'Locked by Moderator'
        ARCHIVED = 'ARCHIVED', 'Archived'

    # Basic Info
    category = models.ForeignKey(
        ForumCategory, 
        on_delete=models.CASCADE, 
        related_name='threads'
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(blank=True, help_text="Brief description of the topic")
    
    # Author & Status
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='forum_threads'
    )
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.OPEN)
    
    # Thread Tags
    tags = models.ManyToManyField('ForumTag', blank=True, related_name='threads')
    
    # Visibility
    is_pinned = models.BooleanField(default=False)
    is_announcement = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    
    # Moderation
    is_approved = models.BooleanField(default=True)
    flagged_reason = models.CharField(max_length=255, blank=True)
    
    # Analytics
    view_count = models.PositiveIntegerField(default=0)
    reply_count = models.PositiveIntegerField(default=0)
    solution_post = models.ForeignKey(
        'ForumPost',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )
    last_activity = models.DateTimeField(auto_now_add=True)
    last_activity_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )

    class Meta:
        ordering = ['-is_pinned', '-is_featured', '-last_activity']
        indexes = [
            models.Index(fields=['category', '-created_at']),
            models.Index(fields=['slug']),
            models.Index(fields=['status']),
            models.Index(fields=['-view_count']),
        ]

    def __str__(self) -> str:
        return self.title

    def mark_solved(self, post):
        """Mark a thread as solved"""
        self.status = self.Status.SOLVED
        self.solution_post = post
        self.save()
        # Award points to solution author
        post.author.profile.add_reputation(25, "Marked as solution")

    def increase_views(self, user=None):
        """Increment view count"""
        self.view_count = F('view_count') + 1
        self.save(update_fields=['view_count'])


class ForumPost(TimestampedModel):
    """Forum posts with moderation and reactions"""
    
    class ApprovalStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Approval'
        APPROVED = 'APPROVED', 'Approved'
        REJECTED = 'REJECTED', 'Rejected'
        FLAGGED = 'FLAGGED', 'Flagged for Review'

    # Basic Info
    thread = models.ForeignKey(
        ForumThread, 
        on_delete=models.CASCADE, 
        related_name='posts'
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='forum_posts'
    )
    content = CKEditor5Field('Content', config_name='extends')
    
    # Threading
    parent = models.ForeignKey(
        'self', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='replies'
    )
    
    # Moderation
    approval_status = models.CharField(
        max_length=20, 
        choices=ApprovalStatus.choices, 
        default=ApprovalStatus.APPROVED
    )
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    edited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='edited_posts'
    )
    edit_reason = models.CharField(max_length=255, blank=True)
    
    # Ratings
    helpful_count = models.PositiveIntegerField(default=0)
    insightful_count = models.PositiveIntegerField(default=0)
    
    # Flags
    is_flagged = models.BooleanField(default=False)
    flag_reason = models.CharField(max_length=255, blank=True)
    flagged_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='flagged_posts'
    )

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['thread', 'approval_status']),
            models.Index(fields=['author', '-created_at']),
            models.Index(fields=['is_flagged']),
        ]

    def __str__(self) -> str:
        return f"Post by {self.author.username} in {self.thread.title}"

    def flag_for_review(self, reason, flagged_by):
        """Flag post for moderation review"""
        self.is_flagged = True
        self.flag_reason = reason
        self.flagged_by = flagged_by
        self.approval_status = self.ApprovalStatus.FLAGGED
        self.save()

    def approve(self):
        """Approve flagged post"""
        self.approval_status = self.ApprovalStatus.APPROVED
        self.is_flagged = False
        self.flag_reason = ''
        self.save()


# ============================================================================
# 3. TAGS & ORGANIZATION
# ============================================================================

class ForumTag(models.Model):
    """Tags for organizing discussions"""
    
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default='#6c757d')
    icon = models.CharField(max_length=50, blank=True)
    thread_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-thread_count', 'name']

    def __str__(self) -> str:
        return self.name


# ============================================================================
# 4. REACTIONS & VOTING
# ============================================================================

class ForumReaction(models.Model):
    """User reactions to posts"""
    
    class ReactionType(models.TextChoices):
        LIKE = 'LIKE', '👍 Helpful'
        INSIGHTFUL = 'INSIGHTFUL', '💡 Insightful'
        CELEBRATE = 'CELEBRATE', '🎉 Great Answer'
        DISAGREE = 'DISAGREE', '👎 Disagree'

    post = models.ForeignKey(
        ForumPost, 
        on_delete=models.CASCADE, 
        related_name='reactions'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='forum_reactions'
    )
    reaction_type = models.CharField(max_length=32, choices=ReactionType.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user', 'reaction_type')
        indexes = [
            models.Index(fields=['post', 'reaction_type']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self) -> str:
        return f"{self.user.username} - {self.reaction_type}"


# ============================================================================
# 5. REPUTATION & BADGES
# ============================================================================

class UserReputation(models.Model):
    """Track user reputation points and actions"""
    
    class ActionType(models.TextChoices):
        THREAD_CREATED = 'THREAD_CREATED', 'Created Thread'
        POST_CREATED = 'POST_CREATED', 'Created Post'
        POST_HELPFUL = 'POST_HELPFUL', 'Post Marked Helpful'
        POST_INSIGHTFUL = 'POST_INSIGHTFUL', 'Post Marked Insightful'
        SOLUTION = 'SOLUTION', 'Marked as Solution'
        MODERATION = 'MODERATION', 'Moderation Action'
        BADGE_EARNED = 'BADGE_EARNED', 'Badge Earned'
        VIOLATION = 'VIOLATION', 'Community Violation'

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forum_reputation'
    )
    points = models.IntegerField(default=0, validators=[MinValueValidator(-9999)])
    
    # Counters
    helpful_received = models.PositiveIntegerField(default=0)
    solutions_provided = models.PositiveIntegerField(default=0)
    posts_created = models.PositiveIntegerField(default=0)
    threads_created = models.PositiveIntegerField(default=0)
    
    # Streaks & Status
    current_streak = models.PositiveIntegerField(default=0)  # Days active
    longest_streak = models.PositiveIntegerField(default=0)
    last_activity_date = models.DateField(null=True, blank=True)
    
    # Status
    is_moderator = models.BooleanField(default=False)
    is_banned = models.BooleanField(default=False)
    ban_until = models.DateTimeField(null=True, blank=True)
    ban_reason = models.TextField(blank=True)

    class Meta:
        ordering = ['-points']

    def __str__(self) -> str:
        return f"{self.user.username} ({self.points} points)"

    def add_reputation(self, points, action_type, reason=''):
        """Add reputation with logging"""
        self.points = F('points') + points
        self.save(update_fields=['points'])
        
        # Log the action
        ReputationLog.objects.create(
            user=self.user,
            points=points,
            action_type=action_type,
            reason=reason
        )

    def update_streak(self):
        """Update user's daily streak"""
        today = timezone.now().date()
        if self.last_activity_date == today:
            return  # Already counted today
        
        if self.last_activity_date == today - timedelta(days=1):
            self.current_streak += 1
        else:
            self.current_streak = 1
        
        if self.current_streak > self.longest_streak:
            self.longest_streak = self.current_streak
        
        self.last_activity_date = today
        self.save()

    def get_level(self):
        """Get user level based on points"""
        if self.points >= 5000:
            return 'Expert'
        elif self.points >= 2000:
            return 'Advanced'
        elif self.points >= 500:
            return 'Established'
        elif self.points >= 100:
            return 'Member'
        else:
            return 'Newcomer'


class ReputationLog(models.Model):
    """Log of all reputation changes"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reputation_logs'
    )
    points = models.IntegerField()
    action_type = models.CharField(max_length=50)
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    related_post = models.ForeignKey(
        ForumPost,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action_type']),
        ]


class Badge(models.Model):
    """Achievement badges for forum participation"""
    
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    description = models.TextField()
    icon = models.CharField(max_length=100)  # Font Awesome icon
    color = models.CharField(max_length=7, default='#007bff')
    
    # Requirements
    required_points = models.PositiveIntegerField(default=0)
    required_posts = models.PositiveIntegerField(default=0)
    required_solutions = models.PositiveIntegerField(default=0)
    required_streak = models.PositiveIntegerField(default=0)  # Days
    
    # Metadata
    is_hidden = models.BooleanField(default=False)  # Don't show until earned
    order = models.PositiveIntegerField(default=0)
    users = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='UserBadge',
        related_name='forum_badges'
    )

    class Meta:
        ordering = ['order', 'name']

    def __str__(self) -> str:
        return self.name


class UserBadge(models.Model):
    """Track when users earned badges"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_badges'
    )
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'badge')
        ordering = ['-earned_at']

    def __str__(self) -> str:
        return f"{self.user.username} - {self.badge.name}"


# ============================================================================
# 6. MODERATION & REPORTING
# ============================================================================

class ForumReport(models.Model):
    """User reports for community moderation"""
    
    class ReportStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pending Review'
        INVESTIGATING = 'INVESTIGATING', 'Under Investigation'
        RESOLVED = 'RESOLVED', 'Resolved'
        DISMISSED = 'DISMISSED', 'Dismissed'
        ESCALATED = 'ESCALATED', 'Escalated to Admin'

    class ReportReason(models.TextChoices):
        SPAM = 'SPAM', 'Spam or Advertising'
        HARASSMENT = 'HARASSMENT', 'Harassment'
        MISINFORMATION = 'MISINFORMATION', 'Misinformation'
        OFFENSIVE = 'OFFENSIVE', 'Offensive Language'
        COPYRIGHT = 'COPYRIGHT', 'Copyright Violation'
        OTHER = 'OTHER', 'Other'

    # Report Info
    reason = models.CharField(max_length=50, choices=ReportReason.choices)
    description = models.TextField()
    status = models.CharField(
        max_length=20, 
        choices=ReportStatus.choices, 
        default=ReportStatus.PENDING
    )
    
    # Target
    post = models.ForeignKey(
        ForumPost,
        on_delete=models.CASCADE,
        related_name='reports'
    )
    reported_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='forum_reports_made'
    )
    
    # Review
    reviewed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='forum_reports_reviewed'
    )
    review_notes = models.TextField(blank=True)
    action_taken = models.CharField(max_length=255, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['post']),
        ]

    def __str__(self) -> str:
        return f"Report on {self.post.id} - {self.reason}"


class ModerationAction(models.Model):
    """Log of moderation actions taken"""
    
    class ActionType(models.TextChoices):
        POST_DELETED = 'POST_DELETED', 'Post Deleted'
        THREAD_LOCKED = 'THREAD_LOCKED', 'Thread Locked'
        THREAD_UNLOCKED = 'THREAD_UNLOCKED', 'Thread Unlocked'
        USER_WARNED = 'USER_WARNED', 'User Warned'
        USER_SUSPENDED = 'USER_SUSPENDED', 'User Suspended'
        USER_UNBANNED = 'USER_UNBANNED', 'User Unbanned'
        POST_HIDDEN = 'POST_HIDDEN', 'Post Hidden'
        POST_APPROVED = 'POST_APPROVED', 'Post Approved'
        POINTS_ADJUSTED = 'POINTS_ADJUSTED', 'Reputation Adjusted'

    moderator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='moderation_actions'
    )
    action_type = models.CharField(max_length=50, choices=ActionType.choices)
    reason = models.TextField()
    
    # Target
    post = models.ForeignKey(
        ForumPost,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='moderation_actions'
    )
    thread = models.ForeignKey(
        ForumThread,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='moderation_actions'
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='moderation_against'
    )
    
    # Details
    duration = models.DurationField(null=True, blank=True)  # For suspensions
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['action_type']),
        ]

    def __str__(self) -> str:
        return f"{self.get_action_type_display()} by {self.moderator}"


# ============================================================================
# 7. NOTIFICATIONS & SUBSCRIPTIONS
# ============================================================================

class ThreadSubscription(models.Model):
    """Users can subscribe to threads for updates"""
    
    class NotificationLevel(models.TextChoices):
        OFF = 'OFF', 'No Notifications'
        REPLIES = 'REPLIES', 'New Replies Only'
        ALL = 'ALL', 'All Activity'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='thread_subscriptions'
    )
    thread = models.ForeignKey(
        ForumThread,
        on_delete=models.CASCADE,
        related_name='subscribers'
    )
    notification_level = models.CharField(
        max_length=10,
        choices=NotificationLevel.choices,
        default=NotificationLevel.ALL
    )
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'thread')

    def __str__(self) -> str:
        return f"{self.user.username} -> {self.thread.title}"


class ForumNotification(models.Model):
    """Notifications for forum activity"""
    
    class NotificationType(models.TextChoices):
        NEW_REPLY = 'NEW_REPLY', 'New Reply'
        POST_REACTION = 'POST_REACTION', 'Post Reaction'
        MENTION = 'MENTION', 'Mentioned'
        BADGE_EARNED = 'BADGE_EARNED', 'Badge Earned'
        MOD_ACTION = 'MOD_ACTION', 'Moderation Action'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forum_notifications'
    )
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    
    # References
    related_post = models.ForeignKey(
        ForumPost,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    related_thread = models.ForeignKey(
        ForumThread,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    from_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='sent_notifications'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self) -> str:
        return f"{self.get_notification_type_display()} for {self.user.username}"


# ============================================================================
# 8. ANALYTICS & STATISTICS
# ============================================================================

class ForumStats(models.Model):
    """Daily forum statistics"""
    
    date = models.DateField(auto_now_add=True, unique=True)
    
    # Activity
    new_threads = models.PositiveIntegerField(default=0)
    new_posts = models.PositiveIntegerField(default=0)
    total_views = models.PositiveIntegerField(default=0)
    
    # Users
    active_users = models.PositiveIntegerField(default=0)
    new_users = models.PositiveIntegerField(default=0)
    
    # Top content
    top_thread = models.ForeignKey(
        ForumThread,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )
    top_contributor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='+'
    )

    class Meta:
        ordering = ['-date']

    def __str__(self) -> str:
        return f"Forum Stats - {self.date}"


# ============================================================================
# 9. PRIVATE MESSAGING
# ============================================================================

class PrivateMessage(TimestampedModel):
    """Direct member-to-member messages."""

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='sent_messages',
    )
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='received_messages',
    )
    subject = models.CharField(max_length=255)
    body = models.TextField()
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['recipient', 'is_read', '-created_at']),
            models.Index(fields=['sender', '-created_at']),
        ]

    def __str__(self) -> str:
        return f"{self.sender_id} → {self.recipient_id}: {self.subject}"


# ============================================================================
# 10. HOUSEKEEPING MODELS
# ============================================================================

class DeletedContent(models.Model):
    """Archive deleted forum content for records"""
    
    class ContentType(models.TextChoices):
        POST = 'POST', 'Post'
        THREAD = 'THREAD', 'Thread'

    content_type = models.CharField(max_length=10, choices=ContentType.choices)
    original_id = models.PositiveIntegerField()
    original_author = models.CharField(max_length=255)  # Username at time of deletion
    
    content = models.TextField()  # Archived content
    reason_deleted = models.CharField(max_length=255)
    deleted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='deleted_content'
    )
    deleted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-deleted_at']
        indexes = [
            models.Index(fields=['content_type', '-deleted_at']),
        ]
