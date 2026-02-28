import random
import string
from datetime import timedelta
from django.utils import timezone


def generate_otp(length: int = 6) -> str:
    """Generate a random numeric OTP of specified length."""
    return "".join(random.choices(string.digits, k=length))


def get_otp_expiry(minutes: int = 5) -> timezone.datetime:
    """Get the expiry time for an OTP."""
    return timezone.now() + timedelta(minutes=minutes)
