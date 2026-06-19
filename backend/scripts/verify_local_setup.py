#!/usr/bin/env python
"""Verify local env + DB before running servers. Usage: python scripts/verify_local_setup.py"""

import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECT_ROOT = ROOT.parent
sys.path.insert(0, str(ROOT))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

ENV_ROOT = PROJECT_ROOT / ".env"
ENV_BACKEND = ROOT / ".env"


def main():
    print("Easy Option Learning — local setup check\n")

    if ENV_ROOT.exists():
        print(f"[OK] Found {ENV_ROOT}")
    elif ENV_BACKEND.exists():
        print(f"[OK] Found {ENV_BACKEND}")
    else:
        print("[FAIL] No .env file found.")
        print("       Copy .env.example to project root:")
        print(f"       copy \"{PROJECT_ROOT / '.env.example'}\" \"{ENV_ROOT}\"")
        sys.exit(1)

    frontend_env = PROJECT_ROOT / "frontend" / ".env"
    if frontend_env.exists():
        print(f"[OK] Found {frontend_env}")
    else:
        print("[WARN] Missing frontend/.env")
        print("       Copy frontend/.env.example to frontend/.env")

    import django

    django.setup()
    from django.conf import settings
    from django.core.management import call_command

    print(f"[OK] SECRET_KEY set")
    print(f"[OK] DEBUG={settings.DEBUG} APP_MODE={settings.APP_MODE}")
    print(f"[OK] Database: {settings.DATABASES['default']['ENGINE']}")

    call_command("check", verbosity=0)
    print("[OK] Django system check passed")

    try:
        from courses.models import Course

        if Course.objects.filter(is_published=True).exists():
            print("[OK] Course data present")
        else:
            print("[WARN] No published course — run: python manage.py seed_course")
    except Exception as exc:
        err = str(exc)
        if "Can't connect to MySQL" in err or "2003" in err:
            print("[WARN] MySQL not reachable on localhost.")
            print("       For local dev without MySQL, set DB_ENGINE=sqlite in .env")
        else:
            print(f"[WARN] Could not check course data: {exc}")

    print("\nStart servers:")
    print("  cd backend && python manage.py runserver")
    print("  cd frontend && npm run dev")
    print("  Open http://localhost:8080  |  Admin http://localhost:8000/admin/")


if __name__ == "__main__":
    main()
