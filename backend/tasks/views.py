from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Task
from .serializers import TaskSerializer, TaskCreateSerializer, TaskUpdateSerializer
from .filters import TaskFilter


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciamento completo de tarefas (CRUD).
    
    Endpoints:
    - GET /api/tasks/ - Listar todas as tarefas do usuário
    - POST /api/tasks/ - Criar nova tarefa
    - GET /api/tasks/{id}/ - Detalhes de uma tarefa
    - PUT/PATCH /api/tasks/{id}/ - Atualizar tarefa
    - DELETE /api/tasks/{id}/ - Deletar tarefa
    - POST /api/tasks/{id}/complete/ - Marcar tarefa como concluída
    - POST /api/tasks/{id}/reopen/ - Reabrir tarefa (marcar como pendente)
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Retorna apenas as tarefas do usuário autenticado.
        Garante isolamento de dados entre usuários.
        """
        return Task.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        """
        Retorna o serializer apropriado baseado na ação.
        """
        if self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer

    def perform_create(self, serializer):
        """
        Associa automaticamente o usuário autenticado à tarefa criada.
        """
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Marca uma tarefa como concluída.
        Endpoint: POST /api/tasks/{id}/complete/
        """
        task = self.get_object()
        task.status = 'completed'
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reopen(self, request, pk=None):
        """
        Reabre uma tarefa (marca como pendente).
        Endpoint: POST /api/tasks/{id}/reopen/
        """
        task = self.get_object()
        task.status = 'pending'
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)
