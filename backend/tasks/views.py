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
    
    Este ViewSet permite criar, listar, atualizar e deletar tarefas.
    Cada usuário só vê suas próprias tarefas (ou as designadas para ele).
    Administradores veem todas as tarefas.
    
    Endpoints disponíveis:
    - GET /api/tasks/ - Lista todas as tarefas do usuário
    - POST /api/tasks/ - Cria uma nova tarefa
    - GET /api/tasks/{id}/ - Ver detalhes de uma tarefa específica
    - PATCH /api/tasks/{id}/ - Atualiza uma tarefa (parcial)
    - PUT /api/tasks/{id}/ - Atualiza uma tarefa (completo)
    - DELETE /api/tasks/{id}/ - Deleta uma tarefa
    - POST /api/tasks/{id}/complete/ - Marca uma tarefa como concluída
    - POST /api/tasks/{id}/reopen/ - Reabre uma tarefa (volta para pendente)
    """
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = TaskFilter
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'updated_at', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        """
        Filtra as tarefas que o usuário tem permissão para ver.
        
        Regras de acesso:
        - Usuários comuns: veem apenas tarefas criadas por eles OU designadas para eles
        - Administradores: veem todas as tarefas do sistema
        
        Isso garante que cada usuário tenha privacidade com suas tarefas,
        enquanto admins podem gerenciar tudo.
        """
        if not self.request.user or not self.request.user.is_authenticated:
            logger.error("Usuário não autenticado tentando acessar tarefas")
            return Task.objects.none()
        
        try:
            user = self.request.user
            
            # Verifica se é administrador (staff ou superusuário)
            if user.is_staff or user.is_superuser:
                # Admins veem tudo - necessário para gerenciamento
                queryset = Task.objects.all()
                logger.debug(f"Admin {user.username} acessando todas as tarefas")
            else:
                # Usuário comum só vê:
                # 1. Tarefas que ele mesmo criou (user = ele)
                # 2. Tarefas que foram designadas para ele (assigned_to = ele)
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
        
        - Criar: usa TaskCreateSerializer (precisa de assigned_to)
        - Atualizar: usa TaskUpdateSerializer (permite mudar status)
        - Listar/Ver: usa TaskSerializer (mostra tudo formatado)
        """
        if self.action == 'create':
            return TaskCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return TaskUpdateSerializer
        return TaskSerializer
    
    def list(self, request, *args, **kwargs):
        """
        Lista as tarefas do usuário com tratamento de erros.
        
        Se der algum problema, retorna uma mensagem amigável ao invés
        de expor detalhes técnicos ao frontend.
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
        Retorna uma tarefa específica, mas antes verifica se o usuário tem permissão.
        
        Proteção de segurança:
        - Admins podem ver qualquer tarefa
        - Usuários comuns só podem ver tarefas próprias ou designadas para eles
        - Se tentar acessar uma tarefa sem permissão, recebe erro 403
        """
        obj = super().get_object()
        
        # Administradores têm acesso total
        if self.request.user.is_staff or self.request.user.is_superuser:
            return obj
        
        # Usuário comum: verifica se é o criador OU o designado
        is_creator = obj.user == self.request.user
        is_assigned = obj.assigned_to == self.request.user
        
        if not (is_creator or is_assigned):
            # Não tem permissão - bloqueia o acesso
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Você não tem permissão para acessar esta tarefa.")
        
        return obj

    def perform_create(self, serializer):
        """
        Quando uma tarefa é criada, define automaticamente quem é o criador.
        
        O usuário logado vira o criador da tarefa automaticamente.
        O usuário designado (assigned_to) vem do formulário.
        """
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """
        Marca uma tarefa como concluída.
        
        Quando chamado, muda o status para 'completed' e registra
        automaticamente a data/hora da conclusão.
        
        Endpoint: POST /api/tasks/{id}/complete/
        """
        task = self.get_object()
        task.status = 'completed'
        task.save()  # O método save() do modelo atualiza completed_at automaticamente
        serializer = self.get_serializer(task)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reopen(self, request, pk=None):
        """
        Reabre uma tarefa que estava concluída.
        
        Muda o status de 'completed' para 'pending' e remove
        a data de conclusão, permitindo que a tarefa seja trabalhada novamente.
        
        Endpoint: POST /api/tasks/{id}/reopen/
        """
        task = self.get_object()
        task.status = 'pending'
        task.save()  # O método save() do modelo remove completed_at automaticamente
        serializer = self.get_serializer(task)
        return Response(serializer.data)
