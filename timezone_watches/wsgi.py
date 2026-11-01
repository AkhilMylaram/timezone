"""
WSGI config for timezone_watches project.
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'timezone_watches.settings')

application = get_wsgi_application()
