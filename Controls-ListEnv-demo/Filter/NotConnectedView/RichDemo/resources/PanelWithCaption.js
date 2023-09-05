define('Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/PanelWithCaption', [
   'UI/Base',
   'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/Panel',

   'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/itemTemplateMainBlock',
   'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/additionalTemplateItems',
   'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/topTemplate'
], function (Base, template) {
   'use strict';
   var FilterViewPanel = Base.Control.extend({
      _template: template,
      _limitWidth: true,
      _caption: 'Long caption for testing Long caption for testing',
      _topTemplate:
         'wml!Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/resources/topTemplate'
   });

   return FilterViewPanel;
});
