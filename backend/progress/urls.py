from django.urls import path
from .views import (
    UserProgressView,
    CompletedLessonsView,
    LessonProgressView,
    ModuleProgressView,
    LevelProgressView,
)

urlpatterns = [
    # User progress endpoints
    path('user/', UserProgressView.as_view(), name='user-progress'),
    path('lessons/completed/', CompletedLessonsView.as_view(), name='completed-lessons'),
    
    # Individual progress tracking
    path('lessons/<int:lesson_id>/', LessonProgressView.as_view(), name='lesson-progress'),
    path('modules/<int:module_id>/', ModuleProgressView.as_view(), name='module-progress'),
    path('levels/<int:level_id>/', LevelProgressView.as_view(), name='level-progress'),
]
