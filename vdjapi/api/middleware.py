from django.core.urlresolvers import resolve
from django.utils.deprecation import MiddlewareMixin

# plz refer to 
# http://stackoverflow.com/questions/14269719/django-rest-framework-v1-versioning#answer-21839842
# e.g.: 
#    curl -H "X-Version: v1" http://localhost:8090/api/auth/test/
# and I've decided to do this in the old way (MiddlewareMixin)
class VersionSwitch(MiddlewareMixin):
    
    def process_request(self, request):
        '''
            curl http://localhost:8090/api/auth/test/ => the latest, v2 maybe
            curl -H "X-Version: v2" http://localhost:8090/api/auth/test/ => v2
            curl -H "X-Version: v1" http://localhost:8090/api/v2/auth/test/ => v2
        '''
        r = resolve(request.path_info)
        version = request.META.get('HTTP_X_VERSION', False)
        if r.namespace.startswith('api:') and version:
            # request.path_info will always be equal to or longer than request.path
            # so I choose request.path to test
            if '/'.join(r.namespaces[:2]) not in request.path:
                # version in request.path takes high priority 
                request.path = request.path.replace('/api', '/api/{}'.format(version))
                request.path_info = request.path_info.replace('/api', '/api/{}'.format(version))