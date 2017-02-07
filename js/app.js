// LOCATION OBJECT CONSTRUCTOR
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

    cityLocations.forEach(function(location) {
        self.locations.push(new Location(location));
    });

    self.tags = ko.observableArray(categories);
    self.selectedFilter = ko.observable(self.tags[3]);
    self.selectedLocation = ko.observable(undefined);
    self.windowWidth = ko.observable($(window).width());
    self.isHiddenContent = ko.observable(self.windowWidth() < 767); // TODO: repeated magic number

    // BEHAVIOUR
    self.select = function(location) {
        // TODO: highlight corresponding marker on map
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

    self.filter = function(vm, event) {
        var filterTag = event.srcElement.value;
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
        // TODO: is this magic number your size?s
        return self.windowWidth() < 767;
    };

};

var viewModel = new LocationsViewModel();
ko.applyBindings(viewModel);

// TODO: check crossbrowsers
// TODO: Take only used portions of bootstrap
// TODO: Bug with text-content section remaining hidden when resizing


$(window).resize(function(){
    // inspiration from
    // http://stackoverflow.com/questions/10854179/how-to-make-window-size-observable-using-knockout
    viewModel.windowWidth($(window).width());
});