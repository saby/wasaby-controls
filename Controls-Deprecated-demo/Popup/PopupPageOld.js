define('Controls-Deprecated-demo/Popup/PopupPageOld', [
   'UI/Base',
   'wml!Controls-Deprecated-demo/Popup/PopupPageOld',
   'SBIS3.CONTROLS/Action/List/OpenEditDialog',
], function (Base, template, OpenEditDialog) {
   'use strict';

   var PopupPage = Base.Control.extend({
      _template: template,
      openOldTemplate: function () {
         this._children.openOldTemplate.open({
            opener: this._children.stackButton2,
            isCompoundTemplate: true
         });
      },
      openFloatArea: function (event, tplName) {
         require([tplName], function () {
            new OpenEditDialog().execute({
               template: tplName,
               mode: 'floatArea',
               dialogOptions: {
                  isStack: true
               }
            });
         });
      },
      _onResult: function (result) {
         if (result) {
            alert(result);
         }
      }
   });

   PopupPage._styles = ['Controls-Deprecated-demo/Popup/PopupPageOld'];

   return PopupPage;
});
