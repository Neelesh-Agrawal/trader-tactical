# quizzes/models.py
from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL


class Quiz(models.Model):
    QUIZ_TYPE_CHOICES = (
        ("lesson", "Lesson"),
        ("module", "Module"),
        ("level", "Level"),
    )

    quiz_type = models.CharField(max_length=10, choices=QUIZ_TYPE_CHOICES)

    lesson = models.OneToOneField(
        "courses.Lesson",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="quiz"
    )
    module = models.OneToOneField(
        "courses.Module",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="quiz"
    )
    level = models.OneToOneField(
        "courses.Level",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="quiz"
    )

    pass_percentage = models.PositiveIntegerField(default=70)
    cooldown_minutes = models.PositiveIntegerField(default=30)
    time_limit_seconds = models.PositiveIntegerField(default=45)  # Per question

    def __str__(self):
        return f"{self.quiz_type.capitalize()} Quiz"

class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="questions"
    )

    text = models.TextField()
    explanation = models.TextField(
        help_text="Explanation shown after answering"
    )

    order = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.text[:60]

class Option(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name="options"
    )

    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="answers")
    text = models.CharField(max_length=255)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class QuizAttempt(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="quiz_attempts"
    )
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="attempts"
    )

    score = models.FloatField()
    passed = models.BooleanField()
    attempted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} – {self.quiz} – {self.score}%"