define(['Core/core-instance', 'Controls/dateRange'], function (cInstance, dateRange) {
   'use strict';

   describe('Controls/dateRange:DateRangeModel', function () {
      describe('.update', function () {
         it('should update [start|end]Value fields', function () {
            let model = new dateRange.DateRangeModel(),
               options = {
                  startValue: new Date(2018, 0, 1),
                  endValue: new Date(2018, 0, 3)
               };

            model.update(options);

            expect(model.startValue).toBe(options.startValue);
            expect(model.endValue).toBe(options.endValue);
         });

         it('should not update [start|end]Value fields if they were not updated from the outside', function () {
            let model = new dateRange.DateRangeModel(),
               startValue = new Date(2018, 0, 1),
               endValue = new Date(2018, 0, 3);

            model.setRange(startValue, endValue);
            model.update({});

            expect(model.startValue).toBe(startValue);
            expect(model.endValue).toBe(endValue);
         });
      });

      ['startValue', 'endValue'].forEach(function (field) {
         describe(`.${field}`, function () {
            it(`should update ${field} if value changed`, function () {
               let model = new dateRange.DateRangeModel(),
                  value = new Date(2018, 0, 1),
                  callback = jest.fn(),
                  rangeChangedCallback = jest.fn();

               model.subscribe(`${field}Changed`, callback);
               model.subscribe('rangeChanged', rangeChangedCallback);
               model[field] = value;

               expect(model[field]).toBe(value);
               expect(callback).toHaveBeenCalledTimes(1);
               expect(rangeChangedCallback).toHaveBeenCalledTimes(1);
            });

            it(`should not update ${field} if value did not changed`, function () {
               let model = new dateRange.DateRangeModel(),
                  value = new Date(2018, 0, 1),
                  callback = jest.fn(),
                  rangeChangedCallback = jest.fn(),
                  valueChangedCallback = jest.fn(),
                  options = {};

               options[field] = value;
               model.update(options);

               model.subscribe(`${field}Changed`, callback);
               model.subscribe('rangeChanged', rangeChangedCallback);
               model.subscribe('valueChanged', valueChangedCallback);
               model[field] = value;

               expect(model[field]).toBe(value);
               expect(callback).not.toHaveBeenCalled();
               expect(rangeChangedCallback).not.toHaveBeenCalled();
               expect(valueChangedCallback).not.toHaveBeenCalled();
            });
         });
      });

      describe('.shiftForward', function () {
         [
            {
               startValue: new Date(2019, 11),
               endValue: new Date(2019, 11),
               displayedRanges: [[new Date(2018, 0), new Date(2020, 0)]]
            },
            {
               startValue: new Date(2020, 1),
               endValue: new Date(2020, 1),
               displayedRanges: [[new Date(2017, 0), new Date(2020, 0)]]
            },
            {
               startValue: new Date(2020, 0),
               endValue: new Date(2020, 0),
               displayedRanges: [
                  [new Date(2017, 0), new Date(2020, 0)],
                  [new Date(2025, 0), new Date(2030, 0)]
               ]
            },
            {
               startValue: new Date(2020, 9),
               endValue: new Date(2020, 12, 0),
               displayedRanges: [[new Date(2020, 0), new Date(2022, 0)]]
            },
            {
               startValue: new Date(2020, 0),
               endValue: new Date(2022, 0),
               displayedRanges: [[new Date(2019, 0), null]]
            }
         ].forEach(function (test) {
            it('should shift forward with displayedRanges', function () {
               let model = new dateRange.DateRangeModel({});
               model.update({
                  startValue: test.startValue,
                  endValue: test.endValue,
                  displayedRanges: test.displayedRanges
               });

               model.shiftForward();

               expect(test.startValue.getTime()).not.toEqual(model.startValue.getTime());
               expect(test.endValue.getTime()).not.toEqual(model.endValue.getTime());
            });
         });

         [
            {
               startValue: new Date(2019, 11),
               endValue: new Date(2020, 0, 0),
               displayedRanges: [[new Date(2018, 0), new Date(2019, 0)]]
            },
            {
               startValue: new Date(2020, 0),
               endValue: new Date(2021, 0),
               displayedRanges: [[new Date(2017, 0), new Date(2020, 0)]]
            },
            {
               startValue: new Date(2020, 9),
               endValue: new Date(2020, 12, 0),
               displayedRanges: [[new Date(2017, 0), new Date(2020, 0)]]
            }
         ].forEach(function (test) {
            it('should not shift forward with displayedRanges', function () {
               let model = new dateRange.DateRangeModel({});
               model.update({
                  startValue: test.startValue,
                  endValue: test.endValue,
                  displayedRanges: test.displayedRanges
               });

               model.shiftForward();

               expect(test.startValue.getTime()).toEqual(model.startValue.getTime());
               expect(test.endValue.getTime()).toEqual(model.endValue.getTime());
            });
         });
         [
            {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 0, 31),
               rStart: new Date(2018, 1, 1),
               rEnd: new Date(2018, 1, 28)
            },
            {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 2, 31),
               rStart: new Date(2018, 3, 1),
               rEnd: new Date(2018, 5, 30)
            },
            {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 5, 30),
               rStart: new Date(2018, 6, 1),
               rEnd: new Date(2018, 11, 31)
            }
         ].forEach(function (test) {
            it('should shift period forward', function () {
               let model = new dateRange.DateRangeModel();

               model.update({ startValue: test.start, endValue: test.end });
               model.shiftForward();

               expect(model.startValue.getTime()).toEqual(test.rStart.getTime());
               cInstance.instanceOfModule(model.startValue, 'Types/entity:DateTime');
               expect(model.endValue.getTime()).toEqual(test.rEnd.getTime());
               cInstance.instanceOfModule(model.endValue, 'Types/entity:DateTime');
            });
         });

         [
            {
               startValue: new Date(2019, 0, 7),
               endValue: new Date(2019, 0, 11),
               selectionType: 'quantum',
               ranges: {
                  weeks: [1]
               },
               rangeSelectedCallback: (startValue, endValue) => {
                  return [
                     new Date(
                        startValue.getFullYear(),
                        startValue.getMonth(),
                        startValue.getDate()
                     ),
                     new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate() - 2)
                  ];
               },
               result: [new Date(2019, 0, 14), new Date(2019, 0, 18)]
            },
            {
               startValue: new Date(2019, 0, 7),
               endValue: new Date(2019, 0, 12),
               selectionType: 'quantum',
               ranges: {
                  days: [3]
               },
               rangeSelectedCallback: (startValue, endValue) => {
                  return [
                     new Date(
                        startValue.getFullYear(),
                        startValue.getMonth(),
                        startValue.getDate()
                     ),
                     new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate() + 3)
                  ];
               },
               result: [new Date(2019, 0, 10), new Date(2019, 0, 15)]
            },
            {
               startValue: new Date(2019, 0, 7),
               endValue: new Date(2019, 0, 9),
               selectionType: 'quantum',
               ranges: {
                  days: [3]
               },
               result: [new Date(2019, 0, 10), new Date(2019, 0, 12)]
            },
            {
               startValue: new Date(2019, 0, 7),
               endValue: new Date(2019, 0, 13),
               selectionType: 'quantum',
               ranges: {
                  days: [7]
               },
               result: [new Date(2019, 0, 14), new Date(2019, 0, 20)]
            }
         ].forEach(function (test) {
            it('should shift period with quantum forward', function () {
               let model = new dateRange.DateRangeModel();

               model.update({
                  startValue: test.startValue,
                  endValue: test.endValue,
                  selectionType: 'quantum',
                  ranges: test.ranges,
                  rangeSelectedCallback: test.rangeSelectedCallback
               });
               model.shiftForward();
               expect(model.startValue.getTime()).toEqual(test.result[0].getTime());
               cInstance.instanceOfModule(model.startValue, 'Types/entity:DateTime');
               expect(model.endValue.getTime()).toEqual(test.result[1].getTime());
               cInstance.instanceOfModule(model.endValue, 'Types/entity:DateTime');
            });
         });
      });

      describe('.shiftBack', function () {
         [
            {
               startValue: new Date(2019, 7),
               endValue: new Date(2019, 7),
               displayedRanges: [[new Date(2019, 0), new Date(2020, 0)]]
            },
            {
               startValue: new Date(2020, 1),
               endValue: new Date(2020, 1),
               displayedRanges: [[new Date(2017, 0), new Date(2020, 0)]]
            },
            {
               startValue: new Date(2020, 0),
               endValue: new Date(2020, 2, 0),
               displayedRanges: [
                  [new Date(2015, 0), new Date(2017, 0)],
                  [new Date(2020, 0), new Date(2030, 0)]
               ]
            },
            {
               startValue: new Date(2020, 9),
               endValue: new Date(2020, 11),
               displayedRanges: [[new Date(2020, 0), new Date(2022, 0)]]
            },
            {
               startValue: new Date(2020, 0),
               endValue: new Date(2022, 0),
               displayedRanges: [[null, new Date(2023, 0)]]
            }
         ].forEach(function (test) {
            it('should shift back with displayedRanges', function () {
               let model = new dateRange.DateRangeModel({});
               model.update({
                  startValue: test.startValue,
                  endValue: test.endValue,
                  displayedRanges: test.displayedRanges
               });

               model.shiftBack();

               expect(test.startValue.getTime()).not.toEqual(model.startValue.getTime());
               expect(test.endValue.getTime()).not.toEqual(model.endValue.getTime());
            });
         });

         [
            {
               startValue: new Date(2019, 0),
               endValue: new Date(2019, 0),
               displayedRanges: [[new Date(2019, 0), new Date(2019, 0)]]
            },
            {
               startValue: new Date(2017, 0),
               endValue: new Date(2017, 0),
               displayedRanges: [[new Date(2017, 0), new Date(2020, 0)]]
            }
         ].forEach(function (test) {
            it('should not shift forward with displayedRanges', function () {
               let model = new dateRange.DateRangeModel({});
               model.update({
                  startValue: test.startValue,
                  endValue: test.endValue,
                  displayedRanges: test.displayedRanges
               });

               model.shiftBack();

               expect(test.startValue.getTime()).toEqual(model.startValue.getTime());
               expect(test.endValue.getTime()).toEqual(model.endValue.getTime());
            });
         });
         [
            {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 0, 31),
               rStart: new Date(2017, 11, 1),
               rEnd: new Date(2017, 11, 31)
            },
            {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 2, 31),
               rStart: new Date(2017, 9, 1),
               rEnd: new Date(2017, 11, 31)
            },
            {
               start: new Date(2018, 0, 1),
               end: new Date(2018, 5, 30),
               rStart: new Date(2017, 6, 1),
               rEnd: new Date(2017, 11, 31)
            }
         ].forEach(function (test) {
            it('should shift period back', function () {
               let model = new dateRange.DateRangeModel();

               model.update({ startValue: test.start, endValue: test.end });
               model.shiftBack();

               expect(model.startValue.getTime()).toEqual(test.rStart.getTime());
               cInstance.instanceOfModule(model.startValue, 'Types/entity:DateTime');
               expect(model.endValue.getTime()).toEqual(test.rEnd.getTime());
               cInstance.instanceOfModule(model.endValue, 'Types/entity:DateTime');
            });
         });
         [
            {
               startValue: new Date(2019, 0, 7),
               endValue: new Date(2019, 0, 11),
               selectionType: 'quantum',
               ranges: {
                  weeks: [1]
               },
               rangeSelectedCallback: (startValue, endValue) => {
                  return [
                     new Date(
                        startValue.getFullYear(),
                        startValue.getMonth(),
                        startValue.getDate()
                     ),
                     new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate() - 2)
                  ];
               },
               result: [new Date(2018, 11, 31), new Date(2019, 0, 4)]
            },
            {
               startValue: new Date(2019, 0, 7),
               endValue: new Date(2019, 0, 12),
               selectionType: 'quantum',
               ranges: {
                  days: [3]
               },
               rangeSelectedCallback: (startValue, endValue) => {
                  return [
                     new Date(
                        startValue.getFullYear(),
                        startValue.getMonth(),
                        startValue.getDate()
                     ),
                     new Date(endValue.getFullYear(), endValue.getMonth(), endValue.getDate() + 3)
                  ];
               },
               result: [new Date(2019, 0, 4), new Date(2019, 0, 9)]
            },
            {
               startValue: new Date(2019, 0, 7),
               endValue: new Date(2019, 0, 9),
               selectionType: 'quantum',
               ranges: {
                  days: [3]
               },
               result: [new Date(2019, 0, 4), new Date(2019, 0, 6)]
            },
            {
               startValue: new Date(2019, 0, 7),
               endValue: new Date(2019, 0, 13),
               selectionType: 'quantum',
               ranges: {
                  days: [7]
               },
               result: [new Date(2018, 11, 31), new Date(2019, 0, 6)]
            }
         ].forEach(function (test) {
            it('should shift period with quantum back', function () {
               let model = new dateRange.DateRangeModel();

               model.update({
                  startValue: test.startValue,
                  endValue: test.endValue,
                  selectionType: 'quantum',
                  ranges: test.ranges,
                  rangeSelectedCallback: test.rangeSelectedCallback
               });
               model.shiftBack();
               expect(model.startValue.getTime()).toEqual(test.result[0].getTime());
               cInstance.instanceOfModule(model.startValue, 'Types/entity:DateTime');
               expect(model.endValue.getTime()).toEqual(test.result[1].getTime());
               cInstance.instanceOfModule(model.endValue, 'Types/entity:DateTime');
            });
         });
      });

      describe('.setRange', function () {
         it('should make notification about changes of startValue and endValue', function (done) {
            let model = new dateRange.DateRangeModel(),
               options = {
                  startValue: new Date(2018, 0, 1),
                  endValue: new Date(2018, 0, 3)
               };
            jest.spyOn(model, '_notify').mockClear().mockImplementation();
            model.setRange(options.startValue, options.endValue);
            setTimeout(function () {
               expect(model._notify).toHaveBeenCalledWith('rangeChanged', expect.anything());
               done();
            }, 10);
         });
      });
   });
});
