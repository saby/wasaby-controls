define(['Controls/_input/TimeInterval/ViewModel', 'Types/entity'], function (
   ViewModel,
   entity
) {
   'use strict';

   const _options = {
      mask: 'HH:MM:SS',
      replacer: ' '
   };

   // eslint-disable-next-line no-param-reassign
   ViewModel = ViewModel.ViewModel;

   describe('Controls/_input/TimeInterval/ViewModel', function () {
      describe('._convertToValue', function () {
         it('should return correct TimeInterval object from String', function () {
            let model = new ViewModel(_options);
            let value = new entity.TimeInterval({
               days: 1,
               hours: 20,
               minutes: 10,
               seconds: 20
            });
            expect(model._convertToValue('44:10:20')._normIntervalStr).toBe(
               value._normIntervalStr
            );

            value = new entity.TimeInterval({
               hours: 20,
               minutes: 10,
               seconds: 20
            });
            expect(model._convertToValue('20:10:20')._normIntervalStr).toBe(
               value._normIntervalStr
            );

            value = new entity.TimeInterval({ seconds: 20 });
            expect(model._convertToValue('00:00:20')._normIntervalStr).toBe(
               value._normIntervalStr
            );
         });
         it('Recalculate value', function () {
            let value = new entity.TimeInterval({
               days: 1,
               hours: 20,
               minutes: 10,
               seconds: 20
            });
            let model = new ViewModel(_options, value);
            expect(model._convertToValue('44:10:20')).toEqual(value);
         });
      });

      describe('._convertToDisplayValue', function () {
         it('should return correct displayValue from TimeInterval object', function () {
            let model = new ViewModel(_options);
            let value = new entity.TimeInterval({
               days: 1,
               hours: 20,
               minutes: 10,
               seconds: 20
            });
            expect(model._convertToDisplayValue(value)).toBe('44:10:20');

            value = new entity.TimeInterval({
               hours: 20,
               minutes: 10,
               seconds: 20
            });
            expect(model._convertToDisplayValue(value)).toBe('20:10:20');

            value = new entity.TimeInterval({ seconds: 20 });
            expect(model._convertToDisplayValue(value)).toBe(' 0:00:20');
         });
      });

      describe('.autoComplete', function () {
         it('should auto complete display value in correct way', function () {
            let model = new ViewModel(_options);
            model.value = model._convertToValue('1 :1 :1 ');
            model.autoComplete();
            expect(model.displayValue).toBe(' 1:01:01');
            model.value = model._convertToValue(' 1: 1: 1');
            model.autoComplete();
            expect(model.displayValue).toBe(' 1:01:01');
            jest.restoreAllMocks();
         });
      });

      describe('_getStartingPosition', function () {
         it('Test1', function () {
            const model = new ViewModel(_options);
            expect(model._getStartingPosition()).toEqual(0);
         });
      });

      describe('_timeIntervalToValueConverter', () => {
         [
            {
               mask: 'HH:MM',
               value: new entity.TimeInterval({
                  hours: 20,
                  minutes: 10,
                  seconds: 30
               }),
               result: '2010'
            },
            {
               mask: 'HH:MM:SS',
               value: new entity.TimeInterval({
                  hours: 20,
                  minutes: 10,
                  seconds: 30
               }),
               result: '201030'
            },
            {
               mask: 'HHH:MM',
               value: new entity.TimeInterval({
                  hours: 20,
                  minutes: 10,
                  seconds: 30
               }),
               result: '02010'
            },
            {
               mask: 'MM:SS',
               value: new entity.TimeInterval({
                  hours: 20,
                  minutes: 10,
                  seconds: 30
               }),
               result: '1030'
            },
            {
               mask: 'HHHH:MM:SS',
               value: new entity.TimeInterval({
                  hours: 20,
                  minutes: 10,
                  seconds: 30
               }),
               result: '00201030'
            }
         ].forEach((test, index) => {
            it(
               'should correctly convert TimeInterval to string ' + index,
               () => {
                  const model = new ViewModel({ mask: test.mask });
                  const result = model._timeIntervalToValueConverter(
                     test.value
                  );
                  expect(test.result).toEqual(result);
               }
            );
         });
      });
   });
});
