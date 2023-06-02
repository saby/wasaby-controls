define([
   'Core/core-merge',
   'Controls/_datePopup/YearsRange',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils'
], function (coreMerge, YearsRange, dateUtils, calendarTestUtils) {
   'use strict';

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2),
      year = new Date(2018, 0, 1);

   describe('Controls/Date/PeriodDialog/YearRange', function () {
      describe('Initialisation', function () {
         it('should create the correct models when empty range passed.', function () {
            const component = calendarTestUtils.createComponent(YearsRange, {
               year: year
            });
            expect(component._rangeModel.startValue).not.toBeDefined();
            expect(component._rangeModel.endValue).not.toBeDefined();
         });

         it('should create the correct range model when range passed.', function () {
            const component = calendarTestUtils.createComponent(YearsRange, {
               year: year,
               startValue: start,
               endValue: end
            });
            expect(
               dateUtils.Base.isDatesEqual(
                  component._rangeModel.startValue,
                  start
               )
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._rangeModel.endValue, end)
            ).toBeTruthy();
         });

         [
            {
               position: new Date(2019, 0),
               lastYear: 2019
            },
            {
               position: new Date(2019, 0),
               startValue: new Date(2019, 0),
               endValue: new Date(2021, 0),
               lastYear: 2023
            },
            {
               position: new Date(2019, 0),
               startValue: new Date(2019, 0),
               endValue: new Date(2024, 0),
               lastYear: 2023
            },
            {
               position: new Date(2019, 0),
               startValue: new Date(2019, 0),
               endValue: new Date(2025, 0),
               lastYear: 2023
            }
         ].forEach(function (test) {
            it(
               'should set the correct lastYear model when options' +
                  `{ year: ${test.position}, startValue: ${test.startValue}, endValue: ${test.endValue} } passed.`,
               function () {
                  const component = calendarTestUtils.createComponent(
                     YearsRange,
                     {
                        year: test.position,
                        startValue: test.startValue,
                        endValue: test.endValue
                     }
                  );
                  expect(component._lastYear).toBe(test.lastYear);
               }
            );
         });
      });

      describe('_changeYear', function () {
         it('should decrease year', function () {
            const component = calendarTestUtils.createComponent(YearsRange, {
               year: year
            });
            const cachedYear = component._lastYear;
            component._changeYear(-1);
            expect(component._lastYear).toEqual(cachedYear - 1);
         });
         it('should not decrease year', () => {
            const component = calendarTestUtils.createComponent(YearsRange, {
               year: year
            });
            const lastYear = dateUtils.Base.MIN_YEAR_VALUE;
            component._lastYear = lastYear;
            component._changeYear(-1);
            expect(component._lastYear).toEqual(lastYear);
         });
         it('should increase year', function () {
            const component = calendarTestUtils.createComponent(YearsRange, {
               year: year
            });
            const cachedYear = component._lastYear;
            component._changeYear(1);
            expect(component._lastYear).toEqual(cachedYear + 1);
         });
         it('should not increase year', () => {
            const component = calendarTestUtils.createComponent(YearsRange, {
               year: year
            });
            const lastYear = dateUtils.Base.MAX_YEAR_VALUE;
            component._lastYear = lastYear;
            component._changeYear(1);
            expect(component._lastYear).toEqual(lastYear);
         });
      });
      describe('_updateModel', () => {
         [
            {
               lastYear: 10000
            },
            {
               lastYear: 1200
            }
         ].forEach((test) => {
            it('should not let _lastYears get out of valid range', () => {
               const component = calendarTestUtils.createComponent(YearsRange, {
                  year: year
               });
               component._lastYear = test.lastYear;
               component._updateModel();
               expect(
                  component._lastYear >= dateUtils.Base.MIN_YEAR_VALUE &&
                     component._lastYear <= dateUtils.Base.MAX_YEAR_VALUE
               ).toBe(true);
            });
         });
      });
   });
});
