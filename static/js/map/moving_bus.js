function addGeoJSONLayer(map, data) {
    var icon = L.icon({
        // iconUrl: image_link + '039-bus.png',
        iconUrl: image_link + 'bus.png',
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

// var map = L.map('map', {
//     zoom: 16,
//     fullscreenControl: true,
//     timeDimensionControl: true,
//     timeDimensionControlOptions: {
//         position:      'bottomleft',
//         autoPlay:      true,
//         minSpeed:      1,
//         speedStep:     0.5,
//         maxSpeed:      15,
//         timeSliderDragUpdate: true,
//         playerOptions: {
//             transitionTime: 500,
//             loop: true,
//             autoPlay: true,
//         }
//
//     },
//     timeDimension: true,
//     center: [35.043655, -85.302690]
// });
//
// var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
// });
// osmLayer.addTo(map);

// var oReq = new XMLHttpRequest();
// oReq.addEventListener("load", (function (xhr) {
//     var response = xhr.currentTarget.response;
//     var data = JSON.parse(response);
//     addGeoJSONLayer(map, data);
// }));
// oReq.open('GET', data_link + 'test.geojson');
// // oReq.open('GET', data_link + 'track_bus699.geojson');
// oReq.send();
var startDate = new Date();
startDate.setUTCHours(0, 0, 0, 0);

var map = L.map('map', {
    zoom: 16,
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
    transitionTime: 500,
    loop: false,
    startOver:true,
    autoPlay: true,
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

var osmLayer = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
});
osmLayer.addTo(map);

$(document).ready(function() {
    // console.log(bus_geojson)
    // var data = JSON.parse(bus_geojson);
    // addGeoJSONLayer(map, data);
    $('.dateselect').datepicker({
        format: 'mm/dd/yyyy',
        defaultDate: '02/12/2020',
        todayHighlight: true,
        autoclose: true,
        // startDate: '-3d'
    });
    var date = new Date(2020, 1, 12);
    $('.dateselect').datepicker('setDate', date);
    // $('.dateselect').click(function() {
    //     // put your selected date into the data object
    //     var query_date = $('.dateselect').val();
    //     $.get("/map/bus_list/", {query_date: query_date}, function(data){
    //                     $("#bus_list").html(data)
    //                 })
    // });
    $('.dateselect').on("change", function() {
        // put your selected date into the data object
        var query_date = $('.dateselect').val();
        $.get("/map/bus_list/", {query_date: query_date}, function(data){
                        $("#bus_list").html(data)
                    });
    });
    $(document).on('click', '.dropdown-menu li a', function () {
    // alert($(this).text());
        $("#dropdownMenuButton").text($(this).text());
        $("#dropdownMenuButton").val($(this).text());
        var query_date = $('.dateselect').val();
        var query_bus = $("#dropdownMenuButton").val();
        var animated = true;
        $.get("/map/retrieve_bus/", {query_date: query_date, query_bus: query_bus, animated: animated}, function(data){
            console.log(data);
            if(data == "Not Implemented!"){
                alert(data);
            }
            else{
                player.stop();
                bus_trajectory = JSON.parse(data);
                addGeoJSONLayer(map, bus_trajectory);
                player.start();
            }
        });
    });
});
