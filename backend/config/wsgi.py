"""
Configuração WSGI do projeto Django.

WSGI (Web Server Gateway Interface) é o padrão usado para servir aplicações Django
em servidores web tradicionais como Apache, Nginx (com Gunicorn), etc.

Em produção, geralmente usado com:
- Gunicorn
- uWSGI
- mod_wsgi (Apache)

Documentação: https://docs.djangoproject.com/en/5.2/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

application = get_wsgi_application()
