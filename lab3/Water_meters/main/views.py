from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Service, Application, ApplicationService, Ownership, User
from .serializers import (
    ServiceSerializer,
    ServiceCreateSerializer,
    ApplicationSerializer,
    ApplicationServiceSerializer,
    OwnershipSerializer 
)


# Услуги (Service)
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['POST', 'PUT', 'PATCH']:
            return ServiceCreateSerializer
        return ServiceSerializer

    def perform_create(self, serializer):
        service = serializer.save()
        # владельцы уже добавлены в ServiceCreateSerializer.create()
        return service


# Заявки (Application)
class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


# Связь Заявка - Услуга
class ApplicationServiceViewSet(viewsets.ModelViewSet):
    queryset = ApplicationService.objects.all()
    serializer_class = ApplicationServiceSerializer


class OwnershipViewSet(viewsets.ModelViewSet): 
    queryset = Ownership.objects.all() 
    serializer_class = OwnershipSerializer 