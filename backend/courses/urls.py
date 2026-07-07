from django.urls import path
from .views import (
    CourseListView,
    CourseDetailView,
    EnrolledCourseListView,
    PaymentCheckoutView,
    PaymentReturnView,
    LevelListView,
    LevelDetailView,
    ModuleListView,
    ModuleDetailView,
    LessonListView,
    LessonDetailView,
    LessonFAQListView,
)

urlpatterns = [
    # Course endpoints
    path('', EnrolledCourseListView.as_view(), name='enrolled-courses'),
    path('all/', CourseListView.as_view(), name='all-courses'),
    path('payments/initiate/', PaymentCheckoutView.as_view(), name='payment-initiate'),
    path('payments/payu/return/', PaymentReturnView.as_view(), name='payment-return'),
    path('<int:course_id>/', CourseDetailView.as_view(), name='course-detail'),

    # Level endpoints
    path('<int:course_id>/levels/', LevelListView.as_view(), name='level-list'),
    path('<int:course_id>/levels/<int:level_id>/', LevelDetailView.as_view(), name='level-detail'),

    # Module endpoints
    path('<int:course_id>/levels/<int:level_id>/modules/', ModuleListView.as_view(), name='module-list'),
    path('<int:course_id>/levels/<int:level_id>/modules/<int:module_id>/', ModuleDetailView.as_view(), name='module-detail'),

    # Lesson endpoints
    path('<int:course_id>/modules/<int:module_id>/lessons/', LessonListView.as_view(), name='lesson-list'),
    path('lessons/<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('lessons/<int:lesson_id>/faqs/', LessonFAQListView.as_view(), name='lesson-faqs'),
]
