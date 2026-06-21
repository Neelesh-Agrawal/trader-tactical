import logging
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

logger = logging.getLogger(__name__)

from .models import User
from django.contrib.auth.password_validation import validate_password
from courses.models import Enrollment, Course


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

        # Auto-enroll user in course ID 1
        try:
            course = Course.objects.get(id=1)
            _, created = Enrollment.objects.get_or_create(
                user=user, course=course, defaults={"is_active": True}
            )
            if created:
                from progress.services import unlock_initial_course_progress

                unlock_initial_course_progress(user, course)
        except Course.DoesNotExist:
            pass
        except Exception as e:
            logger.error(f"Auto-enrollment error: {e}")

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

    def validate(self, attrs):
        phone = attrs.get("phone")
        pin = attrs.get("pin")

        if not phone or not pin:
            raise serializers.ValidationError("Phone and PIN are required")

        # Normalize phone number - PhoneNumberField stores in E.164 format
        # We'll try to parse it the same way PhoneNumberField does
        try:
            from phonenumber_field.phonenumber import PhoneNumber

            # Create PhoneNumber object from string (handles normalization)
            phone_number = PhoneNumber.from_string(phone, region=None)

            # Look up user by phone (PhoneNumberField handles format matching)
            try:
                user = User.objects.get(phone=phone_number)
            except User.DoesNotExist:
                # Try with string representation as fallback
                try:
                    user = User.objects.get(phone=str(phone_number))
                except User.DoesNotExist:
                    raise serializers.ValidationError("Invalid phone number or PIN")

        except Exception:
            # Fallback: try direct lookup with normalized string
            normalized_phone = (
                phone.replace(" ", "")
                .replace("-", "")
                .replace("(", "")
                .replace(")", "")
            )
            try:
                user = User.objects.get(phone=normalized_phone)
            except User.DoesNotExist:
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
