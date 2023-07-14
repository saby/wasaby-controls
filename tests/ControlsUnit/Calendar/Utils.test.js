define([
   'Types/entity',
   'Core/core-instance',
   'Controls/dateRange',
   'Controls/dateUtils'
], function (TypesEntity, cInstance, dateRange, DateUtil) {
   describe('Controls.Calendar.Utils', function () {
      // Тесты дублируются в ветки ws
      // describe('.formatDateRangeCaption', function() {
      //    it('should return emptyCaption option value if options passed as parameter and range dont specified.', function () {
      //       let emptyStr = '...';
      //       assert.equal(dateRange.Utils.formatDateRangeCaption(null, null, emptyStr), emptyStr);
      //    });
      //    [
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 0, 1), ret: '1 января\'17' },
      //       // Single period
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 11, 31), ret: '2017' },
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 5, 30), ret: 'I полугодие\'17' },
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 2, 31), ret: 'I квартал\'17' },
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 0, 31), ret: 'Январь\'17' },
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 0, 1), ret: '1 января\'17' },
      //       // Some years
      //       { start: new Date(2017, 0, 1), end: new Date(2018, 11, 31), ret: '2017-2018' },
      //       // Several simple periods within a year
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 8, 30), ret: 'I-III квартал\'17' },
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 1, 28), ret: 'Январь - Февраль\'17' },
      //       { start: new Date(2017, 0, 1), end: new Date(2017, 0, 15), ret: '01.01.17 - 15.01.17' },
      //       // Within several years
      //       { start: new Date(2017, 0, 1), end: new Date(2018, 5, 30), ret: 'I квартал\'17-II квартал\'18' },
      //       { start: new Date(2017, 0, 1), end: new Date(2018, 2, 31), ret: 'I квартал\'17-I квартал\'18' },
      //       { start: new Date(2017, 0, 1), end: new Date(2018, 0, 31), ret: 'Январь\'17 - Январь\'18' },
      //       { start: new Date(2017, 0, 1), end: new Date(2018, 0, 15), ret: '01.01.17 - 15.01.18' },
      //       // Empty period
      //       { start: undefined, end: undefined, ret: '...' },
      //       { start: null, end: null, ret: '...' },
      //       // The first date is not specified
      //       { start: undefined, end: new Date(2017, 0, 1), ret: '... - 01.01.17' },
      //       { start: null, end: new Date(2017, 0, 1), ret: '... - 01.01.17' },
      //       // The second date is not specified
      //       { start: new Date(2017, 0, 1), end: undefined, ret: '01.01.17 - ...' },
      //       { start: new Date(2017, 0, 1), end: null, ret: '01.01.17 - ...' }
      //    ].forEach(function(test) {
      //       it('should return correct range string value.', function () {
      //          assert.equal(dateRange.Utils.formatDateRangeCaption(test.start, test.end, '...'), test.ret);
      //       });
      //    });
      //
      // });

      it('getFirstDayOffset', function () {
         expect(dateRange.Utils.getFirstDayOffset(2017, 12)).toEqual(4);
         expect(dateRange.Utils.getFirstDayOffset(2017, null)).toEqual(6);
      });

      it('getDaysInMonth', function () {
         expect(dateRange.Utils.getDaysInMonth(2017, 12)).toEqual(31);
         expect(dateRange.Utils.getDaysInMonth(2017, 2)).toEqual(28);
         expect(dateRange.Utils.getDaysInMonth(2016, 2)).toEqual(29);
      });

      it('getWeeksInMonth', function () {
         expect(dateRange.Utils.getWeeksInMonth(2017, 12)).toEqual(5);
         expect(dateRange.Utils.getWeeksInMonth(2018, 4)).toEqual(6);
      });

      it('getWeeksArray', function () {
         let weeks = dateRange.Utils.getWeeksArray(new Date(2017, 0, 1));
         expect(weeks.length).toEqual(6);
         for (let week of weeks) {
            expect(week.length).toEqual(7);
         }
         expect(DateUtil.Base.isDatesEqual(weeks[0][0], new Date(2016, 11, 26))).toBe(true);
         expect(cInstance.instanceOfModule(weeks[0][0], 'Types/entity:Date')).toBe(true);
      });

      it('getWeeksArray dateConstructor', function () {
         let weeks = dateRange.Utils.getWeeksArray(
            new Date(2017, 0, 1),
            'current',
            TypesEntity.DateTime
         );
         expect(cInstance.instanceOfModule(weeks[0][0], 'Types/entity:DateTime')).toBe(true);
      });

      it('getWeekdaysCaptions should return the same array if locale has not changed', function () {
         const result1 = dateRange.Utils.getWeekdaysCaptions();
         const result2 = dateRange.Utils.getWeekdaysCaptions();
         expect(result1).toEqual(result2);
      });

      describe('updateRangeByQuantum', function () {
         const tests = [
            {
               baseDate: new Date(2018, 0, 15),
               date: new Date(2018, 0, 16),
               ranges: {},
               result: [new Date(2018, 0, 15), new Date(2018, 0, 16)]
            },
            {
               baseDate: new Date(2018, 0, 16),
               date: new Date(2018, 0, 15),
               ranges: {},
               result: [new Date(2018, 0, 15), new Date(2018, 0, 16)]
            },
            {
               baseDate: new Date(2018, 0, 15),
               date: new Date(2018, 0, 16),
               ranges: { days: [1] },
               result: [new Date(2018, 0, 15), new Date(2018, 0, 15)]
            },
            {
               baseDate: new Date(2018, 0, 16),
               date: new Date(2018, 0, 15),
               ranges: { days: [1] },
               result: [new Date(2018, 0, 16), new Date(2018, 0, 16)]
            },
            {
               baseDate: new Date(2018, 0, 16),
               date: new Date(2018, 0, 17),
               ranges: { weeks: [1] },
               result: [new Date(2018, 0, 15), new Date(2018, 0, 21)]
            },
            {
               baseDate: new Date(2018, 0, 17),
               date: new Date(2018, 0, 16),
               ranges: { weeks: [1] },
               result: [new Date(2018, 0, 15), new Date(2018, 0, 21)]
            },
            {
               baseDate: new Date(2018, 0, 16),
               date: new Date(2018, 0, 17),
               ranges: { months: [1] },
               result: [new Date(2018, 0, 1), new Date(2018, 0, 31)]
            },
            {
               baseDate: new Date(2018, 0, 17),
               date: new Date(2018, 0, 16),
               ranges: { months: [1] },
               result: [new Date(2018, 0, 1), new Date(2018, 0, 31)]
            },
            {
               baseDate: new Date(2018, 7, 1),
               date: new Date(2018, 8, 1),
               ranges: { months: [1, 2, 3] },
               result: [new Date(2018, 7, 1), new Date(2018, 8, 30)]
            }
         ];
         tests.forEach(function (test) {
            it(`updateRangeByQuantum(${test.baseDate}, ${test.date}, ${test.ranges})`, function () {
               expect(
                  dateRange.Utils.updateRangeByQuantum(test.baseDate, test.date, test.ranges)
               ).toEqual(test.result);
            });
         });
      });
      describe('updateRangeByWorkdays', () => {
         [
            {
               date: new Date(2021, 5, 30),
               result: [new Date(2021, 5, 28), new Date(2021, 6, 2)]
            },
            {
               date: new Date(2021, 5, 29),
               result: [new Date(2021, 5, 28), new Date(2021, 6, 2)]
            },
            {
               date: new Date(2021, 4, 1),
               result: [new Date(2021, 3, 26), new Date(2021, 3, 30)]
            }
         ].forEach((test, index) => {
            it('should return correct period ' + index, () => {
               const dateRangeResult = dateRange.Utils.updateRangeByWorkdays(test.date);
               expect(dateRangeResult).toEqual(test.result);
            });
         });
      });
   });
});
