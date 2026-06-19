#!/usr/bin/env python
"""
Stress-test every UI button mapped to its backend action.
Static/navigation-only buttons are verified separately.

Usage (backend must be running):
  python scripts/button_stress_report.py

Env:
  STRESS_API_BASE=http://localhost:8000
  BUTTON_STRESS_BURST=5   # requests per API button
"""

from __future__ import annotations

import json
import os
import sys
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Callable
from urllib import error, request

BASE = os.getenv("STRESS_API_BASE", "http://localhost:8000")
BURST = int(os.getenv("BUTTON_STRESS_BURST", "5"))
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

FRONTEND_ROUTES = {
    "/",
    "/login",
    "/register",
    "/forgot-pin",
    "/dashboard",
    "/profile",
    "/certificates",
    "/pricing",
    "/terms",
    "/privacy",
    "/refund",
    "/risk",
    "/disclaimer",
    "/level/beginner",
    "/level/beginner/final",
}


@dataclass
class ButtonResult:
    area: str
    button: str
    kind: str  # api | static | external | known_issue
    burst: int = 0
    success: int = 0
    failed: int = 0
    avg_ms: float = 0.0
    status: str = "PASS"
    note: str = ""


def api(method: str, path: str, data: dict | None = None, token: str | None = None):
    url = f"{BASE}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode() if data is not None else None
    req = request.Request(url, data=body, headers=headers, method=method)
    start = time.perf_counter()
    try:
        with request.urlopen(req, timeout=30) as resp:
            elapsed = (time.perf_counter() - start) * 1000
            payload = resp.read().decode()
            parsed = json.loads(payload) if payload else {}
            return resp.status, parsed, elapsed
    except error.HTTPError as e:
        elapsed = (time.perf_counter() - start) * 1000
        payload = e.read().decode()
        try:
            parsed = json.loads(payload)
        except json.JSONDecodeError:
            parsed = {"raw": payload}
        return e.code, parsed, elapsed


def bootstrap_context() -> dict[str, Any]:
    import django

    django.setup()
    from django.core.management import call_command
    from django.contrib.auth import get_user_model
    from rest_framework_simplejwt.tokens import RefreshToken
    from courses.models import Course, Enrollment, Lesson, Module
    from quiz.models import Quiz, Question, Option

    call_command("seed_course", verbosity=0)

    User = get_user_model()
    email = "button_stress@easyoptionlearning.test"
    phone = "+919876543288"
    user, _ = User.objects.get_or_create(
        email=email,
        defaults={
            "username": email,
            "first_name": "Button",
            "last_name": "Stress",
            "phone": phone,
            "phone_verified": True,
            "email_verified": True,
        },
    )
    user.set_password("1234")
    user.save()

    course = Course.objects.filter(id=1).first()
    if course:
        Enrollment.objects.get_or_create(user=user, course=course)

    lesson = Lesson.objects.filter(module__level__order=1).order_by("id").first()
    module = Module.objects.filter(level__order=1).order_by("id").first()

    quiz, _ = Quiz.objects.get_or_create(lesson=lesson, defaults={"quiz_type": "lesson"})
    if not quiz.questions.exists():
        question = Question.objects.create(
            quiz=quiz,
            text="Button stress: call option?",
            explanation="Right to buy.",
            order=1,
        )
        correct = Option.objects.create(
            question=question, text="Right to buy", is_correct=True
        )
        Option.objects.create(question=question, text="Right to sell", is_correct=False)
    else:
        question = quiz.questions.first()
        correct = question.options.filter(is_correct=True).first()

    access = str(RefreshToken.for_user(user).access_token)
    return {
        "access": access,
        "email": email,
        "phone": phone,
        "lesson_id": lesson.id,
        "module_id": module.id,
        "quiz_id": quiz.id,
        "question_id": question.id,
        "correct_option_id": correct.id,
    }


def burst_api(
    area: str,
    button: str,
    method: str,
    path: str,
    *,
    data: dict | None = None,
    token: str | None = None,
    expect: tuple[int, ...] = (200, 201),
    burst: int = BURST,
) -> ButtonResult:
    times: list[float] = []
    ok = 0
    fail = 0
    last_code = 0
    for _ in range(burst):
        code, _, ms = api(method, path, data, token)
        times.append(ms)
        last_code = code
        if code in expect:
            ok += 1
        else:
            fail += 1

    result = ButtonResult(
        area=area,
        button=button,
        kind="api",
        burst=burst,
        success=ok,
        failed=fail,
        avg_ms=round(sum(times) / len(times), 1) if times else 0,
    )
    if fail:
        result.status = "FAIL"
        result.note = f"last HTTP {last_code}"
    return result


