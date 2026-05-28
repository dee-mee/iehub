from celery import shared_task
from .models import Resource


@shared_task
def increment_download_count(resource_id):
    """Increment download count for a resource asynchronously."""
    try:
        resource = Resource.objects.get(id=resource_id)
        resource.download_count += 1
        resource.save(update_fields=['download_count', 'updated_at'])
        return f"Download count incremented for resource {resource_id}"
    except Resource.DoesNotExist:
        return f"Resource {resource_id} not found"


@shared_task
def send_notification_email(user_email, subject, message):
    """Send notification email asynchronously."""
    # TODO: Integrate with SendGrid/Mailgun
    # For now, just log the task
    return f"Email sent to {user_email}: {subject}"
