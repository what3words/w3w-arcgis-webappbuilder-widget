define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/_base/lang',
    'dojo/on',
    'esri/symbols/PictureMarkerSymbol',
    'esri/layers/GraphicsLayer',
    'esri/graphic',
    'esri/tasks/locator',
    'esri/request',
    'jimu/loaderplugins/jquery-loader!https://code.jquery.com/jquery-git1.min.js'
  ],
  function (declare, BaseWidget, lang, on, PictureMarkerSymbol, GraphicsLayer,
    Graphic, Locator, esriRequest, $) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {

      baseClass: 'jimu-widget-w3w',
      _markerGraphic: null,

      postCreate: function () {
        this.inherited(arguments);
        console.log('postCreate');

        this.graphicsLayer = new GraphicsLayer();
        this.map.addLayer(this.graphicsLayer);

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
        this.graphicsLayer.remove(this._markerGraphic);
        this._markerGraphic = null;
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
        if (this._markerGraphic) {
          this.graphicsLayer.remove(this._markerGraphic);
        }
        if (this.graphicsLayer) {
          this.map.removeLayer(this.graphicsLayer);
        }

        this.inherited(arguments);
      },

      onMapClick: function (evt) {
        if (!this.enabled) {
          return;
        }
        if (!this._markerGraphic) {
          this._markerGraphic = this._getMarkerGraphic(evt.mapPoint);
          this.graphicsLayer.add(this._markerGraphic);
        } else {
          this._markerGraphic.setGeometry(evt.mapPoint);
        }
        this._get3wordAddressWithLocator(evt.mapPoint);
      },

      _getMarkerGraphic: function (mapPoint) {
        var symbol = new PictureMarkerSymbol(
          this.folderUrl + "images/redmarker.png",
          40, 40
        );
        // symbol.setOffset(0, 12);
        return new Graphic(mapPoint, symbol);
      },

      _get3wordAddressWithLocator: function (mapPoint) {
        var geocoderUrl = this.config.geocoderUrl;
        var requestHandle = esriRequest({
          url: geocoderUrl,
          content: {
            f: "json"
          },
          handleAs: "json",
          callbackParamName: "callback"
        });
        requestHandle.then(function () {
          var locator = new Locator(geocoderUrl);
          locator.locationToAddress(mapPoint, 100, function (response) {
            $('#what3words').text("///" + response.address.Match_addr);
          });
        }, function (error) {
          console.log("Error: ", error);
          $('#what3words').text("Error" + error);
        });
        return;
      },

    });
  });