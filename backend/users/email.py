from django.conf import settings
from django.core.mail import send_mail
from django.core.mail import EmailMultiAlternatives
import logging

logger = logging.getLogger(__name__)


def send_email_otp(email: str, otp: str) -> bool:
    """
    Send OTP via email.

    Args:
        email: Recipient's email address
        otp: The OTP code to send

    Returns:
        True if sent successfully, False otherwise
    """
    subject = "Your TradeMaster Verification Code"

    # Plain text message
    text_message = f"""Your TradeMaster verification code is: {otp}

This code expires in 5 minutes.

If you didn't request this code, please ignore this email."""

    # HTML message
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #f5f5f5; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1a1a2e; margin-bottom: 20px;">TradeMaster Verification</h2>
            <p style="color: #333; font-size: 16px;">Your verification code is:</p>
            <div style="background: #1a1a2e; color: white; font-size: 32px; font-weight: bold; 
                        padding: 15px 30px; border-radius: 8px; letter-spacing: 8px; 
                        text-align: center; margin: 20px 0;">
                {otp}
            </div>
            <p style="color: #666; font-size: 14px;">This code expires in 5 minutes.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">
                If you didn't request this code, please ignore this email.
            </p>
        </div>
    </body>
    </html>
    """

    from_email = getattr(settings, "DEFAULT_FROM_EMAIL", "noreply@trademaster.com")

    try:
        msg = EmailMultiAlternatives(
            subject=subject, body=text_message, from_email=from_email, to=[email]
        )
        msg.attach_alternative(html_message, "text/html")
        msg.send(fail_silently=False)

        logger.info(f"Email OTP sent to {email}")
        return True

    except Exception as e:
        logger.error(f"Failed to send email OTP to {email}: {str(e)}")
        return False
