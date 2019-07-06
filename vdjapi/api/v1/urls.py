from django.urls import path, include
from .auth import urls as auth_urls

urlpatterns = [
    path('auth', include((auth_urls, 'auth'), namespace='auth')),
]
