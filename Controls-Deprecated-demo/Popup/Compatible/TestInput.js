define('Controls-Deprecated-demo/Popup/Compatible/TestInput', [
   'Lib/Control/CompoundControl/CompoundControl',
   'wml!Controls-Deprecated-demo/Popup/Compatible/TestInput'
], function (CompoundControl, dotTplFn) {
   var TestInput = CompoundControl.extend({
      _dotTplFn: dotTplFn
   });

   return TestInput;
});
