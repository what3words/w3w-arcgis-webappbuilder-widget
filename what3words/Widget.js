define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/_base/lang',
    'dojo/on',
    'esri/symbols/PictureMarkerSymbol',
    'esri/layers/GraphicsLayer',
    'esri/graphic',
    'esri/tasks/locator',
    'esri/request',
    "esri/InfoTemplate",
    'jimu/loaderplugins/jquery-loader!https://code.jquery.com/jquery-git1.min.js'
  ],
  function (declare, BaseWidget, lang, on, PictureMarkerSymbol, GraphicsLayer,
    Graphic, Locator, esriRequest, InfoTemplate, $) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {

      baseClass: 'jimu-widget-w3w',

      postCreate: function () {
        this.inherited(arguments);
        console.log('postCreate');
        this.own(on(this.map, "click", lang.hitch(this, this.onMapClick)));

      },

      startup: function () {
        this.inherited(arguments);
        console.log('startup');
      },

      onOpen: function () {
        console.log('onOpen');
        this.enabled = true;
        $('#what3words').text("Click any location on the map to see its whats3words address");
        
      },

      onClose: function () {
        console.log('onClose');
        this.enabled = false;
      },

      onMinimize: function () {
        console.log('onMinimize');
      },

      onMaximize: function () {
        console.log('onMaximize');
      },

      onSignIn: function (credential) {
        /* jshint unused:false*/
        console.log('onSignIn');
      },

      onSignOut: function () {
        console.log('onSignOut');
      },

      destroy: function () {
        this.inherited(arguments);
        console.log('destroy');
      },

      onMapClick: function (evt) {
        if (!this.enabled) {
          return;
        }
        var graphic = this._getMarkerGraphic(evt.mapPoint);
        this._get3wordAddressWithLocator(evt.mapPoint, graphic);
      },

      _getMarkerGraphic: function (mapPoint) {
        var infoTemplate = new InfoTemplate("Location", "what3words Address: ${what3words Address}");
        var symbol = new PictureMarkerSymbol(
          this.folderUrl + "images/w3wsquare.png",
          30, 30
        );
        // symbol.setOffset(0, 12);
        return new Graphic(mapPoint, symbol, mapPoint, infoTemplate);
      },

      _get3wordAddressWithLocator: function (mapPoint, graphic) {
        var map = this.map;
        var geocoderUrl = this.config.geocoderUrl;
        var locator = new Locator(geocoderUrl);
        var requestHandle = esriRequest({
          url: geocoderUrl,
          content: {
            f: "json"
          },
          handleAs: "json",
          callbackParamName: "callback"
        });
        requestHandle.then(function () {
          locator.locationToAddress(mapPoint, 100, function (response) {
            var address = response.address.Match_addr
            $('#what3words').text("///" + address);

            map.graphics.clear();
						map.infoWindow.hide();
            map.graphics.add(graphic);
            map.infoWindow.setTitle("Location");
            map.infoWindow.setContent("<b>what3words Address:</b> ///" + response.address.Match_addr);
            map.infoWindow.show(mapPoint, map.getInfoWindowAnchor(mapPoint));
          });
        }, function (error) {
          console.log("Error: ", error);
          $('#what3words').text("Error" + error);
        });
        return;
      },

    });
  });