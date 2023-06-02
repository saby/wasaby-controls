define('Controls-demo/Menu/Control/SelectorTemplate/StackTemplate', [
   'UI/Base',
   'wml!Controls-demo/Menu/Control/SelectorTemplate/StackTemplate',
   'Types/source'
], function (Base, template, source) {
   'use strict';

   var DropdownDemo = Base.Control.extend({
      _template: template,
      _selectionChanged: false,

      _beforeMount: function (options) {
         this._source = new source.Memory({
            idProperty: 'key',
            data: options.items,
            filter: function (item, queryFilter) {
               if (queryFilter.selection) {
                  var itemId = String(item.get('key'));
                  var marked = queryFilter.selection.get('marked');
                  var isSelected = false;
                  marked.forEach(function (selectedId) {
                     if (String(selectedId) === itemId) {
                        isSelected = true;
                     }
                  });
                  return isSelected;
               }
               return true;
            }
         });

         this._filter = {};
      },

      _selectedKeysChanged: function () {
         this._selectionChanged = true;
      },

      _selectComplete: function () {
         this._children.SelectorController._selectComplete();
      }
   });
   DropdownDemo._styles = [
      'Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector'
   ];

   return DropdownDemo;
});
