from rest_framework import status
from rest_framework.test import APITestCase
from django.test import override_settings

from .models import User


class RegisterViewTests(APITestCase):
    def test_register_allows_single_name_signup(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                "email": "single@example.com",
                "username": "single@example.com",
                "password": "1234",
                "first_name": "Prince",
                "last_name": "",
                "phone": "+919876543210",
                "occupation": "student",
                "sex": "N",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email="single@example.com")
        self.assertEqual(user.first_name, "Prince")
        self.assertEqual(user.last_name, "")


class OTPExposureTests(APITestCase):
    @override_settings(DEBUG=True, APP_MODE="PROD")
    def test_send_phone_otp_does_not_expose_code_outside_dev_mode(self):
        response = self.client.post(
            "/api/auth/send-otp/",
            {"phone": "+919876543210"},
            format="json",
        )

        self.assertIn(response.status_code, {status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR})
        self.assertNotIn("otp", response.data)
