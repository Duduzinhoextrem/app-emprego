from django.contrib.auth.models import AbstractUser
from django.db import models
import secrets
from datetime import timedelta
from django.utils import timezone


class User(AbstractUser):
    """
    Modelo de usuário personalizado do sistema.
    
    Estende o AbstractUser do Django para permitir:
    - Email único e obrigatório
    - Campos de data de criação/atualização
    - Futuras extensões específicas do nosso app
    
    Todos os usuários (admin, staff, comuns) usam este modelo.
    """
    email = models.EmailField(unique=True, verbose_name='E-mail')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data de Atualização')

    class Meta:
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
        ordering = ['-created_at']

    def __str__(self):
        return self.username


class PasswordResetToken(models.Model):
    """
    Armazena os tokens de recuperação de senha.
    
    Cada vez que alguém solicita reset de senha, criamos um token único.
    O token tem prazo de validade (24 horas por padrão) e só pode ser usado uma vez.
    
    Por segurança, quando um novo token é criado, os tokens antigos são invalidados.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='password_reset_tokens')
    token = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Token de Recuperação de Senha'
        verbose_name_plural = 'Tokens de Recuperação de Senha'
        ordering = ['-created_at']

    def __str__(self):
        return f"Token para {self.user.username} - {self.token[:8]}..."

    def is_valid(self):
        """Verifica se o token ainda pode ser usado."""
        return not self.used and timezone.now() < self.expires_at

    @classmethod
    def create_for_user(cls, user, expires_in_hours=24):
        """
        Cria um novo token de recuperação de senha para um usuário.
        
        Invalida tokens anteriores do mesmo usuário.
        """
        cls.objects.filter(user=user, used=False).update(used=True)
        
        token = secrets.token_urlsafe(32)
        expires_at = timezone.now() + timedelta(hours=expires_in_hours)
        
        return cls.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
