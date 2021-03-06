define('Controls-demo/Lookup/FlatListSelectorWithTabs/FlatListSelectorWithTabs', [
   'UI/Base',
   'wml!Controls-demo/Lookup/FlatListSelectorWithTabs/FlatListSelectorWithTabs',
   'Controls-demo/Lookup/DemoHelpers/DataCatalog',
   'Types/source',
], function(Base, template, lookupData, source) {
   'use strict';
   var FlatListSelector = Base.Control.extend({
      _template: template,
      _keyProperty: 'id',
      _selectionChanged: false,
      _selectedTab: 0,

      _beforeMount: function(newOptions) {
         this._tabSource = new source.Memory({
            data: [
               {id: 'Companies', title: 'Companies'},
               {id: 'Departments', title: 'Departments'}
            ],
            idProperty: 'id'
         });
         this._selectedTab = newOptions.selectedTab || 'Companies';
         this._closeSelectorBind = this._closeSelector.bind(this);
      },

      _closeSelector: function() {
         this._selectComplete = true;
      },

      _selectedKeysChanged: function() {
         this._selectionChanged = true;
      }
   });


   FlatListSelector.getDefaultOptions = function() {
      return {
         filter: {}
      };
   };

   Object.defineProperty(FlatListSelector, 'defaultProps', {
      enumerable: true,
      configurable: true,

      get: function() {
         return FlatListSelector.getDefaultOptions();
      }
   });

   FlatListSelector._styles = ['Controls-demo/Controls-demo', 'Controls-demo/Lookup/Index'];

   return FlatListSelector;
});
