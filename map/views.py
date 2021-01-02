from django.http import HttpResponse
from django.shortcuts import render, redirect
import datetime
from datetime import timezone
import time
from map.models import Bus
from django.core import serializers
import geojson
import Utilities
import urllib.parse

TIME_FORMAT = "%Y-%m-%d %H:%M:%S"


# Create your views here.
def index(request):
    # query_date = datetime.date(2020, 2, 12)
    # bus_id = "Gillig #138"
    # bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=bus_id)
    # bus_name = Bus.objects.filter(date__date=query_date).values_list("vehicle_id").distinct()
    # print(list(bus_name))
    # b_list = set()
    # for bus in bus_list:
    #     b_list.add(bus.vehicle_id)
    # data = serializers.serialize("json", bus_list)
    # context_dict = {"buses": data, "bus_ids": b_list}
    # return render(request, "map/index.html", context_dict)
    return render(request, "map/index.html")


def example9(request):
    query_date = datetime.date(2020, 2, 12)
    bus_id = "Gillig #138"
    bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=bus_id, latitude__isnull=False).order_by('gps_timestamp')
    b_list = set()
    # for bus in bus_list:
    #     print(bus.latitude, " ", datetime.datetime.fromtimestamp(bus.gps_timestamp).strftime(TIME_FORMAT))
    #     b_list.add(bus.vehicle_id)
    bus_geojson = Utilities.create_geojson(bus_list, bus_id)
    bus_geojson_conversion = geojson.dumps(bus_geojson, indent="4")
    data = serializers.serialize("json", bus_list)
    context_dict = {"buses": data, "bus_ids": b_list, "bus_json": bus_geojson_conversion}
    return render(request, "map/example9.html", context_dict)


def example17(request):
    query_date = datetime.date(2020, 2, 12)
    bus_id = "Gillig #138"
    bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=bus_id)
    b_list = set()
    for bus in bus_list:
        b_list.add(bus.vehicle_id)
    data = serializers.serialize("json", bus_list)
    context_dict = {"buses": data, "bus_ids": b_list}
    return render(request, "map/example17.html", context_dict)


def pop_up(request):
    return render(request, 'map/popup.html')


def moving_bus(request):
    query_date = datetime.date(2020, 2, 12)
    bus_id = "Gillig #138"
    bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=bus_id, latitude__isnull=False).order_by('gps_timestamp')
    # query_date_timestamp = time.mktime(query_date.timetuple())
    # bus_geojson = Utilities.create_geojson(bus_list, bus_id, query_date_timestamp)
    # bus_geojson_conversion = geojson.dumps(bus_geojson)
    bus_geojson_g138 = get_bus_data(query_date, bus_id)
    bus_geojson_g150 = get_bus_data(query_date, "Gillig #150")
    data = serializers.serialize("json", bus_list)
    context_dict = {"buses": data, "bus_json": bus_geojson_g138, "bus_json2": bus_geojson_g150}
    return render(request, "map/moving_bus.html", context_dict)


def multiple_bus(request):
    query_date = datetime.date(2020, 2, 12)
    bus_id = "Gillig #138"
    bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=bus_id, latitude__isnull=False).order_by('gps_timestamp')
    # query_date_timestamp = time.mktime(query_date.timetuple())
    # bus_geojson = Utilities.create_geojson(bus_list, bus_id, query_date_timestamp)
    # bus_geojson_conversion = geojson.dumps(bus_geojson)
    bus_geojson_g138 = get_bus_data(query_date, bus_id)
    bus_geojson_g150 = get_bus_data(query_date, "Gillig #150")
    data = serializers.serialize("json", bus_list)
    context_dict = {"buses": data, "bus_json": bus_geojson_g138, "bus_json2": bus_geojson_g150}
    return render(request, "map/test_multiple_buses.html", context_dict)


def get_bus_list(request):
    print(request)
    bus_name = []
    if request.method == 'GET':
        query_date = request.GET['query_date']
        query_date = datetime.datetime.strptime(query_date, "%m/%d/%Y")
        bus_name = list(Bus.objects.filter(date__date=query_date).values_list("vehicle_id").distinct())
        bus_name = Utilities.format_bus_string(bus_name)
    context_dict = {"bus_list": bus_name}
    return render(request, "map/bus_list.html", context_dict)


def get_bus_attributes(request):
    print(request)
    # bus_list = []
    # name = ""
    if request.method == 'GET':
        lat = float(request.GET['lat'])
        lon = float(request.GET['lon'])
        name = urllib.parse.unquote(request.GET['name'])
        query_date = float(request.GET['query_date'])
        query_date = datetime.date.fromtimestamp(query_date)
        bus_list = get_bus_attr_from_db(lat, lon, name, query_date)
        bus = bus_list[0]
        print(bus)
        if bus.speed is not None:
            bus.speed = round(Utilities.convert_to_mile(bus.speed), 1)
        if bus.fuel_used is not None:
            bus.fuel_used = round(Utilities.convert_to_gallon(bus.fuel_used), 4)
        bus.gps_timestamp = datetime.datetime.fromtimestamp(bus.gps_timestamp).strftime(TIME_FORMAT)
        if bus.altitude is not None:
            bus.altitude = round(bus.altitude, 2)
        return render(request, "map/popup.html", {"bus": bus, "bus_id": name})


def retrieve_select_bus(request):
    if request.method == 'GET':
        query_bus = urllib.parse.unquote(request.GET['query_bus'])
        query_date = urllib.parse.unquote(request.GET['query_date'])
        query_date = datetime.datetime.strptime(query_date, "%m/%d/%Y")
        animated = request.GET['animated']
        if animated == "true":
            if query_bus != "All Buses":
                bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=query_bus,
                                              latitude__isnull=False).order_by('gps_timestamp')
                bus_geojson = get_bus_data(query_date, query_bus)
                return HttpResponse(bus_geojson)
            else:
                return HttpResponse("Feature has not been implemented! Please select a bus to continue!")
        else:
            if query_bus != "All Buses":
                bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=query_bus, latitude__isnull=False).order_by(
                    'gps_timestamp')
                data = serializers.serialize("json", bus_list)
                return HttpResponse(data)
                # context_dict = {"buses": data}
                # return render(request, "map/index.html", context_dict)
            else:
                bus_list = Bus.objects.filter(date__date=query_date, latitude__isnull=False).order_by(
                    'gps_timestamp')
                data = serializers.serialize("json", bus_list)
                context_dict = {"buses": data}
                return HttpResponse(data)
                # return render(request, "map/index.html", context_dict)


def get_bus_attr_from_db(lat, lon, bus_id, date):
    bus_list = []
    range_value = 0.000001
    upper_lat = lat + range_value
    lower_lat = lat - range_value
    upper_lon = lon + range_value
    lower_lon = lon - range_value
    bus_list = Bus.objects.filter(date__date=date, vehicle_id=bus_id, latitude__range=[lower_lat,upper_lat],
                                  longitude__range=[lower_lon, upper_lon])
    return bus_list


def get_bus_data(query_date, bus_id):
    bus_list = []
    bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=bus_id, latitude__isnull=False).order_by(
        'gps_timestamp')
    query_date_timestamp = time.mktime(query_date.timetuple())
    bus_geojson = Utilities.create_geojson(bus_list, bus_id, query_date_timestamp)
    bus_geojson_conversion = geojson.dumps(bus_geojson)
    return bus_geojson_conversion
