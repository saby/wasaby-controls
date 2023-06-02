define([
   'Core/core-merge',
   'Env/Env',
   'Types/entity',
   'Types/formatter',
   'Controls/dateUtils',
   'Controls/date',
   'Controls/dateUtils'
], function (
   cMerge,
   env,
   typesEntity,
   formatter,
   DateControlsUtils,
   dateLib,
   dateUtils
) {
   'use strict';

   let options = {
         mask: 'DD.MM.YYYY',
         value: new Date(2018, 0, 1),
         replacer: '_'
      },
      masks = DateControlsUtils.Range.dateMaskConstants;

   describe('Controls/_date/StringValueConverter', function () {
      describe('.update', function () {
         it('should update mask and replacer options', function () {
            let converter = new dateLib.StringValueConverter(),
               mask = 'HH:mm',
               replacer = '-';
            converter.update(options);
            converter.update({ mask: mask, replacer: replacer });

            expect(converter._mask).toBe(mask);
            expect(converter._replacer).toBe(replacer);
         });
      });

      describe('.getStringByValue', function () {
         [
            {
               date: null,
               dateStr: ''
            },
            {
               date: new Date('Invalid'),
               dateStr: ''
            },
            {
               date: new Date(2018, 0, 1),
               dateStr: '01.01.2018'
            }
         ].forEach(function (test) {
            it(`should return "${test.dateStr}" if "${test.date}" is passed`, function () {
               let converter = new dateLib.StringValueConverter();
               converter.update(options);
               expect(converter.getStringByValue(test.date)).toBe(test.dateStr);
            });
         });

         it('should return time based on the timezone', function () {
            const converter = new dateLib.StringValueConverter(),
               isServerSide = env.constants.isServerSide,
               timeZone = typesEntity.DateTime.getClientTimezoneOffset();

            env.constants.isServerSide = true;
            jest
               .spyOn(typesEntity.DateTime, 'getClientTimezoneOffset')
               .mockClear()
               .mockReturnValue(timeZone - 120);
            converter.update({
               mask: 'HH:mm'
            });
            expect(
               converter.getStringByValue(new typesEntity.DateTime(2020, 0, 1))
            ).toBe('02:00');
            env.constants.isServerSide = isServerSide;
         });
      });

      describe('.getValueByString', function () {
         const now = new Date(2021, 2, 4);
         let year = now.getFullYear(),
            month = now.getMonth(),
            date = now.getDate(),
            shortYearStr = formatter.date(now, 'YY'),
            monthStr = formatter.date(now, 'MM');

         [
            // The day and month are filled
            // We substitute the current year
            {
               mask: 'DD.MM.YY',
               stringValue: '11.12.__',
               value: new Date(year, 11, 11)
            },

            // Automatically fill the current month and year
            {
               mask: 'DD.MM.YY',
               stringValue: '11.__.__',
               value: new Date(year, month, 11)
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.__.____',
               value: new Date(year, month, 11)
            },

            // Current year is filled
            // Autofill current month
            {
               mask: 'DD.MM.YY',
               stringValue: `11.__.${shortYearStr}`,
               value: new Date(year, month, 11)
            },

            // The current day and month are auto-charged
            {
               mask: 'DD.MM.YY',
               stringValue: `__.__.${shortYearStr}`,
               value: new Date(year, month, date)
            },

            // Current year and month are filled
            // Autofill current day
            {
               mask: 'DD.MM.YY',
               stringValue: `__.${monthStr}.${shortYearStr}`,
               value: new Date(year, month, date)
            },

            // A year is different from the current one
            // Autofill 01
            {
               mask: 'DD.MM.YY',
               stringValue: '11.__.00',
               value: new Date(2000, 0, 11)
            },

            // Autofill 01.01
            {
               mask: 'DD.MM.YY',
               stringValue: '__.__.00',
               value: new Date(2000, 0, 1)
            },
            {
               mask: 'DD.MM.YY',
               stringValue: '__.__.00',
               value: new Date(2000, 0, 1),
               autocomplete: 'start'
            },
            {
               mask: 'DD.MM.YY',
               stringValue: '__.__.00',
               value: new Date(2000, 11, 31),
               autocomplete: 'end'
            },

            // The year is different from the current year and month
            // Autofill 1
            {
               mask: 'DD.MM.YY',
               stringValue: '__.01.00',
               value: new Date(2000, 0, 1)
            },

            // [[2000, month + 1, null, null, null], new Date(2000, month + 1, 1), 'DD.MM.YY', []], // Подставляем 1
            // The field is completely empty
            { mask: 'DD.MM.YY', stringValue: '__.__.__', value: null },

            // [[null, null, null, null, null], now, 'DD.MM.YY', requiredValidator],
            // other cases
            {
               mask: 'DD.MM.YY',
               stringValue: '__.01.__',
               value: new Date('Invalid')
            },
            { mask: 'DD.MM', stringValue: '__.__', value: null },
            { mask: masks.MM_YYYY, stringValue: '__.____', value: null },
            {
               mask: masks.MM_YYYY,
               stringValue: '10.2019',
               value: new Date(2019, 9)
            },
            {
               mask: 'HH.mm',
               stringValue: '10.__',
               value: new Date(1904, 0, 1, 10)
            },
            {
               mask: 'HH.mm.ss',
               stringValue: '10.__.__',
               value: new Date(1904, 0, 1, 10)
            },
            {
               mask: 'HH.mm.ss',
               stringValue: '10.05.__',
               value: new Date(1904, 0, 1, 10, 5)
            },
            {
               mask: 'HH.mm.ss',
               stringValue: '1_.5_.1_',
               value: new Date(1904, 0, 1, 10, 50, 10)
            },
            {
               mask: 'HH.mm.ss',
               stringValue: '_1._5._1',
               value: new Date(1904, 0, 1, 1, 5, 1)
            },
            { mask: 'HH.mm', stringValue: '__.10', value: new Date('Invalid') },

            // the date is more than maybe
            {
               mask: 'DD.MM.YY',
               stringValue: '55.12.00',
               value: new Date(2000, 11, 31)
            },

            // incorrect year
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12.__20',
               value: new Date(2020, 11, 11)
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12._20_',
               value: new Date(2020, 11, 11)
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12.20__',
               value: new Date(2020, 11, 11)
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12.020_',
               value: new Date('Invalid')
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12._020',
               value: new Date('Invalid')
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12.0_20',
               value: new Date('Invalid')
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12._200',
               value: new Date('Invalid')
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12.200_',
               value: new Date('Invalid')
            },
            {
               mask: 'DD.MM.YYYY',
               stringValue: '11.12.0200',
               value: new Date('Invalid')
            },

            // incorrect time
            {
               mask: 'HH:mm:ss',
               stringValue: '80:80:80',
               value: new Date(1904, 0, 1, 23, 59, 59)
            },
            {
               mask: 'HH:mm:ss',
               stringValue: '80:10:10',
               value: new Date(1904, 0, 1, 23, 10, 10)
            },
            {
               mask: 'HH:mm:ss',
               stringValue: '10:80:80',
               value: new Date(1904, 0, 1, 10, 59, 59)
            },
            {
               mask: 'HH:mm:ss',
               stringValue: '10:10:80',
               value: new Date(1904, 0, 1, 10, 10, 59)
            },
            {
               mask: 'HH:mm',
               stringValue: '80:80',
               value: new Date(1904, 0, 1, 23, 59, 0)
            },
            {
               mask: 'HH:mm',
               stringValue: '10:80',
               value: new Date(1904, 0, 1, 10, 59, 0)
            },
            {
               mask: 'HH:mm',
               stringValue: '24:60',
               value: new Date(1904, 0, 1, 23, 59, 0)
            },
            {
               mask: 'HH:mm',
               stringValue: '80:10',
               value: new Date(1904, 0, 1, 23, 10, 0)
            },

            {
               mask: 'HH:mm',
               stringValue: '10:20',
               value: new Date(2000, 1, 2, 10, 20, 0),
               baseDate: new Date(2000, 1, 2, 3, 4, 0)
            },

            // correct centuries
            {
               mask: 'DD.MM.YY',
               stringValue: '11.12.36',
               value: new Date(2036, 11, 11),
               yearSeparatesCenturies: new Date(2020, 1, 1)
            },
            {
               mask: 'DD.MM.YY',
               stringValue: '11.12.97',
               value: new Date(1997, 11, 11),
               yearSeparatesCenturies: new Date(1996, 1, 1)
            },
            {
               mask: 'DD.MM.YY',
               stringValue: '11.12.05',
               value: new Date(2005, 11, 11),
               yearSeparatesCenturies: new Date(1996, 1, 1)
            },

            // partial inputMode exceptions
            {
               mask: 'DD.MM.YY',
               stringValue: '__.__.21',
               value: new Date('Invalid'),
               inputMode: 'partial'
            },
            {
               mask: 'DD.MM.YY',
               stringValue: '__.__.20',
               value: new Date('Invalid'),
               inputMode: 'partial'
            }
         ].forEach(function (test) {
            it(`should return ${test.value} if "${test.stringValue}" is passed`, function () {
               let converter = new dateLib.StringValueConverter(),
                  rDate;
               jest.useFakeTimers().setSystemTime(now.getTime());
               converter.update(
                  cMerge(
                     {
                        mask: test.mask,
                        dateConstructor: Date,
                        yearSeparatesCenturies: test.yearSeparatesCenturies
                     },
                     options,
                     { preferSource: true }
                  )
               );
               rDate = converter.getValueByString(
                  test.stringValue,
                  test.baseDate,
                  test.autocomplete || true,
                  test.inputMode || 'default'
               );
               expect(
                  dateUtils.Base.isDatesEqual(rDate, test.value)
               ).toBeTruthy();
               jest.useRealTimers();
            });
         });

         it('should create date with proper class', function () {
            let converter = new dateLib.StringValueConverter({
                  mask: 'HH.mm.ss',
                  dateConstructor: Date
               }),
               rDate;
            rDate = converter.getValueByString('10:10:80');
            expect(rDate).toBeInstanceOf(Date);
         });
      });

      describe('.getCurrentDate', function () {
         const baseDate = new Date(2018, 10, 10, 10, 10, 10);
         let currentYear = 2019,
            currentMonth = 5,
            currentDay = 6,
            currentHour = 7,
            currentMinutes = 8,
            currentSeconds = 9,
            currentDate = new Date(
               currentYear,
               currentMonth,
               currentDay,
               currentHour,
               currentMinutes,
               currentSeconds
            );

         afterEach(() => {
            jest.useRealTimers();
         });

         let baseYear = baseDate.getFullYear(),
            baseMonth = baseDate.getMonth(),
            baseDay = baseDate.getDate(),
            baseHour = baseDate.getHours(),
            baseMinutes = baseDate.getMinutes(),
            baseSeconds = baseDate.getSeconds();
         [
            {
               mask: 'DD.MM.YYYY',
               value: new Date(
                  currentYear,
                  currentMonth,
                  currentDay,
                  baseHour,
                  baseMinutes,
                  baseSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'DD.MM.YY',
               value: new Date(
                  currentYear,
                  currentMonth,
                  currentDay,
                  baseHour,
                  baseMinutes,
                  baseSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'YYYY',
               value: new Date(
                  currentYear,
                  baseMonth,
                  baseDay,
                  baseHour,
                  baseMinutes,
                  baseSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'HH:mm',
               value: new Date(
                  baseYear,
                  baseMonth,
                  baseDay,
                  currentHour,
                  currentMinutes,
                  baseSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'HH:mm:ss',
               value: new Date(
                  baseYear,
                  baseMonth,
                  baseDay,
                  currentHour,
                  currentMinutes,
                  currentSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'DD.MM HH:mm',
               value: new Date(
                  baseYear,
                  currentMonth,
                  currentDay,
                  currentHour,
                  currentMinutes,
                  baseSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'DD.MM HH:mm:ss',
               value: new Date(
                  baseYear,
                  currentMonth,
                  currentDay,
                  currentHour,
                  currentMinutes,
                  currentSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'DD.MM.YY HH:mm',
               value: new Date(
                  currentYear,
                  currentMonth,
                  currentDay,
                  currentHour,
                  currentMinutes,
                  baseSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'DD.MM.YY HH:mm:ss',
               value: new Date(
                  currentYear,
                  currentMonth,
                  currentDay,
                  currentHour,
                  currentMinutes,
                  currentSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'DD.MM.YYYY HH:mm',
               value: new Date(
                  currentYear,
                  currentMonth,
                  currentDay,
                  currentHour,
                  currentMinutes,
                  baseSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'DD.MM.YYYY HH:mm:ss',
               value: new Date(
                  currentYear,
                  currentMonth,
                  currentDay,
                  currentHour,
                  currentMinutes,
                  currentSeconds
               ),
               currentDate: currentDate
            },
            {
               mask: 'DD.MM.YY',
               value: new Date(2019, 3, 5, baseHour, baseMinutes, baseSeconds),
               currentDate: new Date(
                  2019,
                  3,
                  5,
                  baseHour,
                  baseMinutes,
                  baseSeconds
               ),
               baseDate: new Date(2019, 2, 31, 10, 10, 10)
            },
            {
               mask: 'DD.MM.YY',
               value: new Date(2019, 2, 5, baseHour, baseMinutes, baseSeconds),
               currentDate: new Date(
                  2019,
                  2,
                  5,
                  baseHour,
                  baseMinutes,
                  baseSeconds
               ),
               baseDate: new Date(2020, 1, 29, 10, 10, 10)
            }
         ].forEach(function (test) {
            it(`should return curent date if it icludes "${test.mask}"`, function () {
               jest.useFakeTimers().setSystemTime(test.currentDate.getTime());
               let converter = new dateLib.StringValueConverter();
               let tested = converter.getCurrentDate(
                  test.baseDate || baseDate,
                  test.mask
               );
               expect(
                  dateUtils.Base.isDatesEqual(tested, test.value)
               ).toBeTruthy();
            });
         });

         it('should create date with proper class', function () {
            let converter = new dateLib.StringValueConverter({
                  mask: 'HH.mm.ss',
                  dateConstructor: Date
               }),
               rDate;
            rDate = converter.getCurrentDate(new Date(), '10:10:80');
            expect(rDate).toBeInstanceOf(Date);
         });
      });
      describe('_createDate', () => {
         [
            {
               hours: 24,
               minutes: 0,
               seconds: 0
            },
            {
               hours: 24,
               minutes: 99,
               seconds: 99
            },
            {
               hours: 24,
               minutes: 0,
               seconds: 0
            },
            {
               hours: 99,
               minutes: 99,
               seconds: 99
            },
            {
               hours: 99,
               minutes: 0,
               seconds: 99
            },
            {
               hours: 99,
               minutes: 11,
               seconds: 0
            }
         ].forEach((test, index) => {
            it(
               'should create correct date with autocorrect if extendedTimeFormat=true ' +
                  index,
               () => {
                  const converter = new dateLib.StringValueConverter({
                     mask: 'DD.MM.YY',
                     dateConstructor: Date
                  });
                  const result = new Date(2020, 0, 1, 23, 59, 59);
                  converter._extendedTimeFormat = true;
                  const value = converter._createDate(
                     2020,
                     0,
                     1,
                     test.hours,
                     test.minutes,
                     test.seconds,
                     true,
                     Date
                  );
                  const testResult = dateUtils.Base.isDatesEqual(result, value);
                  expect(testResult).toBe(true);
               }
            );
         });
         it('should create correct date with 24:00 if extendedTimeFormat=true', () => {
            const converter = new dateLib.StringValueConverter({
               mask: 'DD.MM.YY',
               dateConstructor: Date
            });
            const result = new Date(2020, 0, 1, 23, 59, 59);
            converter._extendedTimeFormat = true;
            const value = converter._createDate(
               2020,
               0,
               1,
               24,
               0,
               0,
               true,
               Date
            );
            const testResult = dateUtils.Base.isDatesEqual(result, value);
            expect(testResult).toBe(true);
         });
      });
   });
});
