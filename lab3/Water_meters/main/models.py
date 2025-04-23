from django.db import models
from django.contrib.auth.models import User

from django.db import models

class ApplicationStatus(models.TextChoices): 
    DRAFT = 'draft', 'Черновик' 
    DELETED = 'deleted', 'Удалена' 
    FORMATTED = 'formatted', 'Сформирована' 
    COMPLETED = 'completed', 'Завершена' 
    REJECTED = 'rejected', 'Отклонена'

class ServiceStatus(models.TextChoices): 
    ACTIVE = 'active', 'Действует' 
    DELETED = 'deleted', 'Удалена'


class User(models.Model):  
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    patronymic = models.CharField(max_length=255, blank=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    birth_date = models.DateField(null=True, blank=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.patronymic if self.patronymic else ''}"

class Service(models.Model):
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    house = models.CharField(max_length=20)
    apartment = models.CharField(max_length=20)
    image = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=ServiceStatus.choices, default=ServiceStatus.ACTIVE)
    def soft_delete(self):
        self.status = ServiceStatus.DELETED
        self.save()
    def __str__(self):
        return f"{self.city}, ул. {self.street}, д. {self.house}, кв. {self.apartment}"


class Ownership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.user} -> {self.service}"

class Application(models.Model): 
    status = models.CharField( max_length=10, choices=ApplicationStatus.choices, default=ApplicationStatus.DRAFT ) 
    created_at = models.DateTimeField(auto_now_add=True) 
    form_date = models.DateTimeField(null=True, blank=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    creator = models.ForeignKey( User, on_delete=models.SET_NULL, null=True, related_name='created_applications' )
    moderator = models.ForeignKey( User, on_delete=models.SET_NULL, null=True, related_name='moderated_applications' )
    def __str__(self):
        return f"Заявка #{self.pk} от {self.creator.first_name if self.creator else 'неизвестно'}"

class ApplicationService(models.Model): 
    application = models.ForeignKey( Application, on_delete=models.CASCADE, related_name='application_services' ) 
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    class Meta:
        unique_together = ('application', 'service')
    def __str__(self):
        return f"Заявка #{self.application.pk} → {self.service}"
