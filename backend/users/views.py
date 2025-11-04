from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
import logging
from .serializers import (
    UserSerializer, 
    UserRegistrationSerializer, 
    ChangePasswordSerializer,
    RequestPasswordResetSerializer,
    ResetPasswordSerializer
)
from .models import PasswordResetToken

User = get_user_model()
logger = logging.getLogger(__name__)


class UserRegistrationView(generics.CreateAPIView):
    """
    Faz o cadastro de novos usuários.
    
    Endpoint: POST /api/auth/register/
    Retorna os tokens JWT ao cadastrar com sucesso.
    """
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    Permite ver e editar o próprio perfil.
    
    Endpoints: GET, PUT, PATCH /api/auth/profile/
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """Permite que o usuário logado altere sua própria senha."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"detail": "Senha alterada com sucesso."},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListViewSet(ModelViewSet):
    """
    Lista os usuários do sistema.
    
    Endpoints:
    - GET /api/auth/users/ - Lista usuários (qualquer usuário autenticado)
    - DELETE /api/auth/users/{id}/ - Exclui usuário (apenas admin)
    Retorna apenas usuários ativos.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    def get_permissions(self):
        """DELETE requer admin, GET requer apenas autenticação."""
        if self.action == 'destroy':
            return [IsAdminUser()]
        return [IsAuthenticated()]
    
    def get_queryset(self):
        """Retorna apenas usuários ativos, ordenados por username."""
        return User.objects.filter(is_active=True).order_by('username')
    
    def destroy(self, request, *args, **kwargs):
        """Exclui um usuário (apenas admin pode executar)."""
        instance = self.get_object()
        
        # Impede que admin se exclua
        if instance.id == request.user.id:
            return Response(
                {'detail': 'Você não pode excluir a si mesmo.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Marca como inativo ao invés de deletar fisicamente (melhor prática)
        instance.is_active = False
        instance.save()
        
        return Response(
            {'detail': 'Usuário excluído com sucesso.'},
            status=status.HTTP_200_OK
        )


class RequestPasswordResetView(APIView):
    """
    Solicita a recuperação de senha.
    
    Endpoint: POST /api/auth/request-password-reset/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RequestPasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                user = User.objects.get(email=email)
                reset_token = PasswordResetToken.create_for_user(user)
                
                logger.info(f"Token de recuperação gerado para: {user.username}")
                
                return Response({
                    'detail': 'Se o email existir no sistema, você receberá instruções para redefinir sua senha.',
                    'token': reset_token.token,
                    'expires_at': reset_token.expires_at.isoformat(),
                }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                logger.warning(f"Tentativa de reset para email inexistente: {email}")
                return Response({
                    'detail': 'Se o email existir no sistema, você receberá instruções para redefinir sua senha.'
                }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    """
    Redefine a senha usando o token gerado.
    
    Endpoint: POST /api/auth/reset-password/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            logger.info("Senha redefinida com sucesso via token")
            return Response({
                'detail': 'Senha redefinida com sucesso. Você já pode fazer login com a nova senha.'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
