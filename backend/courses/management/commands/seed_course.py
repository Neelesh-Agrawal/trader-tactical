from django.core.management.base import BaseCommand
from courses.models import Course, Level, Module, Lesson


class Command(BaseCommand):
    help = "Seed the default Options Trading course with levels, modules, and lessons"

    def handle(self, *args, **options):
        course, created = Course.objects.get_or_create(
            id=1,
            defaults={
                "title": "Options Trading Mastery",
                "description": "A structured path from beginner to advanced options trading.",
                "price_inr": 999,
                "is_published": True,
            },
        )
        if not created:
            course.title = "Options Trading Mastery"
            course.description = (
                "A structured path from beginner to advanced options trading."
            )
            course.price_inr = 999
            course.is_published = True
            course.save()

        structure = [
            {
                "title": "Beginner",
                "order": 1,
                "modules": [
                    {
                        "title": "Welcome to Options Trading",
                        "icon": "🌱",
                        "lessons": [
                            "What Are Options?",
                            "Calls vs Puts",
                            "How Option Prices Move",
                        ],
                    },
                    {
                        "title": "Understanding How Option Trades Work",
                        "icon": "📊",
                        "lessons": [
                            "Opening and Closing Trades",
                            "Strike Price Basics",
                            "Expiry Explained",
                        ],
                    },
                    {
                        "title": "Option Greeks & Volatility",
                        "icon": "📈",
                        "lessons": [
                            "Delta and Direction",
                            "Theta and Time Decay",
                            "IV and Volatility",
                        ],
                    },
                ],
            },
            {
                "title": "Intermediate",
                "order": 2,
                "modules": [
                    {
                        "title": "Reading the Market Like a Trader",
                        "icon": "🎯",
                        "lessons": [
                            "Market Structure",
                            "Trend vs Range",
                            "Volume and Open Interest",
                        ],
                    },
                    {
                        "title": "Strike & Expiry Selection",
                        "icon": "⚡",
                        "lessons": [
                            "Choosing the Right Strike",
                            "Weekly vs Monthly Expiry",
                            "Liquidity Filters",
                        ],
                    },
                ],
            },
            {
                "title": "Advanced",
                "order": 3,
                "modules": [
                    {
                        "title": "Professional Option Strategies",
                        "icon": "🏆",
                        "lessons": [
                            "Iron Condors",
                            "Calendar Spreads",
                            "Risk-Defined Structures",
                        ],
                    },
                ],
            },
        ]

        lesson_count = 0
        for level_data in structure:
            level, _ = Level.objects.update_or_create(
                course=course,
                order=level_data["order"],
                defaults={"title": level_data["title"]},
            )

            for module_order, module_data in enumerate(
                level_data["modules"], start=1
            ):
                module, _ = Module.objects.update_or_create(
                    level=level,
                    order=module_order,
                    defaults={
                        "title": module_data["title"],
                        "icon": module_data["icon"],
                        "description": f"Module {module_order} of the {level.title} level.",
                    },
                )

                for lesson_order, lesson_title in enumerate(
                    module_data["lessons"], start=1
                ):
                    lesson_slug = lesson_title.lower()
                    Lesson.objects.update_or_create(
                        module=module,
                        order=lesson_order,
                        defaults={
                            "title": lesson_title,
                            "lesson_objective": (
                                "<ul>"
                                f"<li>Define the core concepts behind {lesson_slug}</li>"
                                f"<li>Recognize how {lesson_slug} applies in Indian options markets</li>"
                                f"<li>Identify the next skill to practice after this lesson</li>"
                                "</ul>"
                            ),
                            "content": f"<p>This lesson covers <strong>{lesson_title}</strong> with practical examples for Indian markets.</p>",
                            "common_mistakes": (
                                "<ul>"
                                "<li>Trading without a defined risk plan or position size</li>"
                                "<li>Skipping liquidity checks before entering an options trade</li>"
                                "<li>Confusing directional bias with a complete trade setup</li>"
                                "</ul>"
                            ),
                            "key_takeaway": f"<p>Key takeaway: master {lesson_slug} before moving on.</p>",
                            "practical_task": (
                                "<ul>"
                                "<li>Open one live chart for NIFTY or BANKNIFTY</li>"
                                "<li>Mark the levels or signals discussed in this lesson</li>"
                                "<li>Write three observations you would act on in paper trading</li>"
                                "</ul>"
                            ),
                            "estimated_time_minutes": 15,
                        },
                    )
                    lesson_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded course '{course.title}' with {lesson_count} lessons."
            )
        )
