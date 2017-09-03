
from django.contrib.auth import get_user_model
from rest_condition import Or
from rest_framework import status
from rest_framework.decorators import api_view, list_route, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.views import obtain_jwt_token, \
    refresh_jwt_token, verify_jwt_token

from api.v1.auth.serializers import UserSerializer, UserGroupSerializer
from authx.permissions import IsAdminUser


jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER
# just a simple wrapper with extra version parameter

def __resolve_user(token):
    # a little bit overheaded but just login interface for the time being
    serializer = VerifyJSONWebTokenSerializer(data={'token': token,})
    serializer.is_valid(raise_exception=True)
    return serializer.object.get('user')

@api_view(['POST', ])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        response_data = jwt_response_payload_handler(token, user, request)
        return Response(response_data, status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', ])
def login(*args, **kwargs):
    response = obtain_jwt_token(*args, **kwargs)
    return response

class UserViewSet(ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
#     permission_classes = (IsAuthenticated,
#                           Or(IsAdminUser), )

@api_view(('GET',))
@permission_classes((IsAuthenticated,))
def current_user_info(request):
    serializer = UserGroupSerializer(request.user)
    return Response(serializer.data)