from django.shortcuts import render, Http404

# Коллекция данных (пример)
water_counters = [
    {
        'id': 1,
        'name': 'Счетчик на ул. Ленина, д. 10',
        'reading': 120.5,
        'image': 'counter1.jpg',
        'install_date': '2022-01-15',
        'description': 'Установлен в 2022 году, показания обновляются ежемесячно.'
    },
    {
        'id': 2,
        'name': 'Счетчик на проспекте Мира, д. 25',
        'reading': 98.7,
        'image': 'counter2.jpg',
        'install_date': '2021-11-05',
        'description': 'Основной счетчик для жилого комплекса.'
    },
    # Дополнительные элементы можно добавить сюда
]

def counter_list(request):
    query = request.GET.get('q', '')
    if query:
        filtered_counters = [counter for counter in water_counters if query.lower() in counter['name'].lower()]
    else:
        filtered_counters = water_counters
    context = {
        'counters': filtered_counters,
        'query': query
    }
    return render(request, 'counters_list.html', context)

def counter_detail(request, counter_id):
    # Простой поиск по коллекции
    counter = next((item for item in water_counters if item['id'] == counter_id), None)
    if not counter:
        raise Http404("Счетчик не найден")
    context = {
        'counter': counter
    }
    return render(request, 'counter_detail.html', context)
