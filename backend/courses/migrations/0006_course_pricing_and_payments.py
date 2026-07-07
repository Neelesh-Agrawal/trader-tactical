from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


def add_price_inr_if_missing(apps, schema_editor):
    Course = apps.get_model("courses", "Course")
    table_name = Course._meta.db_table

    with schema_editor.connection.cursor() as cursor:
        existing_columns = {
            column.name
            for column in schema_editor.connection.introspection.get_table_description(
                cursor, table_name
            )
        }

    if "price_inr" in existing_columns:
        return

    field = models.PositiveIntegerField(default=0)
    field.set_attributes_from_name("price_inr")
    schema_editor.add_field(Course, field)


def remove_price_inr_if_present(apps, schema_editor):
    Course = apps.get_model("courses", "Course")
    table_name = Course._meta.db_table

    with schema_editor.connection.cursor() as cursor:
        existing_columns = {
            column.name
            for column in schema_editor.connection.introspection.get_table_description(
                cursor, table_name
            )
        }

    if "price_inr" not in existing_columns:
        return

    field = models.PositiveIntegerField(default=0)
    field.set_attributes_from_name("price_inr")
    schema_editor.remove_field(Course, field)


def create_coursepayment_if_missing(apps, schema_editor):
    from courses.models import CoursePayment

    table_name = CoursePayment._meta.db_table

    existing_tables = set(schema_editor.connection.introspection.table_names())
    if table_name in existing_tables:
        return

    schema_editor.create_model(CoursePayment)


def drop_coursepayment_if_present(apps, schema_editor):
    from courses.models import CoursePayment

    table_name = CoursePayment._meta.db_table

    existing_tables = set(schema_editor.connection.introspection.table_names())
    if table_name not in existing_tables:
        return

    schema_editor.delete_model(CoursePayment)


class Migration(migrations.Migration):

    dependencies = [
        ("courses", "0005_module_description_ckeditor"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(
                    add_price_inr_if_missing,
                    remove_price_inr_if_present,
                )
            ],
            state_operations=[
                migrations.AddField(
                    model_name="course",
                    name="price_inr",
                    field=models.PositiveIntegerField(default=0),
                )
            ],
        ),
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(
                    create_coursepayment_if_missing,
                    drop_coursepayment_if_present,
                )
            ],
            state_operations=[
                migrations.CreateModel(
                    name="CoursePayment",
                    fields=[
                        ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                        ("reference", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                        ("txnid", models.CharField(max_length=64, unique=True)),
                        ("amount", models.DecimalField(decimal_places=2, max_digits=10)),
                        ("currency", models.CharField(default="INR", max_length=10)),
                        ("status", models.CharField(choices=[("initiated", "Initiated"), ("success", "Success"), ("failed", "Failed"), ("pending", "Pending"), ("hash_mismatch", "Hash Mismatch")], default="initiated", max_length=20)),
                        ("payu_status", models.CharField(blank=True, default="", max_length=40)),
                        ("payu_payment_id", models.CharField(blank=True, default="", max_length=64)),
                        ("bank_ref_num", models.CharField(blank=True, default="", max_length=128)),
                        ("payment_mode", models.CharField(blank=True, default="", max_length=40)),
                        ("error_message", models.TextField(blank=True, default="")),
                        ("request_payload", models.JSONField(blank=True, default=dict)),
                        ("response_payload", models.JSONField(blank=True, default=dict)),
                        ("paid_at", models.DateTimeField(blank=True, null=True)),
                        ("created_at", models.DateTimeField(auto_now_add=True)),
                        ("updated_at", models.DateTimeField(auto_now=True)),
                        ("course", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="payments", to="courses.course")),
                        ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="course_payments", to=settings.AUTH_USER_MODEL)),
                    ],
                    options={"ordering": ["-created_at"]},
                )
            ],
        ),
    ]
