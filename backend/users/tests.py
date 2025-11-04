from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import PasswordResetToken

User = get_user_model()


class UserAPITestCase(TestCase):
    """
    Testes para a API de usuários.
    """

    def setUp(self):
        """
        Configuração inicial para os testes.
        """
        self.client = APIClient()
        
        # Criar usuário de teste
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_user_registration(self):
        """
        Testa o registro de um novo usuário.
        """
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'password_confirm': 'newpass123',
        }
        response = self.client.post('/api/auth/register/', data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_user_registration_with_mismatched_passwords(self):
        """
        Testa que não é possível registrar com senhas diferentes.
        """
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123',
            'password_confirm': 'differentpass',
        }
        response = self.client.post('/api/auth/register/', data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login(self):
        """
        Testa o login de um usuário.
        """
        data = {
            'username': 'testuser',
            'password': 'testpass123',
        }
        response = self.client.post('/api/auth/login/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_user_login_with_wrong_credentials(self):
        """
        Testa que não é possível fazer login com credenciais incorretas.
        """
        data = {
            'username': 'testuser',
            'password': 'wrongpassword',
        }
        response = self.client.post('/api/auth/login/', data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_profile(self):
        """
        Testa a obtenção do perfil do usuário autenticado.
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/profile/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'testuser')
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_unauthenticated_profile_access(self):
        """
        Testa que usuários não autenticados não podem acessar o perfil.
        """
        response = self.client.get('/api/auth/profile/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password(self):
        """
        Testa a alteração de senha do usuário autenticado.
        """
        self.client.force_authenticate(user=self.user)
        data = {
            'old_password': 'testpass123',
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        response = self.client.post('/api/auth/change-password/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se a senha foi alterada
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass123'))

    def test_change_password_with_wrong_old_password(self):
        """
        Testa que não é possível alterar senha com senha antiga incorreta.
        """
        self.client.force_authenticate(user=self.user)
        data = {
            'old_password': 'wrongpassword',
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        response = self.client.post('/api/auth/change-password/', data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_request_password_reset(self):
        """
        Testa a solicitação de recuperação de senha.
        """
        data = {
            'email': 'test@example.com',
        }
        response = self.client.post('/api/auth/request-password-reset/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)  # Em desenvolvimento retorna o token
        
        # Verifica se o token foi criado
        token = PasswordResetToken.objects.filter(user=self.user).first()
        self.assertIsNotNone(token)
        self.assertTrue(token.is_valid())

    def test_request_password_reset_with_nonexistent_email(self):
        """
        Testa que a solicitação retorna sucesso mesmo com email inexistente (por segurança).
        """
        data = {
            'email': 'nonexistent@example.com',
        }
        response = self.client.post('/api/auth/request-password-reset/', data)
        
        # Por segurança, retorna 200 mesmo se email não existir
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reset_password(self):
        """
        Testa a redefinição de senha usando token.
        """
        # Criar token de recuperação
        reset_token = PasswordResetToken.create_for_user(self.user)
        
        data = {
            'token': reset_token.token,
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        response = self.client.post('/api/auth/reset-password/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verifica se a senha foi alterada
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password('newpass123'))
        
        # Verifica se o token foi marcado como usado
        reset_token.refresh_from_db()
        self.assertTrue(reset_token.used)

    def test_reset_password_with_invalid_token(self):
        """
        Testa que não é possível redefinir senha com token inválido.
        """
        data = {
            'token': 'invalid-token-12345',
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        response = self.client.post('/api/auth/reset-password/', data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_reset_password_with_expired_token(self):
        """
        Testa que não é possível redefinir senha com token expirado.
        """
        # Criar token e marcar como usado para simular expiração
        reset_token = PasswordResetToken.create_for_user(self.user)
        reset_token.used = True
        reset_token.save()
        
        data = {
            'token': reset_token.token,
            'new_password': 'newpass123',
            'new_password_confirm': 'newpass123',
        }
        response = self.client.post('/api/auth/reset-password/', data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_users_list(self):
        """
        Testa a listagem de usuários (apenas autenticados).
        """
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/auth/users/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # A API retorna paginação, verifica se tem results
        if isinstance(response.data, dict) and 'results' in response.data:
            self.assertIsInstance(response.data['results'], list)
        else:
            self.assertIsInstance(response.data, list)

    def test_unauthenticated_users_list_access(self):
        """
        Testa que usuários não autenticados não podem ver a lista de usuários.
        """
        response = self.client.get('/api/auth/users/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
