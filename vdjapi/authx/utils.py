
from rest_framework import serializers
from authx.models import User
from rest_framework_jwt.utils import jwt_payload_handler as drf_jwt_payload_handler

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
                    style={'input_type': 'password'},
                    write_only=True # password not showing for the time being
                )
    
    class Meta:
        model = User

def jwt_response_payload_handler(token, user=None, request=None):
    """
    Returns the response data for both the login and refresh views.
    Override to return a custom response such as including the
    serialized representation of the User.
    
    Deprecated: as some info can be within token xxx.yyy.zzz
    payload => yyy (base64 encoded)

    """
    return {
        'token': token,
        #'user': UserSerializer(user).data,
    }

def jwt_payload_handler(user):
    
    payload = drf_jwt_payload_handler(user)
    
    '''
        warnings.warn(
            'The following fields will be removed in the future: '
            '`email` and `user_id`. ',
            DeprecationWarning
        )
        payload = {
            'user_id': user.pk,
            'email': user.email,
            'username': username,
            'exp': datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA
        }
    '''
    
    payload.setdefault('nickname', user.nickname or user.username)
    # payload.setdefault('roles', []) # TODO 
    return payload