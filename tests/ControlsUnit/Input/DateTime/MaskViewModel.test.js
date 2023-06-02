/**
 * @jest-environment jsdom
 */
define(['Core/core-merge', 'Controls/_date/BaseInput/MaskViewModel'], function (
   cMerge,
   MaskViewModel
) {
   'use strict';

   let options = {
      value: '',
      replacer: ' ',
      formatMaskChars: {
         D: '[0-9]',
         M: '[0-9]',
         Y: '[0-9]',
         H: '[0-9]',
         m: '[0-9]',
         s: '[0-9]',
         U: '[0-9]'
      }
   };

   describe('"Controls/_date/BaseInput/MaskViewModel', function () {
      describe('_convertToDisplayValue', () => {
         it('should return placeholder if there is placeholder', () => {
            const placeholder = 'test';
            const value = '';
            const model = new MaskViewModel.default(
               {
                  ...options,
                  preferSource: true,
                  placeholder,
                  mask: 'DD.MM.YY'
               },
               value
            );
            const result = model._convertToDisplayValue(value);
            expect(result).toEqual(placeholder);
         });

         it('should return value if there is no placeholder', () => {
            const value = '';
            const newValue = '  .  .  ';
            const model = new MaskViewModel.default(
               {
                  ...options,
                  preferSource: true,
                  mask: 'DD.MM.YY'
               },
               value
            );
            const result = model._convertToDisplayValue(value);
            expect(result).toEqual(newValue);
         });
      });
   });
});
