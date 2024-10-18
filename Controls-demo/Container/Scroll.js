define('Controls-demo/Container/Scroll', [
   'UI/Base',
   'wml!Controls-demo/Container/Scroll'
], function (Base, template) {
   var ModuleClass = Base.Control.extend({
      _template: template,
      _pagingVisible: true,
      _scrollbarVisible: true,
      _shadowVisible: true,
      _numberOfRecords: 50,
      _scrollStyleSource: null,

      get shadowVisibility() {
         return this._shadowVisible ? 'auto' : 'hidden';
      }
   });

   ModuleClass._styles = ['Controls-demo/Container/Scroll'];

   return ModuleClass;
});
