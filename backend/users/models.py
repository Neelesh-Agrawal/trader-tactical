from django.contrib.auth.models import AbstractUser
from django.db import models

from phonenumber_field.modelfields import PhoneNumberField

SEX_CHOICES = [
    ('M', 'Male'),
    ('F', 'Female'),
    ('O', 'Other'),
    ('N', 'Prefer not to say'),
]

STATE_CHOICES = [
    ('MH', 'Maharashtra'),
    ('DL', 'Delhi'),
    ('KA', 'Karnataka'),
    ('TN', 'Tamil Nadu'),
    ('GJ', 'Gujarat'),
    ('RJ', 'Rajasthan'),
    ('UP', 'Uttar Pradesh'),
    ('WB', 'West Bengal'),
    ('PB', 'Punjab'),
    ('HR', 'Haryana'),
    ('JK', 'Jammu and Kashmir'),
    ('AP', 'Andhra Pradesh'),
    ('TG', 'Telangana'),
    ('KL', 'Kerala'),
    ('OR', 'Odisha'),
    ('BR', 'Bihar'),
    ('CT', 'Chhattisgarh'),
    ('JH', 'Jharkhand'),
    ('AS', 'Assam'),
    ('ML', 'Meghalaya'),
    ('MN', 'Manipur'),
    ('MZ', 'Mizoram'),
    ('NL', 'Nagaland'),
    ('TR', 'Tripura'),
    ('SK', 'Sikkim'),
    ('AR', 'Arunachal Pradesh'),
    ('HP', 'Himachal Pradesh'),
    ('UT', 'Uttarakhand'),
    ('CG', 'Chandigarh'),
    ('DN', 'Dadra and Nagar Haveli and Daman and Diu'),
    ('LD', 'Lakshadweep'),
    ('AN', 'Andaman and Nicobar Islands'),
]

# Create your models here.
class User(AbstractUser):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    phone = PhoneNumberField(unique=True)
    state = models.CharField(max_length=2, choices=STATE_CHOICES, null=True, blank=True)
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, default='N')
    age = models.PositiveIntegerField(null=True, blank=True)

    REQUIRED_FIELDS = ['username']
    USERNAME_FIELD = 'email'

    def __str__(self):
        return f"{self.first_name} {self.last_name}"
