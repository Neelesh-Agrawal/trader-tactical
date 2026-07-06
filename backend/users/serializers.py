import logging
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Q

logger = logging.getLogger(__name__)

from .models import User
from django.contrib.auth.password_validation import validate_password


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "email",
            "username",
            "password",
            "first_name",
            "last_name",
            "phone",
            "occupation",
            "sex",
            "birth_date",
        )
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": False, "allow_blank": True},
            "phone": {"required": True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data.get("last_name", ""),
            phone=validated_data["phone"],
            occupation=validated_data.get("occupation"),
            sex=validated_data.get("sex", "N"),
            birth_date=validated_data.get("birth_date"),
            phone_verified=True,  # User verified phone via OTP before registration
            email_verified=True,  # User verified email via OTP before registration
        )

        return user


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "first_name",
            "last_name",
            "phone",
            "occupation",
            "sex",
            "birth_date",
        ]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])

    def validate_old_password(self, value):
        user = self.context["request"].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value

    def save(self, **kwargs):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"


class PhoneTokenObtainPairSerializer(serializers.Serializer):
    phone = serializers.CharField(required=True)
    pin = serializers.CharField(required=True, write_only=True)

    def _phone_candidates(self, phone):
        raw_phone = phone.strip()
        digits_only = "".join(character for character in raw_phone if character.isdigit())
        candidates = []

        def add_candidate(value):
            if value and value not in candidates:
                candidates.append(value)

        add_candidate(raw_phone)

        try:
            from phonenumber_field.phonenumber import PhoneNumber

            phone_number = PhoneNumber.from_string(raw_phone, region="IN")
            add_candidate(str(phone_number))
            if digits_only:
                add_candidate(digits_only)
                if len(digits_only) == 10:
                    add_candidate(f"+91{digits_only}")
                elif len(digits_only) == 12 and digits_only.startswith("91"):
                    add_candidate(f"+{digits_only}")
                    add_candidate(digits_only[2:])
        except Exception:
            add_candidate(digits_only)
            if len(digits_only) == 10:
                add_candidate(f"+91{digits_only}")
            elif len(digits_only) == 12 and digits_only.startswith("91"):
                add_candidate(f"+{digits_only}")
                add_candidate(digits_only[2:])

        return candidates

    def _get_user_by_phone(self, phone):
        candidates = self._phone_candidates(phone)
        phone_query = Q()

        for candidate in candidates:
            phone_query |= Q(phone=candidate)

        return User.objects.filter(phone_query).first()

    def validate(self, attrs):
        phone = attrs.get("phone")
        pin = attrs.get("pin")

        if not phone or not pin:
            raise serializers.ValidationError("Phone and PIN are required")

        user = self._get_user_by_phone(phone)
        if user is None:
            raise serializers.ValidationError("Invalid phone number or PIN")

        # Verify PIN (which is stored as password)
        if not user.check_password(pin):
            raise serializers.ValidationError("Invalid phone number or PIN")

        # Generate JWT tokens
        from rest_framework_simplejwt.tokens import RefreshToken

        refresh = RefreshToken.for_user(user)

        attrs["user"] = user
        attrs["refresh"] = str(refresh)
        attrs["access"] = str(refresh.access_token)

        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "phone",
            "phone_verified",
            "email_verified",
            "occupation",
            "sex",
            "birth_date",
            "is_staff",
            "is_active",
        ]
        read_only_fields = fields
