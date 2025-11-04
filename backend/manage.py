#!/usr/bin/env python
"""
Utilitário de linha de comando do Django.

Permite executar comandos administrativos como:
- python manage.py runserver (iniciar servidor)
- python manage.py migrate (aplicar migrações)
- python manage.py createsuperuser (criar admin)
- python manage.py shell (console interativo)
"""
import os
import sys


def main():
    """Executa comandos administrativos do Django."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Não foi possível importar o Django. "
            "Certifique-se de que está instalado e disponível no PYTHONPATH. "
            "Você ativou o ambiente virtual (venv)?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
