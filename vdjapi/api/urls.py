from django.conf.urls import url, include
from .v1 import urls as v1_urls
#from .v2 import urls as v2_urls

urlpatterns = [
    url(r'', include(v1_urls, namespace='default')), # default is the latest
    url(r'^v1/', include(v1_urls, namespace='v1')),
    #url(r'^v2/', include(v2_urls, namespace='v2')),
]
