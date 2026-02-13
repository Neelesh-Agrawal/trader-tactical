from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    EmailTokenObtainPairView,
    PhoneTokenObtainPairView,
    UserProfileView,
    UserUpdateView,
    ChangePasswordView,
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', EmailTokenObtainPairView.as_view(), name='login'),
    path('phone-login/', PhoneTokenObtainPairView.as_view(), name='phone-login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # User
    path('me/', UserProfileView.as_view(), name='me'),
    path('me/update/', UserUpdateView.as_view(), name='update-profile'),
    path('me/change-password/', ChangePasswordView.as_view(), name='change-password'),
]
