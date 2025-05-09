from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Service, Application, ApplicationService, Ownership
from .serializers import (
    ServiceSerializer,
    ServiceCreateSerializer,
    ApplicationSerializer,
    ApplicationServiceSerializer,
    OwnershipSerializer 
)

# Услуги (Service)
class ServiceAPIView(APIView):
    
    def get(self, request):
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ServiceCreateSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            return Response(ServiceSerializer(service).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Детальная информация об одной услуге (Service)
class ServiceDetailAPIView(APIView):
    def get(self, request, pk):
        service = get_object_or_404(Service, pk=pk)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)
    # def post(self, request, pk):
    #     serializer = ServiceSerializer(data=request.data)
    #     if serializer.is_valid():
    #         # Можешь выполнить какую-то логику, например сохранить заявку
    #         return Response({"message": "Заявка принята."}, status=status.HTTP_200_OK)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Заявки (Application)
class ApplicationAPIView(APIView):
    # permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = Application.objects.all()
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(creator=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Связь Заявка - Услуга
class ApplicationServiceAPIView(APIView):
    
    def get(self, request):
        application_services = ApplicationService.objects.all()
        serializer = ApplicationServiceSerializer(application_services, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = ApplicationServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        application_service = get_object_or_404(ApplicationService, pk=pk)
        serializer = ApplicationServiceSerializer(application_service, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        application_service = get_object_or_404(ApplicationService, pk=pk)
        application_service.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# Владельцы (Ownership)
class OwnershipAPIView(APIView):

    def get(self, request):
        ownerships = Ownership.objects.all()
        serializer = OwnershipSerializer(ownerships, many=True)
        return Response(serializer.data)
