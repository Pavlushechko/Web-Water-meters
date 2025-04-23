from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static


def service_list(request):
    return render(request, 'main/service_list.html')

def service_detail(request):
    context = {
        'city': request.GET.get('city', ''),
        'street': request.GET.get('street', ''),
        'house': request.GET.get('house', ''),
        'apartment': request.GET.get('apartment', ''),
        'private_house': request.GET.get('private_house', ''),
        'fullname': request.GET.get('fullname', ''),
        'phone': request.GET.get('phone', ''),
    }
    return render(request, 'main/service_detail.html', context)


def main_page(request):
    return render(request, 'main/main_page.html')

def check(request):
    return HttpResponse("<h4> ПРОВЕРКА связи </h4>")