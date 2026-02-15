from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import LessonProgress, ModuleProgress, LevelProgress, UserStreak
from .serializers import (
    LessonProgressSerializer,
    ModuleProgressSerializer,
    LevelProgressSerializer,
    UserStreakSerializer,
)
from .services import complete_lesson, complete_module, complete_level


class UserProgressView(APIView):
    """Get user's overall progress across all levels, modules, and lessons"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Get all progress data
        lesson_progress = LessonProgress.objects.filter(user=user)
        module_progress = ModuleProgress.objects.filter(user=user)
        level_progress = LevelProgress.objects.filter(user=user)

        data = {
            "lesson_progress": LessonProgressSerializer(
                lesson_progress, many=True
            ).data,
            "module_progress": ModuleProgressSerializer(
                module_progress, many=True
            ).data,
            "level_progress": LevelProgressSerializer(level_progress, many=True).data,
            "completed_lessons": lesson_progress.filter(completed=True).count(),
            "completed_modules": module_progress.filter(completed=True).count(),
            "completed_levels": level_progress.filter(completed=True).count(),
            "unlocked_modules": module_progress.filter(unlocked=True).count(),
            "unlocked_levels": level_progress.filter(unlocked=True).count(),
        }

        return Response(data)


class CompletedLessonsView(APIView):
    """Get completed lessons for current user"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        completed = LessonProgress.objects.filter(user=user, completed=True)
        serializer = LessonProgressSerializer(completed, many=True)
        return Response(serializer.data)


class LessonProgressView(generics.UpdateAPIView):
    """Update lesson progress (mark as completed)"""

    serializer_class = LessonProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        lesson_id = self.kwargs.get("lesson_id")
        user = self.request.user
        obj, created = LessonProgress.objects.get_or_create(
            user=user, lesson_id=lesson_id
        )
        return obj

    def perform_update(self, serializer):
        lesson_id = self.kwargs.get("lesson_id")
        data = serializer.validated_data

        # If marking as completed, trigger cascade
        if data.get("completed"):
            from courses.models import Lesson

            lesson = Lesson.objects.get(id=lesson_id)
            complete_lesson(self.request.user, lesson)
        else:
            serializer.save()


class ModuleProgressView(generics.UpdateAPIView):
    """Update module progress (mark as completed)"""

    serializer_class = ModuleProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        module_id = self.kwargs.get("module_id")
        user = self.request.user
        obj, created = ModuleProgress.objects.get_or_create(
            user=user, module_id=module_id
        )
        return obj


class LevelProgressView(generics.UpdateAPIView):
    """Update level progress (mark as completed/unlocked)"""

    serializer_class = LevelProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        level_id = self.kwargs.get("level_id")
        user = self.request.user
        obj, created = LevelProgress.objects.get_or_create(user=user, level_id=level_id)
        return obj


class UserStreakView(APIView):
    """Get user's streak data"""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        streak, created = UserStreak.objects.get_or_create(user=user)
        serializer = UserStreakSerializer(streak)
        return Response(serializer.data)


class UpdateStreakView(APIView):
    """Update user's streak - call this when user completes any activity"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        streak, created = UserStreak.objects.get_or_create(user=user)
        streak.update_streak()
        serializer = UserStreakSerializer(streak)
        return Response(serializer.data)


class LessonActivityView(APIView):
    """
    Track when user starts/reads a lesson.
    This updates the streak and can be called each time user opens a lesson.
    """

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        lesson_id = request.data.get("lesson_id")

        if not lesson_id:
            return Response(
                {"error": "lesson_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Update streak for this activity
        streak, created = UserStreak.objects.get_or_create(user=user)
        streak.update_streak()

        serializer = UserStreakSerializer(streak)
        return Response(serializer.data)
