define(['Types/entity', 'Controls/input'], function (entity, input) {
   describe('Controls/input:InputCallback.hoursFormat', function () {
      var hoursFormat = input.InputCallback.hoursFormat;

      it('Within normal limits', function () {
         expect(
            hoursFormat({
               position: 1,
               displayValue: '10:00',
               value: new entity.TimeInterval({ hours: 10 })
            })
         ).toEqual({
            position: 1,
            displayValue: '10:00'
         });
      });
      it('More normal', function () {
         expect(
            hoursFormat({
               position: 1,
               displayValue: '30:00',
               value: new entity.TimeInterval({ hours: 30 })
            })
         ).toEqual({
            position: 1,
            displayValue: '24:00'
         });
         expect(
            hoursFormat({
               position: 2,
               displayValue: '25:59',
               value: new entity.TimeInterval({ hours: 25, minutes: 59 })
            })
         ).toEqual({
            position: 2,
            displayValue: '24:00'
         });
      });
   });
});
