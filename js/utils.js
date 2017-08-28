
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

/**
 * Functions below (utils_pop_*) set up popup structure from available popup data
 * in database.
 * 
 * @param {object} pop_data - data available to be added to popup
 * @param {objetc} layer - Leaflet.js layer which popup is thrown on
 * @returns {string} - html element string which represents popup
 */
function utils_pop_tournament(pop_data, layer) {
    let element = utils_concat_divs([
        pop_data.Pop_title,
        pop_data.Pop_date,
        pop_data.Pop_loc_name
    ]);
    
    return element;
}
function utils_pop_team(pop_data, layer) {
    var element = utils_concat_divs([
        pop_data.Pop_title,
        'Date: ' + pop_data.Pop_date,
        'Time: ' + pop_data.Pop_time,
        'Occurs: ' + pop_data.Pop_recurring,
        '<a href="' + pop_data.Pop_facebook + '">Facebook Link</a>'
    ]);

    return element;
}
function utils_pop_pickup(pop_data, layer) {
    var element = utils_concat_divs([
        pop_data.Pop_title,
        'Date: ' + pop_data.Pop_date,
        'Time: ' + pop_data.Pop_time,
        'Occurs: ' + pop_data.Pop_recurring,
        '<a href="' + pop_data.Pop_facebook + '">Facebook Link</a>'
    ]);

    return element;
}
function utils_pop_association(pop_data, layer) {
    var element = utils_concat_divs([
        pop_data.Pop_title,
        '<a href="' + pop_data.Pop_facebook + '">Facebook Link</a>',
        '<a href="' + pop_data.Pop_website + '">Website</a>'
    ]);

    return element;
}

/**
 * Function concatenates an array of text elements that will be thrown into html
 * divs. Each div is separated by a <br>
 * 
 * @param {object} divArr - array of string or numbers
 * @returns - string of concatenated data
 */
function utils_concat_divs(divArr) {
    let str = '';

    for (let i = 0; i < divArr.length; i++) {
        // skip element if undefined
        if (!divArr[i])
            continue;

        str += '<div>' + divArr[i] + '</div>';

        if (i < (divArr.length - 1))
            str += '<br>';
    }

    return str;
}