from django.utils import timezone
from datetime import timedelta

def can_attempt_quiz(user, quiz):
    last_attempt = (
        quiz.attempts
        .filter(user=user)
        .first()
    )

    if not last_attempt:
        return True

    cooldown_end = last_attempt.attempted_at + timedelta(minutes=quiz.cooldown_minutes)
    return timezone.now() >= cooldown_end

def calculate_score(quiz, submitted_answers):
    total_questions = quiz.questions.count()
    correct_count = 0

    for question in quiz.questions.all():
        correct_option_ids = set(
            question.options.filter(is_correct=True)
            .values_list("id", flat=True)
        )

        selected_option_ids = set(submitted_answers.get(str(question.id), []))

        if selected_option_ids == correct_option_ids:
            correct_count += 1

    return (correct_count / total_questions) * 100
