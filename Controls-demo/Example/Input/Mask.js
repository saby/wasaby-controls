define('Controls-demo/Example/Input/Mask', [
   'UI/Base',
   'Controls-demo/Example/Input/SetValueMixin',
   'wml!Controls-demo/Example/Input/Mask/Mask',

   'Controls/input',
   'Controls-demo/Example/resource/BaseDemoInput'
], function (BaseMod, SetValueMixin, template) {
   'use strict';

   var ModuleClass = BaseMod.Control.extend([SetValueMixin], {
      _template: template,

      _mobilePhoneValue: ''
   });

   ModuleClass._styles = ['Controls-demo/Example/resource/Base'];

   return ModuleClass;
});
