from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin


urlpatterns = [
    path('', views.service_list, name='service_list'),
    path('admin/', admin.site.urls),  
    path('service_detail/<int:service_id>/', views.service_detail, name='service_detail'),
    path('applications/', views.applications, name='applications')
] 
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

