var map = {
    chart : null, // this will hold the map from Google
    infoWindow : null, // TODO: style info window
    _currentAnimatedMarker : 'undefined',
    _populateInfoWindow : function (marker, locationID) {
        if (this.infoWindow.marker != marker) {
            this.infoWindow.marker = marker;
            this.infoWindow.setContent('<p>Loading info for ' + marker.title + ' </p>'); // TODO: include 'loading' animation
            this.infoWindow.open(map, marker);
            fourSqr.setVenueContent(locationID, marker.title, function (html) {
                map.infoWindow.setContent(html);
                map.infoWindow.open(map, marker);
            });
        } else {
            // Just open it. Avoid requesting info to Foursquare that you already have.
            map.infoWindow.open(map, marker);
        }
    },
    // TODO: Add a closeclick event listener for infowindow so that when it is closed, it also stops markers animation to prevent it from bouncing without an opened infowindow.
    // Ex:
    // google.maps.event.addListener(infowindow, 'closeclick', function() {
    //     // stop marker animation here
    // });
    // Reference: InfoWindow class documentation @Google Developers
    // https://developers.google.com/maps/documentation/javascript/reference#InfoWindow

    onMarkerClick : function (marker, location, caller) {
        var markerAnimation = marker.getAnimation();
        // Quite the currently animated marker, if any
        if (this._currentAnimatedMarker !== 'undefined')
            this._currentAnimatedMarker.setAnimation(null);
        // Store a reference to this marker,
        // to quite it when a marker is clicked again
        this._currentAnimatedMarker = marker;
        // if clicked marker was already animated, quite it
        if (markerAnimation !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE); // TODO: Change animation
            this._populateInfoWindow(marker, location.fourSqrID);
        }
        // avoid circular reference
        if (caller !== viewModel)
            viewModel.onItemClick(location, map);
    },
    showMarkers : function (markers) {
        var m = this.chart;
        markers.forEach(function (marker) {
            marker.setMap(m);
        });
    },
    hideMarkers : function (markers) {
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
    }
    // TODO: setMap method is not the efficient way to show or hide markers. A more optimized way is to use Marker's' setVisible method. Ex:
    // someMarker.setVisible(true); // or false;
    // Marker class documentation here https://developers.google.com/maps/documentation/javascript/reference?hl=en#MarkerOptions
    // Hoever, depending on your implementations with showing the marker after creating it, the setVisible method may not work. In this case, you can keep using setMap method.

};


var loadMap = function () {
    map.chart = new google.maps.Map(document.getElementById('map'), {
        center : {lat: 18.4726498, lng: -69.8865431},
        zoom : 17, // TODO: Change zoom for smaller devices
        styles : mapStyles
    });

    map.infoWindow = new google.maps.InfoWindow();

    var addMarkerClicklistener = function (marker, location) {
        return function () {
            map.onMarkerClick(marker, location);
        }
    };

    // Update each location to have its own marker
    var locations = viewModel.locations();
    for(var i = 0; i < locations.length; i++) {
        var loc = locations[i];
        var mark = new google.maps.Marker({ position: loc.location, map: map.chart, title: loc.name});
        mark.setAnimation(null);
        loc.mapMarker = mark;
        mark.addListener('click', addMarkerClicklistener(mark, loc));
    }

};

function handleGoogleError() {
    const mapSection = document.getElementById('map');
    const sorryHTML = '<div class="map-missing-excuse"><h1>Uh oh!</h1>'
        + '<h2>Something went wrong</h2>'
        + '<h2>loading the map from Google</h2>'
        + '<h3>Make sure you are connected to the internet</h3>'
        + '<h3>and try reloading this page</h3>'
        + '<h4>In the midtime...</h4>'
        + '<p>You can still see (just) the list of recommended places.</p></div>'

    mapSection.className += ' map-placeholder';
    mapSection.innerHTML = sorryHTML;
}


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
