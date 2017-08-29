from rest_framework.permissions import BasePermission, IsAdminUser as DrfIsAdminUser

class IsAdminUser(DrfIsAdminUser):
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)

class IsSuperUser(BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser
    
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)