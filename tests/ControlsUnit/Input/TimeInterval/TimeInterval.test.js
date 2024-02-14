define(['Controls/input'], function (inputMod) {
   'use strict';

   describe('Controls/_input/TimeInterval', function () {
      var ctrl;

      beforeEach(function () {
         ctrl = new inputMod.TimeInterval();
         var beforeMount = ctrl._beforeMount;

         ctrl._beforeMount = function () {
            beforeMount.apply(this, arguments);

            ctrl._children[this._fieldName] = {
               focus: jest.fn(),
               setSelectionRange: function (start, end) {
                  this.selectionStart = start;
                  this.selectionEnd = end;
               }
            };
         };
      });
      describe('_focusInHandler', function () {
         it('by tab', function () {
            ctrl._beforeMount({
               mask: 'HH:MM'
            });
            ctrl._viewModel.selection = 10;
            ctrl._focusByMouseDown = false;
            ctrl._focusInHandler({
               target: {}
            });
            expect(ctrl._viewModel.selection.start).toEqual(0);
            expect(ctrl._viewModel.selection.end).toEqual(0);
         });
         it('by mouse', function () {
            ctrl._beforeMount({
               mask: 'HH:MM'
            });
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
