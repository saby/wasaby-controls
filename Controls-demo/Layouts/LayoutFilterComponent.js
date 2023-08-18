define('Controls-demo/Layouts/LayoutFilterComponent', [
   'Env/Env',
   'UI/Base',
   'wml!Controls-demo/Layouts/LayoutFilterComponent/LayoutFilterComponent',
   'Controls/toggle'
], function (Env, Base, template) {
   'use strict';

   var ModuleClass = Base.Control.extend({
      _template: template,
      _switchValue: false,

      constructor: function (cfg, context) {
         ModuleClass.superclass.constructor.call(this, cfg, context);
         Env.IoC.resolve('ILogger').info(cfg);
      },

      _switchValueHandler: function () {
         var filter = {};
         if (this._switchValue) {
            filter.title = 'Sasha';
         }
         this._notify('filterChanged', [filter], { bubbling: true });
      }
   });
   return ModuleClass;
});