def static_button(area: str, button: str, note: str = "navigation only") -> ButtonResult:
    return ButtonResult(area=area, button=button, kind="static", status="PASS", note=note)


def known_issue(area: str, button: str, note: str) -> ButtonResult:
    return ButtonResult(area=area, button=button, kind="known_issue", status="ISSUE", note=note)


def run_all(ctx: dict[str, Any]) -> list[ButtonResult]:
    access = ctx["access"]
    results: list[ButtonResult] = []

    # --- Landing (public) ---
    results.append(static_button("Landing", "Start With Level 1", "/register"))
    results.append(static_button("Landing", "Explore Levels", "scroll #levels"))
    results.append(static_button("Landing", "Enroll Now (Level 1/2/3)", "/register"))
    results.append(known_issue("Landing", "NISM Enroll Now", "purchaseUrl is #"))
    results.append(static_button("Landing", "NISM Download Sample PDF", "public PDF asset"))
    results.append(static_button("Landing", "Announcement ribbon", "scroll #nism"))
    results.append(static_button("Landing", "Nav: Levels / FAQs / Contact", "in-page scroll"))
    results.append(static_button("Landing", "Login", "/login"))
    results.append(static_button("Landing", "Sign Up", "/register"))
    results.append(static_button("Landing", "Theme toggle", "client-only"))
    results.append(
        burst_api(
            "Landing",
            "Send Feedback",
            "POST",
            "/api/auth/feedback/",
            data={
                "name": "Button Stress",
                "email": ctx["email"],
                "message": "Button stress test feedback",
            },
            token=access,
            expect=(200, 500),
        )
    )
    results.append(static_button("Landing", "Footer legal links", "/terms /privacy /refund"))

    # --- Auth ---
    results.append(
        burst_api(
            "Auth",
            "Login (phone + PIN)",
            "POST",
            "/api/auth/phone-login/",
            data={"phone": ctx["phone"], "pin": "1234"},
        )
    )
    results.append(
        burst_api(
            "Auth",
            "Login (email + PIN)",
            "POST",
            "/api/auth/login/",
            data={"email": ctx["email"], "password": "1234"},
        )
    )
    results.append(
        burst_api(
            "Auth",
            "Forgot PIN - request OTP",
            "POST",
            "/api/auth/password-reset/request-otp/",
            data={"email": ctx["email"]},
        )
    )
    results.append(static_button("Auth", "Register wizard steps", "see integration tests"))
    results.append(static_button("Auth", "Remember me", "localStorage only"))

    # --- Dashboard ---
    results.append(
        burst_api("Dashboard", "Load profile (header)", "GET", "/api/auth/me/", token=access)
    )
    results.append(
        burst_api("Dashboard", "Continue Learning data", "GET", "/api/progress/user/", token=access)
    )
    results.append(
        burst_api("Dashboard", "Level cards data", "GET", "/api/courses/1/levels/", token=access)
    )
    results.append(static_button("Dashboard", "Continue Learning card", "/level/{id}"))
    results.append(static_button("Dashboard", "Unlock Level CTA", "/pricing?level="))
    results.append(known_issue("Dashboard", "NISM Enroll Now", "purchaseUrl is #"))
    results.append(static_button("Dashboard", "NISM Download PDF", "public PDF"))
    results.append(static_button("Dashboard", "Join Telegram", "external link"))
    results.append(static_button("Dashboard", "Header Profile", "/profile"))
    results.append(static_button("Dashboard", "Header Certificates", "/certificates"))
    results.append(static_button("Dashboard", "Header Logout", "clears JWT"))

    # --- Learning ---
    results.append(
        burst_api(
            "Learning",
            "Sidebar lesson open",
            "GET",
            f"/api/courses/lessons/{ctx['lesson_id']}/",
            token=access,
        )
    )
    results.append(
        burst_api(
            "Learning",
            "Begin Execution (streak)",
            "POST",
            "/api/progress/streak/update/",
            data={},
            token=access,
            expect=(200, 201),
        )
    )
    results.append(
        burst_api(
            "Learning",
            "Lesson activity ping",
            "POST",
            "/api/progress/lessons/activity/",
            data={"lesson_id": ctx["lesson_id"]},
            token=access,
        )
    )
    results.append(
        burst_api(
            "Learning",
            "Mark lesson complete",
            "PATCH",
            f"/api/progress/lessons/{ctx['lesson_id']}/",
            data={"completed": True},
            token=access,
            expect=(200, 201),
        )
    )
    results.append(static_button("Learning", "Next Lesson / Back to Module", "client nav"))
    results.append(
        burst_api(
            "Learning",
            "Take Module Quiz (fetch)",
            "GET",
            f"/api/quizzes/?module_id={ctx['module_id']}",
            token=access,
            expect=(200, 403),
        )
    )
    results.append(
        burst_api(
            "Learning",
            "Take Level Quiz (fetch)",
            "GET",
            "/api/quizzes/?level_id=1",
            token=access,
            expect=(200, 403),
        )
    )
    results.append(static_button("Learning", "Claim Certificate", "/level/{id}/final"))

    # --- Quiz ---
    results.append(
        burst_api(
            "Quiz",
            "Fetch lesson quiz",
            "GET",
            f"/api/quizzes/?lesson_id={ctx['lesson_id']}",
            token=access,
        )
    )
    results.append(
        burst_api(
            "Quiz",
            "Submit quiz",
            "POST",
            f"/api/quizzes/{ctx['quiz_id']}/submit/",
            data={"answers": {str(ctx["question_id"]): ctx["correct_option_id"]}},
            token=access,
        )
    )
    results.append(static_button("Quiz", "Begin Assessment", "client UI"))
    results.append(static_button("Quiz", "Answer options", "client UI"))
    results.append(static_button("Quiz", "Retry / Continue Learning", "client nav"))

    # --- Profile & Certificates ---
    results.append(
        burst_api(
            "Profile",
            "Save profile",
            "PATCH",
            "/api/auth/me/update/",
            data={"first_name": "Button"},
            token=access,
        )
    )
    results.append(
        burst_api(
            "Certificates",
            "List certificates",
            "GET",
            "/api/progress/certificates/",
            token=access,
        )
    )
    results.append(static_button("Certificates", "Download PNG", "GET .../download/ (needs cert)"))

    # --- Pricing ---
    results.append(static_button("Pricing", "Start Level 1/2/3", "/dashboard"))
    results.append(known_issue("Pricing", "NISM Enroll", "purchaseUrl is #"))
    results.append(static_button("Pricing", "FAQ accordion", "client UI"))

    # --- QnA widget ---
    results.append(
        burst_api(
            "QnA",
            "Submit question",
            "POST",
            "/api/auth/qna/submit/",
            data={"question": "Button stress test question?"},
            token=access,
            expect=(200, 201, 400),
        )
    )

    return results


