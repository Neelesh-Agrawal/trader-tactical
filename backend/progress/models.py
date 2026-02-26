# progress/models.py
from django.conf import settings
from django.db import models
from courses.models import Lesson, Module, Level
from django.utils import timezone
from datetime import date

User = settings.AUTH_USER_MODEL


class UserStreak(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="streak")
    current_streak = models.PositiveIntegerField(default=1)
    longest_streak = models.PositiveIntegerField(default=1)
    last_activity_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "User Streak"
        verbose_name_plural = "User Streaks"

    def __str__(self):
        return f"{self.user} - Streak: {self.current_streak}"

    def update_streak(self):
        """
        Update streak based on activity.
        Call this method whenever user completes any lesson activity.
        """
        today = date.today()

        if self.last_activity_date is None:
            # First activity ever - streak already initialized to 1
            pass
        elif self.last_activity_date == today:
            # Already recorded activity today, no change
            pass
        elif self.last_activity_date == today.replace(day=today.day - 1):
            # Consecutive day - increment streak
            self.current_streak += 1
            if self.current_streak > self.longest_streak:
                self.longest_streak = self.current_streak
        else:
            # Missed days - reset streak
            self.current_streak = 1

        self.last_activity_date = today
        self.save()

    @classmethod
    def get_or_create_for_user(cls, user):
        """Get or create streak for user"""
        return cls.objects.get_or_create(user=user)


class LessonProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "lesson")
        ordering = ("lesson__order",)

    def mark_completed(self):
        if not self.completed:
            self.completed = True
            self.completed_at = timezone.now()
            self.save()

    def __str__(self):
        return f"{self.user} - {self.lesson}"


class ModuleProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)

    unlocked = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "module")

    def __str__(self):
        return f"{self.user} - {self.module}"


class LevelProgress(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)

    unlocked = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "level")

    def __str__(self):
        return f"{self.user} - {self.level}"
