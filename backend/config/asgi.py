"""
Configuração ASGI do projeto Django.

ASGI (Asynchronous Server Gateway Interface) é usado para aplicações assíncronas
como WebSockets ou servidores assíncronos (ex: Daphne, Uvicorn).

Em produção, pode ser usado com servidores como:
- Daphne
- Uvicorn
- Hypercorn

Documentação: https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_asgi_application()
