var loadMap = function() {
    // TODO: Load a 'Welcome to Santo Domingo" banner ontop of map, which disappears in a few seconds
    // TODO: Recenter map to show all markers on screen

    // Why is map a global variable?
    map = new google.maps.Map(document.getElementById('map'), {
        center : {lat: 18.4726498, lng: -69.8865431},
        zoom : 17,
        styles : mapStyles
    });

    var infoWindow = new google.maps.InfoWindow();

    // Update each location to have its own marker
    var locations = viewModel.locations();
    for(var i = 0; i < locations.length; i++) {
        var loc = locations[i];
        var mark = new google.maps.Marker({ position : loc.location, map : map, title : loc.name});

        loc.mapMarker = mark;

        mark.addListener('click', handleClickedMarker(mark, infoWindow, loc));
    }

};

var handleClickedMarker = function(marker, infoWindow, location) {
    return function(){
        animateMarker(marker);
        populateInfoWindow(marker, infoWindow, location.fourSqrID);
        viewModel.highlightLocationInList(marker.title);
    };
};

// use when filtering locations
var updateMarkerVisibility = function(marker, visibility) {
    if(visibility)
        marker.setMap(map);
    else
        marker.setMap(null);
};

var quiteAnimatedMarker = function() {
    if (animatedMarker !== 'undefined' && animatedMarker.getAnimation() !== null)
        animatedMarker.setAnimation(null);
};

var animateMarker = function(marker) {
    quiteAnimatedMarker();
    animatedMarker = marker;
    animatedMarker.setAnimation(google.maps.Animation.BOUNCE);
};

var populateInfoWindow = function(marker, infoWindow, fourSqrID) {
    if (infoWindow.marker != marker) {
        infoWindow.marker = marker;
        fourSqr.setVenueContent(fourSqrID, marker.title, function(html){
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
        });

    }
};