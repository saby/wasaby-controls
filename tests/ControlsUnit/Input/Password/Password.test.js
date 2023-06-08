define(['Controls/input', 'Controls/_input/Password/ViewModel'], function (input, ViewModelModule) {
   describe('Controls/_input/Password', function () {
      var ctrl;

      beforeEach(function () {
         ctrl = new input.Password();

         // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
         jest.spyOn(ctrl, '_forceUpdate').mockImplementation();
         var beforeMount = ctrl._beforeMount;

         ctrl._beforeMount = function () {
            beforeMount.apply(this, arguments);

            ctrl._children[this._fieldName] = {
               _mounted: true,
               focus: jest.fn(),
               setSelectionRange: function (start, end) {
                  this.selectionStart = start;
                  this.selectionEnd = end;
               }
            };
         };
      });

      it('The model belongs to the "Controls/_input/Password/ViewModel" class.', function () {
         ctrl._beforeMount({
            value: ''
         });
         const viewModel = ViewModelModule.ViewModel;
         expect(ctrl._viewModel instanceof viewModel).toBe(true);
      });

      describe('The type attribute of the field when mounting.', function () {
         it('Auto-completion is disabled.', function () {
            ctrl._beforeMount({
               value: '',
               autoComplete: false
            });

            expect(ctrl._type).toEqual('text');
         });
         it('Auto-completion is enabled.', function () {
            ctrl._beforeMount({
               value: '',
               autoComplete: true
            });

            expect(ctrl._type).toEqual('password');
         });
      });
      describe('Mouse enter event.', function () {
         describe('Tooltip value.', function () {
            beforeEach(function () {
               ctrl._beforeMount({
                  value: 'test value'
               });
               ctrl._options.tooltip = 'test tooltip';
            });

            var init = function (inst, passwordVisible, valueFits) {
               inst._passwordVisible = passwordVisible;
               inst._hasHorizontalScroll = function () {
                  return !valueFits;
               };
               inst._children[inst._fieldName].hasHorizontalScroll = function () {
                  return !valueFits;
               };
               inst._beforeUpdate({
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
