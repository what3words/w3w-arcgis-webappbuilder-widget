define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/_base/lang',
    'dojo/on',
    'esri/symbols/PictureMarkerSymbol',
    'esri/layers/GraphicsLayer',
    'esri/graphic',
    'esri/tasks/locator',
    'esri/request',
    'esri/geometry/webMercatorUtils',
    'jimu/loaderplugins/jquery-loader!https://code.jquery.com/jquery-git1.min.js'
  ],
  function (declare, BaseWidget, lang, on, PictureMarkerSymbol, GraphicsLayer,
    Graphic, Locator, esriRequest, webMercatorUtils, $) {
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
        $('#w3wtest').text("Click map for 3 word address");
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
        var params = {
          location: evt.mapPoint
        };
        // this._get3wordAddress(evt.mapPoint);
        this._get3wordAddressWithLocator(params);
      },

      _getMarkerGraphic: function (mapPoint) {
        var symbol = new PictureMarkerSymbol(
          this.folderUrl + "images/w3wmarker.png",
          52, 65
        );
        symbol.setOffset(0, 33);
        return new Graphic(mapPoint, symbol);
      },

      _get3wordAddressWithLocator: function (params) {
        var key = this.config.apiKey;
        var username = this.config.username;
        var url = "https://arcgis.what3words.com/v2/arcgis/tokens";
        console.log("request");
        esriRequest(url, {
          method: "get",
          query: {
            f: "json",
            username: username,
            password: key,
            expiration: 10
          }
        }).then(function (response) {
          console.log(response);
          var locator = new Locator("https://arcgis.what3words.com/v2/arcgis/rest/services/what3words_EN_English/GeocodeServer?token=" + response.data.token);
          console.log('locatorURL:' + locator);

          locator.locationToAddress(params,100)
            .then(function (response) {
              // var address = response.address;
              console.log("address: " + response);
            }).catch(function (error) {
              console.log("error: " + error);
            })
          // return;
        });
      }

      // _get3wordAddress: function(mapPoint) {
      //   var key = this.config.apiKey;
      //   var p = webMercatorUtils.webMercatorToGeographic(mapPoint);

      //   var data = {
      //     'key': key,
      //     'language': this.config.lang,
      //     'coordinates': p.y + ',' + p.x
      //   };

      //   $.get('https://api.what3words.com/v3/convert-to-3wa', data, function(response) {
      //     if (response.error) {
      //       console.log(response);
      //       if (response.message) {
      //         $('#what3words').text(response.message);
      //       }
      //     } else {
      //       var w3w = response.words;
      //       $('#what3words').text(w3w);
      //     }
      //   });
      //   return ;
      // }

    });
  });