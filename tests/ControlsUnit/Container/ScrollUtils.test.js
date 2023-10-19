/**
 * @jest-environment jsdom
 */
define(['Env/Env', 'Controls/_scroll/Scroll/ScrollHeightFixUtil'], function (
   Env,
   ScrollHeightFixUtil
) {
   'use strict';

   let oldDetectionValue;
   const mockDetection = (envField) => {
      oldDetectionValue = Env.detection[envField];
      Env.detection[envField] = true;
   };
   const restoreDetection = (envField) => {
      if (typeof window === 'undefined') {
         Env.detection[envField] = undefined;
      } else {
         Env.detection[envField] = oldDetectionValue;
      }
   };

   describe('Controls.Container.Scroll.Utils', function () {
      let result;

      describe('calcHeightFixFn', function () {
         var container;
         it('chrome', function () {
            mockDetection('chrome');

            result = ScrollHeightFixUtil.calcHeightFix();
            expect(result).toEqual(false);
            restoreDetection('chrome');
         });
         it('firefox', function () {
            mockDetection('firefox');

            container = {
               offsetHeight: 10,
               scrollHeight: 10
            };
            result = ScrollHeightFixUtil.calcHeightFix(container);
            expect(result).toEqual(true);

            container = {
               offsetHeight: 40,
               scrollHeight: 40
            };
            result = ScrollHeightFixUtil.calcHeightFix(container);
            expect(result).toEqual(false);
            restoreDetection('firefox');
         });

         it('ie', function () {
            mockDetection('isIE');

            container = {
               scrollHeight: 101,
               offsetHeight: 100
            };
            result = ScrollHeightFixUtil.calcHeightFix(container);
            expect(result).toEqual(true);

            container = {
               scrollHeight: 200,
               offsetHeight: 100
            };
            result = ScrollHeightFixUtil.calcHeightFix(container);
            expect(result).toEqual(false);
            restoreDetection('isIE');
         });
      });
   });
});
