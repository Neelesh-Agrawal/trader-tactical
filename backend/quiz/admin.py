import nested_admin
from django.contrib import admin
from django.core.exceptions import ValidationError

from .models import (
    Quiz,
    Question,
    Option,
    QuizAttempt,
)
from django.db import models


class OptionInline(nested_admin.NestedTabularInline):
    model = Option
    extra = 4
    fields = (
        "text",
        "is_correct",
    )


class QuestionInline(nested_admin.NestedStackedInline):
    model = Question
    extra = 1
    fields = (
        "text",
        "explanation",
    )
    readonly_fields = ("order",)
    inlines = [OptionInline]


@admin.register(Quiz)
class QuizAdmin(nested_admin.NestedModelAdmin):
    list_display = (
        "quiz_type",
        "attached_to",
        "pass_percentage",
        "cooldown_minutes",
    )
    list_filter = ("quiz_type",)
    search_fields = (
        "lesson__title",
        "module__title",
        "level__title",
    )
    inlines = [QuestionInline]

    fieldsets = (
        (None, {
            "fields": ("quiz_type",),
        }),
        ("Attach Quiz To (select exactly ONE)", {
            "fields": ("lesson", "module", "level"),
        }),
        ("Rules", {
            "fields": ("pass_percentage", "cooldown_minutes"),
        }),
    )

    def attached_to(self, obj):
        return obj.lesson or obj.module or obj.level

    attached_to.short_description = "Attached To"

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)

        for obj in instances:
            if isinstance(obj, Question):
                if not obj.order or obj.order == 0:
                    last_order = (
                        Question.objects
                        .filter(quiz=obj.quiz)
                        .aggregate(max_order=models.Max("order"))
                        .get("max_order") or 0
                    )
                    obj.order = last_order + 1

            obj.save()

        formset.save_m2m()

    def save_model(self, request, obj, form, change):
        parents = [obj.lesson, obj.module, obj.level]
        if sum(parent is not None for parent in parents) != 1:
            raise ValidationError(
                "Quiz must be attached to exactly ONE of: Lesson, Module, or Level."
            )
        super().save_model(request, obj, form, change)


@admin.register(QuizAttempt)
class QuizAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "quiz",
        "score",
        "passed",
        "attempted_at",
    )
    list_filter = (
        "passed",
        "quiz__quiz_type",
    )
    readonly_fields = list_display

