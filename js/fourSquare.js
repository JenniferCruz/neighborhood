// TODO: How can I hide sensitive data?
// TODO: Credit FourSquare
var fourSqr = {
    clientID: 'RSE3SPI05J0UPAGUGAN5XQVWGYHTNJQFRYWAS5HXCNGIML5D',
    clientSecret: 'PV23XIPOND4OLQN5Q3BIAWDNQIQ2YNC01DX5JTBSJSAY10NW',
    APIVersionDate: '20130815',
    HTMLStr: '',
    currentID: '',
    clientMethod: '',
    genPhotoRequestURL: function(venueID) {
        return "https://api.foursquare.com/v2/venues/" + venueID
            + "/photos?client_id=" + this.clientID
            + "&client_secret=" + this.clientSecret
            + "&v=" + this.APIVersionDate;
    },
    genVenueRequestURL: function(query) {
        return "https://api.foursquare.com/v2/venues/search?client_id="
            + this.clientID + "&client_secret=" + this.clientSecret + "&" + "v=" + this.APIVersionDate
            + "&ll=18.4726498,-69.8865431&query=" + query;
    },
    requestVenue: function(query) {
        var self = this;
        $.get(this.genVenueRequestURL(query),
            function(data, status){
                self.handleVenueResponse(data, status);
            });
    },
    requestPhotosFor: function (venueID) {
        $.get(this.genPhotoRequestURL(venueID), this.handlePhotoResponse);
    },
    handleVenueResponse: function(data, status) {
        if(status === "success") {
            var venues = data.response.venues;
            var isInResponse = false;
            for(var i = 0; i < venues.length; i++) {
                if(venues[i].id === this.currentID) {
                    isInResponse = true;
                    this.generateVenueHTML(venues[i]);
                    break;
                }
            }
            if(!isInResponse)
                this.generateVenueHTML();
        } else {
            // TODO: Create an error HTML
            console.log("ops! something went wrong getting info from Foursquare");
            console.log(status);
        }

    },
    handlePhotoResponse: function(data, status) {
        if(status === "success") {
            console.log('received photo data');
            console.log(data);
        } else {
            console.log("ops! Something went wrong retrieving pics: " + status);
        }
    },
    generateVenueHTML: function(venue) {
        if(venue) {
            this.HTMLStr = '<h3 class="info-venue-title">' + venue.name + '</h3>';
            if(venue.contact.phone)
                this.HTMLStr += '<p class="info-venue-content"><strong>Phone</strong>: ' + venue.contact.phone + '</p>';
            if(venue.location.address)
                this.HTMLStr += '<p class="info-venue-content"><strong>Address</strong>: ' + venue.location.address + '</p>';
            this.HTMLStr += '<a href="' + 'https://foursquare.com/v/' + venue.id + '?ref=' + this.clientID + '" target="_blank" class="info-venue-content">Checkout more at FourSquare></a>'
        } else {
            this.HTMLStr = '<p>Ops! We could\'n find more info about this place!</p>';
        }
        this.clientMethod(this.HTMLStr);
    },
    setVenueContent: function(id, name, callback) {
        this.clientMethod = callback;
        this.currentID = id;
        this.requestVenue(name);
        // TODO: request photo as well
    }

};

// TODO: Will you use this?
var infoWindowHTMLContent = '<h3 class="info-venue-title">' + '#VENUENAME#' + '</h3>' +
    '<img src="' + '#VENUEPREFIX#' + '180' + '#VENUESUFFIX#' +'">' +
    '<p class="info-venue-content"><strong>Phone</strong>: ' + '#VENUEPHONE#' + '</p>' +
    '<p class="info-venue-content"><strong>Address</strong>: ' + '#VENUEADDRESS#' + '</p>' +
    '<a href="' + '#VENUEREFURL#' + '" class="info-venue-content">Checkout more at FourSquare></a>' + '<hr>' +
    '<p class="info-options-teaser">Nearby? You might be interested in similar venues:</p> ' + '<div class="info-alt-options">' +

    '<div class="info-option"><a href="' + '#FIRSTVENUEURL#' + '">' +
    '<img src="' + '#FIRSTVENUEPREFIX#' + '50' + '#FIRSTVENUESUFFIX#' + '">' +
    '<h4>' + '#FIRSTVENUENAME#' + '</h4></a></div>' +

    '<div class="info-option"><a href="' + '#SECONDVENUEURL#' + '">' +
    '<img src="' + '#SECONDVENUEPREFIX#' + '50' + '#SECONDVENUESUFFIX#' + '">' +
    '<h4>' + '#SECONDVENUENAME#' + '</h4></a></div>' +

    '<div class="info-option"><a href="' + '#THIRDVENUEURL#' + '">' +
    '<img src="' + '#THIRDVENUEPREFIX#' + '50' + '#THIRDVENUESUFFIX#' + '">' +
    '<h4>' + '#THIRDVENUENAME#' + '</h4></a></div>' +

    '</div> </div>';

// TODO: Maybe create a small gallery
// TODO: Consider filtering by data.response.photos.items[i].visibility === 'public'
// TODO: Consider storing img ID for faster future request or just work with those
// TODO: What if this request was not a success but the previous one was????
