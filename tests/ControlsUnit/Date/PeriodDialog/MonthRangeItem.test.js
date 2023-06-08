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

      [
         {
            method: '_onMonthTitleMouseLeave',
            tests: [
               {
                  options: { selectionProcessing: true, monthClickable: true },
                  event: null
               },
               {
                  options: { selectionProcessing: true, monthClickable: false },
                  event: null
               },
               {
                  options: { selectionProcessing: false, monthClickable: true },
                  event: 'itemMouseLeave'
               },
               {
                  options: {
                     selectionProcessing: false,
                     monthClickable: false
                  },
                  event: null
               }
            ]
         },
         {
            method: '_onMonthBodyClick',
            tests: [
               {
                  options: { selectionProcessing: true, monthClickable: true },
                  event: null
               },
               {
                  options: { selectionProcessing: true, monthClickable: false },
                  event: null
               },
               {
                  options: { selectionProcessing: false, monthClickable: true },
                  event: 'monthClick'
               }
            ]
         },
         {
            method: '_onMonthClick',
            tests: [
               {
                  options: { selectionProcessing: true, monthClickable: true },
                  event: 'itemClick'
               },
               {
                  options: { selectionProcessing: true, monthClickable: false },
                  event: 'itemClick'
               },
               {
                  options: { selectionProcessing: false, monthClickable: true },
                  event: null
               },
               {
                  options: {
                     selectionProcessing: false,
                     monthClickable: false
                  },
                  event: 'itemClick'
               },
               {
                  options: { selectionProcessing: true, monthClickable: true },
                  event: 'selectionViewTypeChanged',
                  eventOptions: ['months']
               },
               {
                  options: { selectionProcessing: true, monthClickable: false },
                  event: 'selectionViewTypeChanged',
                  eventOptions: ['months']
               },
               {
                  options: {
                     selectionProcessing: false,
                     monthClickable: false
                  },
                  event: 'selectionViewTypeChanged',
                  eventOptions: ['months']
               }
            ]
         },
         {
            method: '_onMonthTitleClick',
            tests: [
               {
                  options: { selectionProcessing: false, monthClickable: true },
                  event: 'itemClick'
               },
               {
                  options: {
                     selectionProcessing: false,
                     monthClickable: false
                  },
                  event: null
               },
               {
                  options: { selectionProcessing: true, monthClickable: true },
                  event: null
               },
               {
                  options: {
                     selectionProcessing: false,
                     monthClickable: true,
                     ranges: { days: [1] }
                  },
                  event: null
               }
            ]
         },
         {
            method: '_onMonthMouseEnter',
            tests: [
               {
                  options: { selectionProcessing: true, monthClickable: true },
                  event: 'itemMouseEnter'
               },
               {
                  options: { selectionProcessing: true, monthClickable: false },
                  event: 'itemMouseEnter'
               },
               {
                  options: { selectionProcessing: false, monthClickable: true },
                  event: null
               },
               {
                  options: {
                     selectionProcessing: false,
                     monthClickable: false
                  },
                  event: 'itemMouseEnter'
               }
            ]
         },
         {
            method: '_onMonthMouseLeave',
            tests: [
               {
                  options: { selectionProcessing: true, monthClickable: true },
                  event: 'itemMouseLeave'
               },
               {
                  options: { selectionProcessing: true, monthClickable: false },
                  event: 'itemMouseLeave'
               },
               {
                  options: { selectionProcessing: false, monthClickable: true },
                  event: null
               },
               {
                  options: {
                     selectionProcessing: false,
                     monthClickable: false
                  },
                  event: 'itemMouseLeave'
               }
            ]
         }
      ].forEach(function (testGroup) {
         describe(testGroup.method, function () {
            testGroup.tests.forEach(function (test) {
               it(`should generate ${
                  test.event
               } for options ${JSON.stringify(test.options)}.`, function () {
                  const component = calendarTestUtils.createComponent(
                     MonthsRangeItem,
                     coreMerge({ date: start }, test.options, {
                        preferSource: true
                     })
                  );

                  jest
                     .spyOn(component, '_notify')
                     .mockClear()
                     .mockImplementation();
                  component[testGroup.method](null, start);

                  if (test.event) {
                     expect(component._notify).toHaveBeenCalledWith(
                        test.event,
                        test.eventOptions || [start]
                     );
                  } else {
                     expect(component._notify).not.toHaveBeenCalled();
                  }
               });
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
               cssClass: 'controls-PeriodDialog-MonthsRange__hovered'
            },
            {
               options: {
                  selectionProcessing: false,
                  hoveredSelectionValue: start,
                  hoveredStartValue: start,
                  selectionViewType: MonthsRangeItem.SELECTION_VIEW_TYPES.months
               },
               cssClass: 'controls-RangeSelection__start-end-hovered'
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
                  css = component._prepareItemClass();

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
