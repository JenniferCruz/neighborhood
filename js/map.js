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
            // TODO: fix bug when user closes infoWindow and clicks again on the same marker, infoWindow won't open again
        }
    },
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
};


var loadMap = function () {
    map.chart = new google.maps.Map(document.getElementById('map'), {
        center : {lat: 18.4726498, lng: -69.8865431},
        zoom : 17,
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
