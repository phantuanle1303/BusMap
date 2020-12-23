from django.db import models
import datetime

ID_LENGTH = 50
FLOAT_LENGTH = 50


# Create your models here.
class Bus(models.Model):
    vehicle_id = models.CharField(max_length=ID_LENGTH)
    from_file = models.FloatField(default=0)
    latitude = models.FloatField(default=0, null=True)
    longitude = models.FloatField(default=0, null=True)
    gps_timestamp = models.FloatField(default=0, null=True)
    speed = models.FloatField(default=0, null=True)
    speed_timestamp = models.FloatField(default=0, null=True)
    altitude = models.FloatField(default=0, null=True)
    altitude_timestamp = models.FloatField(default=0, null=True)
    fuel_used = models.FloatField(default=0, null=True)
    fuel_used_timestamp = models.FloatField(default=0, null=True)
    date = models.DateTimeField(null=True)
    max_timestamp = models.FloatField(default=0)
    min_timestamp = models.FloatField(default=0)

    class Meta:
        verbose_name_plural = 'Buses'
