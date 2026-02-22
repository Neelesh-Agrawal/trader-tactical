from django.contrib.auth.models import AbstractUser
from django.db import models

from phonenumber_field.modelfields import PhoneNumberField

SEX_CHOICES = [
    ("M", "Male"),
    ("F", "Female"),
    ("O", "Other"),
    ("N", "Prefer not to say"),
]

OCCUPATION_CHOICES = [
    ("student", "Student"),
    ("trader", "Full-time Trader"),
    ("professional", "Finance Professional"),
    ("entrepreneur", "Entrepreneur"),
    ("employee", "Salaried Employee"),
    ("business", "Business Owner"),
    ("investor", "Investor"),
    ("other", "Other"),
]


class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    phone = PhoneNumberField(unique=True)
    occupation = models.CharField(
        max_length=20, choices=OCCUPATION_CHOICES, null=True, blank=True
    )
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, default="N")
    birth_date = models.DateField(null=True, blank=True)
    phone_verified = models.BooleanField(default=False)

    REQUIRED_FIELDS = ["username"]
    USERNAME_FIELD = "email"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class PhoneVerification(models.Model):
    phone = PhoneNumberField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=["phone", "-created_at"]),
        ]

    def __str__(self):
        return f"{self.phone} - {'verified' if self.verified else 'pending'}"
