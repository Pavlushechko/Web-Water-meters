from django.urls import path, include 
from rest_framework.routers import DefaultRouter

from .views import ( ServiceViewSet, ApplicationViewSet, ApplicationServiceViewSet, OwnershipViewSet )

router = DefaultRouter() 
router.register(r'services', ServiceViewSet, basename='service') 
router.register(r'applications', ApplicationViewSet, basename='application') 
router.register(r'application-services', ApplicationServiceViewSet, basename='applicationservice')
router.register(r'ownerships', OwnershipViewSet)

urlpatterns = [ path('', include(router.urls)), ]