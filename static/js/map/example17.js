function addGeoJSONLayer(map, data) {
    var icon = L.icon({
        iconUrl: image_link + 'bus.png',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
    });
    console.log(data);
    var geoJSONLayer = L.geoJSON(data, {
        pointToLayer: function (feature, latLng) {
            console.log(feature);
            if (feature.properties.hasOwnProperty('last')) {
                // return new L.Marker(latLng, {
                //     icon: icon,
                //     title: feature.properties["test"],
                // });
                var marker = new L.Marker(latLng, {
                    icon: icon,
                });
                marker.bindPopup("Test");
                marker.on('mouseover',function(ev) {
                      ev.target.openPopup();
                });
                return marker;
            }
            return L.circleMarker(latLng);
        }
    });

    var geoJSONTDLayer = L.timeDimension.layer.geoJson(geoJSONLayer, {
        updateTimeDimension: true,
        duration: 'PT2M',
        updateTimeDimensionMode: 'replace',
        addlastPoint: true
    });

    // Show both layers: the geoJSON layer to show the whole track
    // and the timedimension layer to show the movement of the bus
    geoJSONLayer.addTo(map);
    geoJSONTDLayer.addTo(map);
}

var map = L.map('map', {
    zoom: 14,
    fullscreenControl: true,
    timeDimensionControl: true,
    timeDimensionControlOptions: {
        // timeDimension: timeDimension,
        position:      'bottomleft',
        autoPlay:      true,
        minSpeed:      1,
        speedStep:     0.5,
        maxSpeed:      15,
        timeSliderDragUpdate: true,
        // timeSliderDragUpdate: true,
        // loopButton: true,
        // autoPlay: true,
        playerOptions: {
            transitionTime: 1000,
            loop: true
        }

    },
    timeDimension: true,
    center: [36.72, -4.43]
});

var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
});
osmLayer.addTo(map);

var oReq = new XMLHttpRequest();
oReq.addEventListener("load", (function (xhr) {
    var response = xhr.currentTarget.response;
    var data = JSON.parse(response);
    addGeoJSONLayer(map, data);
}));
// oReq.open('GET', data_link + 'test.geojson');
oReq.open('GET', data_link + 'track_bus699.geojson');
oReq.send();
