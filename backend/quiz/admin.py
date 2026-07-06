import nested_admin
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import models
from django_ckeditor_5.fields import CKEditor5Field
from django_ckeditor_5.widgets import CKEditor5Widget

from .models import (
    Quiz,
    Question,
    Option,
    QuizAttempt,
)
from .forms import FixedOptionInlineFormSet, QuestionAdminForm


class CKEditorAdminMixin:
    formfield_overrides = {
        CKEditor5Field: {"widget": CKEditor5Widget(config_name="default")},
    }


class OptionInline(nested_admin.NestedTabularInline):
    model = Option
    formset = FixedOptionInlineFormSet
    extra = 4
    min_num = 4
    max_num = 4
    validate_min = True
    validate_max = True
    fields = (
        "text",
        "is_correct",
    )


class QuestionInline(CKEditorAdminMixin, nested_admin.NestedStackedInline):
    model = Question
    form = QuestionAdminForm
    extra = 1
    fields = (
        "text",
        "explanation",
    )
    readonly_fields = ("order",)
    inlines = [OptionInline]


@admin.register(Quiz)
class QuizAdmin(CKEditorAdminMixin, nested_admin.NestedModelAdmin):
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
        (
            None,
            {
                "fields": ("quiz_type",),
            },
        ),
        (
            "Attach Quiz To (select exactly ONE)",
            {
                "fields": ("lesson", "module", "level"),
            },
        ),
        (
            "Rules",
            {
                "fields": ("pass_percentage", "cooldown_minutes"),
            },
        ),
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
                        Question.objects.filter(quiz=obj.quiz)
                        .aggregate(max_order=models.Max("order"))
                        .get("max_order")
                        or 0
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

    def get_changeform_initial_data(self, request):
        initial = super().get_changeform_initial_data(request)

        lesson_id = request.GET.get("lesson")
        quiz_type = request.GET.get("quiz_type")

        if lesson_id:
            initial["lesson"] = lesson_id
            initial["quiz_type"] = "lesson"

        if quiz_type in {"lesson", "module", "level"}:
            initial["quiz_type"] = quiz_type

        return initial


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
