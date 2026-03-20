from django.db import migrations


def sync_certificate_image_column(apps, schema_editor):
    connection = schema_editor.connection
    table_name = "progress_certificate"

    with connection.cursor() as cursor:
        if connection.vendor == "postgresql":
            cursor.execute(
                """
                SELECT column_name
                FROM information_schema.columns
                WHERE table_name = %s
                """,
                [table_name],
            )
            columns = {row[0] for row in cursor.fetchall()}
            if "image_file" in columns:
                return
            if "pdf_file" in columns:
                schema_editor.execute(
                    "ALTER TABLE progress_certificate RENAME COLUMN pdf_file TO image_file"
                )
                return
            schema_editor.execute(
                "ALTER TABLE progress_certificate ADD COLUMN image_file varchar(100)"
            )
            return

        if connection.vendor == "mysql":
            cursor.execute(
                """
                SELECT COLUMN_NAME
                FROM INFORMATION_SCHEMA.COLUMNS
                WHERE TABLE_SCHEMA = DATABASE()
                  AND TABLE_NAME = %s
                """,
                [table_name],
            )
            columns = {row[0] for row in cursor.fetchall()}
            if "image_file" in columns:
                return
            if "pdf_file" in columns:
                schema_editor.execute(
                    "ALTER TABLE progress_certificate CHANGE COLUMN pdf_file image_file varchar(100)"
                )
                return
            schema_editor.execute(
                "ALTER TABLE progress_certificate ADD COLUMN image_file varchar(100)"
            )
            return

        if connection.vendor == "sqlite":
            cursor.execute(f"PRAGMA table_info('{table_name}')")
            columns = {row[1] for row in cursor.fetchall()}
            if "image_file" in columns:
                return
            if "pdf_file" in columns:
                schema_editor.execute(
                    "ALTER TABLE progress_certificate RENAME COLUMN pdf_file TO image_file"
                )
                return
            schema_editor.execute(
                "ALTER TABLE progress_certificate ADD COLUMN image_file varchar(100)"
            )


class Migration(migrations.Migration):
    dependencies = [
        ("progress", "0005_certificate"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[migrations.RunPython(sync_certificate_image_column)],
            state_operations=[],
        )
    ]
