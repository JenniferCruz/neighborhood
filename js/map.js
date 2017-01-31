var map;
var markers = [];
var animatedMarker = 'undefined';
var mapStyles = [
    {"featureType":"all", "elementType":"labels.text.fill", "stylers":[{"color":"#000000"}]},
    {"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"},{"weight":"4"}]},
    {"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"on"},{"saturation":"-100"}]},
    {"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#ffffff"},{"lightness":20},{"visibility":"on"}]},
    {"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},
    {"featureType":"administrative.locality","elementType":"all","stylers":[{"visibility":"on"}]},
    {"featureType":"administrative.neighborhood","elementType":"all","stylers":[{"visibility":"on"}]},
    {"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"on"},{"lightness":"80"}]},
    {"featureType":"landscape","elementType":"all","stylers":[{"visibility":"simplified"},{"color":"#797979"}]},
    {"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#ffffff"},{"lightness":20}]},
    {"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"on"}]},
    {"featureType":"landscape.natural.landcover","elementType":"all","stylers":[{"visibility":"on"}]},
    {"featureType":"landscape.natural.terrain","elementType":"all","stylers":[{"visibility":"off"}]},
    {"featureType":"poi","elementType":"geometry","stylers":[{"color":"#dfdfdf"},{"lightness":21},{"visibility":"on"}]},
    {"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#fed41c"},{"visibility":"on"},{"weight":"3.00"}]},
    {"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#fed41c"},{"gamma":"0.6"}]},
    {"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#fed41c"},{"weight":"4.00"}]},
    {"featureType":"road.highway.controlled_access","elementType":"geometry.stroke","stylers":[{"weight":"1"},{"gamma":"0.6"}]},
    {"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#aeaeae"},{"lightness":18},{"visibility":"on"}]},
    {"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#b6b6b6"}]},
    {"featureType":"road.local","elementType":"all","stylers":[{"visibility":"on"},{"color":"#656565"}]},
    {"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#c6c6c6"},{"lightness":16}]},
    {"featureType":"road.local","elementType":"geometry.stroke","stylers":[{"color":"#b1b1b1"},{"visibility":"on"}]},
    {"featureType":"road.local","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#ffffff"}]},
    {"featureType":"transit","elementType":"geometry","stylers":[{"color":"#bdbdbd"},{"lightness":19},{"visibility":"on"}]},
    {"featureType":"water","elementType":"geometry","stylers":[{"color":"#c0d8e3"},{"lightness":17},{"visibility":"on"}]}];

var loadMap = function() {
    // TODO: Load a 'Welcome to Santo Domingo" banner ontop of map, which disappears in a few seconds
    // TODO: Recenter map to show all markers on screen
    map = new google.maps.Map(document.getElementById('map'), {
        center : {lat: 18.4726498, lng: -69.8865431},
        zoom : 17,
        styles : mapStyles
    });

    var locations = viewModel.locations();
    for(var i = 0; i < locations.length; i++) {
        var mark = new google.maps.Marker({ position : locations[i].location, map : map, title : locations[i].name});
        // markers.push(mark);
        locations[i].mapMarker = mark;

        mark.addListener('click', function(){
            // TODO: Highlight marker and tell KO to highlight list
            animateMarker(this);
            viewModel.highlightLocationInList(this.title);
        });
    }
};

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