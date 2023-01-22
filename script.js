const locations = [
    { "name": "Abandoned Mine", "coords": [3441, 3236, 0], "size": "default" },
    { "name": "Agility Arena", "coords": [2809, 3191, 0], "size": "default" },
    { "name": "Agility Pyramid", "coords": [3364, 2840, 0], "size": "default" },
    { "name": "Agility Training Area", "coords": [2481, 3424, 0], "size": "default" }
];


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

map.on('click', function(e) {
    // Get the coordinates of the clicked point
    let latlng = e.latlng;

    // Assign the coordinates to the variable
    clickedCoordinates = latlng;

    // If there's already a marker, remove it
    if (marker) {
        map.removeLayer(marker);
    }

    // convert latlng to point
    let point = map.project(latlng, map.getMaxZoom());
    let y = MAP_HEIGHT_PX - point.y + (RS_TILE_HEIGHT_PX / 4);
    y = Math.round((y - RS_TILE_HEIGHT_PX) / RS_TILE_HEIGHT_PX) + RS_OFFSET_Y;
    let x = Math.round((point.x - RS_TILE_WIDTH_PX) / RS_TILE_WIDTH_PX) + RS_OFFSET_X;

    // Send x and y to the python script through the websocket
    socket.send(x + "," + y);

    // Create a new marker at the clicked location
    marker = L.marker(latlng).addTo(map);
    // Listen for a response from the python script
    socket.onmessage = function(e) {
        marker.bindPopup(e.data).openPopup();
    }
});

locations.forEach(function(location) {
    let latlng = [location.coords[0], location.coords[1]];
    let marker = L.marker(latlng).addTo(map);
    marker.bindTooltip(location.name);
});

// Add the search bar
let searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", function() {
    let searchTerm = searchBar.value;
    locations.forEach(function(location) {
        if (location.name.toLowerCase().includes(searchTerm.toLowerCase())) {
            let latlng = [location.coords[0], location.coords[1]];
            map.setView(latlng, 14);
        }
    });
});