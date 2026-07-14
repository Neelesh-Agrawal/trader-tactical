import logging
from rest_framework import serializers
from .models import Quiz, Question, Option, QuizAttempt

logger = logging.getLogger(__name__)


class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ('id', 'text', 'is_correct')


class OptionPublicSerializer(serializers.ModelSerializer):
    """Quiz-taking view: do not expose correct answers."""

    class Meta:
        model = Option
        fields = ('id', 'text')


class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'explanation', 'order', 'options')


class QuestionPublicSerializer(serializers.ModelSerializer):
    options = OptionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ('id', 'text', 'explanation', 'order', 'options')


class QuizSerializer(serializers.ModelSerializer):
    questions = QuestionPublicSerializer(many=True, read_only=True)
    name = serializers.SerializerMethodField()

    class Meta:
        model = Quiz
        fields = ('id', 'quiz_type', 'pass_percentage', 'time_limit_seconds', 'cooldown_minutes', 'questions', 'name')

    def get_name(self, obj):
        """Get the name of the related lesson, module, or level"""
        try:
            if obj.lesson:
                return obj.lesson.title
            elif obj.module:
                return obj.module.title
            elif obj.level:
                return obj.level.title
        except Exception as e:
            logger.error(f"Error getting quiz name: {e}")
        return 'Quiz'

class QuizAttemptSerializer(serializers.ModelSerializer):
    quiz_type = serializers.CharField(source="quiz.quiz_type", read_only=True)
    quiz_id = serializers.IntegerField(source="quiz.id", read_only=True)

    lesson_id = serializers.IntegerField(source="quiz.lesson.id", read_only=True, allow_null=True)
    module_id = serializers.IntegerField(source="quiz.module.id", read_only=True, allow_null=True)
    level_id = serializers.IntegerField(source="quiz.level.id", read_only=True, allow_null=True)

    class Meta:
        model = QuizAttempt
        fields = (
            "id",
            "quiz_id",
            "quiz_type",
            "lesson_id",
            "module_id",
            "level_id",
            "score",
            "passed",
            "attempted_at",
        )
