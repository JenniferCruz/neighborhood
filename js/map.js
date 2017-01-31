var map;
var markers = [];

var loadMap = function() {
    // TODO: Load a 'Welcome to Santo Domingo" banner ontop of map, which disappears in a few seconds
    // TODO: Recenter map to show all markers on screen
    map = new google.maps.Map(document.getElementById('map'), {
        center : {lat: 18.4726498, lng: -69.8865431},
        zoom : 17
    });

    var locations = viewModel.locations();
    for(var i = 0; i < locations.length; i++) {
        var mark = new google.maps.Marker({ position : locations[i].location, map : map, title : locations[i].name});
        // markers.push(mark);
        locations[i].mapMarker = mark;
        mark.addListener('click', function(){
            // TODO: Highlight marker and tell KO to highlight list
            console.log('clicked marker!');
        });
    }
};

var updateMarkerVisibility = function(marker, visibility) {
    // TODO: Filter map marker. Function called from filter
    if(visibility) {
        marker.setMap(null);
    }
};