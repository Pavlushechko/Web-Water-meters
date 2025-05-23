from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from . import views

urlpatterns = [
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    path('docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    path('api/register/', views.RegisterUserView.as_view(), name='register'),
    path('api/logout/', views.LogoutView.as_view(), name='logout'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/check-admin/', views.AdminCheckView.as_view(), name='check-admin'),


    path('api/services/', views.ServiceAPIView.as_view(), name='service-list'),
    path('api/services/<int:pk>/', views.ServiceDetailAPIView.as_view(), name='service-detail'),
    path('api/applications/', views.ApplicationAPIView.as_view(), name='application-list'),
    path('api/application-services/', views.ApplicationServiceAPIView.as_view(), name='application-services-list'),
    path('api/applications/<int:pk>/', views.ApplicationDetailAPIView.as_view()),
    path('api/ownerships/', views.OwnershipAPIView.as_view(), name='ownership-list')
]