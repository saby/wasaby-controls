define([
   'Core/core-merge',
   'Types/deferred',
   'Controls/dateRange',
   'Types/formatter',
   'Controls/datePopup',
   'Controls/scroll',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils'
], function (
   coreMerge,
   defferedLib,
   dateRange,
   formatter,
   PeriodDialog,
   scroll,
   dateUtils,
   calendarTestUtils
) {
   'use strict';

   const start = new Date(2018, 0, 1),
      end = new Date(2018, 0, 2);

   const formatDate = function (date) {
      if (dateUtils.Base.isValidDate(date)) {
         return formatter.date(date, formatter.date.FULL_DATE);
      }
      return date;
   };

   describe('Controls/Date/PeriodDialog', function () {
      describe('Initialisation', function () {
         it('should create the correct range model when empty range passed.', function () {
            const now = new Date(2019, 6, 1);
            jest.useFakeTimers().setSystemTime(now.getTime());
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});

            expect(component._monthStateEnabled).toBe(true);
            expect(component._yearStateEnabled).toBe(true);
            expect(component._state).toBe(component._STATES.year);
            expect(component._yearRangeSelectionType).toBe('range');
            expect(component._headerType).toBe('link');
            expect(
               dateUtils.Base.isDatesEqual(
                  component._displayedDate,
                  dateUtils.Base.getStartOfYear(now)
               )
            ).toBeTruthy();

            jest.useRealTimers();
         });

         it('should initialize if invalid start and end dates passed.', function () {
            const now = new Date(2019, 6, 1);
            jest.useFakeTimers().setSystemTime(now.getTime());
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});

            expect(
               dateUtils.Base.isDatesEqual(
                  component._displayedDate,
                  dateUtils.Base.getStartOfYear(now)
               )
            ).toBeTruthy();

            jest.useRealTimers();
         });

         it('should initialize _displayedDate as start of year if dialog opens in year mode.', function () {
            const innerStart = new Date(2018, 3, 1),
               innerEnd = new Date(2018, 4, 0),
               component = calendarTestUtils.createComponent(PeriodDialog.default, {
                  startValue: innerStart,
                  endValue: innerEnd
               });

            expect(
               dateUtils.Base.isDatesEqual(
                  component._displayedDate,
                  dateUtils.Base.getStartOfYear(innerStart)
               )
            ).toBeTruthy();
         });

         // TODO: Новое правило сонаркуба не позволяет использовать приватные поля.
         //  Расскипать когда будем писать правильные тесты.
         // it('should create the correct range models when empty range passed.', function () {
         //    const component = calendarTestUtils.createComponent(
         //       PeriodDialog.default,
         //       {}
         //    );
         //    expect(component._rangeModel.startValue).toEqual(null);
         //    expect(component._rangeModel.endValue).toEqual(null);
         //    expect(component._headerRangeModel.startValue).not.toBeDefined();
         //    expect(component._headerRangeModel.endValue).not.toBeDefined();
         //    expect(component._yearRangeModel.startValue).not.toBeDefined();
         //    expect(component._yearRangeModel.endValue).not.toBeDefined();
         // });

         it('should create the correct range models when range passed.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {
               startValue: start,
               endValue: end
            });
            expect(
               dateUtils.Base.isDatesEqual(component._rangeModel.startValue, start)
            ).toBeTruthy();
            expect(dateUtils.Base.isDatesEqual(component._rangeModel.endValue, end)).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.endValue, end)
            ).toBeTruthy();
            expect(component._yearRangeModel.startValue).not.toBeDefined();
            expect(component._yearRangeModel.endValue).not.toBeDefined();
         });

         [
            {
               options: {},
               yearModel: {
                  startValue: undefined,
                  endValue: undefined
               }
            },
            {
               options: {
                  startValue: new Date(2019, 1, 1),
                  endValue: new Date(2020, 0, 0)
               },
               yearModel: {
                  startValue: undefined,
                  endValue: undefined
               }
            },
            {
               options: {
                  startValue: new Date(2019, 0, 1),
                  endValue: new Date(2019, 1, 10)
               },
               yearModel: {
                  startValue: undefined,
                  endValue: undefined
               }
            },
            {
               options: {
                  startValue: new Date(2019, 0, 1),
                  endValue: new Date(2020, 0, 0)
               },
               yearModel: {
                  startValue: new Date(2019, 0, 1),
                  endValue: new Date(2020, 0, 0)
               }
            }
         ].forEach(function (test) {
            it(`should update _yearsModel if options are equals ${JSON.stringify(
               test.options
            )}.`, function () {
               const component = calendarTestUtils.createComponent(
                  PeriodDialog.default,
                  test.options
               );
               expect(
                  dateUtils.Base.isDatesEqual(
                     component._yearRangeModel.startValue,
                     test.yearModel.startValue
                  )
               ).toBeTruthy();
               expect(
                  dateUtils.Base.isDatesEqual(
                     component._yearRangeModel.endValue,
                     test.yearModel.endValue
                  )
               ).toBeTruthy();
            });
         });

         [
            {
               selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.range
            },
            {
               selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.range,
               ranges: { months: [1], days: [1] }
            }
         ].forEach(function (options) {
            it(`should enable year and month modes if options are equals ${JSON.stringify(
               options
            )}.`, function () {
               const component = calendarTestUtils.createComponent(PeriodDialog.default, options);
               expect(component._monthStateEnabled).toBe(true);
               expect(component._yearStateEnabled).toBe(true);
               expect(component._state).toBe(component._STATES.year);
               expect(component._yearRangeSelectionType).toBe(options.selectionType);
               expect(component._monthRangeSelectionType).toBe(options.selectionType);
            });
         });

         [
            {
               selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.quantum,
               ranges: { quarters: [1] }
            },
            {
               selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.quantum,
               ranges: { halfyears: [1] }
            }
         ].forEach((test) => {
            it('should set correct _monthRangeSelectionType and _monthRangeQuantum', () => {
               const component = calendarTestUtils.createComponent(PeriodDialog.default, test);
               expect(component._monthRangeSelectionType).toBe(test.selectionType);
               expect(JSON.stringify(component._monthRangeQuantum)).toBe(
                  JSON.stringify(test.ranges)
               );
            });
         });

         [
            {
               selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.single
            },
            {
               selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.range,
               ranges: { days: [1] }
            }
         ].forEach(function (options) {
            it(`should enable only month mode if options are equals ${JSON.stringify(
               options
            )}.`, function () {
               const component = calendarTestUtils.createComponent(PeriodDialog.default, options);
               expect(component._monthStateEnabled).toBe(true);
               expect(component._yearStateEnabled).toBe(false);
               expect(component._yearRangeSelectionType).toBe(
                  dateRange.IDateRangeSelectable.SELECTION_TYPES.disable
               );
               expect(component._monthRangeSelectionType).toBe(
                  dateRange.IDateRangeSelectable.SELECTION_TYPES.disable
               );
            });
         });

         [
            {
               selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.quantum,
               ranges: { years: [1] }
            },
            {
               selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.quantum,
               ranges: { months: [1] }
            }
         ].forEach(function (options) {
            it(`should enable only year mode if options are equals ${JSON.stringify(
               options
            )}.`, function () {
               const component = calendarTestUtils.createComponent(PeriodDialog.default, options);
               expect(component._monthStateEnabled).toBe(false);
               expect(component._yearStateEnabled).toBe(true);
            });
         });

         [
            {
               state: 'year',
               tests: [
                  {},
                  {
                     startValue: new Date(2019, 0, 1),
                     endValue: new Date(2019, 1, 0)
                  },
                  {
                     startValue: new Date(2019, 0, 3),
                     endValue: new Date(2019, 1, 10)
                  }
               ]
            },
            {
               state: 'month',
               tests: [
                  {
                     startValue: new Date(2019, 0, 1),
                     endValue: new Date(2019, 0, 1)
                  },
                  {
                     selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.single
                  },
                  {
                     selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.quantum,
                     ranges: { days: [1] }
                  },
                  {
                     selectionType: dateRange.IDateRangeSelectable.SELECTION_TYPES.quantum,
                     ranges: { weeks: [1] }
                  }
               ]
            }
         ].forEach(function (testGroup) {
            testGroup.tests.forEach(function (options) {
               it(`should set ${
                  testGroup.state
               } state if options are equals ${JSON.stringify(options)}.`, function () {
                  const component = calendarTestUtils.createComponent(
                     PeriodDialog.default,
                     options
                  );
                  expect(component._state).toEqual(testGroup.state);
               });
            });
         });

         it('should initialize readOnly state.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {
               readOnly: true
            });
            expect(component._yearRangeSelectionType).toBe(
               dateRange.IDateRangeSelectable.SELECTION_TYPES.disable
            );
         });

         it('should set correct header type.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {
               headerType: 'input'
            });
            expect(component._headerType).toBe('input');
         });

         describe('mask', function () {
            [
               {
                  options: {},
                  mask: 'DD.MM.YY'
               },
               {
                  options: { mask: 'DD.MM.YY hh:mm' },
                  mask: 'DD.MM.YY hh:mm'
               },
               {
                  options: { minRange: 'month' },
                  mask: 'MM.YYYY'
               }
            ].forEach(function (test) {
               it(`should set mask to ${
                  test.mask
               } if options are equals ${JSON.stringify(test.options)}.`, function () {
                  const component = calendarTestUtils.createComponent(
                     PeriodDialog.default,
                     test.options
                  );
                  expect(component._mask).toBe(test.mask);
               });
            });
         });

         describe('validators', function () {
            it('should create validators list.', function () {
               const validators = [
                     jest.fn(),
                     {
                        validator: jest.fn()
                     },
                     {
                        validator: jest.fn(),
                        arguments: {}
                     }
                  ],
                  component = calendarTestUtils.createComponent(PeriodDialog.default, {
                     startValueValidators: validators,
                     endValueValidators: validators
                  });

               expect(Array.isArray(component._startValueValidators)).toBe(true);
               expect(component._startValueValidators.length).toBe(4);

               expect(Array.isArray(component._endValueValidators)).toBe(true);
               expect(component._endValueValidators.length).toBe(4);
            });
         });
      });

      describe('_afterUpdate', function () {
         it('should not activate default autofocus field if _activateInputField is equal false.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});

            jest.spyOn(component, 'activate').mockClear().mockImplementation();
            component._afterUpdate();
            expect(component._activateInputField).toBe(false);
            expect(component.activate).not.toHaveBeenCalled();
         });
         it('should activate default autofocus field if _activateInputField is equal true.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});

            component._activateInputField = true;
            jest.spyOn(component, 'activate').mockClear().mockImplementation();

            component._afterUpdate();

            expect(component._activateInputField).toBe(false);
            expect(component.activate).toHaveBeenCalled();
         });
      });

      describe('_todayCalendarClick', function () {
         it('should update _displayedDate.', function () {
            const oldDate = new Date(2017, 0, 1),
               component = calendarTestUtils.createComponent(PeriodDialog.default, {
                  startValue: oldDate,
                  endValue: oldDate
               });
            expect(dateUtils.Base.isDatesEqual(component._displayedDate, oldDate)).toBeTruthy();
            component._todayCalendarClick();
            expect(dateUtils.Base.isMonthsEqual(component._displayedDate, new Date())).toBeTruthy();
         });
      });

      describe('_headerLinkClick', function () {
         it('should toggle header type.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            expect(component._headerType).toBe('link');
            component._headerLinkClick();
            expect(component._headerType).toBe('input');
            expect(component._activateInputField).toBe(true);
         });
      });

      describe('_onHeaderLinkRangeChanged', function () {
         it('should update range.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {
               startValue: new Date(2019, 0, 1),
               endValue: new Date(2019, 1, 0)
            });
            component._onHeaderLinkRangeChanged(null, null, null);
            expect(component._rangeModel.startValue).toBeNull();
            expect(component._rangeModel.endValue).toBeNull();
         });
      });

      describe('_startValuePickerChanged', function () {
         it('should update start value.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {}),
               date = new Date();
            component._startValuePickerChanged(date);
            expect(component._rangeModel.startValue).toBe(date);
            expect(component._headerRangeModel.startValue).toBe(date);
         });
      });

      describe('_endValuePickerChanged', function () {
         [
            {
               options: {},
               date: new Date(2019, 6, 10),
               endValue: new Date(2019, 6, 10)
            },
            {
               options: { mask: 'MM.YYYY' },
               date: new Date(2019, 6, 10),
               endValue: new Date(2019, 7, 0)
            },
            {
               options: { mask: 'MM.YYYY' },
               date: new Date('InvalidDate'),
               endValue: new Date('InvalidDate')
            },
            {
               options: { mask: 'MM.YYYY' },
               date: null,
               endValue: null
            }
         ].forEach(function (test) {
            it(`should update end value to ${formatDate(
               test.endValue
            )} if ${formatDate(test.date)} is passed and options is equal ${JSON.stringify(test.options)}.`, function () {
               const component = calendarTestUtils.createComponent(
                  PeriodDialog.default,
                  test.options
               );
               component._endValuePickerChanged(test.date);
               expect(
                  dateUtils.Base.isDatesEqual(component._rangeModel.endValue, test.endValue)
               ).toBeTruthy();
               expect(
                  dateUtils.Base.isDatesEqual(component._headerRangeModel.endValue, test.endValue)
               ).toBeTruthy();
            });
         });
      });

      describe('_toggleStateClick', function () {
         [
            {
               options: {
                  startValue: new Date(2019, 3, 10),
                  endValue: new Date(2019, 5, 0)
               },
               state: 'year',
               displayedDate: new Date(2019, 3, 1)
            },
            {
               options: {
                  startValue: new Date(2019, 3, 10),
                  endValue: new Date(2019, 5, 0)
               },
               state: 'month',
               displayedDate: new Date(2019, 0, 1)
            }
         ].forEach(function (test) {
            it('should toggle state and set correct displayed date.', function () {
               const component = calendarTestUtils.createComponent(
                  PeriodDialog.default,
                  test.options
               );
               component._state = test.state;
               component._toggleStateClick();
               expect(component._state).toBe(
                  test.state === component._STATES.year
                     ? component._STATES.month
                     : component._STATES.year
               );
               expect(
                  dateUtils.Base.isDatesEqual(component._displayedDate, test.displayedDate)
               ).toBeTruthy();
            });
         });
         it('should call stateChangedCallback', () => {
            let callbackCalled = false;
            const stateChangedCallback = () => {
               callbackCalled = true;
            };
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {
               stateChangedCallback
            });
            component._toggleStateClick();

            expect(callbackCalled).toBe(true);
         });
      });

      describe('_yearsRangeChanged', function () {
         it('should update range models.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            component._yearsRangeChanged(null, start, end);
            expect(
               dateUtils.Base.isDatesEqual(component._rangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(
                  component._rangeModel.endValue,
                  dateUtils.Base.getEndOfYear(end)
               )
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(
                  component._headerRangeModel.endValue,
                  dateUtils.Base.getEndOfYear(end)
               )
            ).toBeTruthy();
         });
      });

      describe('_yearsSelectionChanged', function () {
         it('should update range models and displayed day.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            component._yearsSelectionChanged(null, start, end);
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(
                  component._headerRangeModel.endValue,
                  dateUtils.Base.getEndOfYear(end)
               )
            ).toBeTruthy();
         });
      });

      describe('_monthsRangeChanged', function () {
         it('should update range models.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            component._monthsRangeChanged(null, start, end);
            expect(
               dateUtils.Base.isDatesEqual(component._rangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(
                  component._rangeModel.endValue,
                  dateUtils.Base.getEndOfMonth(end)
               )
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(
                  component._headerRangeModel.endValue,
                  dateUtils.Base.getEndOfMonth(end)
               )
            ).toBeTruthy();
         });
      });

      describe('_monthsSelectionChanged', function () {
         it('should update range models.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            component._monthsSelectionChanged(null, start, end);
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(
                  component._headerRangeModel.endValue,
                  dateUtils.Base.getEndOfMonth(end)
               )
            ).toBeTruthy();
         });
      });

      describe('_monthRangeMonthClick', function () {
         it('should toggle state and update _displayedDate.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {}),
               newDate = dateUtils.Base.getStartOfMonth(new Date());
            expect(component._state).toBe(component._STATES.year);
            component._monthRangeMonthClick(null, newDate);
            expect(component._state).toBe(component._STATES.month);
            expect(dateUtils.Base.isDatesEqual(component._displayedDate, newDate)).toBeTruthy();
         });
      });

      describe('_monthRangeFixedPeriodClick', function () {
         it('should update range models.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            component._monthRangeFixedPeriodClick(null, start, end);
            expect(
               dateUtils.Base.isDatesEqual(component._rangeModel.startValue, start)
            ).toBeTruthy();
            expect(dateUtils.Base.isDatesEqual(component._rangeModel.endValue, end)).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.endValue, end)
            ).toBeTruthy();
            expect(component._monthRangeSelectionProcessing).toBe(false);
         });
      });

      describe('_dateRangeChanged', function () {
         it('should update range models.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            component._dateRangeChanged(null, start, end);
            expect(
               dateUtils.Base.isDatesEqual(component._rangeModel.startValue, start)
            ).toBeTruthy();
            expect(dateUtils.Base.isDatesEqual(component._rangeModel.endValue, end)).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.endValue, end)
            ).toBeTruthy();
         });
      });

      describe('rangeChanged', () => {
         [
            {
               startValue: new Date(2021, 0, 1),
               endValue: new Date(2022, 0, 1),
               testName: 'should update range model with new date',
               resultStartValue: new Date(2021, 0, 1),
               resultEndValue: new Date(2022, 0, 1),
               selectionType: 'range'
            },
            {
               startValue: null,
               endValue: null,
               testName: 'should update range model with nulls',
               resultStartValue: null,
               resultEndValue: null,
               selectionType: 'range'
            }
         ].forEach((test) => {
            it(test.testName, () => {
               const component = calendarTestUtils.createComponent(PeriodDialog.default, {
                  selectionType: test.selectionType
               });
               component.rangeChanged(test.startValue, test.endValue);
               if (component._rangeModel.startValue && component._rangeModel.endValue) {
                  expect(component._rangeModel.startValue.getTime()).toEqual(
                     test.resultStartValue.getTime()
                  );
                  expect(component._rangeModel.endValue.getTime()).toEqual(
                     test.resultEndValue.getTime()
                  );
                  expect(component._headerRangeModel.startValue.getTime()).toEqual(
                     test.resultStartValue.getTime()
                  );
                  expect(component._headerRangeModel.endValue.getTime()).toEqual(
                     test.resultEndValue.getTime()
                  );
               } else {
                  expect(component._rangeModel.startValue).toEqual(test.resultStartValue);
                  expect(component._rangeModel.endValue).toEqual(test.resultEndValue);
                  expect(component._headerRangeModel.startValue).toEqual(test.resultStartValue);
                  expect(component._headerRangeModel.endValue).toEqual(test.resultEndValue);
               }
            });
         });
      });

      describe('_dateRangeSelectionChanged', function () {
         it('should update range models.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            component._dateRangeSelectionChanged(null, start, end);
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.endValue, end)
            ).toBeTruthy();
         });
      });

      describe('_dateRangeFixedPeriodClick', function () {
         it('should update range models.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            component._dateRangeFixedPeriodClick(null, start, end);
            expect(
               dateUtils.Base.isDatesEqual(component._rangeModel.startValue, start)
            ).toBeTruthy();
            expect(dateUtils.Base.isDatesEqual(component._rangeModel.endValue, end)).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.startValue, start)
            ).toBeTruthy();
            expect(
               dateUtils.Base.isDatesEqual(component._headerRangeModel.endValue, end)
            ).toBeTruthy();
            expect(component._monthRangeSelectionProcessing).toBe(false);
         });
      });

      describe('_keyDownHandler', () => {
         [
            {
               methodName: '_scrollToCurrentMonth',
               event: {
                  nativeEvent: {
                     keyCode: 36
                  }
               }
            },
            {
               methodName: '_notify',
               event: {
                  nativeEvent: {
                     keyCode: 27
                  }
               }
            }
         ].forEach((test) => {
            it(`should call ${test.methodName}`, () => {
               const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
               jest.spyOn(component, test.methodName).mockClear().mockImplementation();
               component._keyDownHandler(test.event);

               expect(component[test.methodName]).toHaveBeenCalledTimes(1);
            });
         });
      });

      describe('_dateRangeSelectionEnded', function () {
         it('should generate "sendResult" event.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {}),
               innerStart = new Date(),
               innerEnd = new Date();

            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._monthSelectionProcessing = true;
            component._dateRangeSelectionEnded(null, innerStart, innerEnd);
            expect(component._notify).toHaveBeenCalledWith('sendResult', [innerStart,
               dateUtils.Base.getEndOfMonth(innerEnd)], {
               bubbling: true
            });
         });
      });

      describe('_applyClick', function () {
         it('should generate "sendResult" event if validation successful.', function () {
            const innerStart = new Date(),
               innerEnd = new Date(),
               self = calendarTestUtils.createComponent(PeriodDialog.default, {
                  startValue: innerStart,
                  endValue: innerEnd
               });

            var setTimeToZero = function (date) {
               var newDate = new Date(date.getTime());

               newDate.setHours(0);
               newDate.setMinutes(0);
               newDate.setSeconds(0);
               newDate.setMilliseconds(0);

               return newDate;
            };

            jest.spyOn(self, '_notify').mockClear().mockImplementation();
            self._children = {
               formController: {
                  submit: function () {
                     return new defferedLib.Deferred().callback({ 0: null, 1: null });
                  }
               }
            };
            return self._applyClick(null).then(() => {
               expect(self._notify).toHaveBeenCalledWith(
                  'sendResult',
                  [setTimeToZero(innerStart), setTimeToZero(innerEnd)],
                  { bubbling: true }
               );
            });
         });
         it('should generate "sendResult" event if validation failed.', function () {
            const innerStart = new Date(),
               innerEnd = new Date(),
               component = calendarTestUtils.createComponent(PeriodDialog.default, {
                  startValue: innerStart,
                  endValue: innerEnd
               });

            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._children = {
               formController: {
                  submit: function () {
                     return new defferedLib.Deferred().callback({ 0: ['error'], 1: null });
                  }
               }
            };
            return component._applyClick(null).then(() => {
               expect(component._notify).not.toHaveBeenCalled();
            });
         });
      });

      describe('_inputFocusOutHandler', function () {
         const event = {
            nativeEvent: {}
         };

         it('should reset header type if the focus is not on the input fields.', function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {}),
               defaultOptions = calendarTestUtils.prepareOptions(PeriodDialog.default);

            component._children = {
               inputs: {
                  contains: function () {
                     return false;
                  }
               },
               formController: {
                  submit: function () {
                     return new defferedLib.Deferred().callback({ 0: null, 1: null });
                  }
               }
            };

            component._headerType = 'someHeaderType';
            return component._inputFocusOutHandler(event).then(() => {
               expect(component._headerType).toBe(defaultOptions.headerType);
            });
         });

         it("should't reset header type if the focus is on the input fields.", function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {}),
               headerType = 'someHeaderType';

            component._children = {
               inputs: {
                  contains: function () {
                     return true;
                  }
               }
            };

            component._headerType = headerType;
            return component._inputFocusOutHandler(event).then(() => {
               expect(component._headerType).toBe(headerType);
            });
         });

         it("should't reset header type if validation of the input fields is failed.", function () {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {}),
               headerType = 'someHeaderType';

            component._children = {
               inputs: {
                  contains: function () {
                     return false;
                  }
               },
               formController: {
                  submit: function () {
                     return new defferedLib.Deferred().callback({ 0: [], 1: null });
                  }
               }
            };

            component._headerType = headerType;
            return component._inputFocusOutHandler(event).then(() => {
               expect(component._headerType).toBe(headerType);
            });
         });
      });

      describe('_inputControlHandler', function () {
         [
            {
               selectionType: 'range'
            },
            {
               selectionType: 'quantum'
            }
         ].forEach(function (test) {
            it('should activate adjacent input', function () {
               const component = calendarTestUtils.createComponent(PeriodDialog.default, {}),
                  displayValue = {
                     length: 8
                  },
                  selection = {
                     end: 8
                  };
               let result = false;
               component._children = {
                  endValueField: {
                     activate: () => {
                        result = true;
                     }
                  }
               };
               component._options = {
                  selectionType: test.selectionType
               };
               component._inputControlHandler('e', 'value', displayValue, selection);
               expect(result).toBe(true);
            });
         });
         [
            {
               selectionType: 'range',
               displayValueLength: 8,
               selectionEnd: 7
            },
            {
               selectionType: 'single',
               displayValueLength: 8,
               selectionEnd: 8
            }
         ].forEach(function (test) {
            it('should not activate adjacent input', function () {
               const component = calendarTestUtils.createComponent(PeriodDialog.default, {}),
                  displayValue = {
                     length: test.displayValueLength
                  },
                  selection = {
                     end: test.selectionEnd
                  };
               let result = false;
               component._children = {
                  endValueField: {
                     activate: () => {
                        result = true;
                     }
                  }
               };
               component._options = {
                  selectionType: test.selectionType
               };

               component._inputControlHandler('e', 'value', displayValue, selection);
               expect(result).toBe(false);
            });
         });
      });

      describe('_monthsRangeSelectionEnded', () => {
         it('should send correct range with rangeSelectedCallback', () => {
            const startValue = new Date(2018, 0);
            const endValue = new Date(2018, 2);
            const formattedStartValue = new Date(2018, 0, 2);
            const formattedEndValue = new Date(2018, 3);
            const rangeSelectedCallback = (innerStartValue, innerEndValue) => {
               return [
                  new Date(
                     innerStartValue.getFullYear(),
                     innerStartValue.getMonth(),
                     innerStartValue.getDate() + 1
                  ),
                  new Date(
                     innerEndValue.getFullYear(),
                     innerEndValue.getMonth(),
                     innerEndValue.getDate() + 1
                  )
               ];
            };
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {
               rangeSelectedCallback
            });
            const stubSendResult = jest
               .spyOn(component, 'sendResult')
               .mockClear()
               .mockImplementation();
            component._monthsRangeSelectionEnded(null, startValue, endValue);
            expect(stubSendResult).toHaveBeenCalledWith(formattedStartValue, formattedEndValue);
         });
      });

      describe('_yearsRangeSelectionEnded', () => {
         it('should send correct range with rangeSelectedCallback', () => {
            const startValue = new Date(2018, 0);
            const endValue = new Date(2018, 0);
            const formattedStartValue = new Date(2018, 0, 2);
            const formattedEndValue = new Date(2019, 0);
            const rangeSelectedCallback = (startValue1, endValue1) => {
               return [
                  new Date(
                     startValue1.getFullYear(),
                     startValue1.getMonth(),
                     startValue1.getDate() + 1
                  ),
                  new Date(endValue1.getFullYear(), endValue1.getMonth(), endValue1.getDate() + 1)
               ];
            };
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {
               rangeSelectedCallback
            });
            const stubSendResult = jest
               .spyOn(component, 'sendResult')
               .mockClear()
               .mockImplementation();
            component._yearsRangeSelectionEnded(null, startValue, endValue);
            expect(stubSendResult).toHaveBeenCalledWith(formattedStartValue, formattedEndValue);
         });
      });

      describe('_yearCanBeDisplayed', () => {
         it('should return false, if we want to scroll to last visible year', () => {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            const value = new Date(dateUtils.Base.MAX_YEAR_VALUE, 0);
            const result = component._yearCanBeDisplayed(value);
            expect(result).toBe(false);
         });

         it('should return true, if we want to scroll to not last visible year', () => {
            const component = calendarTestUtils.createComponent(PeriodDialog.default, {});
            const value = new Date(2021, 0);
            const result = component._yearCanBeDisplayed(value);
            expect(result).toBe(true);
         });
      });
   });
});
