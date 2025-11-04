from django.db import models
from django.conf import settings
from django.core.validators import MaxLengthValidator


class Task(models.Model):
    """
    Modelo que representa uma tarefa no sistema.
    
    Cada tarefa tem:
    - Um criador (quem criou a tarefa)
    - Um usuário designado (quem vai fazer a tarefa)
    - Título e descrição
    - Status (pendente ou concluída)
    - Datas de criação, atualização e conclusão
    """
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('completed', 'Concluída'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='created_tasks',
        verbose_name='Criador'
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='assigned_tasks',
        verbose_name='Usuário Designado',
        help_text='Usuário responsável por executar a tarefa'
    )
    title = models.CharField(
        max_length=200,
        verbose_name='Título',
        validators=[MaxLengthValidator(200, message='O título não pode ter mais de 200 caracteres.')]
    )
    description = models.TextField(
        blank=True,
        null=True,
        max_length=1000,
        verbose_name='Descrição',
        validators=[MaxLengthValidator(1000, message='A descrição não pode ter mais de 1000 caracteres.')]
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        verbose_name='Status'
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Data de Criação')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Data de Atualização')
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name='Data de Conclusão')

    class Meta:
        verbose_name = 'Tarefa'
        verbose_name_plural = 'Tarefas'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        """
        Atualiza automaticamente a data de conclusão quando o status muda.
        """
        from django.utils import timezone
        if self.status == 'completed' and not self.completed_at:
            self.completed_at = timezone.now()
        elif self.status == 'pending':
            self.completed_at = None
        super().save(*args, **kwargs)
