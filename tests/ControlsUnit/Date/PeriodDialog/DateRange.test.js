define([
   'Core/core-merge',
   'Core/core-instance',
   'Types/entity',
   'Controls/_datePopup/DateRange',
   'Controls/_datePopup/Utils',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils'
], function (
   coreMerge,
   cInstance,
   entity,
   DateRange,
   datePopupUtils,
   dateUtils,
   calendarTestUtils
) {
   'use strict';

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2),
      year = new Date(2018, 0, 1);

   describe('Controls/_datePopup/DateRange', function () {
      describe('Initialisation', function () {
         it('should create the correct models when empty range passed.', function () {
            const component = calendarTestUtils.createComponent(DateRange, {
               year: year
            });
            expect(component._rangeModel.startValue).not.toBeDefined();
            expect(component._rangeModel.endValue).not.toBeDefined();
         });

         it('should create the correct range model when range passed.', function () {
            const component = calendarTestUtils.createComponent(DateRange, {
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
            { options: { selectionType: 'range' }, eq: true },
            {
               options: { selectionType: 'quantum', ranges: { months: [1] } },
               eq: true
            },
            {
               options: { selectionType: 'quantum', ranges: { years: [1] } },
               eq: false
            },
            { options: { selectionType: 'single' }, eq: false },
            { options: { readonly: false }, eq: false }
         ].forEach(function (test) {
            it(`should set proper _monthSelectionEnabled for options ${JSON.stringify(
               test.options
            )}.`, function () {
               const component = calendarTestUtils.createComponent(
                  DateRange,
                  test.options
               );
               expect(component._monthSelectionEnabled).toEqual(test.eq);
            });
         });
      });

      describe('_formatMonth', function () {
         [
            { month: 0, text: 'Январь' },
            { month: 1, text: 'Февраль' },
            { month: 2, text: 'Март' },
            { month: 3, text: 'Апрель' },
            { month: 4, text: 'Май' },
            { month: 5, text: 'Июнь' },
            { month: 6, text: 'Июль' },
            { month: 7, text: 'Август' },
            { month: 8, text: 'Сентябрь' },
            { month: 9, text: 'Октябрь' },
            { month: 10, text: 'Ноябрь' },
            { month: 11, text: 'Декабрь' }
         ].forEach(function (test) {
            it(`should return ${test.text} if ${test.month} is passed.`, function () {
               const component = calendarTestUtils.createComponent(DateRange, {
                  year: year
               });
               expect(component._formatMonth(test.month)).toEqual(test.text);
            });
         });
      });
      describe('_onMonthsPositionChanged', () => {
         [
            {
               position: new Date(2018, 5),
               newPosition: new Date(2019, 2),
               result: new Date(2019, 0)
            },
            {
               position: new Date(2018, 5),
               newPosition: new Date(2016, 4),
               result: new Date(2017, 0)
            }
         ].forEach((test) => {
            it('should set correct position', () => {
               const component = calendarTestUtils.createComponent(
                  DateRange,
                  {}
               );
               component._position = test.position;
               let resultValue;
               component._notify = (eventName, value) => {
                  resultValue = value[0];
               };
               component._onMonthsPositionChanged('event', test.newPosition);
               expect(resultValue.getFullYear()).toEqual(
                  test.result.getFullYear()
               );
            });
         });

         [
            {
               position: new Date(2018, 5),
               newPosition: new Date(2018, 2)
            },
            {
               position: new Date(2018, 5),
               newPosition: new Date(2017, 4)
            }
         ].forEach((test) => {
            it('should not set position', () => {
               const component = calendarTestUtils.createComponent(
                  DateRange,
                  {}
               );
               component._position = test.position;
               jest
                  .spyOn(component, '_notify')
                  .mockClear()
                  .mockImplementation();
               component._onMonthsPositionChanged('event', test.newPosition);
               expect(component._notify).not.toHaveBeenCalled();
            });
         });
      });

      describe('_updateView', () => {
         it('should  update _monthsPosition', () => {
            const component = calendarTestUtils.createComponent(DateRange, {});
            component._position = new Date(2020, 5);
            component._shouldUpdateMonthsPosition = true;
            component._updateView({
               position: new Date(2019, 4)
            });
            const result = new Date(2019, 0);
            expect(
               dateUtils.Base.isDatesEqual(result, component._monthsPosition)
            ).toBe(true);
         });
         it('should update _monthsPosition', () => {
            const component = calendarTestUtils.createComponent(DateRange, {});
            component._position = new Date(2020, 5);
            const result = new Date(2020, 0);
            component._monthsPosition = result;
            component._shouldUpdateMonthsPosition = false;
            component._updateView({
               position: new Date(2019, 4)
            });
            expect(
               dateUtils.Base.isDatesEqual(result, component._monthsPosition)
            ).toBe(false);
         });
      });
   });
});
