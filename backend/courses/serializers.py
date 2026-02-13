from rest_framework import serializers
from .models import Course, Level, Module, Lesson
from progress.services import is_lesson_unlocked, is_module_unlocked

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = (
            'id',
            'title',
            'description',
            'is_published',
        )


class CourseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'title', 'description')

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ('id', 'title', 'order')

class LessonSerializer(serializers.ModelSerializer):
    is_unlocked = serializers.SerializerMethodField()

    class Meta:
        model = Lesson
        fields = ('id', 'title', 'order', 'is_unlocked')

    def get_is_unlocked(self, lesson):
        request = self.context.get('request')
        if not request:
            return False
        return is_lesson_unlocked(request.user, lesson)

class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    is_unlocked = serializers.SerializerMethodField()

    class Meta:
        model = Module
        fields = ('id', 'title', 'order', 'is_unlocked', 'lessons')

    def get_is_unlocked(self, module):
        request = self.context.get('request')
        if not request:
            return False
        return is_module_unlocked(request.user, module)

class CourseStructureSerializer(serializers.ModelSerializer):
    levels = LevelSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ('id', 'title', 'description', 'levels')

class LessonDetailSerializer(serializers.ModelSerializer):
    faqs = serializers.StringRelatedField(many=True)
    takeaways = serializers.StringRelatedField(many=True)

    class Meta:
        model = Lesson
        fields = (
            'id',
            'title',
            'content',
            'faqs',
            'takeaways',
        )
    