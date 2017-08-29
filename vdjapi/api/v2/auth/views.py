from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def test(*args, **kwargs):
    return Response({'msg': 'v2 test'})