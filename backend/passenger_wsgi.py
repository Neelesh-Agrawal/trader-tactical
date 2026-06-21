import os
import sys


BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Ensure Passenger can import the Django project and apps.
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

from django.core.wsgi import get_wsgi_application


application = get_wsgi_application()
