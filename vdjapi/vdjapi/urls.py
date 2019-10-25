"""dashboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.urls import path, include
from django.contrib import admin
from django.contrib.auth import views as auth_views

from .views import signup, home, settings, password
from api import urls as api_urls

urlpatterns = [
    path('', home, name='home'),
    path('login', auth_views.LoginView.as_view(), name='login'),
    path('logout', auth_views.LogoutView.as_view(), name='logout'),
    path('signup', signup, name='signup'),
    path('settings', settings, name='settings'),
    path('settings/password', password, name='password'),
    path('api/', include((api_urls, 'api'), namespace='api')),
    path('oauth/', include(('rest_framework_social_oauth2.urls', 'oauth'), namespace='oauth')),
#     path('oauth/', include(('social_django.urls', 'social'), namespace='social')),
    path('admin', admin.site.urls),
    
]
