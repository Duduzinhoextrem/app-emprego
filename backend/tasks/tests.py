from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task

User = get_user_model()


class TaskAPITestCase(TestCase):
    """
    Testes para a API de tarefas.
    """

    def setUp(self):
        """
        Configuração inicial para os testes.
        """
        self.client = APIClient()
        
        # Criar usuários de teste
        self.user1 = User.objects.create_user(
            username='testuser1',
            email='test1@example.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='testuser2',
            email='test2@example.com',
            password='testpass123'
        )
        
        # Criar tarefas de teste
        self.task1 = Task.objects.create(
            user=self.user1,
            assigned_to=self.user1,
            title='Tarefa 1 do Usuário 1',
            description='Descrição da tarefa 1'
        )
        self.task2 = Task.objects.create(
            user=self.user2,
            assigned_to=self.user2,
            title='Tarefa 1 do Usuário 2',
            description='Descrição da tarefa 2'
        )

    def test_user_can_only_see_own_tasks(self):
        """
        Testa se o usuário só pode ver suas próprias tarefas.
        """
        self.client.force_authenticate(user=self.user1)
        response = self.client.get('/api/tasks/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Tarefa 1 do Usuário 1')

    def test_create_task(self):
        """
        Testa a criação de uma nova tarefa.
        """
        self.client.force_authenticate(user=self.user1)
        data = {
            'title': 'Nova Tarefa',
            'description': 'Descrição da nova tarefa',
            'assigned_to': self.user1.id
        }
        response = self.client.post('/api/tasks/', data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.filter(user=self.user1).count(), 2)

    def test_create_task_without_title(self):
        """
        Testa que não é possível criar tarefa sem título.
        """
        self.client.force_authenticate(user=self.user1)
        data = {
            'description': 'Descrição sem título'
        }
        response = self.client.post('/api/tasks/', data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_task(self):
        """
        Testa a atualização de uma tarefa.
        """
        self.client.force_authenticate(user=self.user1)
        data = {
            'title': 'Tarefa Atualizada',
            'status': 'completed'
        }
        response = self.client.patch(f'/api/tasks/{self.task1.id}/', data)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task1.refresh_from_db()
        self.assertEqual(self.task1.title, 'Tarefa Atualizada')
        self.assertEqual(self.task1.status, 'completed')

    def test_delete_task(self):
        """
        Testa a exclusão de uma tarefa.
        """
        self.client.force_authenticate(user=self.user1)
        response = self.client.delete(f'/api/tasks/{self.task1.id}/')
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Task.objects.filter(user=self.user1).count(), 0)

    def test_complete_task_action(self):
        """
        Testa a ação de marcar tarefa como concluída.
        """
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(f'/api/tasks/{self.task1.id}/complete/')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.task1.refresh_from_db()
        self.assertEqual(self.task1.status, 'completed')
        self.assertIsNotNone(self.task1.completed_at)

    def test_filter_tasks_by_status(self):
        """
        Testa o filtro de tarefas por status.
        """
        self.client.force_authenticate(user=self.user1)
        
        # Criar mais uma tarefa concluída
        Task.objects.create(
            user=self.user1,
            assigned_to=self.user1,
            title='Tarefa Concluída',
            status='completed'
        )
        
        # Filtrar por pendentes
        response = self.client.get('/api/tasks/?status=pending')
        self.assertEqual(len(response.data['results']), 1)
        
        # Filtrar por concluídas
        response = self.client.get('/api/tasks/?status=completed')
        self.assertEqual(len(response.data['results']), 1)

    def test_unauthenticated_access(self):
        """
        Testa que usuários não autenticados não podem acessar a API.
        """
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
