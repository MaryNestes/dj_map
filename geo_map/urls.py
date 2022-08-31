from dj_map import settings
from django.conf.urls.static import static
from django.urls import path
from .views import *
urlpatterns = [
    path('', TempMap.as_view(), name='temp'),
    # path('test/', pnt),
]


# if settings.DEBUG:
#     urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT

handler404 = pageNotFound