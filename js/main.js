// note: doesn't work for weird browsers or old IE browsers
document.addEventListener("DOMContentLoaded", go);

// kick things off after document has loaded
function go() {
    // set up Leaflet.js map
    var mymap = L.map('mapid').setView(
        data_start_place().Loc,
        data_start_place().Zoom
    );

    // Set up main Leaflet tilelayer
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

    // create layer dictionary and type dictionary
    let [layer_dict, type_dict] = data_holder_createDataDicts(mymap);

    // set up filter click events
    setupFilterListeners( [layer_dict, type_dict], L, mymap);
    
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

// ================ Internal functions ===================

/**
 * Function filters places to show / hide on map
 * 
 * @param {object} filterType - type of place to add / remove from map
 * @param {boolean} add - add if true, remove if false
 * @param {object} data_dicts - see data_holder.js
 * @param {object} L - Leaflet object
 * @param {object} mymap - map to add / remove Places to / from
 */
function filterPlaces(filterType, add, data_dicts, L, mymap) {
    let layer_dict = data_dicts[0],
        type_dict = data_dicts[1];

    // get layer IDs with filter type
    let layerIDs = type_dict[filterType];

    for (let i = 0; i < layerIDs.length; i++) {
        let layerID = layerIDs[i];

        // get place Data from layer dictionary
        layerData = layer_dict[layerID];

        // if we want to add this layer on, add it!
        if (add) {
            layerData.layer = L.marker( utils_getLatLng(layerData.details) )
                .addTo(mymap);
        }   
        
        // remove layer (place) from map
        else {
            mymap.removeLayer( layerData.layer );
        }
    }
}

/**
 * Function adds click event to filter type. Each click toggles the 'active' state
 * of the filter. When active, a filter will SHOW the map points of that type.
 * 
 * @param {object} data_dicts - see data_holder.js
 * @param {object} L - main Leaflet object
 * @param {object} mymap - my leaflet map
 * @param {function} displayFunction - function to use to display / hide filtered data
 */
function setupFilterListeners(data_dicts, L, mymap) {
    // get filter elements
    var $filterElems = $('#filter-bar li');

    // set click listeners on each filter
    $filterElems.click(function(e){
        // get element data
        var $this = $(this),
            selectedFilter = $this.find('a').data('filter');

        // toggle 'active' class so style changes
        $this.toggleClass('active');

        // get active status of filter
        let add = $this.hasClass('active');

        // add / remove places
        filterPlaces(selectedFilter, add, data_dicts, L, mymap);
    });
}

/**
 * Function holds all of the data needed for different places that will be put
 * on maps, grouped by type (for easy searching).
 * 
 * @param {object} type_dict - dictionary of types
 * @param {string} type - Type of Places we're searching for.
 * @returns {object} - Array of Place IDs with specified place type
 */
function getPlaceIDsByType(type_dict, type) {

    switch (type) {
        case data_type_none():
            return type_dict[data_type_none()];
            break;

        case data_type_team():
            return type_dict[data_type_team()];
            break;

        case data_type_pickup():
            return type_dict[data_type_pickup()];
            break;

        case data_type_tournament():
            return type_dict[data_type_tournament()];
            break;

        case data_type_association():
            return type_dict[data_type_association()];
            break;

        case 'ALL':
            return combineInnerKeys(type_dict);
            break;

        default:
            console.error('Error: Could not find places with type - <' + type + '>');
            return {};
    }
}