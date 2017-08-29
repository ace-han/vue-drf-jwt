
from django.contrib.auth import get_user_model
from rest_condition import Or
from rest_framework import status
from rest_framework.decorators import api_view, list_route
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

@api_view(['GET'])
def test(*args, **kwargs):
    return Response({'msg': 'v1 test'})

def jwt_response_special_handling(response, user=None):
    # special handling for login(obtain_xxx) and register on successful jwt response
    # just add an extra info for is_necessary_user_info_filled telling the client to nav to profile page
    if user is None:
        token = response.data.get('token')
        user = __resolve_user(token)
    return response

def __resolve_user(token):
    # a little bit overheaded but just login interface for the time being
    serializer = VerifyJSONWebTokenSerializer(data={'token': token,})
    serializer.is_valid(raise_exception=True)
    return serializer.object.get('user')

@api_view(['POST', ])
def register(request):
    # need to do some transform on this request.data in order to use UserCreationSerializer
    composed_profile = {
        'phone_num': request.data.get('phone_num'),
        'city': request.data.get('city'),
    }
    request.data['profile'] = composed_profile
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        payload = jwt_payload_handler(user)
        token = jwt_encode_handler(payload)
        response_data = jwt_response_payload_handler(token, user, request)
        return jwt_response_special_handling(
                    Response(response_data, status.HTTP_201_CREATED), user=user
                )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST', ])
def login(*args, **kwargs):
    response = obtain_jwt_token(*args, **kwargs)
    if status.is_success(response.status_code):
        # according to rest_framework_jwt.utils.jwt_response_payload_handler
        # response.data = {'token': xxxx, ...}
        response = jwt_response_special_handling(response)
    return response

class UserViewSet(ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = (IsAuthenticated,
                          Or(IsAdminUser), )

    @list_route(
        methods=['get'],
        url_path='user-info'
    )
    def current_user_info(self, request):
        # may go with groups
        serializer = UserGroupSerializer(request.user)
        return Response(serializer.data)