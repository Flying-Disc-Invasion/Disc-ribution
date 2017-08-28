function data_type_none() {         return 'None';          }
function data_type_team() {         return 'Team';          }
function data_type_pickup() {       return 'Pick-up';       }
function data_type_tournament() {   return 'Tournament';    }
function data_type_association() {  return 'Association';   }

function data_start_place() { 
    return { Loc: [30.041952, 31.243517], Zoom: 7 };
}

/**
 * Function holds the data for all data that can be shown on the map!
 * TODO: Get this data form Firebase, not from here!
 * TODO: add rest of Popup data
 * TODO: add Icon data
 * 
 * @returns {object} - data holder object - all data!
 */ 
function data_holder_getData() {
    return {
        // type: 'None'
        'Cairo': {                  Type: data_type_none(),
            Loc: {  Lat: 30.041952, Lng: 31.243517  },  Zoom: 13
        },
        'MapStart': {               Type: data_type_none(),
            Loc: {  Lat: 30.041952, Lng: 31.243517  },  Zoom: 7
        },

        // type: 'Pick-up'
        'DEO': {                    Type: data_type_pickup(),
            Loc: {  Lat: 30.031998, Lng: 31.211364  },  Zoom: 10,
            Popup_Fn: utils_pop_pickup,
            Popup_Data: {
                Pop_title: 'DEO Weekly Pickup',

                Pop_date: 'Friday',
                Pop_time: '4:00 pm',
                Pop_recurring: 'weekly',

                Pop_facebook: 'https://www.facebook.com/groups/frisbee.eg/'
            }
        },
        
        // type: 'Team':
        'Vibranium': {              Type: data_type_team(),
            Loc: {  Lat: 30.083319, Lng: 31.333850  },  Zoom: 10,
            Popup_Fn: utils_pop_team,
            Popup_Data: {
                Pop_title: 'Vibranium Practice (Everyone welcome!)',
                
                Pop_date: 'Saturday',
                Pop_time: '4:00 pm',
                Pop_recurring: 'weekly',
                
                Pop_facebook: 'https://www.facebook.com/groups/843643645773323/'
            }
        },

        // type: 'Tournament'
        'BUX-1': {                  Type: data_type_tournament(),
            Loc: {  Lat: 30.950335, Lng: 28.828621  },  Zoom: 13,
            Popup_Fn: utils_pop_tournament,
            Popup_Data: {
                Pop_title: 'BUX-1',
                Pop_date: 'Aug 25 - 26, 2017',
                Pop_loc_name: 'Lazorde Bay'
            }
        },

        // type: 'Association'
        'FDI': {                    Type: data_type_association(),
            Loc: {  Lat: 30.035482, Lng: 31.235561  },  Zoom: 10,
            Popup_Fn: utils_pop_association,
            Popup_Data: {
                Pop_title: 'Flying Disc Invasion (FDI)',
                Pop_website: 'http://flying.disc.invasion.com',
                Pop_facebook: 'https://www.facebook.com/FlyingDiscInvasion/'
            }
        }
    };
}

/**
 * Function creates and returns layer_dict and type_dict.
 * 
 * The layer dictionary object will enable layer (marker / shape) removal!
 * It stores data points and the layer object itself
 * (as it puts the points on the map)!!
 * 
 * The type dictionary object will hold groups of types, each type will point to
 * an array of place IDs with that type (to get place details, reference the ID
 * from layer_dict)
 * 
 * Looks like this:
 * layer_dict = {
 *  'ID0': {name: <Place name>, details: <Place Details - type, Loc, zoom>,
 *      layer: <Layer object>},
 *  'ID1':...
 * }
 * 
 * @param {object} map - Leafletjs map object
 * @returns {object} - [layer dictionary, type dictionary]
 */
function data_holder_createDataDicts(map) {
    // get data!
    let data = data_holder_getData(),
        layer_dict = {},
        type_dict = {};

    // loop through data and create layer dictionary structure
    Object.keys(data).forEach(function(placeName, index) {
        let placeDetails = data[placeName],
            placeType = placeDetails.Type,
            placeID = 'ID' + index;

        let newLayer = undefined;

        // get active status of element with same filter type
        let add = $('#filter-bar li a[data-filter="' +
            placeType + '"]').parent().hasClass('active');

        // if filter is 'active', add to map at beginning
        if (add) {
            newLayer = L.marker( utils_getLatLng(placeDetails) )
                .addTo(map);

            // add popup if popup data exists in Place obj
            if (placeDetails.Popup_Fn) {
                newLayer.bindPopup(
                    placeDetails.Popup_Fn( placeDetails.Popup_Data, newLayer )
                );
            }
        }

        // build up layer dictionary
        layer_dict[placeID] = {
            name: placeName,
            details: placeDetails,
            layer: newLayer
        };

        // build up type dictionary
        // if type doesn't exist in dictionary already, initialize to empty array.
        if (type_dict[placeType] === undefined) {
            type_dict[placeType] = [];
        }

        // push place ID into type dictionary
        type_dict[placeType].push(placeID);
    });

    return [layer_dict, type_dict];
}

/**
 * Function combines 2nd layer of inner keys of object into 1 big object
 * 
 * // TODO: finish this
 * @param {any} obj 
 * @returns 
 */
// function combineInnerKeys(outerObj) {
//     let holder = {};

//     Object.keys(outerObj).forEach(function(oKey, index) {
//         let innerObj = outerObj[oKey];

//         Object.keys(innerObj).forEach(function(iKey, index) {
//             if (holder[ iKey ] !== undefined) {
//                 console.error('Error: key <' + key + '> already found in holder obj');
//                 return false;
//             } else {
//                 holder[ iKey ] = innerObj[ iKey ];
//             }
//         })
//     });

//     return holder;
// }


/**
 * Function returns Place object with specified name. If no places exist (name
 * is spelled wrong, or something), empty object returned
 * 
 * @param {string} name - name of Place we're looking for
 * @returns {object} - Place or empty (if not found)
 */
// function getPlaceByName(name) {
//     var lib = {
//         'DEO': {
//             DataType: data_type_pickup(),
//             Loc: {  Lat: 30.031998, Lng: 31.211364  },
//             Zoom: 10
//         },
//         'BUX-1': {
//             DataType: data_type_tournament(),
//             Loc: {  Lat: 30.950335, Lng: 28.828621  },
//             Zoom: 13
//         },
//         'Cairo': {
//             DataType: data_type_none(),
//             Loc: {  Lat: 30.041952, Lng: 31.243517  },
//             Zoom: 13
//         },
//         'MapStart': {
//             DataType: data_type_none(),
//             Loc: {  Lat: 30.041952, Lng: 31.243517  },
//             Zoom: 7
//         }
//     };

//     // return available Place
//     if (lib[name] === undefined) {
//         if (lib[name.toUpperCase()] === undefined) {
//             // no matches
//             console.error('Error: Could not find places with name - <' + name + '>');
//             return {};
//         } else {
//             // match on uppercase name!
//             return lib[name.toUpperCase()];
//         }
//     } else {
//         // match on normal name
//         return lib[name];
//     }
// }