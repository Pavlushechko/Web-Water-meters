from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.conf.urls.static import static


# def service_list(request):
#     return render(request, 'main/service_list.html')

def service_list(request):
    return render(request, "main/service_list.html", {"services": services_list})

def main_page(request):
    return render(request, 'main/main_page.html')

def check(request):
    return HttpResponse("<h4> ПРОВЕРКА связи </h4>")

def service_detail(request, service_id):
    service = next((s for s in services_list if s["id"] == service_id), None)
    return render(request, "main/service_detail.html", {"service": service})


services_list = [
    {
        "id": 1,
        "city": "Норильск",
        "street": "Кирова",
        "house": "1",
        "is_no_apartments": "False",
        "apartment": "45",
        "image": "/static/main/images/Кирова1.jpg",
    },
    {
        "id": 2,
        "city": "Норильск",
        "street": "Талнахская",
        "house": "1",
        "is_no_apartments": "False",
        "apartment": "4",
        "image": "/static/main/images/Талнахская1.jpg",
    },
    {
        "id": 3,
        "city": "Норильск",
        "street": "Талнахская",
        "house": "1",
        "is_no_apartments": "False",
        "apartment": "140",
        "image": "/static/main/images/Талнахская1.jpg",
    },
        {
        "id": 4,
        "city": "Норильск",
        "street": "Талнахская",
        "house": "1",
        "is_no_apartments": "False",
        "apartment": "14",
        "image": "/static/main/images/Талнахская1.jpg",
    },
            {
        "id": 5,
        "city": "Норильск",
        "street": "Талнахская",
        "house": "1",
        "is_no_apartments": "False",
        "apartment": "5",
        "image": "/static/main/images/Талнахская1.jpg",
    }
]