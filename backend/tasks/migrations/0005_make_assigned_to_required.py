# Generated manually

from django.db import migrations, models
import django.db.models.deletion
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0004_populate_assigned_to'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='assigned_to',
            field=models.ForeignKey(
                help_text='Usuário responsável por executar a tarefa',
                on_delete=django.db.models.deletion.CASCADE,
                related_name='assigned_tasks',
                to=settings.AUTH_USER_MODEL,
                verbose_name='Usuário Designado'
            ),
        ),
    ]

