from django.shortcuts import render
from django.http import HttpResponseNotFound
from django.views.generic import TemplateView
from dj_map import settings
def pnt(request):
    return HttpResponseNotFound(f'{settings.BASE_DIR}')

def pageNotFound(request, exception):
    return HttpResponseNotFound('<h1>Page cant be founded</h1>')


class TempMap(TemplateView):
    template_name = 'map/temp.html'
    def get_context_data(self, **kwargs):
        context = super().get_context_data()