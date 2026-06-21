from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import Quiz, QuizAttempt
from .serializers import QuizSerializer, QuizAttemptSerializer
from courses.models import Enrollment, Level, Module
from progress.models import LessonProgress, ModuleProgress
from progress.services import maybe_issue_level_certificate


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

    def _is_module_quiz_unlocked(self, module):
        total_lessons = module.lessons.count()
        completed_lessons = LessonProgress.objects.filter(
            user=self.request.user,
            lesson__module=module,
            completed=True,
        ).count()
        return total_lessons > 0 and total_lessons == completed_lessons

    def _is_level_quiz_unlocked(self, level):
        total_modules = level.modules.count()
        completed_modules = ModuleProgress.objects.filter(
            user=self.request.user,
            module__level=level,
            completed=True,
        ).count()
        return total_modules > 0 and total_modules == completed_modules

    def list(self, request, *args, **kwargs):
        module_id = request.query_params.get("module_id")
        level_id = request.query_params.get("level_id")

        if module_id:
            module = get_object_or_404(Module, id=module_id)
            if not Enrollment.objects.filter(
                user=request.user,
                course=module.level.course,
                is_active=True,
            ).exists():
                raise PermissionDenied("You must be enrolled in this course")
            if not self._is_module_quiz_unlocked(module):
                raise PermissionDenied(
                    "Complete all lessons in this module to unlock the module quiz"
                )

        if level_id:
            level = get_object_or_404(Level, id=level_id)
            if not Enrollment.objects.filter(
                user=request.user,
                course=level.course,
                is_active=True,
            ).exists():
                raise PermissionDenied("You must be enrolled in this course")
            if not self._is_level_quiz_unlocked(level):
                raise PermissionDenied(
                    "Complete all modules in this level to unlock the level quiz"
                )

        return super().list(request, *args, **kwargs)

    def get_object(self):
        """Override to add enrollment check"""
        obj = super().get_object()
        if not check_enrollment(self.request.user, obj):
            raise PermissionDenied(
                "You must be enrolled in this course to access this quiz"
            )

        if obj.quiz_type == "module" and obj.module:
            if not self._is_module_quiz_unlocked(obj.module):
                raise PermissionDenied(
                    "Complete all lessons in this module to unlock the module quiz"
                )

        if obj.quiz_type == "level" and obj.level:
            if not self._is_level_quiz_unlocked(obj.level):
                raise PermissionDenied(
                    "Complete all modules in this level to unlock the level quiz"
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
        correct_answers = {}

        for question in quiz.questions.prefetch_related("options"):
            correct_option = question.options.filter(is_correct=True).first()
            if correct_option:
                correct_answers[str(question.id)] = correct_option.id

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

        if passed and quiz.quiz_type == "level" and quiz.level:
            maybe_issue_level_certificate(request.user, quiz.level)

        response_data = QuizAttemptSerializer(attempt).data
        response_data["correct_answers"] = correct_answers
        return Response(response_data)

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
