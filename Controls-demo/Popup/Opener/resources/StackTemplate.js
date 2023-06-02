define('Controls-demo/Popup/Opener/resources/StackTemplate', [
   'UI/Base',
   'wml!Controls-demo/Popup/Opener/resources/StackTemplate'
], function (Base, template) {
   'use strict';

   var PopupPage = Base.Control.extend({
      _template: template,
      _midOfMinMax: null,

      _beforeMount: function (options) {
         this._midOfMinMax =
            (options.stackMinWidth + options.stackMaxWidth) / 2;
      },

      _close: function () {
         this._notify('close', [], { bubbling: true });
      }
   });

   return PopupPage;
});
