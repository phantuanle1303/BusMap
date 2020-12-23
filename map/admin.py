from django.contrib import admin
from map.models import Bus


# Register your models here.
class BusAdmin(admin.ModelAdmin):
    list_display = ('vehicle_id', 'from_file', 'date')


admin.site.register(Bus, BusAdmin)
