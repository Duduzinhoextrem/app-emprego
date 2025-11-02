from django.db import models
from django.conf import settings
from django.core.validators import MaxLengthValidator


class Task(models.Model):
    """
    Modelo para representar uma tarefa (to-do item).
    Cada tarefa pertence a um usuário específico.
    """
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('completed', 'Concluída'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='tasks',
        verbose_name='Usuário'
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
            models.Index(fields=['user', 'created_at']),
        ]

    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        """
        Sobrescreve o método save para atualizar completed_at automaticamente.
        """
        from django.utils import timezone
        if self.status == 'completed' and not self.completed_at:
            self.completed_at = timezone.now()
        elif self.status == 'pending':
            self.completed_at = None
        super().save(*args, **kwargs)
