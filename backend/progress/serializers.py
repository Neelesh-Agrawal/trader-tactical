from rest_framework import serializers
from .models import LessonProgress, ModuleProgress, LevelProgress, UserStreak


class LessonProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonProgress
        fields = ("id", "lesson_id", "completed", "completed_at")


class ModuleProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuleProgress
        fields = ("id", "module_id", "unlocked", "completed", "completed_at")


class LevelProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = LevelProgress
        fields = ("id", "level_id", "unlocked", "completed", "completed_at")


class UserStreakSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStreak
        fields = ("id", "current_streak", "longest_streak", "last_activity_date")
        read_only_fields = fields
