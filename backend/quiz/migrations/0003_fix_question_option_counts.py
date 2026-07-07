from django.db import migrations


def fix_question_options(apps, schema_editor):
    Question = apps.get_model("quiz", "Question")
    Option = apps.get_model("quiz", "Option")

    for question in Question.objects.all().iterator():
        options = list(Option.objects.filter(question=question).order_by("id"))
        if not options:
            continue

        first_correct = next((option for option in options if option.is_correct), None)
        kept = []

        if first_correct is not None:
            kept.append(first_correct)

        for option in options:
            if option in kept:
                continue
            kept.append(option)
            if len(kept) == 4:
                break

        if len(kept) < 4:
            continue

        if kept[0].is_correct is False:
            kept[0].is_correct = True
            kept[0].save(update_fields=["is_correct"])

        for option in kept[1:]:
            if option.is_correct:
                option.is_correct = False
                option.save(update_fields=["is_correct"])

        kept_ids = [option.id for option in kept[:4]]
        Option.objects.filter(question=question).exclude(id__in=kept_ids).delete()


class Migration(migrations.Migration):

    dependencies = [
        ("quiz", "0002_quiz_time_limit_seconds"),
    ]

    operations = [
        migrations.RunPython(fix_question_options, migrations.RunPython.noop),
    ]
