from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.utils import timezone
from django.shortcuts import get_object_or_404
from .models import Quiz, QuizAttempt
from .serializers import QuizSerializer, QuizAttemptSerializer
from courses.models import Enrollment


def check_enrollment(user, quiz):
    """Check if user is enrolled in the course that owns this quiz"""
    if quiz.lesson:
        course = quiz.lesson.module.level.course
    elif quiz.module:
        course = quiz.module.level.course
    elif quiz.level:
        course = quiz.level.course
    else:
        return False

    return Enrollment.objects.filter(user=user, course=course, is_active=True).exists()


class QuizViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Quiz.objects.prefetch_related("questions__options")
    serializer_class = QuizSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """Filter quizzes by lesson, module, or level"""
        queryset = super().get_queryset()
        lesson_id = self.request.query_params.get("lesson_id")
        module_id = self.request.query_params.get("module_id")
        level_id = self.request.query_params.get("level_id")

        if lesson_id:
            queryset = queryset.filter(lesson_id=lesson_id)
        elif module_id:
            queryset = queryset.filter(module_id=module_id)
        elif level_id:
            queryset = queryset.filter(level_id=level_id)

        return queryset

    def get_object(self):
        """Override to add enrollment check"""
        obj = super().get_object()
        if not check_enrollment(self.request.user, obj):
            from rest_framework.exceptions import PermissionDenied

            raise PermissionDenied(
                "You must be enrolled in this course to access this quiz"
            )
        return obj

    @action(detail=True, methods=["post"], url_path="submit")
    def submit_quiz(self, request, pk=None):
        """Submit quiz answers and calculate score"""
        quiz = self.get_object()
        answers = request.data.get("answers", {})  # {question_id: option_id}

        if not answers:
            return Response(
                {"error": "No answers provided"}, status=status.HTTP_400_BAD_REQUEST
            )

        correct_count = 0
        total_questions = quiz.questions.count()

        for question_id, option_id in answers.items():
            try:
                question = quiz.questions.get(id=question_id)
                option = question.options.get(id=option_id)
                if option.is_correct:
                    correct_count += 1
            except Exception:
                pass

        score = (correct_count / total_questions * 100) if total_questions > 0 else 0
        passed = score >= quiz.pass_percentage

        # Save attempt
        attempt = QuizAttempt.objects.create(
            user=request.user, quiz=quiz, score=score, passed=passed
        )

        return Response(QuizAttemptSerializer(attempt).data)

    @action(detail=True, methods=["get"])
    def user_attempts(self, request, pk=None):
        """Get user's quiz attempts"""
        quiz = self.get_object()
        attempts = quiz.attempts.filter(user=request.user).order_by("-attempted_at")
        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)


class UserQuizAttemptsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        attempts = (
            QuizAttempt.objects.filter(user=request.user)
            .select_related("quiz", "quiz__lesson", "quiz__module", "quiz__level")
            .order_by("-attempted_at")
        )

        serializer = QuizAttemptSerializer(attempts, many=True)
        return Response(serializer.data)
