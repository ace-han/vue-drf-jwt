from django.contrib.auth import get_user_model
from rest_framework.fields import SerializerMethodField
from rest_framework.relations import StringRelatedField

from common.serializers import DynamicFieldsModelSerializer


class UserSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = get_user_model()
        exclude = ('password', )

class UserGroupSerializer(DynamicFieldsModelSerializer):
    groups = StringRelatedField(many=True)
#     groups = SerializerMethodField()
    class Meta:
        model = get_user_model()
        exclude = ('password', )
        
#     def get_groups(self, obj):
#         # empty list for the time being
#         return []