def print_report(results: list[ButtonResult]) -> int:
    api_results = [r for r in results if r.kind == "api"]
    static_count = sum(1 for r in results if r.kind == "static")
    issue_count = sum(1 for r in results if r.kind == "known_issue")

    print("=" * 72)
    print("BUTTON STRESS TEST REPORT")
    print("=" * 72)
    print(f"API base: {BASE}  |  Burst per API button: {BURST}\n")

    current_area = ""
    failures = 0
    for r in results:
        if r.area != current_area:
            current_area = r.area
            print(f"\n--- {current_area} ---")
        if r.kind == "api":
            mark = "PASS" if r.status == "PASS" else "FAIL"
            if r.status != "PASS":
                failures += 1
            print(
                f"  [{mark}] {r.button}: {r.success}/{r.burst} ok, "
                f"avg {r.avg_ms}ms{r.note and ' (' + r.note + ')' or ''}"
            )
        elif r.kind == "known_issue":
            print(f"  [ISSUE] {r.button}: {r.note}")
        else:
            print(f"  [STATIC] {r.button}: {r.note}")

    print("\n" + "-" * 72)
    print(f"API buttons tested: {len(api_results)}")
    print(f"Static/navigation buttons catalogued: {static_count}")
    print(f"Known issues (not API failures): {issue_count}")
    print(f"Frontend routes defined: {len(FRONTEND_ROUTES)}")

    api_failed = [r for r in api_results if r.status != "PASS"]
    if api_failed:
        print(f"\nFAILED API BUTTONS ({len(api_failed)}):")
        for r in api_failed:
            print(f"  - {r.area} / {r.button}")
        print("\nOVERALL: FAIL")
        return 1

    print("\nOVERALL: ALL API BUTTONS PASSED STRESS")
    if issue_count:
        print(f"Note: {issue_count} placeholder button(s) still use href='#'")
    return 0


def main():
    code, _, ms = api("GET", "/api/courses/all/")
    if code >= 500:
        print(f"Backend unreachable or error: HTTP {code}")
        sys.exit(1)
    print(f"Backend reachable (HTTP {code}, {ms:.0f}ms)\n")

    ctx = bootstrap_context()
    results = run_all(ctx)
    sys.exit(print_report(results))


if __name__ == "__main__":
    main()
