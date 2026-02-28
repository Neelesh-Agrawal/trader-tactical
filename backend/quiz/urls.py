from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import QuizViewSet, UserQuizAttemptsView

router = DefaultRouter()
router.register(r'quizzes', QuizViewSet, basename='quiz')

urlpatterns = [
    path("quizzes/attempts/", UserQuizAttemptsView.as_view(), name="quiz-attempts"),
    path('', include(router.urls)),
]
