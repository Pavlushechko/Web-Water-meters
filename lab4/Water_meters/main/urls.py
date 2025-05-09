
# # Если вы не хотите использовать DefaultRouter, просто определите path напрямую
# urlpatterns = [
#     path('services/', ServiceAPIView.as_view(), name='service-list'),
#     path('applications/', ApplicationAPIView.as_view(), name='application-list'),
#     path('application-services/', ApplicationServiceAPIView.as_view(), name='application-service-list'),
#     path('ownerships/', OwnershipAPIView.as_view(), name='ownership-list'),
#     path('', include(router.urls))
# ]
from django.urls import path
from . import views

urlpatterns = [
    path('api/services/', views.ServiceAPIView.as_view(), name='service-list'),
    path('api/services/<int:pk>/', views.ServiceDetailAPIView.as_view(), name='service-detail'),
    path('api/applications/', views.ApplicationAPIView.as_view(), name='application-list'),
    path('api/application-services/', views.ApplicationServiceAPIView.as_view(), name='application-services-list'),
    path('api/ownerships/', views.OwnershipAPIView.as_view(), name='ownership-list')
]