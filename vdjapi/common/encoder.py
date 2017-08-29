from django.core.serializers.json import DjangoJSONEncoder


class BlobJsonEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, bytes):
            return obj.decode('utf-8')
        return super(BlobJsonEncoder, self).default(obj)
