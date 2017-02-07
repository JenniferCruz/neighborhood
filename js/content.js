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
var categories = ['all', 'urban sight', 'street', 'route', 'architecture', 'food', 'store', 'museum', 'things to do', 'restaurant', 'dance', 'salsa', 'son', 'nightlife'];
var cityLocations = [];
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
