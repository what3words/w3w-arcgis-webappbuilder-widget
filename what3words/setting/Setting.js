define([
  'dojo/_base/declare',
  'jimu/BaseWidgetSetting',
  'dijit/_WidgetsInTemplateMixin'
],
function(declare, BaseWidgetSetting, _WidgetsInTemplateMixin) {

  return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-w3w-setting',

    startup: function(){
      this.inherited(arguments);
      this.setConfig(this.config);
    },

    setConfig: function(config){
      this.config = config;
      this.geocoderUrlNode.set('value',this.config.geocoderUrl);
      this.zoomLvl.set('value', this.config.zoomLvlconfig);
    },

    getConfig: function(){
      this.config.geocoderUrl = this.geocoderUrlNode.get('value');
      this.config.zoomLvlconfig = this.zoomLvl.get('value');
      return this.config;
    }
  });
});
