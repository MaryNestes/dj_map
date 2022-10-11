# from dj_map import settings
from django.conf.urls.static import static
from django.urls import path
from .views import *
urlpatterns = [
    path('', TempMap.as_view(), name='temp'),
    path('test/', TemplateView.as_view(template_name="map/test.html"), name='test'),
    path('polarMap/', TemplateView.as_view(template_name="map/polarMap.html"), name='polarMap'),
]


# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT

handler404 = pageNotFound