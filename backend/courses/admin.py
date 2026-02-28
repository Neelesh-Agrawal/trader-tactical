from django.contrib import admin
from .models import (
    Course,
    Level,
    Module,
    Lesson,
    LessonFAQ,
    LessonTakeaway,
    Enrollment,
)

print("courses.admin loaded")


class LessonFAQInline(admin.TabularInline):
    model = LessonFAQ
    extra = 1

class LessonTakeawayInline(admin.TabularInline):
    model = LessonTakeaway
    extra = 1

class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1
    show_change_link = True


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order')
    list_filter = ('module__level', 'module')
    ordering = ('module', 'order')
    inlines = [LessonFAQInline, LessonTakeawayInline]

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'level', 'order')
    list_filter = ('level',)
    ordering = ('level', 'order')
    inlines = [LessonInline]

@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    ordering = ('course', 'order')

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_published', 'created_at')
    list_filter = ('is_published',)
    search_fields = ('title',)

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("user", "course", "enrolled_at", "is_active")
    list_filter = ("is_active", "course")
    search_fields = ("user__email", "course__title")