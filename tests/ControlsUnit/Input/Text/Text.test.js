define([
   'Core/core-instance',
   'Controls/input',
   'ControlsUnit/resources/ProxyCall',
   'UI/Utils'
], function (instance, inputMod, ProxyCall, UIUtils) {
   'use strict';

   describe('Controls/_input/Text', function () {
      var calls;

      function getBaseCtrl(props = {}) {
         const ctrl = new inputMod.Text({ ...inputMod.Text.defaultProps, ...props });

         ctrl.fieldNameRef.current = {
            focus: jest.fn(),
            getContainer: function () {
               return undefined;
            },
            setSelectionRange: function (start, end) {
               this.selectionStart = start;
               this.selectionEnd = end;
            }
         };
         return ctrl;
      }
      let ctrl;

      beforeEach(function () {
         calls = [];
         ctrl = getBaseCtrl();
      });

      it('The model belongs to the "Controls/input:TextViewModel" class.', function () {
         ctrl = getBaseCtrl({
            value: ''
         });

         expect(
            instance.instanceOfModule(ctrl._viewModel, 'Controls/input:TextViewModel') ||
               instance.instanceOfModule(ctrl._viewModel, 'Controls/_input/Text/ViewModel')
         ).toBe(true);
      });
      describe('Click event', function () {
         beforeEach(function () {
            ctrl = getBaseCtrl({
               value: 'test value'
            });
            ctrl._getActiveElement = function () {
               return {};
            };
            ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['selection'], calls, true);
         });
         it('The text is not selected.', function (done) {
            ctrl.props.selectOnClick = false;

            ctrl._mouseDownHandler();
            ctrl._focusInHandler({
               target: {}
            });
            ctrl._clickHandler();

            setTimeout(function () {
               expect(calls).toEqual([]);
               done();
            }, 100);
         });
         it('The text is selected.', function () {
            ctrl.props.selectOnClick = true;

            ctrl._getField().selectionStart = 5;
            ctrl._getField().selectionEnd = 5;
            ctrl._mouseDownHandler();
            ctrl._focusInHandler({
               target: {}
            });
            ctrl._clickHandler();

            expect(calls).toEqual([
               {
                  name: 'selection',
                  value: {
                     start: 0,
                     end: 10
                  }
               }
            ]);
         });
      });
      describe('Change event', function () {
         beforeEach(function () {
            ctrl = getBaseCtrl({
               value: ' test value '
            });
            ctrl.props.onInputCompleted = (value, displayValue) => {
               calls.push({
                  name: 'notify',
                  arguments: ['inputCompleted', [value, displayValue]]
               });
            };
            ctrl.props.onValueChanged = (value, displayValue) => {
               calls.push({
                  name: 'notify',
                  arguments: ['valueChanged', [value, displayValue]]
               });
            };
            ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['displayValue'], calls);
            ctrl._mounted = true;
         });
         it('Trim option equal false. Spaces on both sides are not trimmed.', function () {
            ctrl.props.trim = false;

            ctrl._notifyInputCompleted();

            expect(calls).toEqual([
               {
                  name: 'notify',
                  arguments: ['inputCompleted', [' test value ', ' test value ']]
               }
            ]);
         });
         it('Trim option equal true. Spaces on both sides are not trimmed.', function () {
            ctrl.props.trim = true;
            ctrl.shouldComponentUpdate({
               ...inputMod.Text.defaultProps,
               value: 'test value'
            });

            ctrl._notifyInputCompleted();

            expect(calls).toEqual([
               {
                  name: 'notify',
                  arguments: ['inputCompleted', ['test value', 'test value']]
               }
            ]);
         });
         it('Trim option equal true. Spaces on both sides are trimmed.', function () {
            ctrl.props.trim = true;

            ctrl._notifyInputCompleted();

            expect(calls).toEqual([
               {
                  name: 'displayValue',
                  value: 'test value'
               },
               {
                  name: 'notify',
                  arguments: ['valueChanged', ['test value', 'test value']]
               },
               {
                  name: 'notify',
                  arguments: ['inputCompleted', ['test value', 'test value']]
               }
            ]);
         });
      });
      describe('Validate the constraint option.', function () {
         var fn = UIUtils.Logger.error;
         beforeEach(function () {
            UIUtils.Logger.error = ProxyCall.apply(fn, 'error', calls, true);
         });
         afterEach(function () {
            UIUtils.Logger.error = fn;
         });
         it('[0-9]', function () {
            ctrl = getBaseCtrl({
               value: '',
               constraint: '[0-9]'
            });

            expect(calls.length).toEqual(0);
         });
         it('[A-Z]', function () {
            ctrl = getBaseCtrl({
               value: '',
               constraint: '[A-Z]'
            });

            expect(calls.length).toEqual(0);
         });
         it('[a-z]', function () {
            ctrl = getBaseCtrl({
               value: '',
               constraint: '[a-z]'
            });

            expect(calls.length).toEqual(0);
         });
         it('[-0-9,.\\n]', function () {
            ctrl = getBaseCtrl({
               value: '',
               constraint: '[-0-9,.\n]'
            });

            expect(calls.length).toEqual(0);
         });
         it('\\d', function () {
            ctrl = getBaseCtrl({
               value: '',
               constraint: '\\d'
            });

            expect(calls.length).toEqual(1);
         });
         it('[^\\\\/]', function () {
            ctrl = getBaseCtrl({
               value: '',
               constraint: '[^\\\\/]'
            });

            expect(calls.length).toEqual(0);
         });
         it('[^\\\\/]*', function () {
            ctrl = getBaseCtrl({
               value: '',
               constraint: '[^\\\\/]*'
            });

            expect(calls.length).toEqual(0);
         });
         it('use RegExp', function () {
            ctrl = getBaseCtrl({
               value: '',
               constraint: /([^ ]+)$/g
            });

            expect(calls.length).toEqual(0);
         });
      });
   });
});
