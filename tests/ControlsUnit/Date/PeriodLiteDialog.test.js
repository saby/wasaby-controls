define([
   'Core/core-merge',
   'Controls/shortDatePicker',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils',
   'Types/entity',
   'Types/formatter',
   'wml!Controls/_shortDatePicker/ItemFull',
   'wml!Controls/_shortDatePicker/ItemMonths',
   'wml!Controls/_shortDatePicker/ItemQuarters',
   'Controls/_shortDatePicker/bodyItem',
   'Types/entity',
   'Core/core-instance',
   'Env/Env'
], function (
   coreMerge,
   PeriodLiteDialog,
   DateUtils,
   calendarTestUtils,
   typesEntity,
   formatDate,
   itemTmpl,
   itemTmplMonths,
   itemTmplQuarters,
   bodyItem,
   entity,
   cInstance,
   Env
) {
   'use strict';

   describe('Controls/dateLitePopup', function () {
      describe('Initialisation', function () {
         [
            {
               chooseHalfyears: true,
               chooseQuarters: true,
               chooseMonths: true,
               tmpl: itemTmpl
            },
            {
               chooseHalfyears: false,
               chooseQuarters: false,
               chooseMonths: true,
               tmpl: itemTmplMonths
            },
            {
               chooseHalfyears: false,
               chooseQuarters: true,
               chooseMonths: false,
               tmpl: itemTmplQuarters
            }
         ].forEach(function (test) {
            it(
               `should choose correct item template for options chooseHalfyears: ${test.chooseHalfyears}, ` +
                  `chooseQuarters: ${test.chooseQuarters}, chooseMonths: ${test.chooseMonths}`,
               function () {
                  const component = calendarTestUtils.createComponent(bodyItem, {
                     chooseHalfyears: test.chooseHalfyears,
                     chooseQuarters: test.chooseQuarters,
                     chooseMonths: test.chooseMonths,
                     currentYear: 2020
                  });

                  expect(component._template).toBe(test.tmpl);
               }
            );
         });

         it('should create correct month model', function () {
            const component = calendarTestUtils.createComponent(bodyItem, {
                  currentYear: 2020
               }),
               year = new Date().getFullYear(),
               data = [
                  {
                     date: new Date(year, 0),
                     name: 'I',
                     number: 0,
                     tooltip: formatDate.date(new Date(year, 0, 1), formatDate.date.FULL_HALF_YEAR),
                     quarters: [
                        {
                           date: new Date(year, 0),
                           name: 'I',
                           fullName: formatDate.date(new Date(year, 0, 1), 'QQQQr'),
                           tooltip: formatDate.date(
                              new Date(year, 0, 1),
                              formatDate.date.FULL_QUARTER
                           ),
                           months: [
                              {
                                 date: new Date(year, 0, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 0, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              },
                              {
                                 date: new Date(year, 1, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 1, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              },
                              {
                                 date: new Date(year, 2, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 2, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              }
                           ],
                           number: 0
                        },
                        {
                           date: new Date(year, 3),
                           name: 'II',
                           fullName: formatDate.date(new Date(year, 3, 1), 'QQQQr'),
                           tooltip: formatDate.date(
                              new Date(year, 3, 1),
                              formatDate.date.FULL_QUARTER
                           ),
                           months: [
                              {
                                 date: new Date(year, 3, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 3, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              },
                              {
                                 date: new Date(year, 4, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 4, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              },
                              {
                                 date: new Date(year, 5, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 5, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              }
                           ],
                           number: 1
                        }
                     ]
                  },
                  {
                     date: new Date(year, 6),
                     name: 'II',
                     number: 1,
                     tooltip: formatDate.date(new Date(year, 6, 1), formatDate.date.FULL_HALF_YEAR),
                     quarters: [
                        {
                           date: new Date(year, 6),
                           name: 'III',
                           fullName: formatDate.date(new Date(year, 6, 1), 'QQQQr'),
                           tooltip: formatDate.date(
                              new Date(year, 6, 1),
                              formatDate.date.FULL_QUARTER
                           ),
                           months: [
                              {
                                 date: new Date(year, 6, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 6, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              },
                              {
                                 date: new Date(year, 7, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 7, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              },
                              {
                                 date: new Date(year, 8, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 8, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              }
                           ],
                           number: 2
                        },
                        {
                           date: new Date(year, 9),
                           name: 'IV',
                           fullName: formatDate.date(new Date(year, 9, 1), 'QQQQr'),
                           tooltip: formatDate.date(
                              new Date(year, 9, 1),
                              formatDate.date.FULL_QUARTER
                           ),
                           months: [
                              {
                                 date: new Date(year, 9, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 9, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              },
                              {
                                 date: new Date(year, 10, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 10, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              },
                              {
                                 date: new Date(year, 11, 1),
                                 tooltip: formatDate.date(
                                    new Date(year, 11, 1),
                                    formatDate.date.FULL_MONTH
                                 )
                              }
                           ],
                           number: 3
                        }
                     ]
                  }
               ];

            // Compare all but months.
            expect(
               coreMerge({}, component._getYearModel(year, entity.Date), {
                  ignoreRegExp: /^months$/,
                  clone: true
               })
            ).toEqual(coreMerge({}, data, { ignoreRegExp: /^months$/, clone: true }));

            // And now let's check the month.
            for (let [halfyearIndex, halfyear] of data.entries()) {
               for (let [quarterIndex, quarter] of halfyear.quarters.entries()) {
                  for (let [monthIndex, month] of quarter.months.entries()) {
                     expect(
                        DateUtils.Base.isDatesEqual(
                           component._getYearModel(year, entity.Date)[halfyearIndex].quarters[
                              quarterIndex
                           ].months[monthIndex].name,
                           month.name
                        )
                     ).toBeTruthy();
                  }
               }
            }
         });

         it('should create correct dates type in month model', function () {
            const component = calendarTestUtils.createComponent(bodyItem, {
                  currentYear: 2020
               }),
               year = new Date().getFullYear(),
               yearModel = component._getYearModel(year, entity.Date);
            expect(
               cInstance.instanceOfModule(
                  yearModel[0].quarters[0].months[0].date,
                  'Types/entity:Date'
               )
            ).toBe(true);
         });
      });

      describe('_onYearClick', function () {
         it('should generate sendResult event', function () {
            const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {});
            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._onYearClick(null, 2000);

            expect(component._notify).toHaveBeenCalledWith(
               'sendResult',
               [new entity.applied.Date(2000, 0, 1), new entity.applied.Date(2000, 11, 31)],
               { bubbling: true }
            );
         });
         it('should not generate events if year selection is disabled', function () {
            const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {
               chooseYears: false
            });
            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._onYearClick(null, 2000);

            expect(component._notify).not.toHaveBeenCalled();
         });
      });

      describe('_expandPopup', function () {
         it('should not expand popup', function () {
            const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {
               stickyPosition: {
                  position: {
                     top: 10
                  },
                  targetPosition: {
                     top: 10
                  },
                  margins: {
                     top: 10
                  }
               }
            });
            component._isExpandedPopup = false;
            component._isExpandButtonVisible = false;
            component._expandPopup(null, true);
            expect(component._isExpandedPopup).toEqual(false);

            component._isExpandedPopup = false;
            component._isExpandButtonVisible = true;
            component._expandPopup(null, true);
            expect(component._isExpandedPopup).toEqual(true);
         });
         describe('_getExpandButtonVisibility', function () {
            it('should not show expand button on mobile', () => {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {
                  stickyPosition: {
                     position: {
                        top: 5
                     },
                     targetPosition: {
                        top: 10
                     },
                     margins: {
                        top: 5
                     }
                  }
               });

               Env.detection.isMobilePlatform = true;
               component._isExpandButtonVisible = component._getExpandButtonVisibility(
                  component._options
               );
               expect(component._isExpandButtonVisible).toBe(false);
            });

            it('should show expand button', () => {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {
                  stickyPosition: {
                     position: {
                        top: 5
                     },
                     targetPosition: {
                        top: 10
                     },
                     margins: {
                        top: 5
                     }
                  }
               });
               Env.detection.isMobilePlatform = false;
               component._isExpandButtonVisible = component._getExpandButtonVisibility(
                  component._options
               );
               expect(component._isExpandButtonVisible).toBe(true);
            });

            it('should not show expand button if displayedRanges has less years than needed', () => {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {
                  stickyPosition: {
                     position: {
                        top: 5
                     },
                     targetPosition: {
                        top: 10
                     },
                     margins: {
                        top: 5
                     }
                  },
                  displayedRanges: [[new Date(2018, 0), new Date(2019, 0)]]
               });
               component._isExpandButtonVisible = component._getExpandButtonVisibility(
                  component._options
               );
               expect(component._isExpandButtonVisible).toBe(false);
            });

            it('should show expand button if displayedRanges has enough years', () => {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {
                  stickyPosition: {
                     position: {
                        top: 5
                     },
                     targetPosition: {
                        top: 10
                     },
                     margins: {
                        top: 5
                     }
                  },
                  displayedRanges: [[new Date(2018, 0), new Date(2025, 0)]]
               });
               component._isExpandButtonVisible = component._getExpandButtonVisibility(
                  component._options
               );
               expect(component._isExpandButtonVisible).toBe(true);
            });
         });
      });

      describe('_onYearMouseEnter', function () {
         it('should set year to _yearHovered', function () {
            const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {});
            component._onYearMouseEnter(null, 2019);
            expect(component._yearHovered).toEqual(2019);
         });
         it('should not set year to _yearHovered', function () {
            const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {
               chooseYears: false
            });
            component._onYearMouseEnter();
            expect(component._yearHovered).not.toBeDefined();
         });
      });

      describe('_onHalfYearClick', function () {
         it('should generate sendResult event', function () {
            const component = calendarTestUtils.createComponent(bodyItem, {
               currentYear: 2020,
               year: new Date(2000, 0, 1)
            });
            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._onHalfYearClick(null, 0, 2000);

            expect(component._notify).toHaveBeenCalledWith(
               'sendResult',
               [new entity.applied.Date(2000, 0, 1), new entity.applied.Date(2000, 5, 30)],
               { bubbling: true }
            );
         });
      });

      describe('_onQuarterClick', function () {
         it('should generate sendResult event', function () {
            const component = calendarTestUtils.createComponent(bodyItem, {
               currentYear: 2020,
               year: new Date(2000, 0, 1)
            });
            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._onQuarterClick(null, 0, 2000);

            expect(component._notify).toHaveBeenCalledWith(
               'sendResult',
               [new entity.applied.Date(2000, 0, 1), new entity.applied.Date(2000, 2, 31)],
               { bubbling: true }
            );
         });
      });

      describe('_onMonthClick', function () {
         it('should generate sendResult event', function () {
            const component = calendarTestUtils.createComponent(bodyItem, {
               currentYear: 2020,
               year: new Date(2000, 0, 1)
            });
            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._onMonthClick(null, new Date(2000, 0, 1));

            expect(component._notify).toHaveBeenCalledWith(
               'sendResult',
               [new Date(2000, 0, 1), new Date(2000, 0, 31)],
               { bubbling: true }
            );
         });
      });

      describe('_changeYear', function () {
         [
            {
               year: new Date(2000, 0),
               delta: 1,
               result: 2001
            },
            {
               year: new Date(2000, 0),
               delta: -1,
               result: 1999
            },
            {
               year: new Date(2000, 0),
               delta: 1,
               result: 2001
            },
            {
               year: new Date(2000, 0),
               delta: 1,
               displayedRanges: [
                  [null, new Date(2000, 0)],
                  [new Date(2005, 0), null]
               ],
               result: 2005
            },
            {
               year: new Date(2005, 0),
               delta: -1,
               displayedRanges: [
                  [null, new Date(2000, 0)],
                  [new Date(2005, 0), null]
               ],
               result: 2000
            },
            {
               year: new Date(2005, 0),
               displayedRanges: [
                  [null, new Date(2002, 0)],
                  [new Date(2004, 0), null]
               ],
               chooseHalfyears: false,
               chooseMonths: false,
               chooseQuarters: false,
               delta: -1,
               result: 2004
            },
            {
               year: new Date(2019, 0),
               displayedRanges: [
                  [null, new Date(2017, 0)],
                  [new Date(2019, 0), new Date(2020, 0)],
                  [new Date(2022, 0), new Date(2033, 0)]
               ],
               chooseHalfyears: false,
               chooseMonths: false,
               chooseQuarters: false,
               chooseYears: true,
               delta: -1,
               result: 2017
            },
            {
               year: new Date(2022, 0),
               displayedRanges: [[new Date(2007, 0), null]],
               chooseHalfyears: false,
               chooseMonths: false,
               chooseQuarters: false,
               delta: -1,
               result: 2021
            },
            {
               year: new Date(2025, 0),
               displayedRanges: [
                  [null, new Date(2022, 0)],
                  [new Date(2025, 0), new Date(2027, 0)],
                  [new Date(2030, 0), null]
               ],
               chooseHalfyears: false,
               chooseMonths: false,
               chooseQuarters: false,
               delta: -1,
               result: 2022
            }
         ].forEach(function (options) {
            it('should update year', function () {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, options);
               jest.spyOn(component, '_notify').mockClear().mockImplementation();
               component._position = options.year;
               component._changeYear('event', options.delta);

               expect(component._position.getFullYear()).toEqual(options.result);
               expect(component._notify).toHaveBeenCalledWith('yearChanged', [options.result]);
            });
         });

         [
            {
               year: new Date(2018, 0),
               displayedRanges: [[new Date(2016, 0), new Date(2018, 0)]],
               delta: 1
            },
            {
               year: new Date(2018, 0),
               chooseHalfyears: false,
               chooseMonths: false,
               chooseQuarters: false,
               displayedRanges: [[new Date(2016, 0), new Date(2018, 0)]],
               delta: 1
            },
            {
               year: new Date(2018, 0),
               displayedRanges: [[new Date(2018, 0), new Date(2020, 0)]],
               delta: -1
            },
            {
               year: new Date(2024, 0),
               displayedRanges: [
                  [new Date(2018, 0), new Date(2020, 0)],
                  [new Date(2022, 0), null]
               ],
               chooseHalfyears: false,
               chooseMonths: false,
               chooseQuarters: false,
               delta: -1
            }
         ].forEach(function (options) {
            it('should not update year', function () {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, options);
               component._position = options.year;
               component._changeYear('event', options.delta);
               expect(options.year.getFullYear()).toEqual(component._position.getFullYear());
            });
         });
      });

      describe('_getYearsListPosition', function () {
         const currentYear = new Date().getFullYear();
         [
            [currentYear - 5, currentYear],
            [currentYear - 4, currentYear],
            [currentYear - 3, currentYear],
            [currentYear - 2, currentYear],
            [currentYear - 1, currentYear],
            [currentYear, currentYear],
            [currentYear + 1, currentYear + 1],
            [currentYear + 2, currentYear + 2],
            [currentYear + 3, currentYear + 3]
         ].forEach(function (test) {
            it(`should return ${test[1]} for ${test[0]} year`, function () {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {});
               let result = component
                  ._getYearsListPosition({
                     startValue: new Date(test[0], 0, 1),
                     dateConstructor: Date
                  })
                  .getFullYear();
               expect(result).toEqual(test[1]);
            });
         });
      });

      describe('_getFullYearsListPosition', () => {
         const now = new Date(2023, 0);
         [
            {
               displayedRanges: [[new Date(2020, 0), new Date(2025, 0)]],
               position: new Date(2021, 0),
               result: now.getFullYear()
            },
            {
               displayedRanges: [[new Date(2020, 0), new Date(2025, 0)]],
               position: new Date(2025, 0),
               result: 2025
            },
            {
               position: new Date(2021, 0),
               result: now.getFullYear()
            }
         ].forEach((test) => {
            it('should return correct position', () => {
               jest.useFakeTimers().setSystemTime(now.getTime());
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {});
               component._displayedRanges = test.displayedRanges;
               let result = component
                  ._getYearsListPosition({
                     startValue: test.position,
                     dateConstructor: Date
                  })
                  .getFullYear();
               expect(result).toEqual(test.result);
            });
         });
      });

      describe('_getYearItemCssClasses', function () {
         [
            {
               year: 2019,
               options: {
                  startValue: new Date(2018, 0, 1),
                  endValue: new Date(2018, 11, 31)
               },
               css: 'controls-PeriodLiteDialog__vLayoutItem-clickable'
            },
            {
               year: 2019,
               options: {},
               css: 'controls-PeriodLiteDialog__vLayoutItem-clickable'
            }
         ].forEach(function (test) {
            it(`should return "${test.css}". options: ${test.options}, year: ${test.year}`, function () {
               const component = calendarTestUtils.createComponent(
                  PeriodLiteDialog.View,
                  test.options
               );
               expect(component._getYearItemCssClasses(test.year)).toContain(test.css);
            });
         });
      });

      describe('_updateArrowButtonsState', () => {
         [
            {
               name: 'should set next arrow to readonly',
               displayedRanges: [[new Date(2019, 0), new Date(2021, 0)]],
               startValue: new Date(2019, 0),
               endValue: new Date(2019, 11, 31),
               nextArrowResult: false,
               prevArrowResult: true
            },
            {
               name: 'should set prev arrow to readonly',
               displayedRanges: [[new Date(2019, 0), new Date(2021, 0)]],
               startValue: new Date(2021, 0),
               endValue: new Date(2021, 11, 31),
               nextArrowResult: true,
               prevArrowResult: false
            },
            {
               name: 'should set prev and next arrows to readonly',
               displayedRanges: [[new Date(2019, 0), new Date(2019, 0)]],
               startValue: new Date(2019, 0),
               endValue: new Date(2019, 11, 31),
               nextArrowResult: true,
               prevArrowResult: true
            },
            {
               name: 'should set prev and next arrows to enable',
               startValue: new Date(2020, 0),
               endValue: new Date(2020, 11, 31),
               nextArrowResult: false,
               prevArrowResult: false
            }
         ].forEach((test) => {
            it(test.name, () => {
               const component = calendarTestUtils.createComponent(PeriodLiteDialog.View, {
                  displayedRanges: test.displayedRanges,
                  startValue: test.startValue,
                  endValue: test.endValue
               });
               component._updateArrowButtonsState();
               expect(test.nextArrowResult).toEqual(component._nextArrowButtonReadOnly);
               expect(test.prevArrowResult).toEqual(component._prevArrowButtonReadOnly);
            });
         });
      });
   });
});
