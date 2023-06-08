define(['Controls/input', 'UI/Utils'], function (input, UIUtils) {
   'use strict';

   describe('Controls/input:isMaskFormatValid', function () {
      const isMaskFormatValid = input.isMaskFormatValid;

      it('Valid value. Invalid mask.', function () {
         const actual = isMaskFormatValid('', 'd(d.d)d)');
         expect(actual).toBe(false);
      });
      it('Invalid value. Valid mask.', function () {
         const spy = jest.spyOn(UIUtils.Logger, 'warn').mockImplementation();
         const actual = isMaskFormatValid('1a.a1', 'dd.dd');
         expect(actual).toBe(false);
         expect(spy).toHaveBeenCalledWith(
            'Значение не соответствует формату маски.'
         );
      });
      it('Valid value. Valid mask.', function () {
         const actual = isMaskFormatValid('12.21', 'dd.dd');
         expect(actual).toBe(true);
      });
   });
});
