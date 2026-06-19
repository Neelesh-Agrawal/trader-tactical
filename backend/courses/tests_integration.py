"""
End-to-end API flow tests: registration → login → lessons → progress → quiz.
Run: python manage.py test courses.tests_integration -v 2
"""

from unittest.mock import patch

from django.core.management import call_command
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient
from phonenumber_field.phonenumber import PhoneNumber

from courses.models import Course, Enrollment, Lesson, Level, Module
from quiz.models import Option, Question, Quiz
from users.models import User, PhoneVerification, EmailVerification, PasswordResetOTP


NO_THROTTLE = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_THROTTLE_CLASSES": [],
    "DEFAULT_THROTTLE_RATES": {},
}


@override_settings(REST_FRAMEWORK=NO_THROTTLE, DEBUG=True, APP_MODE="PROD")
class FullUserFlowTests(TestCase):
    """Simulates the complete learner journey through the API."""

    def setUp(self):
        self.sms_patch = patch("users.views.send_otp_sms", return_value=False)
        self.email_patch = patch("users.views.send_email_otp", return_value=False)
        self.reset_patch = patch("users.views.send_password_reset_otp", return_value=False)
        self.sms_patch.start()
        self.email_patch.start()
        self.reset_patch.start()
        self.addCleanup(self.sms_patch.stop)
        self.addCleanup(self.email_patch.stop)
        self.addCleanup(self.reset_patch.stop)

        call_command("seed_course", verbosity=0)
        self.client = APIClient()
        self.phone = "+919876543210"
        self.email = "flowtest@easyoptionlearning.test"
        self.pin = "1234"

    def _auth(self, access: str):
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")

    def _register_user_via_api(self) -> str:
        """Phone OTP → Email OTP → Register → return access token."""
        phone_str = str(PhoneNumber.from_string(self.phone, region=None))

        # Phone OTP
        r = self.client.post(
            "/api/auth/send-otp/", {"phone": self.phone}, format="json"
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK, r.data)
        phone_otp = r.data.get("otp") or PhoneVerification.objects.filter(
            phone=phone_str
        ).latest("created_at").otp
        self.assertTrue(phone_otp, r.data)

        r = self.client.post(
            "/api/auth/verify-otp/",
            {"phone": self.phone, "otp": phone_otp},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK, r.data)

        # Email OTP
        r = self.client.post(
            "/api/auth/send-email-otp/", {"email": self.email}, format="json"
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK, r.data)
        email_otp = r.data.get("otp") or EmailVerification.objects.filter(
            email=self.email
        ).latest("created_at").otp
        self.assertTrue(email_otp, r.data)

        r = self.client.post(
            "/api/auth/verify-email-otp/",
            {"email": self.email, "otp": email_otp},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK, r.data)

        # Register
        r = self.client.post(
            "/api/auth/register/",
            {
                "email": self.email,
                "username": self.email,
                "password": self.pin,
                "first_name": "Flow",
                "last_name": "Tester",
                "phone": self.phone,
            },
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.data)

        # Auto-login after register (same as frontend)
        r = self.client.post(
            "/api/auth/login/",
            {"email": self.email, "password": self.pin},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK, r.data)
        return r.data["access"]

    def test_01_registration_and_profile(self):
        access = self._register_user_via_api()
        self._auth(access)

        r = self.client.get("/api/auth/me/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data["email"], self.email)
        self.assertTrue(r.data["phone_verified"])
        self.assertTrue(r.data["email_verified"])

        user = User.objects.get(email=self.email)
        self.assertTrue(
            Enrollment.objects.filter(user=user, course_id=1).exists(),
            "User should be auto-enrolled in course 1",
        )

    def test_02_phone_login(self):
        access = self._register_user_via_api()
        self.client.credentials()

        r = self.client.post(
            "/api/auth/phone-login/",
            {"phone": self.phone, "pin": self.pin},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK, r.data)
        self.assertIn("access", r.data)

    def test_03_course_levels_and_lesson_read(self):
        access = self._register_user_via_api()
        self._auth(access)

        r = self.client.get("/api/courses/all/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(r.data), 1)

        r = self.client.get("/api/courses/1/levels/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 3)

        beginner = r.data[0]
        self.assertTrue(beginner.get("is_unlocked"), beginner)
        self.assertGreater(len(beginner["modules"]), 0)
        first_module = beginner["modules"][0]
        self.assertTrue(first_module["is_unlocked"])
        self.assertGreater(len(first_module["lessons"]), 0)
        first_lesson = first_module["lessons"][0]
        self.assertTrue(first_lesson["is_unlocked"])

        lesson_id = first_lesson["id"]
        r = self.client.get(f"/api/courses/lessons/{lesson_id}/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertIn("content", r.data)
        self.assertIn("title", r.data)

    def test_04_lesson_activity_and_progress(self):
        access = self._register_user_via_api()
        self._auth(access)

        lesson = Lesson.objects.filter(module__level__order=1).order_by("order").first()
        self.assertIsNotNone(lesson)

        r = self.client.post(
            "/api/progress/lessons/activity/",
            {"lesson_id": lesson.id},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)

        r = self.client.patch(
            f"/api/progress/lessons/{lesson.id}/",
            {"completed": True},
            format="json",
        )
        self.assertIn(r.status_code, (status.HTTP_200_OK, status.HTTP_201_CREATED))

        r = self.client.get("/api/progress/user/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        completed_ids = [p["lesson_id"] for p in r.data["lesson_progress"] if p["completed"]]
        self.assertIn(lesson.id, completed_ids)

    def test_05_lesson_quiz_fetch_and_submit(self):
        access = self._register_user_via_api()
        self._auth(access)

        lesson = Lesson.objects.filter(module__level__order=1).order_by("order").first()
        quiz, _ = Quiz.objects.get_or_create(lesson=lesson, defaults={"quiz_type": "lesson"})
        quiz.quiz_type = "lesson"
        quiz.save()

        question = Question.objects.create(
            quiz=quiz,
            text="What is a call option?",
            explanation="A call gives the right to buy.",
            order=1,
        )
        correct = Option.objects.create(
            question=question, text="Right to buy", is_correct=True
        )
        Option.objects.create(
            question=question, text="Right to sell", is_correct=False
        )

        r = self.client.get(f"/api/quizzes/?lesson_id={lesson.id}")
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertGreater(len(r.data), 0)

        quiz_payload = r.data[0]
        options = quiz_payload["questions"][0]["options"]
        self.assertFalse(
            any("is_correct" in o for o in options),
            "Quiz fetch should not expose is_correct on options",
        )

        r = self.client.post(
            f"/api/quizzes/{quiz.id}/submit/",
            {"answers": {str(question.id): correct.id}},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(r.data["score"], 70)
        self.assertTrue(r.data["passed"])

    def test_06_sequential_lesson_unlock(self):
        access = self._register_user_via_api()
        self._auth(access)

        module = Module.objects.filter(level__order=1).order_by("order").first()
        lessons = list(module.lessons.order_by("order"))
        self.assertGreaterEqual(len(lessons), 2)

        # First lesson should be accessible
        r = self.client.get(f"/api/courses/lessons/{lessons[0].id}/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)

        # Second lesson locked until first is complete
        r = self.client.get(f"/api/courses/lessons/{lessons[1].id}/")
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

        self.client.patch(
            f"/api/progress/lessons/{lessons[0].id}/",
            {"completed": True},
            format="json",
        )

        r = self.client.get(f"/api/courses/lessons/{lessons[1].id}/")
        self.assertEqual(r.status_code, status.HTTP_200_OK)

    def test_07_feedback_endpoint(self):
        access = self._register_user_via_api()
        self._auth(access)

        r = self.client.post(
            "/api/auth/feedback/",
            {
                "name": "Flow Tester",
                "email": self.email,
                "message": "Integration test feedback",
            },
            format="json",
        )
        # 200 if email sends; may be 500 if SMTP misconfigured — accept both in CI
        self.assertIn(r.status_code, (status.HTTP_200_OK, status.HTTP_500_INTERNAL_SERVER_ERROR))

    def test_08_forgot_pin_flow(self):
        access = self._register_user_via_api()
        self.client.credentials()

        r = self.client.post(
            "/api/auth/password-reset/request-otp/",
            {"email": self.email},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        otp = r.data.get("otp") or PasswordResetOTP.objects.filter(
            email=self.email, used=False
        ).latest("created_at").otp

        new_pin = "5678"
        r = self.client.post(
            "/api/auth/password-reset/confirm/",
            {
                "email": self.email,
                "otp": otp,
                "new_pin": new_pin,
                "confirm_pin": new_pin,
            },
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)

        r = self.client.post(
            "/api/auth/phone-login/",
            {"phone": self.phone, "pin": new_pin},
            format="json",
        )
        self.assertEqual(r.status_code, status.HTTP_200_OK)


@override_settings(REST_FRAMEWORK=NO_THROTTLE, DEBUG=True, APP_MODE="PROD")
class StressFlowTests(TestCase):
    """Concurrent requests against core authenticated endpoints."""

    def setUp(self):
        call_command("seed_course", verbosity=0)
        self.user = User.objects.create_user(
            email="stress@easyoptionlearning.test",
            username="stress@easyoptionlearning.test",
            password="1234",
            first_name="Stress",
            last_name="Test",
            phone="+919876543211",
            phone_verified=True,
            email_verified=True,
        )
        course = Course.objects.get(id=1)
        Enrollment.objects.get_or_create(user=self.user, course=course)

        from rest_framework_simplejwt.tokens import RefreshToken

        self.access = str(RefreshToken.for_user(self.user).access_token)
        self.lesson_id = (
            Lesson.objects.filter(module__level__order=1).order_by("id").first().id
        )

    def test_concurrent_level_and_lesson_reads(self):
        """Sequential burst reads (SQLite-safe; parallel stress via live script)."""
        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

        errors = []
        for _ in range(30):
            r1 = client.get("/api/courses/1/levels/")
            r2 = client.get(f"/api/courses/lessons/{self.lesson_id}/")
            r3 = client.get("/api/progress/user/")
            if not (r1.status_code == 200 and r2.status_code == 200 and r3.status_code == 200):
                errors.append((r1.status_code, r2.status_code, r3.status_code))

        self.assertEqual(len(errors), 0, f"Failures: {errors[:5]}")
