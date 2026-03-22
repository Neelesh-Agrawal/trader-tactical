import nested_admin
from django.contrib import admin
from django.db.models import Max
from django import forms
from django.forms.models import BaseInlineFormSet
from django.urls import reverse
from django.utils.html import format_html
from quiz.models import Quiz, Question, Option

from .models import (
    Course,
    Level,
    Module,
    Lesson,
    LessonFAQ,
    Enrollment,
)

print("courses.admin loaded")


class LessonFAQInline(nested_admin.NestedStackedInline):
    model = LessonFAQ
    extra = 1


class QuizOptionInline(nested_admin.NestedTabularInline):
    model = Option
    extra = 1
    fields = ("text", "is_correct")


class QuizQuestionInline(nested_admin.NestedStackedInline):
    model = Question
    extra = 1
    fields = ("text", "explanation", "order")
    readonly_fields = ("order",)
    inlines = [QuizOptionInline]


class QuizQuestionInlineFormSet(BaseInlineFormSet):
    def save_new(self, form, commit=True):
        obj = super().save_new(form, commit=False)
        if not obj.order:
            max_order = (
                Question.objects.filter(quiz=obj.quiz).aggregate(
                    max_order=Max("order")
                )["max_order"]
                or 0
            )
            obj.order = max_order + 1
        if commit:
            obj.save()
            form.save_m2m()
        return obj


QuizQuestionInline.formset = QuizQuestionInlineFormSet


class LessonQuizInlineFormSet(BaseInlineFormSet):
    def save_new(self, form, commit=True):
        obj = super().save_new(form, commit=False)
        obj.quiz_type = "lesson"
        obj.module = None
        obj.level = None
        if commit:
            obj.save()
            form.save_m2m()
        return obj


class LessonQuizInlineForm(forms.ModelForm):
    class Meta:
        model = Quiz
        fields = (
            "quiz_type",
            "pass_percentage",
            "cooldown_minutes",
            "time_limit_seconds",
        )
        widgets = {
            "quiz_type": forms.HiddenInput(),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["quiz_type"].initial = "lesson"

    def clean(self):
        cleaned_data = super().clean()
        cleaned_data["quiz_type"] = "lesson"
        return cleaned_data

    def save_existing(self, form, obj, commit=True):
        obj = super().save_existing(form, obj, commit=False)
        obj.quiz_type = "lesson"
        obj.module = None
        obj.level = None
        if commit:
            obj.save()
            form.save_m2m()
        return obj


class LessonQuizInline(nested_admin.NestedStackedInline):
    model = Quiz
    fk_name = "lesson"
    form = LessonQuizInlineForm
    formset = LessonQuizInlineFormSet
    extra = 0
    max_num = 1
    inlines = [QuizQuestionInline]
    fields = (
        "quiz_type",
        "pass_percentage",
        "cooldown_minutes",
        "time_limit_seconds",
    )

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Lesson)
class LessonAdmin(nested_admin.NestedModelAdmin):
    list_display = ("title", "module", "order")
    list_filter = ("module__level", "module")
    ordering = ("module", "order")
    inlines = [LessonFAQInline, LessonQuizInline]
    fieldsets = (
        (
            None,
            {
                "fields": (
                    "module",
                    "title",
                    "order",
                    "estimated_time_minutes",
                )
            },
        ),
        (
            "Lesson Objective",
            {
                "fields": ("lesson_objective",),
            },
        ),
        (
            "Content",
            {
                "fields": ("content",),
            },
        ),
        (
            "Common Mistakes",
            {
                "fields": ("common_mistakes",),
            },
        ),
        (
            "Key Takeaway",
            {
                "fields": ("key_takeaway",),
            },
        ),
        (
            "Practical Task",
            {
                "fields": ("practical_task",),
            },
        ),
        (
            "Lesson Quiz",
            {
                "fields": ("quiz_admin_link",),
            },
        ),
    )
    readonly_fields = ("quiz_admin_link",)

    def get_inline_instances(self, request, obj=None):
        inline_instances = super().get_inline_instances(request, obj)
        if obj is None:
            return [
                inline
                for inline in inline_instances
                if not isinstance(inline, LessonQuizInline)
            ]
        return inline_instances

    def quiz_admin_link(self, obj):
        if not obj or not obj.pk:
            return "Save the lesson first to configure quiz"
        try:
            quiz = obj.quiz
        except Exception:
            add_url = reverse("admin:quiz_quiz_add")
            return format_html(
                '<strong>No lesson quiz yet.</strong> <a href="{}?lesson={}&quiz_type=lesson">Create lesson quiz</a>',
                add_url,
                obj.id,
            )

        change_url = reverse("admin:quiz_quiz_change", args=[quiz.id])
        return format_html(
            '<strong>Lesson quiz configured.</strong> <a href="{}">Edit lesson quiz</a>',
            change_url,
        )

    quiz_admin_link.short_description = "Quiz"


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "level", "order")
    list_filter = ("level",)
    ordering = ("level", "order")


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order")
    list_filter = ("course",)
    ordering = ("course", "order")


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "is_published", "created_at")
    list_filter = ("is_published",)
    search_fields = ("title",)


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "enrolled_at", "is_active")
    list_filter = ("is_active", "course")
    search_fields = ("user__email", "course__title")
