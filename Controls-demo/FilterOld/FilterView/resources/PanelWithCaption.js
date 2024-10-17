define('Controls-demo/FilterOld/FilterView/resources/PanelWithCaption', [
   'UI/Base',
   'wml!Controls-demo/FilterOld/FilterView/resources/Panel',

   'wml!Controls-demo/FilterOld/FilterView/resources/itemTemplateMainBlock',
   'wml!Controls-demo/FilterOld/FilterView/resources/additionalTemplateItems',
   'wml!Controls-demo/FilterOld/FilterView/resources/topTemplate'
], function (Base, template) {
   'use strict';
   var FilterViewPanel = Base.Control.extend({
      _template: template,
      _limitWidth: true,
      _caption: 'Long caption for testing Long caption for testing',
      _topTemplate: 'wml!Controls-demo/FilterOld/FilterView/resources/topTemplate'
   });

   return FilterViewPanel;
});
