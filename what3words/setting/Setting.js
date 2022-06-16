define([
  'dojo/_base/declare',
  'jimu/BaseWidgetSetting'
],
function(declare, BaseWidgetSetting) {

  return declare([BaseWidgetSetting], {
    baseClass: 'jimu-widget-w3w-setting',

    postCreate: function(){
      //the config object is passed in
      this.setConfig(this.config);
    },

    setConfig: function(config){
      this.geocoderUrlNode.value = config.geocoderUrl;
      this.langNode.value = config.defaultLang;
    },

    getConfig: function(){
      //WAB will get config object through this method
      return {
        geocoderUrl: this.geocoderUrlNode.value,
        language: this.langNode.value
      };
    }
  });
});
