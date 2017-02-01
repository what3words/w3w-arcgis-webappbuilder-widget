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
      this.apiKeyNode.value = config.apiKey;
      this.langNode.value = config.defaultLang;
    },

    getConfig: function(){
      //WAB will get config object through this method
      return {
        apiKey: this.apiKeyNode.value,
        lang: this.langNode.value
      };
    }
  });
});
