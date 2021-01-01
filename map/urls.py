from map import views
from django.urls import path, re_path

urlpatterns = [
    re_path(r'^$', views.index, name='index'),
    re_path(r'^example9/$', views.example9, name='example9'),
    re_path(r'^example17/$', views.example17, name='example17'),
    re_path(r'^moving_bus/$', views.moving_bus, name='moving_bus'),
    re_path(r'^bus_attr/$', views.get_bus_attributes, name='get_bus_attributes'),
    re_path(r'^multiple_buses/$', views.multiple_bus, name='multiple_bus'),
    re_path(r'^bus_list/$', views.get_bus_list, name='get_bus_list'),
    re_path(r'^retrieve_bus/$', views.retrieve_select_bus, name='retrieve_select_bus'),
]