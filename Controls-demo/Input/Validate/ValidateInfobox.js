define('Controls-demo/Input/Validate/ValidateInfobox', [
   'UI/Base',
   'wml!Controls-demo/Input/Validate/ValidateInfobox',
   'Controls/validate',
   'Controls-demo/Input/Validate/Validator'
], function (Base, template) {
   'use strict';
   var VdomDemoText = Base.Control.extend({
      _template: template,
      _valueEmail: '',
      _value: '',
      _value2: 'is required',
      _valueInn: null,
      _value4: '',
      _value5: '',
      _value6: '',
      _valueReadOnly: '234567',
      _items: null,
      _placeholder: 'Input text',
      _setValue: function (e, record) {
         this._example = record.get('example');
      },
      _openPanel: function () {
         this._children.opener.open();
      },
      _eventHandler: function (e, value) {
         this._eventResult = e.type + ': ' + value;
      },
      _clickHandler: function () {
         this._children.formController.submit();
      }
   });
   VdomDemoText._styles = [
      'Controls-demo/Input/Validate/ValidateInfobox',
      'Controls-demo/Input/resources/VdomInputs'
   ];

   return VdomDemoText;
});
