# progress/admin.py
from django.contrib import admin
from .models import Certificate, LessonProgress, ModuleProgress, LevelProgress


@admin.register(LessonProgress)
class LessonProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "lesson", "completed", "completed_at")
    list_filter = ("completed", "lesson__module__level")
    search_fields = ("user__email", "lesson__title")


@admin.register(ModuleProgress)
class ModuleProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "module", "completed")


@admin.register(LevelProgress)
class LevelProgressAdmin(admin.ModelAdmin):
    list_display = ("user", "level", "unlocked", "completed")


@admin.register(Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("user", "level", "certificate_id", "issued_at", "storage_backend")
    list_filter = ("storage_backend", "issued_at")
    search_fields = (
        "user__email",
        "level__title",
        "level__course__title",
        "certificate_id",
    )
