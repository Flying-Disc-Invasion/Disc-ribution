
/**
 * Function converts a place's Loc object to an array of lattitude & longitude
 * coordinates
 * 
 * @param {object} place - object with Loc node w/ Lat & Lng nodes inside
 * @returns {object} - coordinate array.
 */
function utils_getLatLng(place) {
    let lat = place.Loc.Lat;
    let lng = place.Loc.Lng;

    if (!lat || !lng) {
        console.error('Lat/Lng not found in place:',place);
    }

    return [lat, lng];
}