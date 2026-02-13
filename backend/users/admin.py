from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        'email',
        'username',
        'first_name',
        'last_name',
        'phone',
        'is_staff',
        'is_active',
    )

    list_filter = ('is_staff', 'is_active', 'sex', 'state')
    ordering = ('email',)
    search_fields = ('email', 'username', 'phone')

    fieldsets = (
        (None, {
            'fields': (
                'email',
                'username',
                'password',
            )
        }),
        ('Personal Info', {
            'fields': (
                'first_name',
                'last_name',
                'phone',
                'state',
                'sex',
                'age',
            )
        }),
        ('Permissions', {
            'fields': (
                'is_staff',
                'is_active',
                'is_superuser',
                'groups',
                'user_permissions',
            )
        }),
        ('Important dates', {
            'fields': (
                'last_login',
                'date_joined',
            )
        }),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'username',
                'first_name',
                'last_name',
                'phone',
                'state',
                'sex',
                'age',
                'password1',
                'password2',
                'is_staff',
                'is_active',
                'is_superuser',
                'groups',
                'user_permissions',
            ),
        }),
    )
