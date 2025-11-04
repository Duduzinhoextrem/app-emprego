"""
Configuração das URLs de tarefas.

Todas as rotas de tarefas são geradas automaticamente pelo ViewSet:
- GET    /api/tasks/           - Listar tarefas
- POST   /api/tasks/           - Criar tarefa
- GET    /api/tasks/{id}/       - Ver detalhes
- PATCH  /api/tasks/{id}/       - Atualizar tarefa
- PUT    /api/tasks/{id}/       - Atualizar tarefa (completo)
- DELETE /api/tasks/{id}/       - Deletar tarefa
- POST   /api/tasks/{id}/complete/ - Marcar como concluída
- POST   /api/tasks/{id}/reopen/   - Reabrir tarefa
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TaskViewSet

app_name = 'tasks'

# Router gera automaticamente todas as rotas do CRUD
router = DefaultRouter()
router.register(r'', TaskViewSet, basename='task')

urlpatterns = [
    path('', include(router.urls)),  # Inclui todas as rotas geradas pelo router
]
