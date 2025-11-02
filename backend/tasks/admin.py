from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    """
    Configuração do admin para o modelo Task.
    """
    list_display = ['title', 'user', 'status', 'created_at', 'completed_at']
    list_filter = ['status', 'created_at', 'user']
    search_fields = ['title', 'description', 'user__username', 'user__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at', 'completed_at']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('user', 'title', 'description')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at', 'completed_at'),
            'classes': ('collapse',)
        }),
    )
