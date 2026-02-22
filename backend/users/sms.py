from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_sms(phone_number: str, message: str) -> bool:
    """
    Send SMS using Twilio.

    Args:
        phone_number: Recipient's phone number (E.164 format)
        message: SMS content

    Returns:
        True if sent successfully, False otherwise
    """
    # TODO: Add Twilio credentials to settings
    # Configure these in settings.py:
    # TWILIO_ACCOUNT_SID = 'your_account_sid'
    # TWILIO_AUTH_TOKEN = 'your_auth_token'
    # TWILIO_PHONE_NUMBER = '+1234567890'

    account_sid = getattr(settings, "TWILIO_ACCOUNT_SID", None)
    auth_token = getattr(settings, "TWILIO_AUTH_TOKEN", None)
    twilio_number = getattr(settings, "TWILIO_PHONE_NUMBER", None)

    if not all([account_sid, auth_token, twilio_number]):
        logger.warning("Twilio credentials not configured. SMS not sent.")
        # For development, log the message instead
        logger.info(f"[DEV MODE] SMS to {phone_number}: {message}")
        return False

    try:
        from twilio.rest import Client

        client = Client(account_sid, auth_token)

        twilio_message = client.messages.create(
            body=message, from_=twilio_number, to=phone_number
        )

        logger.info(f"SMS sent successfully: {twilio_message.sid}")
        return True

    except Exception as e:
        logger.error(f"Failed to send SMS: {str(e)}")
        return False


def send_otp_sms(phone_number: str, otp: str) -> bool:
    """Send OTP via SMS."""
    message = (
        f"Your TradeMaster verification code is: {otp}. This code expires in 5 minutes."
    )
    return send_sms(phone_number, message)
