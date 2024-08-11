define([
   'Core/core-merge',
   'Controls/_calendar/Month/Model',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils'
], function (coreMerge, MonthModel, DateUtil, calendarTestUtils) {
   'use strict';

   // eslint-disable-next-line no-param-reassign
   MonthModel = MonthModel.default;

   let config = {
      month: new Date(2017, 0, 1)
   };

   describe('Controls/Date/Month/MonthModel', function () {
      describe('Initialisation', function () {
         it('should create the correct model for the month with selection when creating', function () {
            let mvm, weeks, cfg;

            cfg = coreMerge(
               {
                  startValue: new Date(2017, 0, 2),
                  endValue: new Date(2017, 1, -1)
               },
               config,
               { preferSource: true }
            );

            mvm = new MonthModel(cfg);
            weeks = mvm.getMonthArray();

            calendarTestUtils.assertMonthView(weeks, function (day) {
               if (
                  day.date.getMonth() === 0 &&
                  day.date.getDate() !== 1 &&
                  day.date.getDate() !== 31
               ) {
                  expect(day.selected).toBe(true);
               } else {
                  expect(day.selected).toBe(false);
               }
            });
            expect(DateUtil.Base.isDatesEqual(weeks[0][0].date, new Date(2016, 11, 26))).toBe(true);
         });
      });

      describe('.updateOptions', function () {
         it('should not update the model if the view does not change', function () {
            let mvm = new MonthModel(config),
               version = mvm.getVersion();

            jest.spyOn(mvm, '_isStateChanged').mockClear().mockReturnValue(false);
            jest.spyOn(mvm, '_validateWeeksArray').mockClear().mockImplementation();

            mvm.updateOptions(config);

            expect(mvm._validateWeeksArray).not.toHaveBeenCalled();
            expect(mvm.getVersion()).toBe(version);
         });

         it('should update the model if the view changed', function () {
            let mvm = new MonthModel(config),
               version = mvm.getVersion();

            jest.spyOn(mvm, '_isStateChanged').mockClear().mockReturnValue(true);
            jest.spyOn(mvm, '_validateWeeksArray').mockClear().mockImplementation();

            mvm.updateOptions(config);

            expect(mvm._validateWeeksArray).toHaveBeenCalled();
            expect(mvm.getVersion()).not.toEqual(version);
         });
      });

      describe('._isStateChanged', function () {
         let tests = [
            {
               start: new Date(2016, 0, 1),
               end: new Date(2016, 1, 0),
               newStart: new Date(2016, 1, 1),
               newEnd: new Date(2016, 2, 1),
               resp: false
            },
            {
               start: new Date(2016, 0, 1),
               end: new Date(2016, 1, 0),
               newStart: new Date(2018, 1, 1),
               newEnd: new Date(2018, 2, 1),
               resp: false
            },
            {
               start: new Date(2016, 0, 1),
               end: new Date(2017, 0, 15),
               newStart: new Date(2018, 1, 1),
               newEnd: new Date(2018, 2, 1),
               resp: true
            },
            {
               start: new Date(2017, 0, 10),
               end: new Date(2017, 0, 15),
               newStart: new Date(2018, 1, 1),
               newEnd: new Date(2018, 2, 1),
               resp: true
            },
            {
               start: new Date(2017, 0, 10),
               end: new Date(2017, 0, 15),
               newStart: new Date(2017, 0, 15),
               newEnd: new Date(2017, 0, 20),
               resp: true
            },
            {
               start: new Date(2016, 0, 10),
               end: new Date(2016, 0, 15),
               newStart: new Date(2017, 0, 15),
               newEnd: new Date(2017, 0, 20),
               resp: true
            },
            {
               hoveredStartValue: new Date(2017, 0, 4),
               hoveredEndValue: new Date(2017, 0, 7),
               singleDayHover: false,
               resp: true
            },
            {
               hoveredStartValue: new Date(2016, 11, 7),
               hoveredEndValue: new Date(2017, 0, 12),
               singleDayHover: false,
               resp: true
            },
            {
               hoveredStartValue: new Date(2018, 0, 1),
               hoveredEndValue: new Date(2018, 1, 1),
               singleDayHover: false,
               lastHoveredStartValue: new Date(2017, 0, 4),
               lastHoveredEndValue: new Date(2017, 0, 10),
               resp: true
            },
            {
               hoveredStartValue: new Date(2017, 1, 1),
               hoveredEndValue: new Date(2017, 1, 10),
               singleDayHover: false,
               resp: false
            }
         ];
         tests.forEach(function (test) {
            it(`should return ${test.resp}`, function () {
               let cfg = coreMerge(
                     {
                        startValue: test.start,
                        endValue: test.end,
                        hoveredStartValue: test.hoveredStartValue,
                        hoveredEndValue: test.hoveredEndValue
                     },
                     config,
                     { preferSource: true }
                  ),
                  mvm = new MonthModel(cfg);

               cfg.startValue = test.newStart;
               cfg.endValue = test.newEnd;
               mvm._singleDayHover = test.singleDayHover;
               mvm._state.hoveredEndValue = test.lastHoveredEndValue;
               mvm._state.hoveredStartValue = test.lastHoveredStartValue;

               expect(mvm._isStateChanged(cfg)).toBe(test.resp);
            });
         });
      });

      describe('_prepareClass', function () {
         const month = new Date(2019, 0, 1);
         [
            {
               date: month,
               options: {
                  month: month,
                  startValue: month,
                  endValue: month
               },
               cssClass: 'controls-MonthViewVDOM__item-selectedStartEnd'
            },
            {
               date: month,
               options: {
                  month: month,
                  startValue: month,
                  selectionProcessing: true
               },
               cssClass: 'controls-MonthViewVDOM__item-selectedStart'
            }
         ].forEach(function (test) {
            it(`should return correct css class if options are equal to ${JSON.stringify(
               test.options
            )}.`, function () {
               let model = new MonthModel(
                     coreMerge({ month: month }, test.options, {
                        preferSource: true
                     })
                  ),
                  css = model._prepareClass(model._getDayObject(test.date));
               expect(css).toContain(test.cssClass);
            });
         });
      });
   });
});
