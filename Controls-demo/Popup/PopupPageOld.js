define('Controls-demo/Popup/PopupPageOld', [
   'UI/Base',
   'wml!Controls-demo/Popup/PopupPageOld',
   'Controls-demo/Popup/TestDialog'
], function (Base, template) {
   'use strict';

   var PopupPage = Base.Control.extend({
      _template: template,

      openDialog: function () {
         this._children.dialog.open({
            opener: this._children.dialogButton
         });
      },

      openModalDialog: function () {
         this._children.modalDialog.open({});
      },

      openSticky: function () {
         this._children.sticky.open({
            target: this._children.stickyButton._container,
            opener: this._children.stickyButton,
            templateOptions: {
               type: this._firstClick ? 'sticky' : 'dialog'
            }
         });
         this._firstClick = true;
      },

      openNotification: function () {
         this._children.notification.open({
            opener: this._children.notificationButton
         });
      },

      openStack: function () {
         this._children.stack.open({
            opener: this._children.stackButton
         });
      },
      _onResult: function (result) {
         if (result) {
            alert(result);
         }
      }
   });

   PopupPage._styles = ['Controls-demo/Popup/PopupPageOld'];

   return PopupPage;
});
