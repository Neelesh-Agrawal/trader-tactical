import logging
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import DatabaseError
from rest_framework.authentication import BaseAuthentication

logger = logging.getLogger(__name__)
User = get_user_model()


class DevModeAuthentication(BaseAuthentication):
    """Custom authentication class that automatically logs in and enrolls a dummy

    developer user in DEV mode.
    """

    def authenticate(self, request):
        if getattr(settings, "APP_MODE", "PROD") == "DEV":
            try:
                # Retrieve or create a dummy developer user
                user, created = User.objects.get_or_create(
                    email="test@easyoptionlearning.local",
                    defaults={
                        "username": "test_student",
                        "first_name": "Test",
                        "last_name": "Student",
                        "phone": "+15555555555",
                        "phone_verified": True,
                        "email_verified": True,
                        "occupation": "student",
                        "sex": "M",
                    },
                )

                return (user, None)
            except DatabaseError as e:
                logger.error(
                    f"Database error in DevModeAuthentication: {e}. Skipping auto-login."
                )
                return None
        return None
