var map = {
    chart : null,
    _currentAnimatedMarker : 'undefined',
    infoWindow : null,
    _populateInfoWindow : function (marker, locationID) {
        if (this.infoWindow.marker != marker) {
            this.infoWindow.marker = marker;
            this.infoWindow.setContent('<p>Loading info for ' + marker.title + ' </p>');
            this.infoWindow.open(map, marker);
            fourSqr.setVenueContent(locationID, marker.title, function (html) {
                map.infoWindow.setContent(html);
                map.infoWindow.open(map, marker);
            });
        }
    },
    onMarkerClick : function (marker, location, caller) {
        // Quite the currently animated marker, if any
        var markerAnimation = marker.getAnimation();
        if (this._currentAnimatedMarker !== 'undefined')
            this._currentAnimatedMarker.setAnimation(null);
        this._currentAnimatedMarker = marker;
        if (markerAnimation !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE); // TODO: Cooler animation
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
        var mark = new google.maps.Marker({
            position : loc.location,
            map : map.chart,
            title : loc.name});
        mark.setAnimation(null);
        loc.mapMarker = mark;
        mark.addListener('click', addMarkerClicklistener(mark, loc));
    }

};