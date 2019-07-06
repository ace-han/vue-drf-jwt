from django.urls import path, include
from .v1 import urls as v1_urls
#from .v2 import urls as v2_urls

urlpatterns = [
    path('', include((v1_urls, 'default'), namespace='default')), # default is the latest
    path('v1/', include((v1_urls, 'v1'), namespace='v1')),
    #url(r'^v2/', include(v2_urls, namespace='v2')),
]
