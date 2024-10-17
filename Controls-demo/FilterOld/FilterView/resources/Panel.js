define('Controls-demo/FilterOld/FilterView/resources/Panel', [
   'UI/Base',
   'wml!Controls-demo/FilterOld/FilterView/resources/Panel',

   'wml!Controls-demo/FilterOld/FilterView/resources/itemTemplateMainBlock',
   'wml!Controls-demo/FilterOld/FilterView/resources/additionalTemplateItems'
], function (Base, template) {
   'use strict';
   var FilterViewPanel = Base.Control.extend({
      _template: template,
      _limitWidth: true
   });

   return FilterViewPanel;
});
