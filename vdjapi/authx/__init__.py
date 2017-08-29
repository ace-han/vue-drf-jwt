# this module special for authentication and authorization


# since the app_labbel='auth' is used by django.contrib.auth
# actually it's 
# django.apps.config.AppConfig.__init__
# if not hasattr(self, 'label'):
#    self.label = app_name.rpartition(".")[2]
# this will make 'django.contrib.auth' 'auth'=>label and this label should be unique across the project

# so I might rename this module to authx with the default django app behavior
# for app app_label name rename plz refer to 
#     https://docs.djangoproject.com/en/1.7/ref/applications/#for-application-authors




