from django.db import models
from django.contrib.auth.models import User

from django.db import models

class Service(models.Model):
    city = models.CharField(max_length=100, verbose_name='Город')
    street = models.CharField(max_length=100, verbose_name='Улица')
    house_number = models.CharField(max_length=10, verbose_name='Номер дома')
    apartment_number = models.CharField(max_length=10, verbose_name='Номер квартиры')
    owner = models.CharField(max_length=150, verbose_name='Хозяин квартиры')
    
    image = models.ImageField(upload_to='services/', verbose_name='Изображение')
    is_deleted = models.BooleanField(default=False, verbose_name='Удалена')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата создания')

    class Meta:
        db_table = 'service'
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'

    def __str__(self):
        return f"{self.city}, {self.street}, д.{self.house_number}, кв.{self.apartment_number}"


class Request(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Черновик'),
        ('deleted', 'Удалён'),
        ('formed', 'Сформирован'),
        ('finished', 'Завершён'),
        ('rejected', 'Отклонён'),
    ]
    creator = models.ForeignKey(User, related_name='created_requests', on_delete=models.CASCADE)
    moderator = models.ForeignKey(User, related_name='moderated_requests', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    formed_at = models.DateTimeField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

class RequestService(models.Model):
    request = models.ForeignKey(Request, on_delete=models.CASCADE)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('request', 'service')

