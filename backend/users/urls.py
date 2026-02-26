from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    EmailTokenObtainPairView,
    PhoneTokenObtainPairView,
    UserProfileView,
    UserUpdateView,
    ChangePasswordView,
    SendOTPView,
    VerifyOTPView,
    SendEmailOTPView,
    VerifyEmailOTPView,
    FeedbackView,
    QnASubmitView,
)

urlpatterns = [
    # Auth
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", EmailTokenObtainPairView.as_view(), name="login"),
    path("phone-login/", PhoneTokenObtainPairView.as_view(), name="phone-login"),
    path("refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # Phone OTP
    path("send-otp/", SendOTPView.as_view(), name="send-otp"),
    path("verify-otp/", VerifyOTPView.as_view(), name="verify-otp"),
    # Email OTP
    path("send-email-otp/", SendEmailOTPView.as_view(), name="send-email-otp"),
    path("verify-email-otp/", VerifyEmailOTPView.as_view(), name="verify-email-otp"),
    # Feedback
    path("feedback/", FeedbackView.as_view(), name="feedback"),
    # QnA
    path("qna/submit/", QnASubmitView.as_view(), name="qna-submit"),
    # User
    path("me/", UserProfileView.as_view(), name="me"),
    path("me/update/", UserUpdateView.as_view(), name="update-profile"),
    path("me/change-password/", ChangePasswordView.as_view(), name="change-password"),
]
