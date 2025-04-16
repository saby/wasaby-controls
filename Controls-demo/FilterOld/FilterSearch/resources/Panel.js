/**
 * Created by am.gerasimov on 17.07.2018.
 */
define('Controls-demo/FilterOld/FilterSearch/resources/Panel', [
   'UI/Base',
   'wml!Controls-demo/FilterOld/FilterSearch/resources/Panel',
   'Controls/dropdown',
   'wml!Controls-demo/FilterOld/FilterSearch/resources/itemTemplate'
], function (Base, tempalte) {
   'use strict';

   return Base.Control.extend({
      _template: tempalte
   });
});
