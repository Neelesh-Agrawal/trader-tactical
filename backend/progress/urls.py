from django.urls import path
from .views import (
    UserProgressView,
    CompletedLessonsView,
    LessonProgressView,
    ModuleProgressView,
    LevelProgressView,
    UserStreakView,
    UpdateStreakView,
    LessonActivityView,
)

urlpatterns = [
    # User progress endpoints
    path("user/", UserProgressView.as_view(), name="user-progress"),
    path(
        "lessons/completed/", CompletedLessonsView.as_view(), name="completed-lessons"
    ),
    # Individual progress tracking
    path(
        "lessons/<int:lesson_id>/", LessonProgressView.as_view(), name="lesson-progress"
    ),
    path(
        "modules/<int:module_id>/", ModuleProgressView.as_view(), name="module-progress"
    ),
    path("levels/<int:level_id>/", LevelProgressView.as_view(), name="level-progress"),
    # Streak endpoints
    path("streak/", UserStreakView.as_view(), name="user-streak"),
    path("streak/update/", UpdateStreakView.as_view(), name="update-streak"),
    path("lessons/activity/", LessonActivityView.as_view(), name="lesson-activity"),
]
