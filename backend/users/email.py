from django.conf import settings
from django.core.mail import EmailMultiAlternatives
import logging

logger = logging.getLogger(__name__)


def _send_otp_email(email: str, otp: str, subject: str, heading: str) -> bool:
    text_message = f"""Your verification code is: {otp}

This code expires in 5 minutes.

If you didn't request this code, please ignore this email."""

    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="max-width: 500px; margin: 0 auto; background: #f5f5f5; padding: 30px; border-radius: 10px;">
            <h2 style="color: #1a1a2e; margin-bottom: 20px;">{heading}</h2>
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
            subject=subject,
            body=text_message,
            from_email=from_email,
            to=[email],
        )
        msg.attach_alternative(html_message, "text/html")
        msg.send(fail_silently=False)
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP email to {email}: {str(e)}")
        return False


def send_email_otp(email: str, otp: str) -> bool:
    """
    Send OTP via email.

    Args:
        email: Recipient's email address
        otp: The OTP code to send

    Returns:
        True if sent successfully, False otherwise
    """
    sent = _send_otp_email(
        email=email,
        otp=otp,
        subject="Your TradeMaster Verification Code",
        heading="TradeMaster Verification",
    )
    if sent:
        logger.info(f"Email OTP sent to {email}")
    return sent


def send_password_reset_otp(email: str, otp: str) -> bool:
    sent = _send_otp_email(
        email=email,
        otp=otp,
        subject="Your TradeMaster PIN Reset Code",
        heading="TradeMaster PIN Reset",
    )
    if sent:
        logger.info(f"Password reset OTP sent to {email}")
    return sent
