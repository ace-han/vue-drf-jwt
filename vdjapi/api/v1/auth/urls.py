from django.conf.urls import url, include
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register('users', views.UserViewSet)

urlpatterns = [
    url(r'^token/$', views.obtain_jwt_token),
    url(r'^token/refresh/$', views.refresh_jwt_token),
    url(r'^token/verify/$', views.verify_jwt_token),
    url(r'^register/$', views.register),
    url(r'^login/$', views.obtain_jwt_token),
    url(r'^user/info/', views.current_user_info),
    url(r'^', include(router.urls)),
]
