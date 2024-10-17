define(['Controls/input'], function (inputMod) {
   'use strict';

   describe('Controls/_input/TimeInterval', function () {
      function getBaseCtrl() {
         const ctrl = new inputMod.TimeInterval({
            ...inputMod.TimeInterval.defaultProps,
            mask: 'HH:MM'
         });

         var beforeMount = ctrl._beforeMount;

         ctrl._beforeMount = function () {
            beforeMount.apply(this, arguments);

            ctrl.fieldNameRef.current = {
               getContainer: function () {
                  return undefined;
               },
               focus: jest.fn(),
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
         ctrl = getBaseCtrl();
      });
      describe('_focusInHandler', function () {
         it('by tab', function () {
            ctrl._viewModel.selection = 10;
            ctrl._focusByMouseDown = false;
            ctrl._focusInHandler({
               target: {}
            });
            expect(ctrl._viewModel.selection.start).toEqual(0);
            expect(ctrl._viewModel.selection.end).toEqual(0);
         });
         it('by mouse', function () {
            ctrl._viewModel.selection = 10;
            ctrl._focusByMouseDown = true;
            ctrl._focusInHandler({
               target: {}
            });
            expect(ctrl._viewModel.selection.start).toEqual(10);
            expect(ctrl._viewModel.selection.end).toEqual(10);
         });
      });
   });
});
