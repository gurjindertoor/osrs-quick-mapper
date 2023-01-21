const MAP_HEIGHT_PX = 296704; // Total height of the map in px at max zoom level
const RS_TILE_WIDTH_PX = 32, RS_TILE_HEIGHT_PX = 32; // Width and height in px of an rs tile at max zoom level
const RS_OFFSET_X = 1152; // Amount to offset x coordinate to get correct value
const RS_OFFSET_Y = 8328; // Amount to offset y coordinate to get correct value


var map = L.map('map').setView([-78.20207141002261, -135.7196044921875], 13);

L.tileLayer('https://raw.githubusercontent.com/Explv/osrs_map_tiles/master/0/{z}/{x}/{y}.png', {
    maxZoom: 19,
    zoomDelta: 0.5,
    zoomSnap: 0.5,
    minZoom: 4,
    maxZoom: 11,
    attribution: 'Map data',
    noWrap: true,
    tms: true
}).addTo(map);

var marker;
var clickedCoordinates;


// map.on('click', function(e) {
//     // Get the coordinates of the clicked point
//     var latlng = e.latlng;

//     // Assign the coordinates to the variable
//     clickedCoordinates = latlng;

//     // If there's already a marker, remove it
//     if (marker) {
//         map.removeLayer(marker);
//     }

//     let point = L.point(latlng.lat, latlng.lng);
//     var y = MAP_HEIGHT_PX - point.y + (RS_TILE_HEIGHT_PX / 4);
//     y = Math.round((y - RS_TILE_HEIGHT_PX) / RS_TILE_HEIGHT_PX) + RS_OFFSET_Y;
//     var x = Math.round((point.x - RS_TILE_WIDTH_PX) / RS_TILE_WIDTH_PX) + RS_OFFSET_X;

//     console.log(point)
//     console.log(x,y)

//     // Create a new marker at the clicked location
//     marker = L.marker(latlng).addTo(map);
//     marker.bindPopup("Coordinates: " + latlng.lat + ", " + latlng.lng).openPopup();
//   });



    // var point = L.point(latlng.lat, latlng.lng);
    // console.log(point)


//   fromLatLng(map, latLng, z) {
//     var point = map.project(latLng, map.getMaxZoom());
//     var y = MAP_HEIGHT_PX - point.y + (RS_TILE_HEIGHT_PX / 4);
//     y = Math.round((y - RS_TILE_HEIGHT_PX) / RS_TILE_HEIGHT_PX) + RS_OFFSET_Y;
//     var x = Math.round((point.x - RS_TILE_WIDTH_PX) / RS_TILE_WIDTH_PX) + RS_OFFSET_X;
//     return new Position(x, y, z);
// }


map.on('click', function(e) {
    // Get the coordinates of the clicked point
    var latlng = e.latlng;

    // Assign the coordinates to the variable
    clickedCoordinates = latlng;

    // If there's already a marker, remove it
    if (marker) {
        map.removeLayer(marker);
    }

    // convert latlng to point
    var point = map.project(latlng, map.getMaxZoom());
    // convert point to x,y tile
    var tilePoint = point.divideBy(RS_TILE_WIDTH_PX).floor();
    // adjust x,y tile based on offset
    var x = tilePoint.x - RS_OFFSET_X;
    var y = tilePoint.y - RS_OFFSET_Y;

    console.log(x, y);

    // Create a new marker at the clicked location
    marker = L.marker(latlng).addTo(map);
    marker.bindPopup("Tile: " + x + ", " + y).openPopup();
  });
