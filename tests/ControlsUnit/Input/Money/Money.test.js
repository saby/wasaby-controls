define(['Core/core-instance', 'Controls/input'], function (instance, input) {
   'use strict';

   describe('Controls/_input/Money', function () {
      var Money = input.Money;
      describe('Money part', function () {
         it('value = 100.00, precision = 2', function () {
            const value = '100.00';
            const precision = 2;
            expect(Money.integerPart(value, precision)).toEqual('100');
            expect(Money.fractionPart(value, precision)).toEqual('.00');
         });
         it('value = 100, precision = 0', function () {
            const value = '100';
            const precision = 0;
            expect(Money.integerPart(value, precision)).toEqual('100');
            expect(Money.fractionPart(value, precision)).toEqual('');
         });
      });
   });
});
