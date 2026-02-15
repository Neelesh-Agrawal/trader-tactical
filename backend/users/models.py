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
    age = models.PositiveIntegerField(null=True, blank=True)

    REQUIRED_FIELDS = ["username"]
    USERNAME_FIELD = "email"

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
