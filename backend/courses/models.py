from django.db import models
from django.conf import settings
from django_ckeditor_5.fields import CKEditor5Field

LEVEL_CHOICES = [
    ('Beginner', 'Beginner'),
    ('Intermediate', 'Intermediate'),
    ('Advanced', 'Advanced'),
]

User = settings.AUTH_USER_MODEL

class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(
        upload_to='courses/thumbnails/',
        null=True,
        blank=True
    )
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Level(models.Model):
    course = models.ForeignKey(
        Course,
        related_name='levels',
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=100, choices=LEVEL_CHOICES)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']
        unique_together = ('course', 'order')

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Module(models.Model):
    level = models.ForeignKey(
        Level,
        related_name='modules',
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']
        unique_together = ('level', 'order')

    def __str__(self):
        return self.title

class Lesson(models.Model):
    module = models.ForeignKey(
        Module,
        related_name='lessons',
        on_delete=models.CASCADE
    )
    title = models.CharField(max_length=255)
    content = CKEditor5Field(config_name='default')
    order = models.PositiveIntegerField()
    estimated_time_minutes = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ['order']
        unique_together = ('module', 'order')

    def __str__(self):
        return self.title


class LessonFAQ(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        related_name='faqs',
        on_delete=models.CASCADE
    )
    question = models.CharField(max_length=500)
    answer = models.TextField()

    def __str__(self):
        return self.question

class LessonTakeaway(models.Model):
    lesson = models.ForeignKey(
        Lesson,
        related_name='takeaways',
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=500)

    def __str__(self):
        return self.text

class Enrollment(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )
    course = models.ForeignKey(
        "Course",
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "course")
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.user} → {self.course}"
