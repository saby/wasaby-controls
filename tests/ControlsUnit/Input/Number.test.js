define(['Core/core-instance', 'Controls/input', 'ControlsUnit/resources/ProxyCall'], function (
   instance,
   inputMod,
   ProxyCall
) {
   'use strict';

   describe('Controls/_input/Number', function () {
      var calls;

      function getBaseCtrl(props = {}) {
         const ctrl = new inputMod.Number({ ...inputMod.Number.defaultProps, ...props });
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

      let ctrl;

      beforeEach(function () {
         calls = [];
         ctrl = getBaseCtrl();
      });

      it('The model belongs to the "Controls/_input/Number/ViewModel" class.', function () {
         ctrl = getBaseCtrl({
            value: 0
         });
         expect(
            instance.instanceOfModule(ctrl._viewModel, 'Controls/_input/Number/ViewModel')
         ).toBe(true);
      });
      describe('showEmptyDecimals', function () {
         it('showEmptyDecimals=true, readOnly=false', function () {
            ctrl = getBaseCtrl({
               value: '1.10000',
               showEmptyDecimals: true
            });
            expect('1.10000').toEqual(ctrl._viewModel.displayValue);
         });
         it('showEmptyDecimals=false, readOnly=false', function () {
            ctrl = getBaseCtrl({
               value: '1.10000',
               showEmptyDecimals: false,
               readOnly: false
            });
            expect('1.10000').toEqual(ctrl._viewModel.displayValue);
         });
         it('showEmptyDecimals=false, readOnly=true', function () {
            ctrl = getBaseCtrl({
               value: '1.10000',
               showEmptyDecimals: false,
               readOnly: true
            });
            expect('1.1').toEqual(ctrl._viewModel.displayValue);
         });
      });
      describe('Change event', function () {
         beforeEach(function () {
            ctrl = getBaseCtrl({
               value: 0
            });
            ctrl._viewModel = ProxyCall.set(ctrl._viewModel, ['displayValue'], calls);
         });
         it('ShowEmptyDecimals option equal true. Trailing zeros are not trimmed.', function () {
            ctrl._options.showEmptyDecimals = true;

            ctrl._notifyInputCompleted();

            expect(calls).toEqual([
               {
                  name: 'notify',
                  arguments: ['inputCompleted', [0, '0']]
               }
            ]);
         });
      });
   });
});
