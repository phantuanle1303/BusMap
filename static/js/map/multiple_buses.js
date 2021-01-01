var startDate = new Date();
startDate.setUTCHours(0, 0, 0, 0);

var map = L.map('map', {
    zoom: 14,
    fullscreenControl: true,
    center: [35.043655, -85.302690]
});

// start of TimeDimension manual instantiation
var timeDimension = new L.TimeDimension({
        period: "PT5M",
    });
// helper to share the timeDimension object between all layers
map.timeDimension = timeDimension;
// otherwise you have to set the 'timeDimension' option on all layers.

var player  = new L.TimeDimension.Player({
    transitionTime: 1000,
    loop: false,
    startOver:true
}, timeDimension);

var timeDimensionControlOptions = {
    player:        player,
    timeDimension: timeDimension,
    position:      'bottomleft',
    autoPlay:      true,
    minSpeed:      1,
    speedStep:     0.5,
    maxSpeed:      15,
    timeSliderDragUpdate: true
};

var timeDimensionControl = new L.Control.TimeDimension(timeDimensionControlOptions);
map.addControl(timeDimensionControl);

function addGeoJSONLayer(map, data) {
    var icon = L.icon({
        iconUrl: image_link + '039-bus.png',
        iconSize: [30, 30],
        iconAnchor: [11, 11]
    });
    console.log(data);
    var geoJSONLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latLng) {
            console.log(feature);
            if (feature.properties.hasOwnProperty('last')) {
                console.log(feature);
                var marker = new L.Marker(latLng, {
                    icon: icon,
                });
                marker.on('mouseover',function(ev) {
                    const lat = latLng.lat;
                    const lon = latLng.lng;
                    const bus = feature.properties["name"];
                    const query_date = feature.properties["query_date"];
                    console.log(lat, lon, bus);
                    // marker.bindPopup(bus);
                    // ev.target.openPopup();
                    $.get("/map/bus_attr/", {lat: lat, lon: lon, name:bus, query_date: query_date}, function(data){
                        marker.bindPopup(data);
                        ev.target.openPopup();

                    });
                    player.pause();
                });
                marker.on('mouseout',function(ev) {
                    ev.target.closePopup();
                    player.release();
                });
                return marker;
            }
            return L.circleMarker(latLng);
        }
    });

    var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
        updateTimeDimension: true,
        duration: 'PT5S',
        updateTimeDimensionMode: 'replace',
        addlastPoint: true
    });

    // Show both layers: the geoJSON layer to show the whole track
    // and the timedimension layer to show the movement of the bus
    // geoJSONLayer.addTo(map);
    geoJSONTDLayer.addTo(map);
}

var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
});
osmLayer.addTo(map);

$(document).ready(function() {
    console.log(bus_geojson)
    var data = JSON.parse(bus_geojson);
    var data2 = JSON.parse(bus_geojson2);
    addGeoJSONLayer(map, data);
    addGeoJSONLayer(map, data2);
});
