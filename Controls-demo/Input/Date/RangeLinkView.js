define('Controls-demo/Input/Date/RangeLinkView', [
   'UI/Base',
   'wml!Controls-demo/Input/Date/RangeLinkView'
], function (Base, template) {
   'use strict';

   var ModuleClass = Base.Control.extend({
      _template: template,
      _startValue: new Date(2018, 0, 1),
      _endValue: new Date(2018, 0, 31),
      _captionFormatter: function () {
         return 'Custom range format';
      }
   });

   return ModuleClass;
});
