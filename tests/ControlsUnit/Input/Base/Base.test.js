define([
   'Env/Event',
   'Env/Env',
   'Controls/_input/Base/ViewModel',
   'Controls/input',
   'ControlsUnit/resources/ProxyCall',
   'ControlsUnit/Input/Base/InputUtility',
   'ControlsUnit/resources/TemplateUtil',
   'Vdom/Vdom'
], function (EnvEvent, Env, BaseViewModelModule, inputMod, ProxyCall) {
   var calls;
   function getBaseCtrl(props = {}) {
      const ctrl = new inputMod.Base({ ...inputMod.Base.defaultProps, ...props });
      ctrl._notify = ProxyCall.apply(ctrl._notify, 'notify', calls, true);
      ctrl.props.onInputCompleted = (value, displayValue) => {
         calls.push({
            name: 'notify',
            arguments: ['inputCompleted', [value, displayValue]]
         });
      };

      var beforeMount = ctrl._beforeMount;

      ctrl._beforeMount = function () {
         beforeMount.apply(this, arguments);

         ctrl.fieldNameRef.current = {
            _mounted: true,
            selectionStart: 0,
            selectionEnd: 0,
            value: '',
            focus: jest.fn(),
            getContainer: function () {
               return undefined;
            },
            setSelectionRange: function (start, end) {
               this.selectionStart = start;
               this.selectionEnd = end;
            }
         };
      };
      ctrl._beforeMount();
      return ctrl;
   }

   describe('Controls/_input/Base', function () {
      var ctrl = getBaseCtrl();
      ctrl._beforeMount({});

      beforeEach(function () {
         calls = [];
         ctrl = getBaseCtrl();
      });

      it('The model belongs to the "Controls/input:BaseViewModel" class.', function () {
         ctrl._beforeMount({
            value: ''
         });
         const baseModel = BaseViewModelModule.ViewModel;
         expect(ctrl._viewModel instanceof baseModel).toBe(true);
      });
      it('ViewModel _isEmptyValue', function () {
         const isEmptyValue = inputMod.NewBaseViewModel.prototype._isEmptyValue;

         let isEmpty = isEmptyValue('');
         expect(isEmpty).toEqual(true);

         isEmpty = isEmptyValue(null);
         expect(isEmpty).toEqual(true);

         isEmpty = isEmptyValue('123');
         expect(isEmpty).toEqual(false);

         isEmpty = isEmptyValue(123);
         expect(isEmpty).toEqual(false);
      });

      it('ViewModel setDisplayValue', function () {
         let value = '';
         inputMod.NewBaseViewModel.prototype._convertToDisplayValue = () => {
            return '123';
         };
         inputMod.NewBaseViewModel.prototype._convertToValue = () => {
            return value;
         };
         const model = new inputMod.NewBaseViewModel({}, '');
         model._emptyValue = null;
         model._setDisplayValue(value);
         expect(model._value).toEqual(null);

         value = '123';
         model._setDisplayValue(value);
         expect(model._value).toEqual('123');

         model._emptyValue = '';
         value = null;
         model._setDisplayValue(value);
         expect(model._value).toEqual('');
      });
      it('Pass null as the value option.', function () {
         ctrl._getActiveElement = function () {
            return ctrl._getField();
         };
         ctrl._beforeMount({
            value: null
         });

         expect(ctrl._viewModel.value).toEqual(null);
         expect(ctrl._viewModel.displayValue).toEqual('');
         expect(ctrl._viewModel.selection.start).toEqual(0);
         expect(ctrl._viewModel.selection.end).toEqual(0);
      });

      describe('The _fieldName property value equal the name option value when mounting the control, if it defined.', function () {
         it('No.', function () {
            ctrl = getBaseCtrl({
               value: '',
               autoComplete: true
            });

            expect(ctrl._fieldName.includes('input')).toBe(true);
         });
         it('Yes.', function () {
            ctrl = getBaseCtrl({
               value: '',
               name: 'test name',
               autoComplete: true
            });

            expect(ctrl._fieldName).toEqual('test name');
         });
      });
      describe('Changing options in model.', function () {
         beforeEach(function () {
            ctrl._getViewModelOptions = function (options) {
               return {
                  option: options.optionModel
               };
            };
            ctrl = getBaseCtrl({
               value: '',
               optionModel: 'test'
            });
            ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['options', 'value'], calls, true);
         });
         it('No change.', function () {
            ctrl._beforeUpdate({
               value: '',
               optionModel: 'test'
            });

            expect(calls.length).toEqual(0);
         });
      });
      describe('MouseEnter', function () {
         describe('Tooltip', function () {
            beforeEach(function () {
               ctrl = getBaseCtrl({
                  value: 'test value'
               });
               ctrl.props.tooltip = 'test tooltip';
            });
            it('The value fits in the field.', function () {
               ctrl._hasHorizontalScroll = function () {
                  return false;
               };
               ctrl._getField().hasHorizontalScroll = function () {
                  return false;
               };

               ctrl._mouseEnterHandler();

               expect(ctrl._tooltip).toEqual('test tooltip');
            });
            it('The value no fits in the field.', function () {
               ctrl._hasHorizontalScroll = function () {
                  return true;
               };
               ctrl._getField().hasHorizontalScroll = function () {
                  return true;
               };

               ctrl._mouseEnterHandler();

               expect(ctrl._tooltip).toEqual('test value');
            });
            it('The value fits in the field is read mode.', function () {
               ctrl.props.readOnly = true;
               ctrl._hasHorizontalScroll = function () {
                  return false;
               };
               ctrl._getField().hasHorizontalScroll = function () {
                  return false;
               };

               ctrl._mouseEnterHandler();

               expect(ctrl._tooltip).toEqual('test tooltip');
            });
            it('The value no fits in the field is read mode.', function () {
               ctrl.props.readOnly = true;
               ctrl._hasHorizontalScroll = function () {
                  return true;
               };
               ctrl._getField().hasHorizontalScroll = function () {
                  return true;
               };

               ctrl._mouseEnterHandler();

               expect(ctrl._tooltip).toEqual('test value');
            });
         });
      });
      describe('Change event', function () {
         it('Notification when input is complete.', function () {
            ctrl = getBaseCtrl({
               value: 'test value'
            });
            ctrl._notifyInputCompleted();

            expect(calls).toEqual([
               {
                  name: 'notify',
                  arguments: ['inputCompleted', ['test value', 'test value']]
               }
            ]);

            ctrl.shouldComponentUpdate({
               value: ''
            });
            ctrl._notifyInputCompleted();

            expect(calls).toEqual([
               {
                  name: 'notify',
                  arguments: ['inputCompleted', ['test value', 'test value']]
               },
               {
                  name: 'notify',
                  arguments: ['inputCompleted', ['', '']]
               }
            ]);
         });
      });
      describe('Click event on the placeholder.', function () {
         beforeEach(function () {
            ctrl = getBaseCtrl({
               value: ''
            });
            ctrl.props.onFocus = () => {
               calls.push({
                  name: 'focus',
                  arguments: []
               });
            };
            ctrl._getField().focus = ProxyCall.apply(ctrl._getField().focus, 'focus', calls, true);
         });
         it('Not not focus the field through a script in not IE browser', function () {
            ctrl._ieVersion = null;

            ctrl._placeholderClickHandler();

            expect(calls.length).toEqual(0);
         });

         it('Focus the field through a script in ie browser version 10.', function () {
            ctrl._ieVersion = 10;

            ctrl._placeholderClickHandler();

            expect(calls).toEqual([
               {
                  name: 'focus',
                  arguments: []
               }
            ]);
         });
         it('Not focus the field through a script in ie browser version 12.', function () {
            ctrl._ieVersion = 12;

            ctrl._placeholderClickHandler();

            expect(calls.length).toEqual(0);
         });
      });
      describe('hidePlaceholder', function () {
         it('The autoComplete equal "on".', function () {
            ctrl._hidePlaceholderUsingCSS = false;
            ctrl = getBaseCtrl({
               value: '',
               autoComplete: 'on'
            });
            expect(ctrl._placeholderVisibility).toEqual('hidden');
            ctrl.props.placeholderVisibility = 'empty';
            ctrl.componentDidMount();
            expect(ctrl._placeholderVisibility).toEqual('empty');
         });
         it('The autoComplete equal "off".', function () {
            ctrl._hidePlaceholderUsingCSS = false;
            ctrl = getBaseCtrl({
               value: '',
               autoComplete: 'off',
               placeholderVisibility: 'empty'
            });
            expect(ctrl._placeholderVisibility).toEqual('empty');
            var options = {
               placeholderVisibility: 'empty'
            };
            ctrl._afterMount(options);
            expect(ctrl._placeholderVisibility).toEqual('empty');
         });
      });
   });
});
