// note: doesn't work for weird browsers or old IE browsers
document.addEventListener("DOMContentLoaded", go);

// kick things off after document has loaded
function go() {
    // non-map TODO: get starting filter settings

    // get place holder
    var Places = getPlaceHolder();

    var mymap = L.map('mapid').setView(Places.Cairo.LatLng, Places.Cairo.Zoom);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        // 'your.mapbox.project.id':
        // found in account -> tilesheets tab
        id: 'mapbox.satellite',
        // id: 'mapbox.mapbox-terrain-v2',
        // id: 'mapbox.mapbox-terrain-v2',
        // mapbox public access token:
        accessToken: 'pk.eyJ1IjoiZmx5aW5nLWRpc2MtaW52YXNpb24iLCJhIjoiY2ozYW90cDluMDA3bTJ3bnQybHNyd3JtNSJ9.xFlo1nKUx5f6X9Z0irMJHA'
    }).addTo(mymap);

    var marker = L.marker(Places.DEO.LatLng).addTo(mymap);

    setupFilterListeners(L, mymap);
/*
    var circle = L.circle([51.508, -0.11], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(mymap);

    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(mymap);

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

    // standalone popup [openOn closes other open popups]
    var popup = L.popup()
        .setLatLng([51.5, -0.09])
        .setContent("I am a standalone popup.")
        .openOn(mymap);

    function onMapClick(e) {
        L.popup()
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }

    mymap.on('click', onMapClick);
    */
}

/**
 * Function holds all of the data needed for different places that will be put on maps
 * TODO: add & retrieve this data from Firebase after figure out exactly what data we need
 * 
 * @returns place holder object which holds all needed data for each location
 */
function getPlaceHolder() {
    return {
        'DEO': {
            LatLng: [30.031998, 31.211364],
            Zoom: 10
        },
        'Cairo': {
            LatLng: [30.041952, 31.243517],
            Zoom: 13
        }
    };
}

// ================ Internal functions ===================

// Capture the click event on a filter type
function setupFilterListeners(L, mymap) {
    // get filter elements
    var filterElems = $('#filter-bar li');

    // set click listeners on each filter
    filterElems.click(function(e){
        // get element data
        var $this = $(this),
            selectedFilter = $this.data('filter');

        // toggle 'active' class so style changes
        $this.toggleClass('active');
    });
}