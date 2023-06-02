define([
   'Core/core-merge',
   'Controls/_datePopup/MonthsRangeItem',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils'
], function (coreMerge, MonthsRangeItem, dateUtils, calendarTestUtils) {
   'use strict';

   // eslint-disable-next-line no-param-reassign
   MonthsRangeItem = MonthsRangeItem.default;

   const start = new Date(2018, 0, 1);

   describe('Controls/Date/PeriodDialog/MonthRangeItem', function () {
      describe('Initialisation', function () {
         [
            {
               options: {
                  selectionType: 'single',
                  date: start
               },
               eq: {
                  months: false,
                  quarters: false,
                  halfYears: false,
                  years: false
               }
            },
            {
               options: {
                  selectionType: 'disable',
                  date: start
               },
               eq: {
                  months: false,
                  quarters: false,
                  halfYears: false,
                  years: false
               }
            },
            {
               options: { selectionType: 'range', date: start },
               eq: {
                  months: true,
                  quarters: true,
                  halfYears: true,
                  years: true
               }
            },
            {
               options: {
                  selectionType: 'quantum',
                  ranges: { days: [3] },
                  date: start
               },
               eq: {
                  months: false,
                  quarters: false,
                  halfYears: false,
                  years: false
               }
            },
            {
               options: {
                  selectionType: 'quantum',
                  ranges: {
                     months: [1],
                     quarters: [1],
                     halfyears: [1],
                     years: [1]
                  },
                  date: start
               },
               eq: {
                  months: true,
                  quarters: true,
                  halfYears: true,
                  years: true
               }
            },
            {
               options: {
                  selectionType: 'range',
                  readOnly: true,
                  date: start
               },
               eq: {
                  months: false,
                  quarters: false,
                  halfYears: false,
                  years: false
               }
            }
         ].forEach(function (test) {
            it(`should set proper model for options ${JSON.stringify(
               test.options
            )}.`, function () {
               const component = calendarTestUtils.createComponent(
                  MonthsRangeItem,
                  test.options
               );

               expect(component._monthsSelectionEnabled).toEqual(
                  test.eq.months
               );
               expect(component._quarterSelectionEnabled).toEqual(
                  test.eq.quarters
               );
               expect(component._halfyearSelectionEnabled).toEqual(
                  test.eq.halfYears
               );
               expect(component._yearSelectionEnabled).toEqual(test.eq.years);
            });
         });
      });

      describe('_prepareItemClass', function () {
         [
            {
               options: {
                  selectionProcessing: false,
                  hoveredSelectionValue: start
               },
               cssClass: 'controls-PeriodDialog-MonthsRange__item-unselected'
            }
         ].forEach(function (test) {
            it(`should return correct css class if options are equal to ${JSON.stringify(
               test.options
            )}.`, function () {
               const component = calendarTestUtils.createComponent(
                     MonthsRangeItem,
                     coreMerge({ date: start }, test.options, {
                        preferSource: true
                     })
                  ),
                  css = component._prepareItemClass(new Date(2021, 0));

               expect(css).toContain(test.cssClass);
            });
         });
      });

      // describe('_toggleState', function() {
      //    it('should toggle state.', function() {
      //       const component = calendarTestUtils.createComponent(PeriodDialog, {});
      //       assert.strictEqual(component._state, component._STATES.year);
      //       component._toggleState();
      //       assert.strictEqual(component._state, component._STATES.month);
      //    });
      // });
   });
});
