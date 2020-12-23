$(document).ready(function() {
// JQuery code to be added in here.
    var mymap = L.map('mapid').setView([35.043655, -85.302690], 16);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoicGhhbnR1YW5sZTEzMDMiLCJhIjoiY2tpejNhbno0MTBxZTJ3bnJsZWFsN3FybSJ9.12dEg2JUHiyjqkW8siCNcA'
    }).addTo(mymap);
    var msg = $('#buses_list').html();
    const objs = JSON.parse(buses)
    // const test = objs[0].fields
    // // msg+= test.fields.vehicle_id
    // console.log(test)
    // for(const k in test){
    //     console.log(typeof(k))
    //     if(k == "fuel_used"){
    //         msg+= test[k]
    //     }
    // }
    for (const obj in objs){
        // console.log(objs[obj]["fields"])
        const fields = objs[obj].fields;
        console.log(fields["latitude"]);
        // for(const field in fields){
        //     console.log(field);
        // }
        // msg+= "(" + fields["latitude"] + ", " + fields["longitude"] + ")";
        var marker = L.marker([fields["latitude"], fields["longitude"]]).addTo(mymap);
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
        marker.bindPopup("<b><strong>" + fields["vehicle_id"]+ "</strong></b> <br/>"
                        + "<b>Fuel used:" + fuel_used +" (gallon)</b><br/>"
                        + "<b>Speed:" + speed +" (mph)</b><br/>"
                        + "<b>Altitude:" + altitude +" (metre)</b><br/>");
    }
    // $('#buses_list').html(msg);
});

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}