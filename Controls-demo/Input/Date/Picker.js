define('Controls-demo/Input/Date/Picker', [
   'UI/Base',
   'Controls-demo/Date/MonthListSource',
   'wml!Controls-demo/Input/Date/Picker',
   'wml!Controls-demo/Date/MonthListDay'
], function (Base, MonthListSource, template, dayTemplate) {
   'use strict';

   var ModuleClass = Base.Control.extend({
      _template: template,
      _dayTemplate: dayTemplate,
      _date: new Date(2017, 0, 1, 12, 15, 30, 123),
      _emptyDate: null,

      _masks: ['DD.MM.YYYY', 'DD.MM.YY'],

      _source: null,

      _beforeMount: function () {
         this._source = new MonthListSource();
      }
   });
   ModuleClass._styles = ['Controls-demo/Input/Date/Picker'];

   return ModuleClass;
});
