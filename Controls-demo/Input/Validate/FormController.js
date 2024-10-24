define('Controls-demo/Input/Validate/FormController', [
   'UI/Base',
   'wml!Controls-demo/Input/Validate/FormController',
   'Types/source',
   'Controls/validate',
   'Controls-demo/Input/Validate/Validator',
   'Controls-demo/Input/Validate/EqualEmailValidator'
], function (Base, template, source) {
   'use strict';
   var DEMO_ITEMS = [
      {
         id: 1,
         title: 'Мужской'
      },
      {
         id: 2,
         title: 'Женский'
      }
   ];
   var VdomDemoText = Base.Control.extend({
      _template: template,
      _value1: '',
      _switchState: false,
      _value2: 'Иван',
      _value5: '',
      _instruction: false,
      _value6: 'email@pochta',
      _valueReadOnly: '234567',
      _items: null,
      _sourceConfig: null,
      _sourceNumber: undefined,
      _placeholder: 'Input text',
      _beforeMount: function () {
         this._sourceConfig = new source.Memory({
            keyProperty: 'id',
            data: DEMO_ITEMS
         });
      },
      _selectedHandler: function (event, key) {
         this._sourceNumber = key;
      },
      _setValue: function (e, record) {
         this._example = record.get('example');
      },
      _eventHandler: function (e, value) {
         this._eventResult = e.type + ': ' + value;
      },
      _cleanValid: function () {
         this._children.formController.setValidationResult(null);
      },
      isTrue: function (args) {
         return args.value ? true : 'Обязательное поле';
      },
      isSelected: function (args) {
         // eslint-disable-next-line eqeqeq
         return args.value != undefined ? true : 'Обязательное поле';
      },
      _clickHandler: function () {
         var self = this;
         this._children.formController.submit().then(function (result) {
            if (!result.hasErrors) {
               self._children.Confirmation.open({
                  message: 'Валидация прошла успешно',
                  type: 'ok'
               });
            }
         });
      }
   });
   VdomDemoText._styles = [
      'Controls-demo/Input/Validate/ValidateInfobox',
      'Controls-demo/Input/resources/VdomInputs'
   ];

   return VdomDemoText;
});
