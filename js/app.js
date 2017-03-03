// LOCATION OBJECT CONSTRUCTOR
var Location = function(data) {
    var self = this;
    self.name = data.name;
    self.tags = data.tags;
    self.location = data.location;
    self.fourSqrID = data.fourSqrID;
    self.mapMarker = null; // mapMarker will be updated when map markers are created
    self.visible = ko.observable(true); // this property will allow to filter the list of locations in UI
    return self;
};

// VIEW MODEL
var LocationsViewModel = function() {
    // TODO: work with Foursquare even if Google Maps doesn't load,
    // so that when a user clicks on a location in the list, info about this place is displayed

    // DATA
    var windowWidthTreshold = 767;

    var self = this;
    self.locations = new ko.observableArray([]);

    cityLocations.forEach(function(location) {
        self.locations.push(new Location(location));
    });

    self.tags = ko.observableArray(categories); // available categories for filtering are displayed in UI drop down
    self.selectedFilter = ko.observable('undefined'); // updated when user selects a new tag from the drop down
    self.selectedLocation = ko.observable(undefined); // updated when user clicks on a location

    // to detect when window is resized
    self.windowWidth = ko.observable(window.innerWidth);
    // will be used to hide intro and filter section when browser is shrinked
    // or page is loaded from a small device
    self.isSectionHidden = ko.observable(self.windowWidth() < windowWidthTreshold);


    // BEHAVIOUR
    self.onItemClick = function(location, caller) {
        if (location === self.selectedLocation())
            self.selectedLocation('undefined');
        else
            self.selectedLocation(location);
        // avoid circular reference
        if (caller !== map)
            map.onMarkerClick(location.mapMarker, location, viewModel);
    };

    self.onFilter = function(vm) {
        var filterTag = vm.selectedFilter();
        var markersToShow = [];
        var markersToHide = [];
        for (var i = 0; i < self.locations().length; i++) {
            var currentLocation = self.locations()[i];
            if (currentLocation.tags.includes(filterTag)) {
                currentLocation.visible(true);
                markersToShow.push(currentLocation.mapMarker);
            } else {
                currentLocation.visible(false);
                markersToHide.push(currentLocation.mapMarker);
            }
        }
        map.showMarkers(markersToShow);
        map.hideMarkers(markersToHide);
    };

    self.hideFilterSection = function() {
        self.isSectionHidden(true);
    };

    self.showFilterSection = function() {
        self.isSectionHidden(false);
    };

    self.windowIsSmall = function() {
        return self.windowWidth() < windowWidthTreshold;
    };

};

var viewModel = new LocationsViewModel();
ko.applyBindings(viewModel);

window.onresize = function() {
    // Idea from
    // http://stackoverflow.com/questions/10854179/how-to-make-window-size-observable-using-knockout
    viewModel.windowWidth(window.innerWidth);
};