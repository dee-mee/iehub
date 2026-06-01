from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings

@shared_task
def send_forum_reply_notification(user_email, first_name, thread_title, author_name, post_preview, thread_url):
    """Notify user of a new reply in a thread they subscribed to."""
    subject = f"New reply in: {thread_title}"
    
    plain_message = f"Hi {first_name},\n\n" \
                    f"{author_name} just replied to the thread '{thread_title}' in the IE Hub Forum.\n\n" \
                    f"--- Preview ---\n" \
                    f"{post_preview}\n" \
                    f"---------------\n\n" \
                    f"You can view the reply here: {thread_url}\n\n" \
                    f"You are receiving this because you subscribed to updates for this thread. " \
                    f"You can change your notification settings in the forum."

    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=True,
    )
    return f"Forum notification sent to {user_email}"

@shared_task
def send_private_message_notification(user_email, first_name, sender_name, subject, message_preview, messages_url):
    """Notify user of a new private message."""
    email_subject = f"New Private Message: {subject}"
    
    plain_message = f"Hi {first_name},\n\n" \
                    f"You have received a new private message from {sender_name} on IE Hub.\n\n" \
                    f"Subject: {subject}\n" \
                    f"Preview: {message_preview}...\n\n" \
                    f"View your messages here: {messages_url}\n\n" \
                    f"Regards,\nThe IE Hub Team"

    send_mail(
        email_subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=True,
    )
    return f"Private message notification sent to {user_email}"
