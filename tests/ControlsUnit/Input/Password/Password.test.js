define(['Controls/input', 'Controls/_input/Password/ViewModel'], function (input, ViewModelModule) {
   describe('Controls/_input/Password', function () {
      function getBaseCtrl(props = {}) {
         const ctrl = new input.Password({ ...input.Password.defaultProps, ...props });

         ctrl.fieldNameRef.current = {
            getContainer: function () {
               return undefined;
            },
            _mounted: true,
            focus: jest.fn(),
            setSelectionRange: function (start, end) {
               this.selectionStart = start;
               this.selectionEnd = end;
            }
         };

         return ctrl;
      }

      let ctrl;

      beforeEach(function () {
         ctrl = getBaseCtrl();
      });

      it('The model belongs to the "Controls/_input/Password/ViewModel" class.', function () {
         ctrl = getBaseCtrl({
            value: ''
         });
         const viewModel = ViewModelModule.ViewModel;
         expect(ctrl._viewModel instanceof viewModel).toBe(true);
      });

      describe('The type attribute of the field when mounting.', function () {
         it('Auto-completion is disabled.', function () {
            ctrl = getBaseCtrl({
               value: '',
               autoComplete: false
            });

            expect(ctrl._type).toEqual('text');
         });
         it('Auto-completion is enabled.', function () {
            ctrl = getBaseCtrl({
               value: '',
               autoComplete: true
            });

            expect(ctrl._type).toEqual('password');
         });
      });
      describe('Mouse enter event.', function () {
         describe('Tooltip value.', function () {
            beforeEach(function () {
               ctrl = getBaseCtrl({
                  value: 'test value',
                  tooltip: 'test tooltip'
               });
            });

            var init = function (inst, passwordVisible, valueFits) {
               inst._passwordVisible = passwordVisible;
               inst._hasHorizontalScroll = function () {
                  return !valueFits;
               };
               inst.fieldNameRef.current.hasHorizontalScroll = function () {
                  return !valueFits;
               };
               inst.shouldComponentUpdate({
                  ...input.Password.defaultProps,
                  value: 'test value'
               });
            };

            it('The password is hidden and the value fits into the field.', function () {
               init(ctrl, false, true);

               ctrl._mouseEnterHandler();

               expect(ctrl._tooltip).toEqual('');
            });
            it('The password is hidden and the value no fits into the field.', function () {
               init(ctrl, false, false);

               ctrl._mouseEnterHandler();

               expect(ctrl._tooltip).toEqual('');
            });
            it('The password is visible and the value fits into the field.', function () {
               init(ctrl, true, true);

               ctrl._mouseEnterHandler();

               expect(ctrl._tooltip).toEqual('test tooltip');
            });
            it('The password is visible and the value no fits into the field.', function () {
               init(ctrl, true, false);

               ctrl._mouseEnterHandler();

               expect(ctrl._tooltip).toEqual('test value');
            });
         });
      });
      describe('The click event on the icon.', function () {
         it('Auto-completion is disabled.', function () {
            ctrl._autoComplete = 'off';
            ctrl._toggleVisibilityHandler();

            expect(ctrl._type).toEqual('text');
            expect(ctrl._passwordVisible).toEqual(true);

            ctrl._toggleVisibilityHandler();

            expect(ctrl._type).toEqual('text');
            expect(ctrl._passwordVisible).toEqual(false);
         });
         it('Auto-completion is enabled.', function () {
            ctrl._autoComplete = 'on';
            ctrl._toggleVisibilityHandler();

            expect(ctrl._type).toEqual('text');
            expect(ctrl._passwordVisible).toEqual(true);

            ctrl._toggleVisibilityHandler();

            expect(ctrl._type).toEqual('password');
            expect(ctrl._passwordVisible).toEqual(false);
         });
      });
   });
});
