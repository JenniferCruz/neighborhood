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
    // self.windowWidth = ko.observable();
    self.windowWidth = ko.observable(window.innerWidth);
    self.isHiddenContent = ko.observable(self.windowWidth() < windowWidthTreshold);

    // BEHAVIOUR
    self.select = function(location) {
        if (location === self.selectedLocation()) {
            self.selectedLocation('undefined');
            quiteAnimatedMarker();
        } else {
            self.selectedLocation(location);
            animateMarker(location.mapMarker);
        }
    };

    self.highlightLocationInList = function (name) {
        for(var i = 0; i < self.locations().length; i++) {
            if(self.locations()[i].name === name) {
                self.select(self.locations()[i]);
                break;
            }
        }
    };

    self.filter = function(vm) {
        var filterTag = vm.selectedFilter();
        for(var i = 0; i < self.locations().length; i++) {
            var currentLocation = self.locations()[i];
            if (currentLocation.tags.includes(filterTag))
                currentLocation.visible(true);
            else currentLocation.visible(false);
            updateMarkerVisibility(currentLocation.mapMarker, currentLocation.visible());
        }
    };

    // self.toggleTextContent = function(model, event) {
    //     if(self.isHiddenContent())
    //         self.isHiddenContent(false);
    //     else self.isHiddenContent(true);
    //     // console.log(self.isHiddenContent());
    // };

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