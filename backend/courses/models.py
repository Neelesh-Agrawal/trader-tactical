import uuid

from django.db import models
from django.conf import settings
from django_ckeditor_5.fields import CKEditor5Field

LEVEL_CHOICES = [
    ("Beginner", "Beginner"),
    ("Intermediate", "Intermediate"),
    ("Advanced", "Advanced"),
    ("NISM", "NISM")
]

User = settings.AUTH_USER_MODEL


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    thumbnail = models.ImageField(
        upload_to="courses/thumbnails/", null=True, blank=True
    )
    price_inr = models.PositiveIntegerField(default=0)
    is_published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Level(models.Model):
    course = models.ForeignKey(Course, related_name="levels", on_delete=models.CASCADE)
    title = models.CharField(max_length=100, choices=LEVEL_CHOICES)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["order"]
        unique_together = ("course", "order")

    def __str__(self):
        return f"{self.course.title} - {self.title}"


class Module(models.Model):
    level = models.ForeignKey(Level, related_name="modules", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = CKEditor5Field(config_name="default", blank=True, default="")
    icon = models.CharField(max_length=50, blank=True, default="")
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ["order"]
        unique_together = ("level", "order")

    def __str__(self):
        return self.title

    def get_previous_module(self):
        return (
            Module.objects.filter(level=self.level, order__lt=self.order)
            .order_by("-order")
            .first()
        )


class Lesson(models.Model):
    module = models.ForeignKey(Module, related_name="lessons", on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    lesson_objective = CKEditor5Field(config_name="default", blank=True, default="")
    content = CKEditor5Field(config_name="default")
    common_mistakes = CKEditor5Field(config_name="default", blank=True, default="")
    key_takeaway = CKEditor5Field(config_name="default", blank=True, default="")
    practical_task = CKEditor5Field(config_name="default", blank=True, default="")
    order = models.PositiveIntegerField()
    estimated_time_minutes = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["order"]
        unique_together = ("module", "order")

    def __str__(self):
        return self.title

    def get_previous_lesson(self):
        return (
            Lesson.objects.filter(module=self.module, order__lt=self.order)
            .order_by("-order")
            .first()
        )


class LessonFAQ(models.Model):
    lesson = models.ForeignKey(Lesson, related_name="faqs", on_delete=models.CASCADE)
    question = models.CharField(max_length=500)
    answer = CKEditor5Field(config_name="default", blank=True, default="")

    def __str__(self):
        return self.question


class Enrollment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="enrollments")
    course = models.ForeignKey(
        "Course", on_delete=models.CASCADE, related_name="enrollments"
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ("user", "course")
        ordering = ["-enrolled_at"]

    def __str__(self):
        return f"{self.user} → {self.course}"


class CoursePayment(models.Model):
    STATUS_INITIATED = "initiated"
    STATUS_SUCCESS = "success"
    STATUS_FAILED = "failed"
    STATUS_PENDING = "pending"
    STATUS_HASH_MISMATCH = "hash_mismatch"

    STATUS_CHOICES = [
        (STATUS_INITIATED, "Initiated"),
        (STATUS_SUCCESS, "Success"),
        (STATUS_FAILED, "Failed"),
        (STATUS_PENDING, "Pending"),
        (STATUS_HASH_MISMATCH, "Hash Mismatch"),
    ]

    reference = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    txnid = models.CharField(max_length=64, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="course_payments")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="INR")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_INITIATED)
    payu_status = models.CharField(max_length=40, blank=True, default="")
    payu_payment_id = models.CharField(max_length=64, blank=True, default="")
    bank_ref_num = models.CharField(max_length=128, blank=True, default="")
    payment_mode = models.CharField(max_length=40, blank=True, default="")
    error_message = models.TextField(blank=True, default="")
    request_payload = models.JSONField(default=dict, blank=True)
    response_payload = models.JSONField(default=dict, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.txnid} ({self.status})"
