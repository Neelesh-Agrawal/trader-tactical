from django.conf import settings
import logging
import re

logger = logging.getLogger(__name__)

# Same OTP copy as trader-tactical (DLT-approved for ANTSPL / Fortius template).
OTP_SMS_TEMPLATE = (
    "Your TradeMaster verification code is: {otp}. This code expires in 5 minutes."
)


def _otp_message(otp: str) -> str:
    custom = getattr(settings, "SMS_OTP_MESSAGE_TEMPLATE", "").strip()
    if custom:
        return custom.format(otp=otp)
    return OTP_SMS_TEMPLATE.format(otp=otp)


def _normalize_mobile_fortius(phone_number: str) -> str:
    digits = re.sub(r"\D", "", phone_number)
    if len(digits) == 10:
        return f"91{digits}"
    return digits


def _send_sms_moplet(phone_number: str, message: str) -> bool:
    """Send SMS using Moplet (trader-tactical default provider)."""
    api_key = getattr(settings, "MOPLET_API_KEY", None)
    sender_id = getattr(settings, "MOPLET_SENDER_ID", None)

    if not all([api_key, sender_id]):
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

        logger.info("SMS sent successfully via Moplet")
        return True

    except Exception as exc:
        logger.error("Failed to send SMS via Moplet: %s", exc)
        return False


def _send_sms_fortius(phone_number: str, message: str) -> bool:
    """Hostinger production provider when Fortius env vars are set."""
    api_key = getattr(settings, "SMS_API_KEY", "")
    sender_id = getattr(settings, "SMS_SENDER_ID", "")
    api_url = getattr(settings, "SMS_API_URL", "")
    template_id = getattr(settings, "SMS_OTP_TEMPLATE_ID", "")

    if not all([api_key, sender_id, api_url]):
        return False

    try:
        import requests

        params = {
            "apikey": api_key,
            "senderid": sender_id,
            "mobile": _normalize_mobile_fortius(phone_number),
            "message": message,
        }
        if template_id:
            params["templateid"] = template_id

        response = requests.get(api_url, params=params, timeout=30)
        response.raise_for_status()

        try:
            payload = response.json()
        except ValueError:
            logger.error("Fortius SMS returned non-JSON response")
            return False

        if str(payload.get("status", "")).lower() in {"true", "success", "1"}:
            logger.info("SMS sent successfully via Fortius")
            return True

        logger.error(
            "Fortius SMS failed: %s",
            payload.get("description") or payload,
        )
        return False

    except Exception as exc:
        logger.error("Failed to send SMS via Fortius: %s", exc)
        return False


def send_sms(phone_number: str, message: str) -> bool:
    """
    Send SMS — Moplet first (trader-tactical), then Fortius if configured.
    """
    if _send_sms_moplet(phone_number, message):
        return True

    if _send_sms_fortius(phone_number, message):
        return True

    logger.warning("SMS credentials not configured or send failed.")
    logger.info("[DEV MODE] SMS to %s: %s", phone_number, message)
    return False


def send_otp_sms(phone_number: str, otp: str) -> bool:
    """Send OTP via SMS (same message as trader-tactical)."""
    return send_sms(phone_number, _otp_message(otp))
