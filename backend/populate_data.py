"""
Script para popular o banco de dados com dados de exemplo.
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from tasks.models import Task

User = get_user_model()


def populate():
    """
    Popula o banco de dados com usuários e tarefas de exemplo.
    """
    print("Iniciando população de dados...")
    
    # Criar superusuário
    if not User.objects.filter(username='admin').exists():
        admin = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='admin123',
            first_name='Admin',
            last_name='User'
        )
        print(f"✓ Superusuário criado: {admin.username}")
    else:
        admin = User.objects.get(username='admin')
        print(f"✓ Superusuário já existe: {admin.username}")
    
    # Criar usuários de teste
    users_data = [
        {
            'username': 'joao',
            'email': 'joao@example.com',
            'password': 'senha123',
            'first_name': 'João',
            'last_name': 'Silva'
        },
        {
            'username': 'maria',
            'email': 'maria@example.com',
            'password': 'senha123',
            'first_name': 'Maria',
            'last_name': 'Santos'
        },
    ]
    
    created_users = []
    for user_data in users_data:
        if not User.objects.filter(username=user_data['username']).exists():
            user = User.objects.create_user(**user_data)
            created_users.append(user)
            print(f"✓ Usuário criado: {user.username}")
        else:
            user = User.objects.get(username=user_data['username'])
            created_users.append(user)
            print(f"✓ Usuário já existe: {user.username}")
    
    # Criar tarefas de exemplo para cada usuário
    tasks_data = {
        'joao': [
            {'title': 'Estudar Django REST Framework', 'description': 'Completar tutorial oficial do DRF', 'status': 'pending'},
            {'title': 'Implementar autenticação JWT', 'description': 'Configurar SimpleJWT no projeto', 'status': 'completed'},
            {'title': 'Criar testes unitários', 'description': 'Escrever testes para todas as views', 'status': 'pending'},
            {'title': 'Documentar API', 'description': 'Usar drf-spectacular para documentação', 'status': 'completed'},
            {'title': 'Deploy no servidor', 'description': 'Configurar deploy em produção', 'status': 'pending'},
        ],
        'maria': [
            {'title': 'Aprender React Native', 'description': 'Estudar componentes e navegação', 'status': 'pending'},
            {'title': 'Integrar com API', 'description': 'Conectar app mobile com backend', 'status': 'pending'},
            {'title': 'Implementar AsyncStorage', 'description': 'Armazenar tokens localmente', 'status': 'completed'},
            {'title': 'Criar telas de autenticação', 'description': 'Login, registro e recuperação de senha', 'status': 'completed'},
        ],
    }
    
    for user in created_users:
        if user.username in tasks_data:
            for task_data in tasks_data[user.username]:
                if not Task.objects.filter(user=user, title=task_data['title']).exists():
                    task = Task.objects.create(user=user, **task_data)
                    print(f"  ✓ Tarefa criada para {user.username}: {task.title}")
                else:
                    print(f"  ✓ Tarefa já existe para {user.username}: {task_data['title']}")
    
    print("\n" + "="*50)
    print("População de dados concluída!")
    print("="*50)
    print("\nCredenciais de acesso:")
    print("\nSuperusuário:")
    print("  Username: admin")
    print("  Password: admin123")
    print("\nUsuários de teste:")
    print("  Username: joao | Password: senha123")
    print("  Username: maria | Password: senha123")
    print("="*50)


if __name__ == '__main__':
    populate()
