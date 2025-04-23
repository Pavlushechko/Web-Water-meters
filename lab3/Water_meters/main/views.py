from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render 
from .models import Service, Application 
from django.db.models import Q
from django.shortcuts import get_object_or_404

def service_list(request): 
    search_query = request.GET.get('search', '')
    services = Service.objects.filter(status='active')
    if search_query:
        services = services.filter(
            Q(city__icontains=search_query) |
            Q(street__icontains=search_query) |
            Q(house__icontains=search_query) |
            Q(apartment__icontains=search_query)
        )
    return render(request, 'main/service_list.html', {'services': services})

def main_page(request):
    return render(request, 'main/main_page.html')

def check(request):
    return HttpResponse("<h4> ПРОВЕРКА связи </h4>")

def service_detail(request, service_id):
    service = get_object_or_404(Service, id=service_id)
    return render(request, "main/service_detail.html", {"service": service})

def applications(request):
    applications = Application.objects.all()
    return render(request, "main/applications.html", {"show_services": "applications", "applications": applications})