from .models import LessonProgress, ModuleProgress, LevelProgress
from django.utils import timezone


def is_lesson_unlocked(user, lesson):
    """
    A lesson is unlocked if:
    - It has no previous lesson OR
    - The previous lesson is completed
    """
    previous = lesson.get_previous_lesson()
    if not previous:
        return True

    return LessonProgress.objects.filter(
        user=user,
        lesson=previous,
        completed=True
    ).exists()


def is_module_unlocked(user, module):
    """
    A module is unlocked if:
    - It has no previous module OR
    - The previous module is completed
    """
    previous = module.get_previous_module()
    if not previous:
        return True

    return ModuleProgress.objects.filter(
        user=user,
        module=previous,
        completed=True
    ).exists()


def complete_lesson(user, lesson):
    """
    Marks a lesson as completed and automatically:
    - completes the module if all lessons are done
    - completes the level if all modules are done
    - unlocks the next module
    """

    lesson_progress, _ = LessonProgress.objects.get_or_create(
        user=user,
        lesson=lesson
    )

    if lesson_progress.completed:
        return  # Idempotent (safe to call twice)

    lesson_progress.completed = True
    lesson_progress.completed_at = timezone.now()
    lesson_progress.save()

    module = lesson.module
    total_lessons = module.lessons.count()

    completed_lessons = LessonProgress.objects.filter(
        user=user,
        lesson__module=module,
        completed=True
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
        defaults={
            "completed": True,
            "completed_at": timezone.now()
        }
    )

    # Unlock next module if it exists
    from courses.models import Module
    next_modules = Module.objects.filter(
        level=module.level,
        order__gt=module.order
    ).order_by('order')
    
    if next_modules.exists():
        next_module = next_modules.first()
        ModuleProgress.objects.get_or_create(
            user=user,
            module=next_module,
            defaults={"unlocked": True}
        )

    # Check if all modules in level are completed
    level = module.level
    total_modules = level.modules.count()

    completed_modules = ModuleProgress.objects.filter(
        user=user,
        module__level=level,
        completed=True
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
        defaults={
            "completed": True,
            "completed_at": timezone.now()
        }
    )

    # Unlock next level if it exists
    from courses.models import Level
    next_levels = Level.objects.filter(
        course=level.course,
        order__gt=level.order
    ).order_by('order')
    
    if next_levels.exists():
        next_level = next_levels.first()
        LevelProgress.objects.get_or_create(
            user=user,
            level=next_level,
            defaults={"unlocked": True}
        )



