// LOCATION OBJECT CONSTRUCTOR
var Location = function(data) {
    var self = this;
    self.name = data.name;
    self.tags = data.tags;
    self.location = data.location;
    self.visible = ko.observable(true);
    self.mapMarker = null;
    self.fourSqrID = data.fourSqrID;
    return self;
};

// VIEW MODEL
var LocationsViewModel = function() {
    const windowWidthTreshold = 767;

    // DATA
    var self = this;
    self.locations = new ko.observableArray([]);

    cityLocations.forEach(function(location) {
        self.locations.push(new Location(location));
    });

    self.tags = ko.observableArray(categories);
    self.selectedFilter = ko.observable(self.tags[3]);

    self.selectedLocation = ko.observable(undefined);
    self.windowWidth = ko.observable(window.innerWidth);
    self.isHiddenContent = ko.observable(self.windowWidth() < windowWidthTreshold);

    // BEHAVIOUR
    self.highlightLocationInList = function (name) { // TODO: rename something like handleHTMLSelectChange
        for(var i = 0; i < self.locations().length; i++) {
            if(self.locations()[i].name === name) {
                self.select(self.locations()[i]);
                break;
            }
        }
    };

    self.onItemClick = function (location, caller) {
        if (location === self.selectedLocation())
            self.selectedLocation('undefined');
        else
            self.selectedLocation(location);
        // avoid circular reference
        if (caller !== map)
            map.onMarkerClick(location.mapMarker, location.fourSqrID, viewModel);
    };

    self.highlightItem = function (locationName, caller) {
        for (var i = 0; i < self.locations().length; i++) {
            if (self.locations()[i].name === locationName) {
                self.onItemClick(self.locations()[i], caller);
                break;
            }
        }
    };

    self.filter = function (vm) {
        // TODO: Rename to make clear is input
        var filterTag = vm.selectedFilter();
        var markersToShow = [];
        var markersToHide = [];
        for (var i = 0; i < self.locations().length; i++) {
            var currentLocation = self.locations()[i];
            if (currentLocation.tags.includes(filterTag)) {
                currentLocation.visible(true);
                markersToShow.push(currentLocation.mapMarker);
            }
            else {
                currentLocation.visible(false);
                markersToHide.push(currentLocation.mapMarker);
            }
        }
        map.showMarkers(markersToShow);
        map.hideMarkers(markersToHide);
    };
    self.hideTextContent = function() {
        self.isHiddenContent(true);
    };

    self.showTextContent = function() {
        self.isHiddenContent(false);
    };

    self.windowIsSmall = function() {
        return self.windowWidth() < windowWidthTreshold;
    };

};

var viewModel = new LocationsViewModel();
ko.applyBindings(viewModel);

// TODO: check crossbrowsers
// TODO: Take only used portions of bootstrap

window.onresize = function(){
    // inspiration from
    // http://stackoverflow.com/questions/10854179/how-to-make-window-size-observable-using-knockout
    viewModel.windowWidth(window.innerWidth);
};