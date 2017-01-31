var map;

var loadMap = function () {
    var markers = [];

    // TODO: Load a 'Welcome to Santo Domingo" banner ontop of map, which disappears in a few seconds
    map = new google.maps.Map(document.getElementById('map'), {
        center : {lat: 18.4726498, lng: -69.8865431},
        zoom : 17
    });

    for(var i = 0; i < locations.length; i++) {
        var mark = new google.maps.Marker({
                position : locations[i].location,
                map : map,
                title : locations[i].place});
        markers.push(mark);
        mark.addListener('click', function(){
            highlight(this);
        });
    }

};

var highlight = function() {

};

var Location = function(place) {
    // var self = this;
    this.title = ko.observable(place.name);
    // this.coords = ko.observable(place.location);
    // this.tags = ko.observableArray([]);
    // place.tags.forEach(function(tag){
       // self.tags.push(ko.observable(tag));
    // });
    return this;
};

var PlacesViewModel = function() {
    var self = this;
    self.locations = ko.observableArray([]);
    cityLocations.forEach(function(place) {
        var p = ko.observable(new Location(place));
        self.locations.push(p);
    });

    var highlightItem = function(place) {
        console.log('!');
        console.log(place);
    }
};

ko.applyBindings(new PlacesViewModel());