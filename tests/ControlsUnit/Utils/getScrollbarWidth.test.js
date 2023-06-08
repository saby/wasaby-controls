define(['Controls/scrollbar'], function (scroll) {
   describe('Controls.Utils.getScrollbarWidth', function () {
      const constWidthScrollbar = 20;
      const getScrollbarWidthByMeasuredBlock =
         scroll.getScrollbarWidthByMeasuredBlock;
      let detection, result;
      beforeEach(function () {
         scroll.getScrollbarWidthByMeasuredBlock = function () {
            return constWidthScrollbar;
         };
      });
      afterEach(function () {
         scroll.getScrollbarWidthByMeasuredBlock =
            getScrollbarWidthByMeasuredBlock;
      });
      it('webKit', function () {
         detection = {
            webkit: true
         };

         result = scroll.getScrollbarWidth(detection);
         expect(result).toEqual(0);
      });
      it('ie12', function () {
         detection = {
            isIE12: true
         };

         detection.IEVersion = 16;
         result = scroll.getScrollbarWidth(detection);
         expect(result).toEqual(12);

         detection.IEVersion = 17;
         result = scroll.getScrollbarWidth(detection);
         expect(result).toEqual(16);
      });
      it('ie11', function () {
         detection = {
            isIE11: true
         };

         result = scroll.getScrollbarWidth(detection);
         expect(result).toEqual(17);
      });
      it('ie10', function () {
         detection = {
            isIE10: true
         };

         result = scroll.getScrollbarWidth(detection);
         expect(result).toEqual(17);
      });
      it('firefox', function () {
         detection = {
            firefox: true
         };

         result = scroll.getScrollbarWidth(detection);
         if (typeof window === 'undefined') {
            expect(result).toEqual(undefined);
         } else {
            expect(result).toEqual(20);
         }
      });
   });
});
