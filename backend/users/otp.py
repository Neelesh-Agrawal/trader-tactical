import secrets
from datetime import timedelta
from django.utils import timezone


def generate_otp(length: int = 6) -> str:
    """Generate a cryptographically secure numeric OTP of specified length."""
    return "".join(str(secrets.randbelow(10)) for _ in range(length))


def get_otp_expiry(minutes: int = 5) -> timezone.datetime:
    """Get the expiry time for an OTP."""
    return timezone.now() + timedelta(minutes=minutes)
