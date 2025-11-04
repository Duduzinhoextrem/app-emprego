import django_filters
from .models import Task


class TaskFilter(django_filters.FilterSet):
    """
    Define quais filtros podem ser aplicados na listagem de tarefas.
    
    Filtros disponíveis:
    - status: pendente ou concluída
    - created_at: data exata de criação (formato: YYYY-MM-DD)
    - created_at_gte: tarefas criadas a partir desta data
    - created_at_lte: tarefas criadas até esta data
    
    Exemplos de uso:
    - /api/tasks/?status=pending
    - /api/tasks/?created_at_gte=2024-01-01&created_at_lte=2024-12-31
    """
    status = django_filters.ChoiceFilter(choices=Task.STATUS_CHOICES)
    created_at = django_filters.DateFilter(field_name='created_at', lookup_expr='date')
    created_at_gte = django_filters.DateFilter(field_name='created_at', lookup_expr='date__gte')
    created_at_lte = django_filters.DateFilter(field_name='created_at', lookup_expr='date__lte')

    class Meta:
        model = Task
        fields = ['status', 'created_at', 'created_at_gte', 'created_at_lte']
