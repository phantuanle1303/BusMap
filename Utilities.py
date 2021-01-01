import datetime
from geojson import LineString, Feature, Point, dumps
import os
import django


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BusMap.settings')

django.setup()
from map.models import Bus
TIME_FORMAT = "%Y-%m-%d %H:%M:%S"


def create_geojson(bus_list, bus_id, query_date):
    times = []
    points = []
    for bus in bus_list:
        times.append(datetime.datetime.fromtimestamp(bus.gps_timestamp).strftime(TIME_FORMAT))
        points.append((bus.longitude, bus.latitude))
    linestring = LineString(points)
    return Feature(geometry=linestring,
                   properties={
                       "name": bus_id,
                       "times": times,
                       "query_date": query_date
                   })


def test_query():
    query_date = datetime.date(2020, 2, 12)
    bus_id = "Gillig #138"
    bus_list = Bus.objects.filter(date__date=query_date, vehicle_id=bus_id, latitude__isnull=False).order_by(
        'gps_timestamp')
    return bus_list


def format_bus_string(bus_list):
    formatted_bus_list = []
    for bus in bus_list:
        new_bus = bus[0].replace("(\'", "")
        new_bus = new_bus.replace("\'),", "")
        formatted_bus_list.append(new_bus)
    return sorted(formatted_bus_list)


if __name__ == "__main__":
    bus_list = test_query()
    bus_id = "Gillig #138"
    test = create_geojson(bus_list, bus_id)
    print(dumps(test, indent=4))
