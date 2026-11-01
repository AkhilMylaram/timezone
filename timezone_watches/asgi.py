"""
ASGI config for timezone_watches project.
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'timezone_watches.settings')

application = get_asgi_application()
