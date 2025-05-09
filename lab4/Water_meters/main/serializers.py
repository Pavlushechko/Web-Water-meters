from rest_framework import serializers
from .models import Service, Application, ApplicationService, User, Ownership, UserProfile
from django.contrib.auth.models import User



# Пользователь
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['middle_name']  # Используем middle_name вместо patronymic

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile']

# Владелец услуги (ownership)
class OwnershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Ownership
        fields = '__all__'


# Услуга
class ServiceSerializer(serializers.ModelSerializer):
    owners = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = ['id', 'city', 'street', 'house', 'apartment', 'image', 'status', 'owners', 'gvs', 'hvs']

    def get_owners(self, obj):
        ownerships = Ownership.objects.filter(service=obj)
        return UserSerializer([o.user for o in ownerships], many=True).data


# Добавление услуги — отдельно, чтобы позволить указывать владельцев по id
class ServiceCreateSerializer(serializers.ModelSerializer):
    owner_ids = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=User.objects.all(),
        write_only=True
    )

    class Meta:
        model = Service
        fields = ['id', 'city', 'street', 'house', 'apartment', 'image', 'status', 'owner_ids']

    def create(self, validated_data):
        owner_ids = validated_data.pop('owner_ids')
        service = Service.objects.create(**validated_data)
        for user in owner_ids:
            Ownership.objects.create(user=user, service=service)
        return service


# Услуга в заявке
class ApplicationServiceSerializer(serializers.ModelSerializer):
    service = ServiceSerializer(read_only=True)
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        write_only=True,
        source='service'
    )

    class Meta:
        model = ApplicationService
        fields = ['id', 'application', 'service', 'service_id']


# Заявка
class ApplicationSerializer(serializers.ModelSerializer):
    application_services = ApplicationServiceSerializer(many=True, read_only=True)
    creator = UserSerializer(read_only=True)
    moderator = UserSerializer(read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'status', 'created_at', 'form_date', 'completion_date', 'creator', 'moderator', 'application_services']
