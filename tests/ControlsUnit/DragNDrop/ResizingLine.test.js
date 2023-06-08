define(['Controls/dragnDrop', 'ControlsUnit/resources/ProxyCall'], function (
   dragnDrop
) {
   'use strict';

   describe('Controls.dragnDrop.ResizingLine', () => {
      [
         {
            orientation: 'vertical',
            positions: ['top', 'bottom']
         },
         {
            orientation: 'horizontal',
            positions: ['left', 'right']
         }
      ].forEach((test) => {
         it(`_offset orientation: ${test.orientation}`, function () {
            let rlInstance = new dragnDrop.ResizingLine({});

            rlInstance._options = {
               minOffset: 300,
               maxOffset: 300,
               direction: 'direct',
               orientation: test.orientation
            };

            let offset = rlInstance._offset(100);
            expect(`${test.positions[0]}: 100%`).toBe(offset.style);
            expect(100).toBe(offset.value);

            offset = rlInstance._offset(400);
            expect(`${test.positions[0]}: 100%`).toBe(offset.style);
            expect(300).toBe(offset.value);

            offset = rlInstance._offset(-100);
            expect(`${test.positions[1]}: 0`).toBe(offset.style);
            expect(-100).toBe(offset.value);

            offset = rlInstance._offset(-400);
            expect(`${test.positions[1]}: 0`).toBe(offset.style);
            expect(-300).toBe(offset.value);

            rlInstance._options.direction = 'reverse';

            offset = rlInstance._offset(100);
            expect(`${test.positions[0]}: 0`).toBe(offset.style);
            expect(-100).toBe(offset.value);

            offset = rlInstance._offset(400);
            expect(`${test.positions[0]}: 0`).toBe(offset.style);
            expect(-300).toBe(offset.value);

            offset = rlInstance._offset(-100);
            expect(`${test.positions[1]}: 100%`).toBe(offset.style);
            expect(100).toBe(offset.value);

            offset = rlInstance._offset(-400);
            expect(`${test.positions[1]}: 100%`).toBe(offset.style);
            expect(300).toBe(offset.value);
         });
      });

      it('isResizing', () => {
         var ctrl = new dragnDrop.ResizingLine({});

         expect(ctrl._isResizing(0, 0)).toBe(false);
         expect(ctrl._isResizing(100, 0)).toBe(true);
         expect(ctrl._isResizing(0, 100)).toBe(true);
         expect(ctrl._isResizing(100, 100)).toBe(true);
      });

      it('endDrag', () => {
         const Line = new dragnDrop.ResizingLine({});
         const notifySpy = jest.spyOn(Line, '_notify').mockClear();
         const dragObject = {
            entity: {
               offset: {
                  value: 10
               }
            }
         };
         Line._onEndDragHandler(null, dragObject);
         expect(notifySpy).not.toHaveBeenCalledWith('offset', [10, undefined]);

         notifySpy.mockClear();

         Line._dragging = true;
         Line._onEndDragHandler(null, dragObject);
         expect(notifySpy).toHaveBeenCalledWith('offset', [10, undefined]);

         Line.destroy();
      });
   });
});
