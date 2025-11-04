# Generated manually

from django.db import migrations


def populate_assigned_to(apps, schema_editor):
    """
    Popula o campo assigned_to com o mesmo valor de user para tarefas existentes.
    """
    Task = apps.get_model('tasks', 'Task')
    for task in Task.objects.all():
        if not task.assigned_to:
            task.assigned_to = task.user
            task.save(update_fields=['assigned_to'])


def reverse_populate_assigned_to(apps, schema_editor):
    """
    Operação reversa não necessária.
    """
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_remove_task_tasks_task_user_id_f0f56f_idx_and_more'),
    ]

    operations = [
        migrations.RunPython(populate_assigned_to, reverse_populate_assigned_to),
    ]

