from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from django.db import models
import logging
from .models import Task
from .serializers import TaskSerializer, TaskCreateSerializer, TaskUpdateSerializer
from .filters import TaskFilter

logger = logging.getLogger(__name__)


class TaskViewSet(viewsets.ModelViewSet):
    """
    Gerencia todas as operações de tarefas (CRUD completo).
    
    Endpoints disponíveis:
    - GET /api/tasks/ - Lista as tarefas do usuário
    - POST /api/tasks/ - Cria uma nova tarefa
    - GET /api/tasks/{id}/ - Mostra os detalhes de uma tarefa
    - PATCH /api/tasks/{id}/ - Atualiza uma tarefa
    - DELETE /api/tasks/{id}/ - Deleta uma tarefa
    - POST /api/tasks/{id}/complete/ - Marca como concluída
    - POST /api/tasks/{id}/reopen/ - Reabre uma tarefa concluída
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Filtra as tarefas baseado nas permissões do usuário.
        
        Usuários normais só veem tarefas que criaram ou que foram designadas pra eles.
        Administradores veem todas as tarefas do sistema.
        """
        if not self.request.user or not self.request.user.is_authenticated:
            logger.error("Usuário não autenticado tentando acessar tarefas")
            return Task.objects.none()
        
        try:
            user = self.request.user
            
            if user.is_staff or user.is_superuser:
                queryset = Task.objects.all()
                logger.debug(f"Admin {user.username} acessando todas as tarefas")
            else:
                queryset = Task.objects.filter(
                    models.Q(user=user) | models.Q(assigned_to=user)
                )
                logger.debug(f"Usuário {user.username} visualizando {queryset.count()} tarefas")
            
            return queryset
        except Exception as e:
            logger.error(f"Erro ao buscar tarefas para usuário {self.request.user.username}: {str(e)}", exc_info=True)
            return Task.objects.none()

    def get_serializer_class(self):
        """
        Escolhe qual serializer usar dependendo da operação.
        """
        if self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer
    
    def list(self, request, *args, **kwargs):
        """
        Lista as tarefas com tratamento de erros.
        """
        try:
            return super().list(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Erro ao listar tarefas: {str(e)}", exc_info=True)
            return Response(
                {'detail': 'Erro interno do servidor. Verifique os logs para mais detalhes.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def get_object(self):
        """
        Verifica se o usuário tem permissão pra acessar essa tarefa.
        Admin pode ver qualquer tarefa, usuário normal só vê as suas ou as designadas pra ele.
        """
        obj = super().get_object()
        
        if self.request.user.is_staff or self.request.user.is_superuser:
            return obj
        
        is_creator = obj.user == self.request.user
        is_assigned = obj.assigned_to == self.request.user
        
        if not (is_creator or is_assigned):
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Você não tem permissão para acessar esta tarefa.")
        
        return obj

    def perform_create(self, serializer):
        """
        Define automaticamente quem criou a tarefa como o usuário logado.
        """
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Marca uma tarefa como concluída."""
        task = self.get_object()
        task.status = 'completed'
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reopen(self, request, pk=None):
        """Reabre uma tarefa que estava concluída."""
        task = self.get_object()
        task.status = 'pending'
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)
