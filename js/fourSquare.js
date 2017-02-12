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
        var self = this;
        $.get(this.genPhotoRequestURL(venueID), function(data, status) {
            self.handlePhotoResponse(data, status);
        });
    },
    handleVenueResponse: function(data, status) {
        if(status === "success") {
            var venues = data.response.venues;
            var isInResponse = false;
            for(var i = 0; i < venues.length; i++) {
                if(venues[i].id === this.currentID) {
                    isInResponse = true;
                    this.generateVenueHTML(venues[i]);
                    this.requestPhotosFor(this.currentID);
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
            var photos = data.response.photos.items;
            if(photos.length > 0) {
                var img = venueHTML.img.replace('#PREFIX#', photos[0].prefix).replace('#SUFFIX#', photos[0].suffix);
                this.HTMLStr = this.HTMLStr.replace('#IMG#', img);
            } else {
                this.HTMLStr = this.HTMLStr.replace('#IMG#', '');
            }
        } else {
            console.log("ops! Something went wrong retrieving pics: " + status);
        }

        this.clientMethod(this.HTMLStr);
    },
    generateVenueHTML: function(venue) {
        if(venue) {
            this.HTMLStr = venueHTML.header.replace('#NAME#', venue.name);
            this.HTMLStr += '#IMG#';
            if(venue.contact.phone)
                this.HTMLStr += venueHTML.phone.replace('#PHONE#', venue.contact.phone);
            if(venue.location.address)
                this.HTMLStr += venueHTML.address.replace('#ADDRESS#', venue.location.address);
            this.HTMLStr += venueHTML.fourSqrLink.replace('#ID#', venue.id);
        } else {
            this.HTMLStr = '<p>Ops! We could\'n find more info about this place!</p>';
            this.clientMethod(this.HTMLStr);
        }
        // this.clientMethod(this.HTMLStr);
    },
    setVenueContent: function(id, name, callback) {
        this.clientMethod = callback;
        this.currentID = id;
        this.requestVenue(name);
        // TODO: request photo as well
    }

};

var venueHTML = {
    header: '<h3 class="info-venue-title">' + '#NAME#' + '</h3>',
    img: '<img src="' + '#PREFIX#' + '180' + '#SUFFIX#' +'">',
    phone: '<p class="info-venue-content"><strong>Phone</strong>: ' + '#PHONE#' + '</p>',
    address: '<p class="info-venue-content"><strong>Address</strong>: ' + '#ADDRESS#' + '</p>',
    fourSqrLink:  '<p><a href="' + 'https://foursquare.com/v/' + '#ID#' + '?ref=' + fourSqr.clientID + '" target="_blank" class="info-venue-content">Checkout more at FourSquare></a></p>'
};

// TODO: Maybe create a small gallery
// TODO: Consider filtering by data.response.photos.items[i].visibility === 'public'
// TODO: Consider storing img ID for faster future request or just work with those
// TODO: What if this request was not a success but the previous one was????
