from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm, \
    AdminPasswordChangeForm, UsernameField
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

from authx.models import User as WujieUser

class WujieUserChangeForm(UserChangeForm):
    class Meta:
        model = WujieUser
        fields = '__all__'
        field_classes = {'username': UsernameField}

class WujieUserCreationForm(UserCreationForm):
    class Meta:
        model = WujieUser
        fields = ("username",)
        field_classes = {'username': UsernameField}


class WujieUserAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Personal info'), {'fields': ('nickname', 'email')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser',
                                       'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )
    form = WujieUserChangeForm
    add_form = WujieUserCreationForm
    change_password_form = AdminPasswordChangeForm
    list_display = ('username', 'email', 'nickname', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'nickname', 'email')
    ordering = ('username',)
    filter_horizontal = ('groups', 'user_permissions',)

# admin.site.unregister(User)
admin.site.register(WujieUser, WujieUserAdmin)