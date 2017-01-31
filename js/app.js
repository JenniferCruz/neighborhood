// PLAIN INFO
var cityLocations = [];
var categories = ['all', 'urban sight', 'street', 'route', 'architecture', 'food', 'store', 'museum', 'things to do', 'restaurant', 'dance', 'salsa', 'son', 'nightlife'];
cityLocations.push({
    name : 'Calle Las Damas',
    location : {lat: 18.47317, lng: -69.882598},
    tags : [categories[1], categories[2], categories[3], categories[0]]
});
cityLocations.push({
    name : 'Chocomuseo',
    location : {lat: 18.473665, lng: -69.884687},
    tags : [categories[5], categories[6], categories[7],categories[8], categories[0]]
});
cityLocations.push({
    name : 'La cafetera',
    location : {lat : 18.473219, lng : -69.886549},
    tags : [categories[9], categories[5], categories[0]]
});
cityLocations.push({
    name : 'El bar de Lucia',
    location : {lat : 18.473889, lng : -69.88527},
    tags : [categories[5], categories[9], categories[10], categories[11], categories[12], categories[13], categories[0]]
});
cityLocations.push({
    name : 'Jalao\'',
    location : {lat : 18.473827, lng : -69.883973},
    tags : [categories[5], categories[9], categories[0]]
});

// OBJECT - Seems unnecessary - might need to DRY it out... let's see how this evolves..
var Location = function(data) {
    var self = this;
    self.name = data.name;
    self.tags = data.tags;
    self.location = data.location;
    self.visible = ko.observable(true);
    self.mapMarker = null;
    return self;
};

// VIEW MODEL
var LocationsViewModel = function() {
    // DATA
    var self = this;
    self.locations = new ko.observableArray([]);
    cityLocations.forEach(function(location){self.locations.push(new Location(location));});

    self.tags = ko.observableArray(categories);
    self.selectedFilter = ko.observable(self.tags[3]);
    self.selectedLocation = ko.observable(undefined);

    // BEHAVIOUR
    self.select = function(location) {
        if (location === self.selectedLocation())
            self.selectedLocation('undefined');
        else
            self.selectedLocation(location);
        // TODO: highlight corresponding marker on map
    };

    self.filter = function(vm, event) {
        // TODO: filter map markers as well
        var filterTag = event.srcElement.value;
        for(var i = 0; i < self.locations().length; i++) {
            var currentLocation = self.locations()[i];
            if (currentLocation.tags.includes(filterTag))
                currentLocation.visible(true);
            else currentLocation.visible(false);
            updateMarkerVisibility(currentLocation.mapMarker, currentLocation.visible());
        }
    };

    // self.getVisibleLocationsNames = function() {
    //     var visibleLocs = [];
    //     self.locations.forEach(function(currentLoc){
    //         if(currentLoc().visible())
    //             visibleLocs.push(currentLoc);
    //     });
    //     return visibleLocs;
    // };
};

var viewModel = new LocationsViewModel();
ko.applyBindings(viewModel);