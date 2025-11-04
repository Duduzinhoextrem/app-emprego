from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    Personaliza como as tarefas aparecem no painel administrativo do Django.
    
    Define:
    - Quais campos aparecem na listagem
    - Quais filtros estão disponíveis
    - Quais campos podem ser pesquisados
    - Como os campos são organizados no formulário de edição
    """
    list_display = ['title', 'user', 'assigned_to', 'status', 'created_at', 'completed_at']
    list_filter = ['status', 'created_at', 'user', 'assigned_to']
    search_fields = ['title', 'description', 'user__username', 'user__email', 'assigned_to__username']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('user', 'assigned_to', 'title', 'description')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
