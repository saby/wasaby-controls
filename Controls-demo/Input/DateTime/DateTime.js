define('Controls-demo/Input/DateTime/DateTime', [
   'UI/Base',
   'wml!Controls-demo/Input/DateTime/DateTime'
], function (Base, template) {
   'use strict';

   var ModuleClass = Base.Control.extend({
      _template: template,
      _date: new Date(2017, 0, 1, 12, 15, 30, 123),
      _startTime: new Date(0, 0, 0, 10, 15, 0, 0),
      _endTime: new Date(0, 0, 0, 12, 40, 0, 0),
      _inputReadOnly: false,
      _extendedTimeFormatValue: new Date(2020, 0, 1, 23, 59, 59),

      _extendedTimeFormatInputCompleted: function (event, value) {
         this._extendedTimeFormatValue = value;
      },

      _masks: [
         {
            title: 'Main date and time formats',
            masks: [
               'DD.MM.YYYY',
               'DD.MM.YY',
               'DD.MM',
               'YYYY',
               'HH:mm',
               'HH:mm:ss'
            ]
         },
         {
            title: 'Additional date and time formats',
            masks: [
               'MM.YYYY' // ,
               // 'HH:MM:SS.UUU'
            ]
         },
         {
            title: 'Mixed date and time formats',
            masks: [
               'DD.MM HH:mm',
               'DD.MM HH:mm:ss',

               // 'DD.MM HH:mm:ss.UUU',
               'DD.MM.YY HH:mm',
               'DD.MM.YY HH:mm:ss',

               // 'DD.MM.YY HH:mm:ss.UUU',
               'DD.MM.YYYY HH:mm',
               'DD.MM.YYYY HH:mm:ss'

               // 'DD.MM.YYYY HH:mm:ss.UUU'
            ]
         }
      ]
   });
   ModuleClass._styles = ['Controls-demo/Input/DateTime/DateTime'];

   return ModuleClass;
});
