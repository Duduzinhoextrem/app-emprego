import django_filters
from .models import Task


class TaskFilter(django_filters.FilterSet):
    """
    Filtros para tarefas.
    Permite filtrar por status e por data de criação.
    """
    status = django_filters.ChoiceFilter(choices=Task.STATUS_CHOICES)
    created_at = django_filters.DateFilter(field_name='created_at', lookup_expr='date')
    created_at_gte = django_filters.DateFilter(field_name='created_at', lookup_expr='date__gte')
    created_at_lte = django_filters.DateFilter(field_name='created_at', lookup_expr='date__lte')

    class Meta:
        model = Task
        fields = ['status', 'created_at', 'created_at_gte', 'created_at_lte']
