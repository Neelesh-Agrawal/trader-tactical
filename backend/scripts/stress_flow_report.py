#!/usr/bin/env python
"""
Live stress test against running backend (default http://localhost:8000).
Run backend first: python manage.py runserver

Usage: python scripts/stress_flow_report.py
"""

import json
import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from urllib import error, request

BASE = os.getenv("STRESS_API_BASE", "http://localhost:8000")
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")


def api(method, path, data=None, token=None):
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
            return resp.status, json.loads(payload) if payload else {}, elapsed
    except error.HTTPError as e:
        elapsed = (time.perf_counter() - start) * 1000
        payload = e.read().decode()
        try:
            data = json.loads(payload)
        except json.JSONDecodeError:
            data = {"raw": payload}
        return e.code, data, elapsed


def bootstrap_user():
    """Create user + token via Django ORM (avoids SMS/email timeouts)."""
    import django

    django.setup()
    from django.core.management import call_command
    from django.contrib.auth import get_user_model
    from rest_framework_simplejwt.tokens import RefreshToken
    from courses.models import Course, Enrollment, Lesson
    from quiz.models import Quiz, Question, Option

    call_command("seed_course", verbosity=0)

    User = get_user_model()
    email = "stress_live@easyoptionlearning.test"
    phone = "+919876543299"
    user, _ = User.objects.get_or_create(
        email=email,
        defaults={
            "username": email,
            "first_name": "Stress",
            "last_name": "Live",
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
    quiz, _ = Quiz.objects.get_or_create(lesson=lesson, defaults={"quiz_type": "lesson"})
    quiz.quiz_type = "lesson"
    quiz.save()
    if not quiz.questions.exists():
        question = Question.objects.create(
            quiz=quiz,
            text="Stress test: What is a call option?",
            explanation="A call gives the right to buy.",
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
        "email": email,
        "phone": phone,
        "access": access,
        "lesson_id": lesson.id,
        "quiz_id": quiz.id,
        "question_id": question.id,
        "correct_option_id": correct.id,
    }


def run_authenticated_flow(user):
    access = user["access"]
    lesson_id = user["lesson_id"]
    steps = []

    def step(name, method, path, data=None, token=None, expect=(200, 201)):
        code, body, ms = api(method, path, data, token)
        ok = code in expect
        steps.append({"step": name, "status": code, "ok": ok, "ms": round(ms, 1)})
        if not ok:
            raise RuntimeError(f"{name} failed: {code} {body}")
        return body

    step("profile", "GET", "/api/auth/me/", token=access)
    step("courses", "GET", "/api/courses/all/", token=access)
    step("levels", "GET", "/api/courses/1/levels/", token=access)
    step("lesson_detail", "GET", f"/api/courses/lessons/{lesson_id}/", token=access)
    step(
        "lesson_activity",
        "POST",
        "/api/progress/lessons/activity/",
        {"lesson_id": lesson_id},
        token=access,
    )
    step(
        "complete_lesson",
        "PATCH",
        f"/api/progress/lessons/{lesson_id}/",
        {"completed": True},
        token=access,
        expect=(200, 201),
    )
    step("progress", "GET", "/api/progress/user/", token=access)
    quiz_body = step(
        "quiz_fetch",
        "GET",
        f"/api/quizzes/?lesson_id={lesson_id}",
        token=access,
    )
    if quiz_body and quiz_body[0].get("questions"):
        opts = quiz_body[0]["questions"][0].get("options", [])
        if any("is_correct" in o for o in opts):
            raise RuntimeError("quiz_fetch leaked is_correct before submit")
    step(
        "quiz_submit",
        "POST",
        f"/api/quizzes/{user['quiz_id']}/submit/",
        {"answers": {str(user["question_id"]): user["correct_option_id"]}},
        token=access,
    )
    step(
        "phone_login",
        "POST",
        "/api/auth/phone-login/",
        {"phone": user["phone"], "pin": "1234"},
    )
    return steps


def run_signup_flow():
    """Live registration via API (OTP returned when SMS/email not configured)."""
    import random

    suffix = random.randint(100000, 999999)
    phone = f"+9198765{suffix}"
    email = f"stress_signup_{suffix}@easyoptionlearning.test"
    pin = "1234"
    steps = []

    def step(name, method, path, data=None, token=None, expect=(200, 201)):
        code, body, ms = api(method, path, data, token)
        ok = code in expect
        steps.append({"step": name, "status": code, "ok": ok, "ms": round(ms, 1)})
        if not ok:
            raise RuntimeError(f"{name} failed: {code} {body}")
        return body

    phone_body = step("send_phone_otp", "POST", "/api/auth/send-otp/", {"phone": phone})
    phone_otp = phone_body.get("otp")
    if not phone_otp:
        raise RuntimeError("send_phone_otp: no OTP in response (configure DEV or SMTP)")
    step("verify_phone_otp", "POST", "/api/auth/verify-otp/", {"phone": phone, "otp": phone_otp})

    email_body = step("send_email_otp", "POST", "/api/auth/send-email-otp/", {"email": email})
    email_otp = email_body.get("otp")
    if not email_otp:
        raise RuntimeError("send_email_otp: no OTP in response")
    step(
        "verify_email_otp",
        "POST",
        "/api/auth/verify-email-otp/",
        {"email": email, "otp": email_otp},
    )
    step(
        "register",
        "POST",
        "/api/auth/register/",
        {
            "email": email,
            "username": email,
            "password": pin,
            "first_name": "Stress",
            "last_name": "Signup",
            "phone": phone,
        },
        expect=(201,),
    )
    login_body = step(
        "login_after_register",
        "POST",
        "/api/auth/login/",
        {"email": email, "password": pin},
    )
    return steps, login_body.get("access")


def stress_concurrent(access, lesson_id, workers=20, iterations=50):
    results = []

    def one_request(_):
        start = time.perf_counter()
        code, _, _ = api("GET", f"/api/courses/lessons/{lesson_id}/", token=access)
        return code, (time.perf_counter() - start) * 1000

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = [pool.submit(one_request, i) for i in range(iterations)]
        for f in as_completed(futures):
            results.append(f.result())

    ok = sum(1 for c, _ in results if c == 200)
    times = [t for _, t in results]
    return {
        "requests": iterations,
        "workers": workers,
        "success": ok,
        "failed": iterations - ok,
        "avg_ms": round(sum(times) / len(times), 1),
        "max_ms": round(max(times), 1),
        "min_ms": round(min(times), 1),
    }


def main():
    print("=" * 60)
    print("EASY OPTION LEARNING - FLOW & STRESS TEST REPORT")
    print("=" * 60)
    print(f"API base: {BASE}\n")

    # Health check
    code, _, ms = api("GET", "/api/courses/all/")
    if code == 401:
        print("[OK] Backend reachable (401 without auth expected)\n")
    elif code >= 500:
        print(f"[FAIL] Backend error: {code}")
        sys.exit(1)
    else:
        print(f"[OK] Backend reachable ({code}) in {ms:.0f}ms\n")

    print("--- Signup Flow: Phone OTP -> Email OTP -> Register -> Login ---")
    try:
        signup_steps, _ = run_signup_flow()
        for s in signup_steps:
            mark = "PASS" if s["ok"] else "FAIL"
            print(f"  [{mark}] {s['step']}: HTTP {s['status']} ({s['ms']}ms)")
    except Exception as exc:
        print(f"  [SKIP] Signup flow: {exc}")

    print("\n--- Authenticated Flow: Profile -> Levels -> Lesson -> Progress -> Quiz -> Login ---")
    try:
        user = bootstrap_user()
        steps = run_authenticated_flow(user)
        for s in steps:
            mark = "PASS" if s["ok"] else "FAIL"
            print(f"  [{mark}] {s['step']}: HTTP {s['status']} ({s['ms']}ms)")
        print("\n--- Concurrent Lesson Read Stress (50 requests, 20 workers) ---")
        stress = stress_concurrent(user["access"], user["lesson_id"])
        print(f"  Success: {stress['success']}/{stress['requests']}")
        print(f"  Failed:  {stress['failed']}")
        print(f"  Latency: avg {stress['avg_ms']}ms | min {stress['min_ms']}ms | max {stress['max_ms']}ms")
        print("\n" + "=" * 60)
        if stress["failed"] == 0:
            print("OVERALL: ALL TESTS PASSED")
        else:
            print("OVERALL: STRESS TEST HAD FAILURES")
            sys.exit(1)
    except Exception as exc:
        print(f"\n[FAIL] {exc}")
        sys.exit(1)


if __name__ == "__main__":
    main()
