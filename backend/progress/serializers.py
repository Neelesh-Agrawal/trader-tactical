from rest_framework import serializers
from .models import (
    Certificate,
    LessonProgress,
    ModuleProgress,
    LevelProgress,
    UserStreak,
)


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


class CertificateSerializer(serializers.ModelSerializer):
    level_title = serializers.CharField(source="level.title", read_only=True)
    level_order = serializers.IntegerField(source="level.order", read_only=True)
    course_title = serializers.CharField(source="level.course.title", read_only=True)
    download_url = serializers.SerializerMethodField()

    class Meta:
        model = Certificate
        fields = (
            "id",
            "certificate_id",
            "level",
            "level_title",
            "level_order",
            "course_title",
            "issued_at",
            "storage_backend",
            "download_url",
        )
        read_only_fields = fields

    def get_download_url(self, obj):
        request = self.context.get("request")
        if not request:
            return f"/api/progress/certificates/{obj.id}/download/"
        return request.build_absolute_uri(
            f"/api/progress/certificates/{obj.id}/download/"
        )
