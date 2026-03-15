from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("progress", "0005_certificate"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunSQL(
                    sql="""
                    DO $$
                    BEGIN
                        IF EXISTS (
                            SELECT 1
                            FROM information_schema.columns
                            WHERE table_name = 'progress_certificate'
                              AND column_name = 'pdf_file'
                        )
                        AND NOT EXISTS (
                            SELECT 1
                            FROM information_schema.columns
                            WHERE table_name = 'progress_certificate'
                              AND column_name = 'image_file'
                        ) THEN
                            ALTER TABLE progress_certificate RENAME COLUMN pdf_file TO image_file;
                        ELSIF NOT EXISTS (
                            SELECT 1
                            FROM information_schema.columns
                            WHERE table_name = 'progress_certificate'
                              AND column_name = 'image_file'
                        ) THEN
                            ALTER TABLE progress_certificate ADD COLUMN image_file varchar(100);
                        END IF;
                    END $$;
                    """,
                    reverse_sql=migrations.RunSQL.noop,
                )
            ],
            state_operations=[],
        )
    ]
