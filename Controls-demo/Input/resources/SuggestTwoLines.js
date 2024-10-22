define('Controls-demo/Input/resources/SuggestTwoLines', [
   'UI/Base',
   'wml!Controls-demo/Input/resources/SuggestTwoLines',
   'Types/source'
], function (BaseMod, template, source) {
   'use strict';

   var SuggestTwoLines = BaseMod.Control.extend({
      _template: template,
      _changeValueHandler: function (event, tmp) {
         if (tmp == null) {
            this._notify('suggestValueChanged', undefined);
         } else {
            this._notify('suggestValueChanged', [tmp]);
         }
      },
      _suggestSource: function () {
         return new source.Memory({
            keyProperty: 'title',
            data: this._options.source,
            filter: function (record, filter) {
               if (record.get('title').indexOf(filter.title) !== -1) {
                  return true;
               }
            }
         });
      }
   });
   SuggestTwoLines._styles = ['Controls-demo/Input/resources/VdomInputs'];

   return SuggestTwoLines;
});
