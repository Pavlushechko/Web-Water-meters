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
from django.core.cache import cache
from datetime import datetime, timedelta
import json

from .models import Service, Application, ApplicationService, Ownership
from .serializers import (
    ServiceSerializer,
    ServiceCreateSerializer,
    ApplicationSerializer,
    ApplicationServiceSerializer,
    ApplicationCreateSerializer,
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
        is_admin = user.is_staff

        search_query = request.query_params.get('search', '').strip()
        page = request.query_params.get('page', '1')

        key_prefix = "services_all" if is_admin else f"services_user_{user.id}"
        search_part = search_query.replace(" ", "_") or "none"
        cache_key = f"{key_prefix}_search_{search_part}_page_{page}"

        cached_json = cache.get(cache_key)
        if cached_json:
            data = json.loads(cached_json)
            return Response(data)

        services = Service.objects.all() if is_admin else Service.objects.filter(ownership__user=user)

        if search_query:
            for keyword in search_query.split():
                services = services.filter(
                    Q(city__istartswith=keyword) |
                    Q(street__istartswith=keyword) |
                    Q(house__istartswith=keyword) |
                    Q(apartment__istartswith=keyword)
                )

        if page == 'all':
            serializer = ServiceSerializer(services, many=True)
            data = serializer.data
            cache.set(cache_key, json.dumps(data))
            return Response(data)

        paginator = PageNumberPagination()
        paginator.page_size = 2
        result_page = paginator.paginate_queryset(services, request)
        serializer = ServiceSerializer(result_page, many=True)
        paginated_data = paginator.get_paginated_response(serializer.data).data

        cache.set(cache_key, json.dumps(paginated_data))
        return Response(paginated_data)

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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
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

        # Получаем параметры фильтрации
        created_start_str = request.query_params.get('created_start')
        created_end_str = request.query_params.get('created_end')
        completed_start_str = request.query_params.get('completed_start')
        completed_end_str = request.query_params.get('completed_end')

        status_filter = request.query_params.get('status')
        # Базовый queryset
        if user.is_staff:
            applications = Application.objects.all()
        else:
            applications = Application.objects.filter(creator=user)

        # Фильтрация по статусу
        if status_filter:
            applications = applications.filter(status=status_filter.lower())

        if created_start_str:
            try:
                created_start = datetime.strptime(created_start_str, '%Y-%m-%d').date()
                applications = applications.filter(created_at__date__gte=created_start)
            except ValueError:
                return Response({"detail": "Неверный формат created_start"}, status=400)

        if created_end_str:
            try:
                created_end = datetime.strptime(created_end_str, '%Y-%m-%d').date()
                applications = applications.filter(created_at__date__lte=created_end)
            except ValueError:
                return Response({"detail": "Неверный формат created_end"}, status=400)

        if completed_start_str:
            try:
                completed_start = datetime.strptime(completed_start_str, '%Y-%m-%d').date()
                applications = applications.filter(completion_date__date__gte=completed_start)
            except ValueError:
                return Response({"detail": "Неверный формат completed_start"}, status=400)

        if completed_end_str:
            try:
                completed_end = datetime.strptime(completed_end_str, '%Y-%m-%d').date()
                applications = applications.filter(completion_date__date__lte=completed_end)
            except ValueError:
                return Response({"detail": "Неверный формат completed_end"}, status=400)

        # Финальный возврат — уже после всех фильтров
        serializer = ApplicationSerializer(applications.order_by('-created_at'), many=True)
        return Response(serializer.data)


    def post(self, request, *args, **kwargs):
        data = request.data.copy()
        data['creator'] = request.user.id
        data['moderator'] = request.user.id
        serializer = ApplicationCreateSerializer(data=data)
        if serializer.is_valid():
            application = serializer.save()
            return Response(ApplicationSerializer(application).data, status=status.HTTP_201_CREATED)
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
    def get_permissions(self):
        permission_classes = [IsAdminUser]
        if self.request.method == 'GET':
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get(self, request, pk):
        user = request.user
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # 🔒 Проверяем, является ли пользователь админом или создателем заявки
        if not user.is_staff and application.creator != user:
            return Response({"detail": "Нет доступа."}, status=status.HTTP_403_FORBIDDEN)
            
        serializer = ApplicationSerializer(application)
        return Response(serializer.data)
    
    def put(self, request, pk, *args, **kwargs):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"detail": "Заявка не найдена."}, status=status.HTTP_404_NOT_FOUND)

        user = request.user
        if not user.is_staff and application.creator != user:
            return Response({"detail": "Недостаточно прав."}, status=status.HTTP_403_FORBIDDEN)

        serializer = ApplicationSerializer(application, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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

class AdminCheckView(APIView):
    def get(self, request):
        return Response({
            'is_admin': request.user.is_staff or request.user.is_superuser
        }, status=status.HTTP_200_OK)