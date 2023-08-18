define(['Core/core-instance', 'Controls/input'], function (instance, input) {
   'use strict';

   describe('Controls/_input/Money', function () {
      var ctrl;
      var Money = input.Money;

      beforeEach(function () {
         ctrl = new Money();
         var beforeMount = ctrl._beforeMount;

         ctrl._beforeMount = function () {
            beforeMount.apply(this, arguments);

            ctrl._children[this._fieldName] = {
               selectionStart: 0,
               selectionEnd: 0,
               value: '',
               focus: jest.fn(),
               setSelectionRange: function (start, end) {
                  this.selectionStart = start;
                  this.selectionEnd = end;
               }
            };
         };
      });

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
