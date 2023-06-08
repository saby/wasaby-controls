define(['Core/core-merge', 'Controls/_date/BaseInput/Model'], function (
   cMerge,
   DateTimeModel
) {
   'use strict';

   let options = {
      mask: 'DD.MM.YYYY',
      value: new Date(2018, 0, 1),
      replacer: ' ',
      dateConstructor: Date
   };

   describe('Controls/_date/BaseInput/Model', function () {
      describe('constructor', function () {
         it('should initialize internal fields', function () {
            let model = new DateTimeModel.default(options);

            expect(model._mask).toBe(options.mask);
            expect(model.value).toBe(options.value);
            expect(model.value).toBeInstanceOf(Date);
            expect(model._lastValue).toBe(options.value);
            expect(model.textValue).toBe('01.01.2018');
         });
      });

      describe('.update', function () {
         it('should update value fields if value changed', function () {
            let model = new DateTimeModel.default(options),
               newDate = new Date(2019, 1, 2);

            jest.spyOn(model, '_notify').mockClear().mockImplementation();
            model.update(
               cMerge({ value: newDate }, options, { preferSource: true })
            );

            expect(model._notify).not.toHaveBeenCalled();
            expect(model.value).toBe(newDate);
            expect(model.value).toBeInstanceOf(Date);
            expect(model._lastValue).toBe(newDate);
            expect(model.textValue).toBe('02.02.2019');
         });

         it('should update displayValue fields if displayValue changed', function () {
            const innerOptions = {
               mask: 'DD.MM.YY',
               displayValue: '01.01.21',
               replacer: ' ',
               dateConstructor: Date
            };
            const model = new DateTimeModel.default(innerOptions);

            jest.spyOn(model, '_notify').mockClear().mockImplementation();
            model.update(
               cMerge({ displayValue: '02.01.21' }, innerOptions, {
                  preferSource: true
               })
            );

            expect(model._notify).not.toHaveBeenCalled();
            expect(model.value.getTime()).toBe(new Date(2021, 0, 2).getTime());
            expect(model.value).toBeInstanceOf(Date);
            expect(model._lastValue.getTime()).toBe(
               new Date(2021, 0, 2).getTime()
            );
            expect(model.textValue).toBe('02.01.21');
         });
      });

      describe('.value', function () {
         it('should update native and text value', function () {
            let model = new DateTimeModel.default(options),
               newDate = new Date(2019, 1, 2);

            model.value = newDate;

            expect(model.value).toBe(newDate);
            expect(model._lastValue).toBe(newDate);
            expect(model.textValue).toBe('02.02.2019');
         });
      });

      describe('.textValue', function () {
         it('should update native and text value', function () {
            let model = new DateTimeModel.default(options),
               newTextValue = '02.02.2019',
               newDate = new Date(2019, 1, 2);

            model.textValue = newTextValue;

            expect(model.value.getTime()).toBe(newDate.getTime());
            expect(model.value).toBeInstanceOf(Date);
            expect(model._lastValue.getTime()).toBe(newDate.getTime());
            expect(model.textValue).toBe(newTextValue);
         });

         it('should set Invalid Date if text value not full', function () {
            let model = new DateTimeModel.default(options),
               newTextValue = '02.0 .2019';

            model.textValue = newTextValue;

            // assert.isNone(model.value.getTime());
            expect(model._lastValue.getTime()).toBe(options.value.getTime());
            expect(model.textValue).toBe(newTextValue);
         });

         it('should not generate valueChanged event if the text value changed from one invalid date to another', function () {
            let model = new DateTimeModel.default(options);
            model.textValue = '02.0 .2019';
            jest.spyOn(model, '_notify').mockClear().mockImplementation();
            model.textValue = '02.99.2019';
            expect(model._notify).not.toHaveBeenCalled();
         });
      });

      describe('.autocomplete', function () {
         it('should update native and text value', function () {
            let model = new DateTimeModel.default(options),
               newTextValue = '02.02.2019',
               newDate = new Date(2019, 1, 2);

            model.autocomplete(newTextValue);

            expect(model.value.getTime()).toBe(newDate.getTime());
            expect(model.value).toBeInstanceOf(Date);
            expect(model._lastValue.getTime()).toBe(newDate.getTime());
            expect(model.textValue).toBe(newTextValue);
         });
      });

      describe('.setCurrentDate', function () {
         it('should set current date in value', function () {
            let model = new DateTimeModel.default(options);
            jest
               .useFakeTimers()
               .setSystemTime(new Date(2019, 0, 2, 3, 4, 5, 6), 'Date');
            model.setCurrentDate();
            expect(new Date(2019, 0, 2).getTime()).toBe(model.value.getTime());
            expect(model.value).toBeInstanceOf(Date);
            jest.useRealTimers();
         });
      });

      describe('_updateValue', () => {
         it('should not update text value with invalid date', () => {
            const model = new DateTimeModel.default(options);
            const textValue = '22.01.2021';
            model._textValue = textValue;
            model._updateValue(new Date('invalid'));
            expect(textValue).toEqual(model._textValue);
         });

         it('should update text value with null', () => {
            const model = new DateTimeModel.default(options);
            model._textValue = '22.01.2021';
            model._updateValue(null);
            expect('').toEqual(model._textValue);
         });
      });
   });
});
