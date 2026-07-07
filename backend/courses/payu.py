import hashlib
from decimal import Decimal, ROUND_HALF_UP

from django.conf import settings


DEFAULT_COURSE_PRICES = {
    1: Decimal("999.00"),
    2: Decimal("1999.00"),
    3: Decimal("2999.00"),
}

TITLE_PRICE_HINTS = {
    "beginner": Decimal("999.00"),
    "foundation": Decimal("999.00"),
    "intermediate": Decimal("1999.00"),
    "growth": Decimal("1999.00"),
    "advanced": Decimal("2999.00"),
    "mastery": Decimal("2999.00"),
    "nism": Decimal("199.00"),
}


def format_amount(amount: Decimal) -> str:
    return str(amount.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP))


def get_course_price(course) -> Decimal:
    if getattr(course, "price_inr", 0):
        return Decimal(course.price_inr).quantize(Decimal("0.01"))

    normalized_title = course.title.strip().lower()
    for hint, amount in TITLE_PRICE_HINTS.items():
        if hint in normalized_title:
            return amount

    return DEFAULT_COURSE_PRICES.get(course.id, Decimal("999.00"))


def build_payment_hash(fields: dict[str, str], salt: str) -> str:
    hash_string = "|".join(
        [
            fields["key"],
            fields["txnid"],
            fields["amount"],
            fields["productinfo"],
            fields["firstname"],
            fields["email"],
            fields.get("udf1", ""),
            fields.get("udf2", ""),
            fields.get("udf3", ""),
            fields.get("udf4", ""),
            fields.get("udf5", ""),
            "",
            "",
            "",
            "",
            "",
            salt,
        ]
    )
    return hashlib.sha512(hash_string.encode("utf-8")).hexdigest().lower()


def build_reverse_hash(response_data: dict[str, str], salt: str) -> str:
    sequence = [
        salt,
        response_data.get("status", ""),
        "",
        "",
        "",
        "",
        "",
        response_data.get("udf5", ""),
        response_data.get("udf4", ""),
        response_data.get("udf3", ""),
        response_data.get("udf2", ""),
        response_data.get("udf1", ""),
        response_data.get("email", ""),
        response_data.get("firstname", ""),
        response_data.get("productinfo", ""),
        response_data.get("amount", ""),
        response_data.get("txnid", ""),
        response_data.get("key", ""),
    ]

    additional_charges = response_data.get("additionalCharges")
    if additional_charges:
        sequence.insert(0, additional_charges)

    return hashlib.sha512("|".join(sequence).encode("utf-8")).hexdigest().lower()


def get_payu_checkout_url() -> str:
    return settings.PAYU_CHECKOUT_URL
