from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def send_sms(phone_number: str, message: str) -> bool:
    """
    Send SMS using Moplet.

    Args:
        phone_number: Recipient's phone number (E.164 format)
        message: SMS content

    Returns:
        True if sent successfully, False otherwise
    """
    api_key = getattr(settings, "MOPLET_API_KEY", None)
    sender_id = getattr(settings, "MOPLET_SENDER_ID", None)

    if not all([api_key, sender_id]):
        logger.warning("Moplet credentials not configured. SMS not sent.")
        logger.info(f"[DEV MODE] SMS to {phone_number}: {message}")
        return False

    try:
        import requests

        url = "https://api.moplet.com/send"
        payload = {
            "api_key": api_key,
            "sender_id": sender_id,
            "to": phone_number,
            "message": message,
        }

        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()

        logger.info(f"SMS sent successfully via Moplet")
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
