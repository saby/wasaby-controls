define(['Controls/stickyBlock'], function (scroll) {
   'use strict';

   describe('Controls/scroll:Utils', function () {
      describe('getNextId', function () {
         it('should return increasing ids', function () {
            const id1 = scroll.getNextStickyId(),
               id2 = scroll.getNextStickyId();

            expect(id2).toBe((parseInt(id1, 10) + 1).toString());
         });
      });
   });
});
