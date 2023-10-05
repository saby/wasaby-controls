define('Controls-Deprecated-demo/Popup/resources/MyTextBox', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-Deprecated-demo/Popup/resources/MyTextBox/MyTextBox',
   'SBIS3.CONTROLS/TextBox'
], function (CompoundControl, dotTplFn) {
   var moduleClass = CompoundControl.extend({
      _dotTplFn: dotTplFn,
      $protected: {
         _options: {}
      },
      init: function () {
         moduleClass.superclass.init.call(this);
      }
   });
   moduleClass._styles = ['Controls-Deprecated-demo/Popup/resources/MyTextBox/MyTextBox'];

   return moduleClass;
});