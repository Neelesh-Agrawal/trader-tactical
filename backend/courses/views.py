from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from .models import Course, Lesson, Enrollment, Level, Module
from django.shortcuts import get_object_or_404

from progress.services import is_lesson_unlocked

from .serializers import (
    CourseSerializer,
    CourseListSerializer,
    LessonDetailSerializer,
    LessonSerializer,
    LevelSerializer,
    ModuleSerializer,
)


# Course Endpoints
class CourseListView(generics.ListAPIView):
    """List all published courses"""

    queryset = Course.objects.filter(is_published=True)
    serializer_class = CourseListSerializer
    permission_classes = [IsAuthenticated]


class CourseDetailView(APIView):
    """Get course details (requires enrollment)"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        enrollment = get_object_or_404(
            Enrollment, user=request.user, course_id=course_id
        )
        course = enrollment.course
        serializer = CourseSerializer(course)
        return Response(serializer.data)


class EnrolledCourseListView(APIView):
    """List all courses user is enrolled in"""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        enrollments = Enrollment.objects.filter(user=request.user).select_related(
            "course"
        )
        courses = [e.course for e in enrollments]
        serializer = CourseSerializer(courses, many=True)
        return Response(serializer.data)


class EnrollCourseView(APIView):
    """Enroll user in a course"""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        course_id = request.data.get("course_id")

        course = Course.objects.filter(id=course_id, is_published=True).first()

        if not course:
            return Response(
                {"detail": "Course not found"}, status=status.HTTP_404_NOT_FOUND
            )

        enrollment, created = Enrollment.objects.get_or_create(
            user=request.user, course=course
        )

        if created:
            from progress.services import unlock_initial_course_progress

            unlock_initial_course_progress(request.user, course)
            return Response(
                {"detail": "Enrolled successfully"}, status=status.HTTP_201_CREATED
            )

        return Response({"detail": "Already enrolled"}, status=status.HTTP_200_OK)


# Level Endpoints
class LevelListView(APIView):
    """List all levels for a course"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        levels = Level.objects.filter(course_id=course_id).order_by("order")

        serializer = LevelSerializer(
            levels, many=True, context={"request": request}
        )
        return Response(serializer.data)


class LevelDetailView(APIView):
    """Get a specific level with all its modules"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, level_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        level = get_object_or_404(Level, id=level_id, course_id=course_id)

        serializer = LevelSerializer(level, context={"request": request})
        return Response(serializer.data)


# Module Endpoints
class ModuleListView(APIView):
    """List all modules for a level"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, level_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        modules = Module.objects.filter(
            level_id=level_id, level__course_id=course_id
        ).order_by("order")

        serializer = ModuleSerializer(
            modules, many=True, context={"request": request}
        )
        return Response(serializer.data)


class ModuleDetailView(APIView):
    """Get a specific module with all its lessons"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, level_id, module_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        module = get_object_or_404(
            Module, id=module_id, level_id=level_id, level__course_id=course_id
        )

        serializer = ModuleSerializer(module, context={"request": request})
        return Response(serializer.data)


# Lesson Endpoints
class LessonListView(APIView):
    """List all lessons for a module"""

    permission_classes = [IsAuthenticated]

    def get(self, request, course_id, module_id):
        # Verify enrollment
        get_object_or_404(Enrollment, user=request.user, course_id=course_id)

        lessons = Lesson.objects.filter(
            module_id=module_id, module__level__course_id=course_id
        ).order_by("order")

        serializer = LessonSerializer(
            lessons, many=True, context={"request": request}
        )
        return Response(serializer.data)


class LessonDetailView(generics.RetrieveAPIView):
    """Get lesson details with rich lesson sections and FAQs"""

    queryset = Lesson.objects.select_related(
        "module", "module__level"
    ).prefetch_related("faqs")
    serializer_class = LessonDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        lesson = super().get_object()

        is_enrolled = Enrollment.objects.filter(
            user=self.request.user,
            course=lesson.module.level.course,
            is_active=True,
        ).exists()
        if not is_enrolled:
            raise PermissionDenied("You must be enrolled in this course")

        if not is_lesson_unlocked(self.request.user, lesson):
            raise PermissionDenied(
                "Complete the previous lesson before opening this lesson"
            )

        return lesson


class LessonFAQListView(APIView):
    """Get FAQs for a specific lesson"""

    permission_classes = [IsAuthenticated]

    def get(self, request, lesson_id):
        from .models import LessonFAQ

        faqs = LessonFAQ.objects.filter(lesson_id=lesson_id)
        data = [
            {"id": faq.id, "question": faq.question, "answer": faq.answer}
            for faq in faqs
        ]
        return Response(data)
