define('Controls-demo/PropertyGrid/SuggestTemplate/SuggestTemplate', [
   'UI/Base',
   'wml!Controls-demo/PropertyGrid/SuggestTemplate/SuggestTemplate',
   'Types/source',
   'Types/collection',
   'wml!Controls-demo/Input/Suggest/resources/SuggestTemplate'
], function (Base, template, source, collection) {
   'use strict';

   var sugTmpl = Base.Control.extend({
      _template: template,
      _viewValue: '',
      _source: null,

      _beforeMount: function (options) {
         this._source = new source.Memory({
            keyProperty: 'title',
            data: options.items
         });
         this.rs = new collection.RecordSet({
            keyProperty: 'title',
            rawData: options.items
         });

         this.selectedKey = options.value;
      },
      selectedKeyChanged: function (event, key) {
         this._notify('choose', [this.rs.getRecordById(key)]);
      }
   });

   sugTmpl._styles = [
      'Controls-demo/Input/resources/VdomInputs',
      'Controls-demo/Input/Suggest/Suggest'
   ];

   return sugTmpl;
});
