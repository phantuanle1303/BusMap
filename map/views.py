from django.shortcuts import render, redirect
import datetime
from map.models import Bus
from django.core import serializers
import json



# Create your views here.
def index(request):
    query_date = datetime.date(2020, 2, 12)
    bus_id = "Gillig #138"
    bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=bus_id)
    b_list = set()
    for bus in bus_list:
        b_list.add(bus.vehicle_id)
    data = serializers.serialize("json", bus_list)
    context_dict = {"buses": data, "bus_ids": b_list}
    return render(request, "map/index.html", context_dict)


