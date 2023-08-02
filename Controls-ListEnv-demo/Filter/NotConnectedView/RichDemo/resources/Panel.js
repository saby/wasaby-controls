define('Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/Panel', [
   'UI/Base',
   'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/Panel',

   'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/itemTemplateMainBlock',
   'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/additionalTemplateItems'
], function (Base, template) {
   'use strict';
   var FilterViewPanel = Base.Control.extend({
      _template: template,
      _limitWidth: true
   });

   return FilterViewPanel;
});
