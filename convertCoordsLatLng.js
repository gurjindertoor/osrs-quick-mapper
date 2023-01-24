const MAP_HEIGHT_PX = 296704; // Total height of the map in px at max zoom level
const RS_TILE_WIDTH_PX = 32, RS_TILE_HEIGHT_PX = 32; // Width and height in px of an rs tile at max zoom level
const RS_OFFSET_X = 1152; // Amount to offset x coordinate to get correct value
const RS_OFFSET_Y = 8328; // Amount to offset y coordinate to get correct value

var map = L.map('map').setView([-78.20207141002261, -135.7196044921875], 9);

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

let marker;
let clickedCoordinates;

const socket = new WebSocket("ws://localhost:8765");

// const fs = require('fs');

fetch('locations.json')
  .then(response => response.json())
  .then(data => {
    // Parse the JSON data and extract the location information
    const locations = data.locations;
    // Create a new array to store the updated location information
    let updatedLocations = [];
    // Iterate through each location
    locations.forEach(location => {
        let x = location.coords[0];
        let y = location.coords[1];

        let zoom = map.getMaxZoom();
        
        x = x - RS_OFFSET_X;
        x = x * RS_TILE_WIDTH_PX + RS_TILE_WIDTH_PX;
        
        y = y - RS_OFFSET_Y;
        y = (y * RS_TILE_HEIGHT_PX) + RS_TILE_HEIGHT_PX + (RS_TILE_HEIGHT_PX / 4);
        y = MAP_HEIGHT_PX - y;
        
        let point = new L.Point(x, y);
        let latlng = map.unproject(point, zoom);
        // console.log(latlng.lat); // prints latitude
        // console.log(latlng.lng); // prints longitude
        
        let updatedLocation = {
            "name": location.name,
            "coords": [latlng.lat, latlng.lng],
            "size": location.size
        }
        // Add the updated location to the array
        updatedLocations.push(updatedLocation);
    });

    // console.log(updatedLocations)
    // Convert the array to a JSON string and split the data into multiple lines
    let jsonData = JSON.stringify(updatedLocations, null, 2);
    // Create a Blob object with the JSON data
    let blob = new Blob([jsonData], { type: "application/json" });
    // Use saveAs() to save the Blob object as a file
    saveAs(blob, "updatedLocations.json");
});