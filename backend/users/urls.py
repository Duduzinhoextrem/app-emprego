from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    UserRegistrationView, 
    UserProfileView, 
    ChangePasswordView, 
    UserListViewSet,
    RequestPasswordResetView,
    ResetPasswordView
)

app_name = 'users'

router = DefaultRouter()
router.register(r'users', UserListViewSet, basename='user')

urlpatterns = [
    # 🔐 Autenticação via JWT (tokens)
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login - retorna access e refresh token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Renova o access token
    
    # 👤 Registro e perfil do usuário
    path('register/', UserRegistrationView.as_view(), name='register'),  # Cadastro de novos usuários
    path('profile/', UserProfileView.as_view(), name='profile'),  # Ver/editar próprio perfil
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),  # Alterar senha (precisa estar logado)
    
    # 🔑 Recuperação de senha (esqueci minha senha)
    path('request-password-reset/', RequestPasswordResetView.as_view(), name='request_password_reset'),  # Solicitar token de reset
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),  # Redefinir senha com token
    
    # 📋 Lista de usuários (usado no seletor de designação de tarefas)
    path('', include(router.urls)),  # GET /api/auth/users/
]
