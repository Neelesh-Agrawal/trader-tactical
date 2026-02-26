from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from phonenumber_field.phonenumber import PhoneNumber
import logging

logger = logging.getLogger(__name__)

from .models import User, PhoneVerification, EmailVerification
from .serializers import (
    RegisterSerializer,
    EmailTokenObtainPairSerializer,
    PhoneTokenObtainPairSerializer,
    UserProfileSerializer,
    UserUpdateSerializer,
    ChangePasswordSerializer,
)
from .otp import generate_otp, get_otp_expiry
from .sms import send_otp_sms
from .email import send_email_otp


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Password updated successfully"}, status=status.HTTP_200_OK
        )


class PhoneTokenObtainPairView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PhoneTokenObtainPairSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        return Response(
            {
                "access": serializer.validated_data["access"],
                "refresh": serializer.validated_data["refresh"],
            }
        )


class SendOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")

        if not phone:
            return Response(
                {"error": "Phone number is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            phone_obj = PhoneNumber.from_string(phone, region=None)
            phone_str = str(phone_obj)
        except Exception:
            return Response(
                {"error": "Invalid phone number format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check if user exists with this phone
        user_exists = User.objects.filter(phone=phone_str).exists()

        # Delete any existing unverified OTPs for this phone
        PhoneVerification.objects.filter(phone=phone_str, verified=False).delete()

        # Generate new OTP
        otp = generate_otp()
        expires_at = get_otp_expiry(minutes=5)

        # Create verification record
        PhoneVerification.objects.create(
            phone=phone_str, otp=otp, expires_at=expires_at
        )

        # Send OTP via SMS
        sent = send_otp_sms(phone_str, otp)

        if not sent:
            # In development mode, return OTP in response for testing
            if getattr(settings, "DEBUG", False):
                return Response(
                    {
                        "message": "OTP sent (development mode)",
                        "otp": otp,  # TODO: Remove in production
                        "user_exists": user_exists,
                    }
                )
            return Response(
                {"error": "Failed to send OTP. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {"message": "OTP sent successfully", "user_exists": user_exists}
        )


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        otp = request.data.get("otp")

        if not phone or not otp:
            return Response(
                {"error": "Phone number and OTP are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            phone_obj = PhoneNumber.from_string(phone, region=None)
            phone_str = str(phone_obj)
        except Exception:
            return Response(
                {"error": "Invalid phone number format"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find the most recent unverified OTP
        try:
            verification = PhoneVerification.objects.filter(
                phone=phone_str, verified=False
            ).latest("created_at")
        except PhoneVerification.DoesNotExist:
            return Response(
                {"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Check if OTP is expired
        if verification.expires_at < timezone.now():
            return Response(
                {"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Verify OTP
        if verification.otp != otp:
            return Response(
                {"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Mark as verified
        verification.verified = True
        verification.save()

        # Update user phone_verified status if user exists
        try:
            user = User.objects.get(phone=phone_str)
            user.phone_verified = True
            user.save()
        except User.DoesNotExist:
            pass

        # Generate JWT tokens if user exists
        tokens = None
        if User.objects.filter(phone=phone_str).exists():
            from rest_framework_simplejwt.tokens import RefreshToken

            user = User.objects.get(phone=phone_str)
            refresh = RefreshToken.for_user(user)
            tokens = {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            }

        return Response(
            {
                "message": "Phone verified successfully",
                "verified": True,
                "tokens": tokens,
            }
        )


class SendEmailOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.lower().strip()

        # Delete any existing unverified OTPs for this email
        EmailVerification.objects.filter(email=email, verified=False).delete()

        # Generate new OTP
        otp = generate_otp()
        expires_at = get_otp_expiry(minutes=5)

        # Create verification record
        EmailVerification.objects.create(email=email, otp=otp, expires_at=expires_at)

        # Send OTP via email
        sent = send_email_otp(email, otp)

        if not sent:
            if getattr(settings, "DEBUG", False):
                return Response(
                    {
                        "message": "OTP sent (development mode)",
                        "otp": otp,
                    }
                )
            return Response(
                {"error": "Failed to send OTP. Please try again."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        logger.info(f"SendEmailOTPView: Successfully sent email OTP to {email}")
        return Response({"message": "OTP sent successfully"})


class VerifyEmailOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response(
                {"error": "Email and OTP are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        email = email.lower().strip()

        # Find the most recent unverified OTP
        try:
            verification = EmailVerification.objects.filter(
                email=email, verified=False
            ).latest("created_at")
        except EmailVerification.DoesNotExist:
            return Response(
                {"error": "Invalid or expired OTP"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Check if OTP is expired
        if verification.expires_at < timezone.now():
            return Response(
                {"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Verify OTP
        if verification.otp != otp:
            return Response(
                {"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Mark as verified
        verification.verified = True
        verification.save()

        # Update user email_verified status if user exists
        try:
            user = User.objects.get(email=email)
            user.email_verified = True
            user.save()
        except User.DoesNotExist:
            pass

        return Response(
            {
                "message": "Email verified successfully",
                "verified": True,
            }
        )


class FeedbackView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        message = request.data.get("message")
        email = request.data.get("email", "")
        name = request.data.get("name", "Anonymous")

        if not message:
            return Response(
                {"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get feedback recipient from settings
        feedback_recipient = getattr(settings, "FEEDBACK_RECIPIENT", None)

        if not feedback_recipient:
            return Response(
                {"error": "Feedback system not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            subject = f"New Feedback from {name}"
            email_message = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}"

            send_mail(
                subject=subject,
                message=email_message,
                from_email=getattr(
                    settings, "DEFAULT_FROM_EMAIL", settings.DEFAULT_FROM_EMAIL
                ),
                recipient_list=[feedback_recipient],
                fail_silently=False,
            )

            return Response({"message": "Feedback sent successfully"})

        except Exception as e:
            logger.error(f"Failed to send feedback: {str(e)}")
            return Response(
                {"error": f"Failed to send feedback: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class QnASubmitView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        user_email = request.data.get("user_email")
        context_type = request.data.get("context_type")
        context_id = request.data.get("context_id")
        question = request.data.get("question")

        if not question:
            return Response(
                {"error": "Question is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        logger.info(f"QnA submission from user {user.id} ({user_email}): {question}")
        logger.info(f"Context: {context_type}, ID: {context_id}")

        # Get admin email from settings
        admin_email = getattr(settings, "FEEDBACK_RECIPIENT", None)

        if not admin_email:
            logger.error("FEEDBACK_RECIPIENT not configured")
            return Response(
                {"error": "Q&A system not configured"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            subject = f"New Q&A Question from {user.email}"
            email_message = f"""User: {user.email}
User ID: {user.id}
Context Type: {context_type}
Context ID: {context_id}

Question:
{question}

---
This is a new question submitted through the QnA widget.
Reply directly to the user at: {user.email}
"""

            send_mail(
                subject=subject,
                message=email_message,
                from_email=getattr(
                    settings, "DEFAULT_FROM_EMAIL", "noreply@trademaster.com"
                ),
                recipient_list=[admin_email],
                fail_silently=False,
            )

            logger.info(f"QnA email sent successfully to {admin_email}")
            return Response({"message": "Question submitted successfully"})

        except Exception as e:
            logger.error(f"Failed to send QnA email: {str(e)}")
            return Response(
                {"error": f"Failed to submit question: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
