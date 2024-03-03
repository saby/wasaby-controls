define('Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector', [
   'UI/Base',
   'wml!Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector',
   'Controls-demo/Input/Lookup/LookupData',
   'Types/source',
   'Controls-demo/Utils/MemorySourceFilter',
   'Controls/list'
], function (Base, template, lookupData, source, MemorySourceFilter) {
   'use strict';
   var FlatListSelector = Base.Control.extend({
      _template: template,
      _keyProperty: 'id',
      _selectionChanged: false,

      _beforeMount: function (newOptions) {
         var keyProperty = this._keyProperty;

         this._closeSelectorBind = this._closeSelector.bind(this);
         this._source =
            newOptions.source ||
            new source.Memory({
               data: lookupData.names,
               filter: function (item, queryFilter) {
                  var selectionFilterFn = function (innerItem, filter) {
                     var isSelected = false,
                        itemId = innerItem.get(keyProperty);

                     filter.selection.get('marked').forEach(function (selectedId) {
                        if (
                           // eslint-disable-next-line eqeqeq
                           selectedId == itemId ||
                           (selectedId === null &&
                              filter.selection.get('excluded').indexOf(itemId) === -1)
                        ) {
                           isSelected = true;
                        }
                     });

                     return isSelected;
                  };

                  return queryFilter.selection
                     ? selectionFilterFn(item, queryFilter)
                     : MemorySourceFilter()(item, queryFilter);
               },

               keyProperty: keyProperty
            });
      },

      _closeSelector: function () {
         this._children.SelectorController._selectComplete();
      },

      _selectedKeysChanged: function () {
         this._selectionChanged = true;
      }
   });

   FlatListSelector.getDefaultOptions = function () {
      return {
         filter: {},
         multiSelect: false
      };
   };

   FlatListSelector._styles = ['Controls-demo/Input/Lookup/FlatListSelector/FlatListSelector'];

   return FlatListSelector;
});
