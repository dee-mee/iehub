from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

@shared_task
def send_verification_email(user_email, first_name, token):
    """Send verification email with token link."""
    subject = 'Verify your IE Hub Account'
    # The frontend URL for verification
    # For local dev it might be http://localhost:5173/verify-email
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    verify_link = f"{frontend_url}/verify-email/{token}"
    
    context = {
        'first_name': first_name,
        'verify_link': verify_link,
    }
    
    # We could use a template here if we had one
    # html_message = render_to_string('emails/verify_email.html', context)
    # plain_message = strip_tags(html_message)
    
    plain_message = f"Hi {first_name},\n\nWelcome to IE Hub! Please verify your email by clicking the link below:\n\n{verify_link}\n\nIf you did not register for an account, please ignore this email."
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
        # html_message=html_message,
    )
    
    return f"Verification email sent to {user_email}"

@shared_task
def send_approval_notification(user_email, first_name):
    """Notify user that their account has been approved."""
    subject = 'Your IE Hub Account has been Approved'
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    dashboard_link = f"{frontend_url}/dashboard"
    
    plain_message = f"Hi {first_name},\n\nGreat news! Your IE Hub account has been approved by the administrators. You can now access the full platform, including the forum and learning materials.\n\nLogin here: {dashboard_link}\n\nWelcome to the community!"
    
    send_mail(
        subject,
        plain_message,
        settings.DEFAULT_FROM_EMAIL,
        [user_email],
        fail_silently=False,
    )
    
    return f"Approval notification sent to {user_email}"
