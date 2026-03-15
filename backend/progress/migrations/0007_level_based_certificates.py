import uuid

from django.db import migrations, models
import django.db.models.deletion


def migrate_course_certificates_to_level(apps, schema_editor):
    Certificate = apps.get_model("progress", "Certificate")
    Level = apps.get_model("courses", "Level")
    LevelProgress = apps.get_model("progress", "LevelProgress")

    existing_certificates = list(Certificate.objects.all().order_by("id"))

    for certificate in existing_certificates:
        completed_level_ids = list(
            LevelProgress.objects.filter(
                user_id=certificate.user_id,
                level__course_id=certificate.course_id,
                completed=True,
            )
            .order_by("level__order")
            .values_list("level_id", flat=True)
        )

        if not completed_level_ids:
            fallback_level_id = (
                Level.objects.filter(course_id=certificate.course_id)
                .order_by("-order")
                .values_list("id", flat=True)
                .first()
            )
            if fallback_level_id:
                completed_level_ids = [fallback_level_id]

        if not completed_level_ids:
            certificate.delete()
            continue

        first_level_id = completed_level_ids[0]
        certificate.level_id = first_level_id
        certificate.save(update_fields=["level"])

        for level_id in completed_level_ids[1:]:
            already_exists = Certificate.objects.filter(
                user_id=certificate.user_id,
                level_id=level_id,
            ).exists()
            if already_exists:
                continue

            Certificate.objects.create(
                user_id=certificate.user_id,
                course_id=certificate.course_id,
                level_id=level_id,
                certificate_id=uuid.uuid4(),
                issued_at=certificate.issued_at,
                image_file=certificate.image_file,
                storage_backend=certificate.storage_backend,
            )


class Migration(migrations.Migration):
    dependencies = [
        ("courses", "0003_lesson_objective_module_icon"),
        ("progress", "0006_sync_certificate_image_column"),
    ]

    operations = [
        migrations.AddField(
            model_name="certificate",
            name="level",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="certificates",
                to="courses.level",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="certificate",
            unique_together=set(),
        ),
        migrations.RunPython(
            migrate_course_certificates_to_level,
            reverse_code=migrations.RunPython.noop,
        ),
        migrations.RemoveField(
            model_name="certificate",
            name="course",
        ),
        migrations.AlterField(
            model_name="certificate",
            name="level",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="certificates",
                to="courses.level",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="certificate",
            unique_together={("user", "level")},
        ),
    ]
