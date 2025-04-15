from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path('', views.service_list, name='service_list'),
    path('service_detail/<int:service_id>/', views.service_detail, name='service_detail'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
