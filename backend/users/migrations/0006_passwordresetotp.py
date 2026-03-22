from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("users", "0005_user_email_verified_emailverification"),
    ]

    operations = [
        migrations.CreateModel(
            name="PasswordResetOTP",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("email", models.EmailField(max_length=254)),
                ("otp", models.CharField(max_length=6)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("expires_at", models.DateTimeField()),
                ("used", models.BooleanField(default=False)),
                ("used_at", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "indexes": [
                    models.Index(
                        fields=["email", "-created_at"],
                        name="users_passw_email_46bd14_idx",
                    )
                ],
            },
        ),
    ]
