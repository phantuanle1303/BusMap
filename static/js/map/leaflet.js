$(document).ready(function() {
// JQuery code to be added in here.
    console.log(buses);
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
    // var mymap = L.map('mapid').setView([35.043655, -85.302690], 16);
    // // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    // //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    // //     maxZoom: 18,
    // //     id: 'mapbox/streets-v11',
    // //     tileSize: 512,
    // //     zoomOffset: -1,
    // //     accessToken: 'pk.eyJ1IjoicGhhbnR1YW5sZTEzMDMiLCJhIjoiY2tpejNhbno0MTBxZTJ3bnJsZWFsN3FybSJ9.12dEg2JUHiyjqkW8siCNcA'
    // // }).addTo(mymap);
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(mymap);

    $(document).on('click', '.dropdown-menu li a', function () {
    // alert($(this).text());
        $("#dropdownMenuButton").text($(this).text());
        $("#dropdownMenuButton").val($(this).text());
        var query_date = $('.dateselect').val();
        var query_bus = $("#dropdownMenuButton").val();
        $.get("/map/retrieve_bus/", {query_date: query_date, query_bus: query_bus, animated: false}, function(data){
                        console.log(data);
                        const objs = JSON.parse(data);
                        showBusInMap(mymap, objs);
                        console.log(markerGroup);
                    });
        // const objs = JSON.parse(buses);
        // console.log(buses);
        // showBusInMap(mymap, objs);
    });

//     var mymap = L.map('mapid').setView([35.043655, -85.302690], 16);
//     var mymap = L.map('mapid').setView([35.043655, -85.302690], 16);
//     // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     //     maxZoom: 18,
//     //     id: 'mapbox/streets-v11',
//     //     tileSize: 512,
//     //     zoomOffset: -1,
//     //     accessToken: 'pk.eyJ1IjoicGhhbnR1YW5sZTEzMDMiLCJhIjoiY2tpejNhbno0MTBxZTJ3bnJsZWFsN3FybSJ9.12dEg2JUHiyjqkW8siCNcA'
//     // }).addTo(mymap);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//     }).addTo(mymap);
    // var msg = $('#buses_list').html();
    // const objs = JSON.parse(buses)
    // const test = objs[0].fields
    // // msg+= test.fields.vehicle_id
    // console.log(test)
    // for(const k in test){
    //     console.log(typeof(k))
    //     if(k == "fuel_used"){
    //         msg+= test[k]
    //     }
    // }
    // for (const obj in objs){
    //     // console.log(objs[obj]["fields"])
    //     const fields = objs[obj].fields;
    //     console.log(fields["latitude"]);
    //     // for(const field in fields){
    //     //     console.log(field);
    //     // }
    //     // msg+= "(" + fields["latitude"] + ", " + fields["longitude"] + ")";
    //     var marker = L.marker([fields["latitude"], fields["longitude"]]).addTo(mymap);
    //     var fuel_used = fields["fuel_used"];
    //     if (fuel_used === null){
    //         fuel_used = "N/A"
    //     }
    //     else{
    //         fuel_used = round(fuel_used * 0.26417205236, 3);
    //     }
    //     var speed = fields["speed"];
    //     if (speed === null){
    //         speed = "N/A"
    //     }
    //     else{
    //         speed = round(speed * 0.62137, 1);
    //     }
    //     var altitude = fields["altitude"];
    //     if (altitude === null){
    //         altitude = "N/A"
    //     }
    //     else{
    //         altitude = round(altitude, 0);
    //     }
    //     marker.bindPopup("<b><strong>" + fields["vehicle_id"]+ "</strong></b> <br/>"
    //                     + "<b>Fuel used:" + fuel_used +" (gallon)</b><br/>"
    //                     + "<b>Speed:" + speed +" (mph)</b><br/>"
    //                     + "<b>Altitude:" + altitude +" (metre)</b><br/>");
    // }
    // $('#buses_list').html(msg);
});

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

var mymap = L.map('mapid').setView([35.043655, -85.302690], 16);
    // L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    //     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    //     maxZoom: 18,
    //     id: 'mapbox/streets-v11',
    //     tileSize: 512,
    //     zoomOffset: -1,
    //     accessToken: 'pk.eyJ1IjoicGhhbnR1YW5sZTEzMDMiLCJhIjoiY2tpejNhbno0MTBxZTJ3bnJsZWFsN3FybSJ9.12dEg2JUHiyjqkW8siCNcA'
    // }).addTo(mymap);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mymap);
var markerGroup = L.layerGroup().addTo(mymap);
function showBusInMap(mymap, objs){
    markerGroup.clearLayers();
    for (const obj in objs){
        const fields = objs[obj].fields;
        // console.log(fields["latitude"]);
        var marker = L.marker([fields["latitude"], fields["longitude"]]).addTo(markerGroup);
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
        var date = new Date(fields["gps_timestamp"] * 1000);
        var formatDate = getdateTime(date);
        marker.bindPopup("<b><strong>" + fields["vehicle_id"]+ "</strong></b> <br/>"
                        + "<b>Fuel Point (Accumulated): " + fuel_used +" (gallon)</b><br/>"
                        + "<b>Speed: " + speed +" (mph)</b><br/>"
                        + "<b>Altitude: " + altitude +" (metre)</b><br/>"
                        + "<b>Timestamp: " + formatDate + "</b><br/>");
    }
}

function getdateTime(date){
        var year = date.getFullYear();
        var month = date.getMonth()+1;
        var day = date.getDate();
        // Hours part from the timestamp
        var hours = date.getHours();
        // Minutes part from the timestamp
        var minutes = date.getMinutes();
        if (date.getMinutes()< 10){
            minutes = "0" + minutes
        }
        // Seconds part from the timestamp
        var seconds = date.getSeconds();
        if (date.getSeconds()< 10){
            seconds = "0" + seconds
        }
        return (month + "/" + day + "/" + year + " " + hours + ":" + minutes + ":" + seconds);

}