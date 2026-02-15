from rest_framework import serializers
from .models import Course, Level, Module, Lesson
from progress.services import is_lesson_unlocked, is_module_unlocked


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = (
            "id",
            "title",
            "description",
            "is_published",
        )


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "title", "description")


class LessonSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = (
            "id",
            "title",
            "objective",
            "order",
            "estimated_time_minutes",
            "is_unlocked",
        )

    def get_is_unlocked(self, lesson):
        request = self.context.get("request")
        if not request:
            return False
        return is_lesson_unlocked(request.user, lesson)


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    is_unlocked = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = (
            "id",
            "title",
            "description",
            "icon",
            "order",
            "is_unlocked",
            "lessons",
        )

    def get_is_unlocked(self, module):
        request = self.context.get("request")
        if not request:
            return False
        return is_module_unlocked(request.user, module)


class LevelSerializer(serializers.ModelSerializer):
    modules = ModuleSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ("id", "title", "order", "modules")


class CourseStructureSerializer(serializers.ModelSerializer):
    levels = LevelSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ("id", "title", "description", "levels")


class LessonDetailSerializer(serializers.ModelSerializer):
    faqs = serializers.SerializerMethodField()
    takeaways = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = (
            "id",
            "title",
            "objective",
            "content",
            "estimated_time_minutes",
            "faqs",
            "takeaways",
        )

    def get_faqs(self, obj):
        return [
            {"id": faq.id, "question": faq.question, "answer": faq.answer}
            for faq in obj.faqs.all()
        ]

    def get_takeaways(self, obj):
        return [
            {"id": takeaway.id, "text": takeaway.text}
            for takeaway in obj.takeaways.all()
        ]
