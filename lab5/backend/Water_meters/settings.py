from pathlib import Path
from datetime import timedelta
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-c&3hcq0go-&xadi2qrfr)05fc)*qv!_p8@ej1ldydeow&+)+4i'

DEBUG = True

ALLOWED_HOSTS = ["*"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000"  # адрес фронтенда
]


INSTALLED_APPS = [
    'main',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'drf_spectacular',
    'django_minio_backend'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware'
]

ROOT_URLCONF = 'Water_meters.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'Water_meters.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',  # База данных PostgreSQL
        'NAME': 'Water-meters',  # Имя базы данных
        'USER': 'admin',  # Имя пользователя
        'PASSWORD': 'norilsk1',  # Пароль
        'HOST': 'localhost',  # Хост. Если контейнер на том же сервере, это будет 'localhost'
        'PORT': '5432',  # Порт. По умолчанию для PostgreSQL
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',  # Возвращать данные в формате JSON
        # Если вы хотите поддерживать браузерное отображение API, можно оставить:
        'rest_framework.renderers.BrowsableAPIRenderer',  # Для удобного отображения API в браузере
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
}

SPECTACULAR_SETTINGS = {
    'TITLE': 'WATER_METERS',
    'DESCRIPTION': 'API OF WATER_METERS',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': True,  # Показывать ли схему на сервере
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),#60
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),#days=1
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

STORAGES = {  # -- ADDED IN Django 5.1
    "default": {
        "BACKEND": "django_minio_backend.models.MinioBackend",
    },
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT",'localhost:9000')
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY",'admin')
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY",'norilsk1')
MINIO_BUCKET_CHECK_ON_SAVE = True
MINIO_USE_HTTPS = False
MINIO_PRIVATE_BUCKETS = [
    'images'
]


LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

STATIC_URL = '/static/'

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),  # Подключаем static из main
]