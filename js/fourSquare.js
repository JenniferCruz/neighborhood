// TODO: How can I hide sensitive data?
// TODO: Credit FourSquare

var fourSqr = {
    setVenueContent: function(query, id, callback) {
        // Create new Handler and Template to avoid a race condition
        new Handler(new TemplateAssembler())
            .resolve(query, id, callback);
    }
};


var Handler = function (template) {

    const obj = {};

    obj._template = template;

    obj._photo = function (url, callback) {
        $.get(url, function (data, status) {
            if (status === 'success' && data.response.photos.items.length > 0)
                template.setPhotoHTML(data.response.photos.items[0]); // why the first one?
            callback(template.html());
        }); // TODO: second callback to handle error?
    };

    obj._requestVenue = function(url, id, callback) {

        const self = this;

        $.get(url, function (data, status) {
            if (status === 'success') {
                var place = _find(id, data);
                template.setVenueHTML(place);

                if (place)
                    self._photo(connector.getPhotoURL(id), callback);
                else
                    callback(template.html());
            }
            else
                callback(template.html());
        });

        const _find = function (id, data) {
            for (var i = 0; i < data.response.venues.length; i++)
                if (data.response.venues[i].id === id)
                    return data.response.venues[i];
            return null;
        };
    };

    obj.resolve = function (id, query, callback) {
        // The handler starts resolution by requesting the venue to FourSquare
        // Resolution finishes when the callback is called
        this._requestVenue(connector.getVenueURL(query), id, callback);
    };

    return obj;
};

var TemplateAssembler = function () {
    const obj = {};

    obj._top = '';
    obj._center = '';
    obj._bottom = '';
    obj._htmlTemplate = {
        header: '<h3 class="info-venue-title">' + '#NAME#' + '</h3>',
        img: '<img src="' + '#PREFIX#' + '180' + '#SUFFIX#' +'">',
        phone: '<p class="info-venue-content"><strong>Phone</strong>: ' + '#PHONE#' + '</p>',
        address: '<p class="info-venue-content"><strong>Address</strong>: ' + '#ADDRESS#' + '</p>',
        fourSqrLink:  '<p><a href="' + 'https://foursquare.com/v/' + '#ID#' + '?ref=' + fourSqr._clientID + '" target="_blank" class="info-venue-content">Checkout more at FourSquare></a></p>'
    };

    obj.setVenueHTML = function (venue) {
        if(venue) {
            this._top = this._htmlTemplate.header.replace('#NAME#', venue.name);
            if(venue.contact.phone)
                this._bottom = this._htmlTemplate.phone.replace('#PHONE#', venue.contact.phone);
            if(venue.location.address)
                this._bottom += this._htmlTemplate.address.replace('#ADDRESS#', venue.location.address);
            this._bottom += this._htmlTemplate.fourSqrLink.replace('#ID#', venue.id);
        } else {
            this._top = '<h1>Ops! Sorry!</h1>';
            this._bottom = '<p>We could\'n find more info about this place...</p>';
        }
    };

    obj.setPhotoHTML = function (photo) {
        if(photo)
            this._center = this._htmlTemplate.img
                .replace('#PREFIX#', photo.prefix)
                .replace('#SUFFIX#', photo.suffix);
    };

    obj.html = function () {
        return this._top + this._center + this._bottom;
    };

    return obj;
};

var connector = {
    _clientID: 'RSE3SPI05J0UPAGUGAN5XQVWGYHTNJQFRYWAS5HXCNGIML5D',
    _clientSecret: 'PV23XIPOND4OLQN5Q3BIAWDNQIQ2YNC01DX5JTBSJSAY10NW',
    _APIVersionDate: '20130815',
    getVenueURL: function(query) {
        return "https://api.foursquare.com/v2/venues/search?client_id="
            + this._clientID + "&client_secret=" + this._clientSecret + "&" + "v=" + this._APIVersionDate
            + "&ll=18.4726498,-69.8865431&query=" + query;
    },
    getPhotoURL: function (id) {
        return "https://api.foursquare.com/v2/venues/" + id
            + "/photos?client_id=" + this._clientID
            + "&client_secret=" + this._clientSecret
            + "&v=" + this._APIVersionDate;
    }
};



// TODO: Maybe create a small gallery
// TODO: Consider filtering by data.response.photos.items[i].visibility === 'public'
// TODO: Consider storing img ID for faster future request or just work with those
// TODO: What if this request was not a success but the previous one was????
