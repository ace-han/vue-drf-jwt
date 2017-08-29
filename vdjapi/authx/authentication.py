from rest_framework_jwt.authentication import BaseJSONWebTokenAuthentication

from django.conf import settings

class JSONWebTokenAuthenticationQS(BaseJSONWebTokenAuthentication):
    def get_jwt_value(self, request):
        return request.query_params.get(settings.QS_JWT_KEY)