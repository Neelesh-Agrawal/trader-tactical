"""
Per-button API stress tests (Django test client, SMS/email mocked).
Run: python manage.py test courses.tests_button_stress -v 2
"""

from unittest.mock import patch

from django.core.management import call_command
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from courses.models import Course, Enrollment, Lesson, Module
from quiz.models import Option, Question, Quiz
from users.models import User

NO_THROTTLE = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_THROTTLE_CLASSES": [],
    "DEFAULT_THROTTLE_RATES": {},
}

BURST = 8


@override_settings(REST_FRAMEWORK=NO_THROTTLE, DEBUG=True, APP_MODE="PROD")
class ButtonApiStressTests(TestCase):
    """Burst each API-backed button action."""

    def setUp(self):
        for target, ret in (
            ("users.views.send_otp_sms", False),
            ("users.views.send_email_otp", False),
            ("users.views.send_password_reset_otp", False),
        ):
            p = patch(target, return_value=ret)
            p.start()
            self.addCleanup(p.stop)

        call_command("seed_course", verbosity=0)
        self.user = User.objects.create_user(
            email="btn_stress@easyoptionlearning.test",
            username="btn_stress@easyoptionlearning.test",
            password="1234",
            first_name="Btn",
            last_name="Stress",
            phone="+919876543287",
            phone_verified=True,
            email_verified=True,
        )
        Enrollment.objects.get_or_create(user=self.user, course=Course.objects.get(id=1))
        self.lesson = Lesson.objects.filter(module__level__order=1).order_by("id").first()
        self.module = Module.objects.filter(level__order=1).order_by("id").first()
        self.quiz, _ = Quiz.objects.get_or_create(
            lesson=self.lesson, defaults={"quiz_type": "lesson"}
        )
        if not self.quiz.questions.exists():
            q = Question.objects.create(
                quiz=self.quiz, text="Stress?", explanation="x", order=1
            )
            self.correct = Option.objects.create(
                question=q, text="Yes", is_correct=True
            )
            Option.objects.create(question=q, text="No", is_correct=False)
        else:
            q = self.quiz.questions.first()
            self.correct = q.options.filter(is_correct=True).first()

        self.access = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access}")

    def _burst(self, method: str, path: str, data=None, ok=(200, 201)):
        errors = []
        for _ in range(BURST):
            if method == "GET":
                r = self.client.get(path)
            elif method == "POST":
                r = self.client.post(path, data or {}, format="json")
            elif method == "PATCH":
                r = self.client.patch(path, data or {}, format="json")
            else:
                raise ValueError(method)
            if r.status_code not in ok:
                errors.append(r.status_code)
        self.assertEqual(
            len(errors), 0, f"{method} {path} failed {len(errors)}/{BURST}: {errors[:3]}"
        )

    def test_landing_feedback_button(self):
        self._burst(
            "POST",
            "/api/auth/feedback/",
            {
                "name": "Stress",
                "email": self.user.email,
                "message": "burst feedback",
            },
            ok=(200, 500),
        )

    def test_auth_login_buttons(self):
        self.client.credentials()
        self._burst(
            "POST",
            "/api/auth/phone-login/",
            {"phone": str(self.user.phone), "pin": "1234"},
        )
        self._burst(
            "POST",
            "/api/auth/login/",
            {"email": self.user.email, "password": "1234"},
        )
        self._burst(
            "POST",
            "/api/auth/password-reset/request-otp/",
            {"email": self.user.email},
        )

    def test_dashboard_data_buttons(self):
        self._burst("GET", "/api/auth/me/")
        self._burst("GET", "/api/progress/user/")
        self._burst("GET", "/api/courses/all/")
        self._burst("GET", "/api/courses/1/levels/")

    def test_learning_lesson_buttons(self):
        self._burst("GET", f"/api/courses/lessons/{self.lesson.id}/")
        self._burst(
            "POST",
            "/api/progress/lessons/activity/",
            {"lesson_id": self.lesson.id},
        )
        self._burst(
            "PATCH",
            f"/api/progress/lessons/{self.lesson.id}/",
            {"completed": True},
            ok=(200, 201),
        )
        self._burst("POST", "/api/progress/streak/update/", {}, ok=(200, 201))

    def test_quiz_buttons(self):
        self._burst("GET", f"/api/quizzes/?lesson_id={self.lesson.id}")
        q = self.quiz.questions.first()
        self._burst(
            "POST",
            f"/api/quizzes/{self.quiz.id}/submit/",
            {"answers": {str(q.id): self.correct.id}},
        )

    def test_profile_and_cert_buttons(self):
        self._burst(
            "PATCH",
            "/api/auth/me/update/",
            {"first_name": "Burst"},
        )
        self._burst("GET", "/api/progress/certificates/")

    def test_qna_submit_button(self):
        self._burst(
            "POST",
            "/api/auth/qna/submit/",
            {"question": "Burst question?"},
            ok=(200, 201, 400),
        )

    def test_module_level_quiz_fetch_buttons(self):
        self._burst(
            "GET",
            f"/api/quizzes/?module_id={self.module.id}",
            ok=(200, 403),
        )
        self._burst("GET", "/api/quizzes/?level_id=1", ok=(200, 403))
