from django.db import models
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm


class ApplicationStatus(models.TextChoices): 
    DRAFT = 'draft', 'Черновик' 
    DELETED = 'deleted', 'Удалена' 
    FORMATTED = 'formatted', 'Сформирована' 
    COMPLETED = 'completed', 'Завершена' 
    REJECTED = 'rejected', 'Отклонена'


class ServiceStatus(models.TextChoices): 
    ACTIVE = 'active', 'Действует' 
    DELETED = 'deleted', 'Удалена'


class Service(models.Model):
    city = models.CharField(max_length=100)
    street = models.CharField(max_length=100)
    house = models.CharField(max_length=20)
    apartment = models.CharField(max_length=20)
    image = models.URLField(max_length=50000, blank=True, null=True)
    status = models.CharField(max_length=10, choices=ServiceStatus.choices, default=ServiceStatus.ACTIVE)
    gvs = models.CharField(max_length=5, blank=True, null=True)
    hvs = models.CharField(max_length=5, blank=True, null=True)

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
    status = models.CharField(max_length=10, choices=ApplicationStatus.choices, default=ApplicationStatus.DRAFT) 
    created_at = models.DateTimeField(auto_now_add=True) 
    form_date = models.DateTimeField(null=True, blank=True)
    completion_date = models.DateTimeField(null=True, blank=True)
    creator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='created_applications')
    moderator = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='moderated_applications')

    def __str__(self):
        return f"Заявка #{self.pk} от {self.creator.first_name if self.creator else 'неизвестно'}"


class ApplicationService(models.Model): 
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='application_services') 
    service = models.ForeignKey(Service, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('application', 'service')

    def __str__(self):
        return f"Заявка #{self.application.pk} → {self.service}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    middle_name = models.CharField("Отчество", max_length=100, blank=True)
    
    def __str__(self):
        return f"{self.user.last_name} {self.user.first_name} {self.middle_name}"

class CustomUserCreationForm(UserCreationForm):
    middle_name = forms.CharField(max_length=100, required=False, label="Отчество")

    class Meta:
        model = User
        fields = ("username", "first_name", "last_name", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=commit)
        if commit:
            UserProfile.objects.create(user=user, middle_name=self.cleaned_data["middle_name"])
        return user

