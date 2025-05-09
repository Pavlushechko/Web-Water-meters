from django.contrib import admin
from .models import User, Service, Application, ApplicationService, Ownership

admin.site.register(User)
admin.site.register(Service)
admin.site.register(Application)
admin.site.register(ApplicationService)
admin.site.register(Ownership)
