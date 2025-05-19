from rest_framework import serializers
from .models import Service, Application, ApplicationService, User, Ownership, UserProfile
from django.contrib.auth.models import User



# Пользователь
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['middle_name']  # Используем middle_name вместо patronymic

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    middle_name = serializers.CharField(write_only=True, required=False)  # добавляем поле

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'middle_name']

    def create(self, validated_data):
        middle_name = validated_data.pop('middle_name', '')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # создаём профиль пользователя
        UserProfile.objects.create(user=user, middle_name=middle_name)
        return user



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
        fields = ['id', 'city', 'street', 'house', 'apartment', 'image', 'gvs', 'hvs', 'owners']

    def get_owners(self, obj):
        owners = Ownership.objects.filter(service=obj).select_related('user__profile')
        return [
            {
                'id': o.user.id,
                'first_name': o.user.first_name,
                'last_name': o.user.last_name,
                'email': o.user.email,
                'profile': {'middle_name': o.user.profile.middle_name}
            }
            for o in owners
        ]


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
        fields = ['id', 'application', 'service', 'service_id', 'gvs', 'hvs']


# Заявка
class ApplicationSerializer(serializers.ModelSerializer):
    # Это поле будет только для чтения, и оно будет показывать связанные услуги
    application_services = ApplicationServiceSerializer(many=True, read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'status', 'created_at', 'completion_date', 'creator', 'moderator', 'application_services']

    def __init__(self, *args, **kwargs):
        # Если мы создаем заявку, не включаем поле application_services
        if kwargs.get('context') and kwargs['context'].get('request') and kwargs['context']['request'].method == 'POST':
            self.fields.pop('application_services', None)  # Исключаем поле для POST-запросов
        super().__init__(*args, **kwargs)


# serializers.py
class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'status', 'created_at', 'completion_date']
