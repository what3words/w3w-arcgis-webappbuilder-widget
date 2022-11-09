define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/_base/lang',
    'dojo/on',
    'esri/symbols/PictureMarkerSymbol',
    'esri/layers/GraphicsLayer',
    'esri/graphic',
    'esri/tasks/locator',
    'esri/request',
    'esri/InfoTemplate',
    'dijit/layout/ContentPane',
    'jimu/loaderplugins/jquery-loader!https://code.jquery.com/jquery-git1.min.js'
  ],
  function (declare, BaseWidget, lang, on, PictureMarkerSymbol, GraphicsLayer,
    Graphic, Locator, esriRequest, InfoTemplate, ContentPane, $) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {

      baseClass: 'jimu-widget-w3w',

      postCreate: function () {
        this.inherited(arguments);
        console.log('postCreate');
        this.own(on(this.map, "click", lang.hitch(this, this.onMapClick)));
      },

      startup: function () {
        console.log('startup');
        this.inherited(arguments);
        // this.mapIdNode.innerHTML = 'map id:' + this.map.id;
        this._initContentPane();
      },

      onOpen: function () {
        console.log('onOpen');
        this.enabled = true;
        this.widgetManager.activateWidget(this);
      },

      _initContentPane: function () {
        this.contentPane = new ContentPane({
          content: "Click any location on the map to see its what3words address",
        }, this.inputcoordcontainer);
        this.contentPane.startup();
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
          this.folderUrl + "images/redmarker.png",
          30, 30
        );
        // symbol.setOffset(0, 12);
        return new Graphic(mapPoint, symbol, mapPoint, infoTemplate);
      },

      copyToClipboard: function(containerid) {
        var range = document.createRange();
        range.selectNode(containerid);
        window.getSelection().removeAllRanges(); 
        window.getSelection().addRange(range); 
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
      },

      _get3wordAddressWithLocator: function (mapPoint, graphic) {
        var map = this.map;
        var geocoderUrl = this.config.geocoderUrl;
        var locator = new Locator(geocoderUrl);
        var zoomIt = Number(this.config.zoomLvlconfig);
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
            // console.log(response)
            // clear graphics and infoWindow
            map.graphics.clear();
            map.infoWindow.hide();
            // add graphics and infoWindow
            var content = "<b>what3words Address:</b> ///" + response.address.what3words + "</br></br>" + "<b>Coordinates:</b> " + response.address.Y + ", " + response.address.X + "</br></br>" + "<b>wkid</b>: " + response.location.spatialReference.wkid;
            $('.w3winputcontainer').html(content);

            map.graphics.add(graphic);
            map.infoWindow.setTitle("Location");
            map.infoWindow.setContent(content);
            map.infoWindow.resize(250, 110);
            map.infoWindow.show(mapPoint, map.getInfoWindowAnchor(mapPoint));
            map.centerAndZoom(mapPoint, zoomIt);
          });
        }, function (error) {
          console.log("Error: ", error);
          $('#what3words').text("Error" + error);
        });
        //When the popup is closed remove the graphic
				map.infoWindow.on("hide", function () {
					map.graphics.clear();
          $('.w3winputcontainer').text("Click any location on the map to see its what3words address");
				});
        return;
      },

      onClose: function () {
        console.log('onClose');
        this.enabled = false;
        this.map.graphics.clear();
        this.map.infoWindow.hide();
        $('.w3winputcontainer').text("Click any location on the map to see its what3words address");
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

    });
  });