from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.utils import timezone

from .models import Service, Application, ApplicationService, Ownership
from .serializers import (
    ServiceSerializer,
    ServiceCreateSerializer,
    ApplicationSerializer,
    ApplicationServiceSerializer,
    OwnershipSerializer,
    UserSerializer
)


# Услуги (Service)
class ServiceAPIView(APIView):
    def get_permissions(self):
        permission_classes = [IsAdminUser]
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get(self, request):
        user = request.user

        # Если пользователь — admin, он видит все услуги
        if user.is_staff:
            services = Service.objects.all()
        else:
            services = Service.objects.filter(ownership__user=user)

        # Поиск
        search_query = request.query_params.get('search', '')
        if search_query:
            for keyword in search_query.strip().split():
                services = services.filter(
                    Q(city__istartswith=keyword) |
                    Q(street__istartswith=keyword) |
                    Q(house__istartswith=keyword) |
                    Q(apartment__istartswith=keyword)
                )

        # Пагинация
        if request.query_params.get('page') == 'all':
            serializer = ServiceSerializer(services, many=True)
            return Response(serializer.data)

        paginator = PageNumberPagination()
        paginator.page_size = 2
        result_page = paginator.paginate_queryset(services, request)
        serializer = ServiceSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)


    def post(self, request):
        serializer = ServiceCreateSerializer(data=request.data)
        if serializer.is_valid():
            service = serializer.save()
            return Response(ServiceSerializer(service).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Детальная информация об одной услуге (Service)
class ServiceDetailAPIView(APIView):
    def get_permissions(self):
        permission_classes = [IsAdminUser]
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get(self, request, pk, *args, **kwargs):
        user = request.user
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        # 🔒 Только админ или владелец
        if not user.is_staff and not service.ownership_set.filter(user=user).exists():
            return Response({"detail": "Нет доступа."}, status=status.HTTP_403_FORBIDDEN)
        serializer = ServiceSerializer(service)
        return Response(serializer.data)

    def put(self, request, pk, *args, **kwargs):
        try:
            service = Service.objects.get(pk=pk)
        except Service.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)

        # Оставляем только gvs и hvs
        allowed_fields = {'gvs', 'hvs'}
        update_data = {key: value for key, value in request.data.items() if key in allowed_fields}

        serializer = ServiceSerializer(service, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Service updated.', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Заявки (Application)

class ApplicationAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'DELETE':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get(self, request, *args, **kwargs):
        application_id = kwargs.get('application_id')
        user = request.user

        if application_id:
            try:
                application = Application.objects.get(id=application_id)
                if not user.is_staff and application.creator != user:
                    return Response({"detail": "Недостаточно прав."}, status=status.HTTP_403_FORBIDDEN)
                serializer = ApplicationSerializer(application)
                return Response(serializer.data, status=status.HTTP_200_OK)
            except Application.DoesNotExist:
                return Response({"detail": "Заявка не найдена."}, status=status.HTTP_404_NOT_FOUND)

        if user.is_staff:
            applications = Application.objects.all()
        else:
            applications = Application.objects.filter(creator=user)

        serializer = ApplicationSerializer(applications, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['creator'] = request.user.id  # автоматически устанавливаем создателя
        data['moderator'] = request.user.id
        serializer = ApplicationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Связь Заявка - Услуга
class ApplicationServiceAPIView(APIView):
    # permission_classes = [IsAdminUser]
    def get_permissions(self):
        if self.request.method == 'DELETE':
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
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

class ApplicationDetailAPIView(APIView):
    # permission_classes = [IsAdminUser]
    def get(self, request, pk):
        application = get_object_or_404(Application, pk=pk)
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)


class RegisterUserView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Создаем JWT токен для нового пользователя
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh_token"]
            token = RefreshToken(refresh_token)
            token.blacklist()  # Добавляем refresh токен в черный список
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
