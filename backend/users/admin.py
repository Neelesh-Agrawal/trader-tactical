from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, PhoneVerification, EmailVerification


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        "email",
        "username",
        "first_name",
        "last_name",
        "phone",
        "phone_verified",
        "email_verified",
        "occupation",
        "is_staff",
        "is_active",
    )

    list_filter = (
        "is_staff",
        "is_active",
        "sex",
        "occupation",
        "phone_verified",
        "email_verified",
    )
    ordering = ("email",)
    search_fields = ("email", "username", "phone")

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "email",
                    "username",
                    "password",
                )
            },
        ),
        (
            "Personal Info",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "phone",
                    "phone_verified",
                    "email_verified",
                    "occupation",
                    "sex",
                    "birth_date",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "username",
                    "first_name",
                    "last_name",
                    "phone",
                    "birth_date",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
    )


@admin.register(PhoneVerification)
class PhoneVerificationAdmin(admin.ModelAdmin):
    list_display = ("phone", "otp", "created_at", "expires_at", "verified")
    list_filter = ("verified", "created_at")
    search_fields = ("phone",)
    readonly_fields = ("otp", "created_at", "expires_at")


@admin.register(EmailVerification)
class EmailVerificationAdmin(admin.ModelAdmin):
    list_display = ("email", "otp", "created_at", "expires_at", "verified")
    list_filter = ("verified", "created_at")
    search_fields = ("email",)
    readonly_fields = ("otp", "created_at", "expires_at")
