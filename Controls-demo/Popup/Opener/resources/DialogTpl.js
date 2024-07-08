define('Controls-demo/Popup/Opener/resources/DialogTpl', [
   'UI/Base',
   'wml!Controls-demo/Popup/Opener/resources/DialogTpl'
], function (Base, template) {
   'use strict';

   var PopupPage = Base.Control.extend({
      _template: template,
      _close: function () {
         this._notify('close', [], { bubbling: true });
      }
   });
   PopupPage._styles = ['Controls-demo/Popup/Opener/resources/StackHeader'];

   return PopupPage;
});
