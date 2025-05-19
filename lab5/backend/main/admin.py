from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from .models import Service, Application, ApplicationService, Ownership, CustomUserCreationForm, UserProfile


admin.site.register(Service)
admin.site.register(Application)
admin.site.register(ApplicationService)
admin.site.register(Ownership)

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(UserAdmin):
    inlines = (UserProfileInline,)

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)