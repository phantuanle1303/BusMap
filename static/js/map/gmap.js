let map;
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 35.043655, lng: -85.302690 },
      zoom: 16,
    });
    const objs = JSON.parse(buses)
    for (const obj in objs){
        console.log(objs[obj]["fields"])
        const fields = objs[obj].fields;
        var myLatlng = new google.maps.LatLng(fields["latitude"], fields["longitude"]);
        var marker = new google.maps.Marker({
        position: myLatlng,
        title:fields["vehicle_id"]
        });
        marker.setMap(map);
        var fuel_used = fields["fuel_used"];
        if (fuel_used === null){
            fuel_used = "N/A"
        }
        else{
            fuel_used = round(fuel_used * 0.26417205236, 3);
        }
        var speed = fields["speed"];
        if (speed === null){
            speed = "N/A"
        }
        else{
            speed = round(speed * 0.62137, 1);
        }
        var altitude = fields["altitude"];
        if (altitude === null){
            altitude = "N/A"
        }
        else{
            altitude = round(altitude, 0);
        }
        // marker.bindPopup("<b><strong>" + fields["vehicle_id"]+ "</strong></b> <br/>"
        //                 + "<b>Fuel used:" + fuel_used +" (gallon)</b><br/>"
        //                 + "<b>Speed:" + speed +" (mph)</b><br/>"
        //                 + "<b>Altitude:" + altitude +" (metre)</b><br/>");
    }
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
