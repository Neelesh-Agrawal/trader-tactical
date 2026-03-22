from .certificate_storage import get_certificate_storage
from .models import (
    Certificate,
    LessonProgress,
    ModuleProgress,
    LevelProgress,
    UserStreak,
)
from django.utils import timezone


def is_lesson_unlocked(user, lesson):
    """
    A lesson is unlocked if:
    - It has no previous lesson OR
    - The previous lesson is completed
    """
    get_previous = getattr(lesson, "get_previous_lesson", None)
    if callable(get_previous):
        previous = get_previous()
    else:
        from courses.models import Lesson

        previous = (
            Lesson.objects.filter(module=lesson.module, order__lt=lesson.order)
            .order_by("-order")
            .first()
        )
    if not previous:
        return True

    return LessonProgress.objects.filter(
        user=user, lesson=previous, completed=True
    ).exists()


def is_module_unlocked(user, module):
    """
    A module is unlocked if:
    - It has no previous module OR
    - The previous module is completed
    """
    get_previous = getattr(module, "get_previous_module", None)
    if callable(get_previous):
        previous = get_previous()
    else:
        from courses.models import Module

        previous = (
            Module.objects.filter(level=module.level, order__lt=module.order)
            .order_by("-order")
            .first()
        )
    if not previous:
        return True

    return ModuleProgress.objects.filter(
        user=user, module=previous, completed=True
    ).exists()


def update_user_streak(user):
    """
    Update user's streak when they complete any activity.
    This is called from complete_lesson and can be called from other activity endpoints.
    """
    streak, created = UserStreak.objects.get_or_create(user=user)
    streak.update_streak()
    return streak


def complete_lesson(user, lesson):
    """
    Marks a lesson as completed and automatically:
    - completes the module if all lessons are done
    - completes the level if all modules are done
    - unlocks the next module
    - updates user's streak
    """

    lesson_progress, _ = LessonProgress.objects.get_or_create(user=user, lesson=lesson)

    if lesson_progress.completed:
        return  # Idempotent (safe to call twice)

    lesson_progress.completed = True
    lesson_progress.completed_at = timezone.now()
    lesson_progress.save()

    # Update user's streak
    update_user_streak(user)

    module = lesson.module
    total_lessons = module.lessons.count()

    completed_lessons = LessonProgress.objects.filter(
        user=user, lesson__module=module, completed=True
    ).count()

    if completed_lessons == total_lessons:
        complete_module(user, module)


def complete_module(user, module):
    """
    Marks a module as completed and:
    - completes the level if all modules are done
    - unlocks the next module
    """
    ModuleProgress.objects.update_or_create(
        user=user,
        module=module,
        defaults={"completed": True, "completed_at": timezone.now()},
    )

    # Unlock next module if it exists
    from courses.models import Module

    next_modules = Module.objects.filter(
        level=module.level, order__gt=module.order
    ).order_by("order")

    if next_modules.exists():
        next_module = next_modules.first()
        ModuleProgress.objects.get_or_create(
            user=user, module=next_module, defaults={"unlocked": True}
        )

    # Check if all modules in level are completed
    level = module.level
    total_modules = level.modules.count()

    completed_modules = ModuleProgress.objects.filter(
        user=user, module__level=level, completed=True
    ).count()

    if completed_modules == total_modules:
        complete_level(user, level)


def complete_level(user, level):
    """
    Marks a level as completed and:
    - unlocks the next level
    """
    LevelProgress.objects.update_or_create(
        user=user,
        level=level,
        defaults={"completed": True, "completed_at": timezone.now()},
    )

    # Unlock next level if it exists
    from courses.models import Level

    next_levels = Level.objects.filter(
        course=level.course, order__gt=level.order
    ).order_by("order")

    if next_levels.exists():
        next_level = next_levels.first()
        LevelProgress.objects.get_or_create(
            user=user, level=next_level, defaults={"unlocked": True}
        )

    maybe_issue_level_certificate(user, level)


def is_level_ready_for_certificate(user, level):
    from quiz.models import QuizAttempt

    level_quiz_passed = QuizAttempt.objects.filter(
        user=user,
        quiz__quiz_type="level",
        quiz__level=level,
        passed=True,
    ).exists()
    if not level_quiz_passed:
        return False

    total_modules = level.modules.count()
    completed_modules = ModuleProgress.objects.filter(
        user=user,
        module__level=level,
        completed=True,
    ).count()

    return total_modules > 0 and completed_modules == total_modules


def maybe_issue_level_certificate(user, level):
    if not is_level_ready_for_certificate(user, level):
        return None

    certificate, created = Certificate.objects.get_or_create(
        user=user,
        level=level,
        defaults={"storage_backend": "local"},
    )

    if not created:
        return certificate

    storage = get_certificate_storage()
    certificate.storage_backend = storage.backend_name
    filename = f"{certificate.certificate_id}.png"
    storage.save_certificate(certificate, filename)
    certificate.save(update_fields=["storage_backend"])

    return certificate
