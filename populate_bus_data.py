import os
import pandas as pd
import django
import datetime

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'BusMap.settings')

django.setup()

from map.models import Bus

NAN = float("nan")
time_format = "%Y-%m-%d %H:%M:%S"

def populate(data):
    df = pd.read_pickle(data)
    for i in range(len(df)):
        date = datetime.datetime.fromtimestamp(df.max_time_stamp.get(i)).strftime("%Y-%m-%d %H:%M:%S")
        add_vehicle(df.vehicleID.get(i), df.fromfile.get(i), df.latitude.get(i), df.longitude.get(i), df.gpstimestamp.get(i),
                    df.gps_speed.get(i), df.gps_speed_timestamp.get(i), df.gps_altitude.get(i),
                    df.gps_altitude_timestamp.get(i), df.fuel_used.get(i), df.fuel_used_timestamp.get(i), date,
                    df.max_time_stamp.get(i), df.min_time_stamp.get(i))


def add_vehicle(vehicle_id, from_file, latitude, longitude, gps_timestamp, speed, speed_timestamp, altitude,
                altitude_timestamp, fuel_used, fuel_used_timestamp, date, max_timestamp, min_timestamp):
    b = Bus.objects.get_or_create(vehicle_id=vehicle_id, from_file=from_file, max_timestamp=max_timestamp,
                                  min_timestamp=min_timestamp)[0]
    b.vehicle_id = vehicle_id
    b.from_file = from_file
    b.latitude = format_value(latitude)
    b.longitude = format_value(longitude)
    b.gps_timestamp = format_value(gps_timestamp)
    b.speed = format_value(speed)
    b.speed_timestamp = format_value(speed_timestamp)
    b.altitude = format_value(altitude)
    b.altitude_timestamp = format_value(altitude_timestamp)
    b.fuel_used = format_value(fuel_used)
    b.fuel_used_timestamp = format_value(fuel_used_timestamp)
    b.date = date
    b.max_timestamp = format_value(max_timestamp)
    b.min_timestamp = format_value(min_timestamp)
    b.save()
    return b


def format_value(value):
    field_value = NAN
    if type(value) != str:
        field_value = value
    return field_value


if __name__ == "__main__":
    file = "test_buses.pkl"
    populate(file)
