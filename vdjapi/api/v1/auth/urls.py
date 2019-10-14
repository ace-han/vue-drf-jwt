from django.urls import path, include
from rest_framework import routers

# from . import views
# 
# router = routers.DefaultRouter()
# router.register('users', views.UserViewSet)
# 
# urlpatterns = [
#     url(r'^token/$', views.obtain_jwt_token),
#     url(r'^token/refresh/$', views.refresh_jwt_token),
#     url(r'^token/verify/$', views.verify_jwt_token),
#     url(r'^register/$', views.register),
#     url(r'^login/$', views.obtain_jwt_token),
#     url(r'^user/info/', views.current_user_info),
#     url(r'^', include(router.urls)),
# ]

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]