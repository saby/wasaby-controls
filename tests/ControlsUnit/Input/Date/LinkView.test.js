define(['Controls/dateRange'], function (dateRange) {
   'use strict';

   const config = {
      startValue: new Date(2018, 0, 1),
      endValue: new Date(2018, 1, 0),
      dateConstructor: Date,
      fontColorStyle: 'link'
   };

   describe('Controls/dateRange:LinkView', function () {
      describe('Initialisation', function () {
         it('should create correct model', function () {
            const component = new dateRange.LinkView(config);

            expect(component._caption).toBe("Январь'18");
            expect(component._rangeModel.startValue).toEqual(config.startValue);
            expect(component._rangeModel.endValue).toEqual(config.endValue);
         });
      });

      describe('shiftBack', function () {
         it('should update model', function () {
            const component = new dateRange.LinkView(config),
               startValue = new Date(2017, 11, 1),
               endValue = new Date(2018, 0, 0);

            component.shiftBack();

            expect(component._rangeModel.startValue.getTime()).toEqual(startValue.getTime());
            expect(component._rangeModel.endValue.getTime()).toEqual(endValue.getTime());

            expect(component._caption).toBe("Декабрь'17");
         });
      });

      describe('shiftForward', function () {
         it('should update model', function () {
            const component = new dateRange.LinkView(config),
               startValue = new Date(2018, 1, 1),
               endValue = new Date(2018, 2, 0);

            component.shiftForward();

            expect(component._rangeModel.startValue.getTime()).toEqual(startValue.getTime());
            expect(component._rangeModel.endValue.getTime()).toEqual(endValue.getTime());

            expect(component._caption).toBe("Февраль'18");
         });
      });

      describe('_beforeUpdate', function () {
         it('should update caption', function () {
            const component = new dateRange.LinkView(config),
               caption = component._caption,
               testCaptionFormatter = function () {
                  return 'test';
               };
            component.shouldComponentUpdate({
               ...config,
               captionFormatter: testCaptionFormatter
            });
            expect(component._caption).not.toEqual(caption);
         });
      });
      describe('_updateResetButtonVisible', function () {
         [
            {
               options: {
                  startValue: new Date(2020, 5, 4),
                  endValue: new Date(2022, 3, 7),
                  resetStartValue: new Date(2020, 5, 4),
                  resetEndValue: new Date(2022, 3, 7)
               },
               result: false
            },
            {
               options: {
                  startValue: new Date(2020, 5, 4),
                  endValue: new Date(2029, 3, 7),
                  resetStartValue: new Date(2020, 5, 4),
                  resetEndValue: new Date(2022, 3, 7)
               },
               result: true
            },
            {
               options: {
                  startValue: new Date(2021, 5, 4),
                  endValue: new Date(2022, 3, 7),
                  resetStartValue: new Date(2020, 5, 4),
                  resetEndValue: new Date(2022, 3, 7)
               },
               result: true
            },
            {
               options: {
                  startValue: new Date(2021, 5, 4),
                  endValue: new Date(2029, 3, 7),
                  resetStartValue: new Date(2020, 5, 4),
                  resetEndValue: new Date(2022, 3, 7)
               },
               result: true
            },
            {
               options: {
                  startValue: new Date(2021, 5, 4, 9, 9, 9, 1),
                  endValue: new Date(2021, 5, 4, 1, 1, 1, 4),
                  resetStartValue: new Date(2021, 5, 4, 10, 42, 41, 33),
                  resetEndValue: new Date(2021, 5, 4, 10, 42, 41, 33)
               },
               result: false
            }
         ].forEach((test) => {
            it('should set correct reset button visible state ', () => {
               const component = new dateRange.LinkView(config);
               const resetButtonVisible = component._getResetButtonVisible(test.options);
               expect(test.result).toEqual(resetButtonVisible);
            });
         });
      });
   });
});
