// TODO: How can I hide sensitive data?
// TODO: Credit FourSquare
var fourSqr = {
    _clientID: 'RSE3SPI05J0UPAGUGAN5XQVWGYHTNJQFRYWAS5HXCNGIML5D',
    _clientSecret: 'PV23XIPOND4OLQN5Q3BIAWDNQIQ2YNC01DX5JTBSJSAY10NW',
    _APIVersionDate: '20130815',
    _HTMLStr: '',
    _currentID: '',
    _clientMethod: '',
    _genPhotoRequestURL: function(venueID) {
        return "https://api.foursquare.com/v2/venues/" + venueID
            + "/photos?client_id=" + this._clientID
            + "&client_secret=" + this._clientSecret
            + "&v=" + this._APIVersionDate;
    },
    _genVenueRequestURL: function(query) {
        return "https://api.foursquare.com/v2/venues/search?client_id="
            + this._clientID + "&client_secret=" + this._clientSecret + "&" + "v=" + this._APIVersionDate
            + "&ll=18.4726498,-69.8865431&query=" + query;
    },
    _requestVenue: function(query) {
        // make AJAX venue request to Foursquare.
        var self = this;
        $.get(this._genVenueRequestURL(query),
            function(data, status){
                self._handleVenueResponse(data, status);
            });
    },
    _requestPhotosFor: function (venueID) {
        // make AJAX photo request to Foursquare
        var self = this;
        $.get(this._genPhotoRequestURL(venueID), function(data, status) {
            self._handlePhotoResponse(data, status);
        });
    },
    _handleVenueResponse: function(data, status) {
        // called from _requestVenue callback
        if(status === "success") {
            var venues = data.response.venues;
            var isInResponse = false;
            for(var i = 0; i < venues.length; i++) {
                if(venues[i].id === this._currentID) {
                    isInResponse = true;
                    this._generateVenueHTML(venues[i]);
                    this._requestPhotosFor(this._currentID);
                    break;
                }
            }
            if(!isInResponse)
                this._generateVenueHTML();
        } else {
            // TODO: Create an error HTML
            console.log("ops! something went wrong getting info from Foursquare");
            console.log(status);
        }

    },
    _handlePhotoResponse: function(data, status) {
        // called from _requestPhotosFor callback
        if(status === "success") {
            var photos = data.response.photos.items;
            if(photos.length > 0) {
                var img = venueHTML.img.replace('#PREFIX#', photos[0].prefix).replace('#SUFFIX#', photos[0].suffix);
                this._HTMLStr = this._HTMLStr.replace('#IMG#', img);
            } else {
                this._HTMLStr = this._HTMLStr.replace('#IMG#', '');
            }
        } else {
            console.log("ops! Something went wrong retrieving pics: " + status);
        }
        // Ultimate reponsable of calling its client method to display infoView
        // TODO: How could I remove this responsability from this method?
        this._clientMethod(this._HTMLStr);
    },
    _generateVenueHTML: function(venue) {
        if(venue) {
            this._HTMLStr = venueHTML.header.replace('#NAME#', venue.name);
            this._HTMLStr += '#IMG#';
            if(venue.contact.phone)
                this._HTMLStr += venueHTML.phone.replace('#PHONE#', venue.contact.phone);
            if(venue.location.address)
                this._HTMLStr += venueHTML.address.replace('#ADDRESS#', venue.location.address);
            this._HTMLStr += venueHTML.fourSqrLink.replace('#ID#', venue.id);
        } else {
            this._HTMLStr = '<p>Ops! We could\'n find more info about this place!</p>';
            this._clientMethod(this._HTMLStr);
        }
    },
    setVenueContent: function(id, name, callback) {
        // Intended to be the only method called from the outside
        this._clientMethod = callback;
        this._currentID = id;
        this._requestVenue(name);
    }
};

var venueHTML = {
    header: '<h3 class="info-venue-title">' + '#NAME#' + '</h3>',
    img: '<img src="' + '#PREFIX#' + '180' + '#SUFFIX#' +'">',
    phone: '<p class="info-venue-content"><strong>Phone</strong>: ' + '#PHONE#' + '</p>',
    address: '<p class="info-venue-content"><strong>Address</strong>: ' + '#ADDRESS#' + '</p>',
    fourSqrLink:  '<p><a href="' + 'https://foursquare.com/v/' + '#ID#' + '?ref=' + fourSqr._clientID + '" target="_blank" class="info-venue-content">Checkout more at FourSquare></a></p>'
};

// TODO: Maybe create a small gallery
// TODO: Consider filtering by data.response.photos.items[i].visibility === 'public'
// TODO: Consider storing img ID for faster future request or just work with those
// TODO: What if this request was not a success but the previous one was????
