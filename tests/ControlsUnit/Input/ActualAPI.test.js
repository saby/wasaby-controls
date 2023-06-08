define(['Controls/input', 'UI/Utils'], function (input, { Logger }) {
   describe('InputActualAPI', function () {
      beforeEach(() => {
         jest.spyOn(Logger, 'error').mockClear().mockImplementation();
      });

      it('inlineHeight', function () {
         const inlineHeight = input.ActualAPI.inlineHeight;

         expect(inlineHeight('s', undefined)).toEqual('s');
         expect(inlineHeight('m', undefined)).toEqual('m');
         expect(inlineHeight('l', undefined)).toEqual('l');
         expect(inlineHeight('default', undefined)).toEqual('default');
         expect(inlineHeight(undefined, 'xs')).toEqual('xs');
         expect(inlineHeight(undefined, 'xs')).toEqual('xs');
         expect(inlineHeight(undefined, 'xs')).toEqual('xs');
         expect(inlineHeight(undefined, 'xs')).toEqual('xs');
      });
      it('fontColorStyle', function () {
         const fontColorStyle = input.ActualAPI.fontColorStyle;

         expect(fontColorStyle('default', undefined)).toEqual('default');
         expect(fontColorStyle('primary', undefined)).toEqual('primary');
         expect(fontColorStyle('secondary', undefined)).toEqual('secondary');
         expect(fontColorStyle(undefined, 'primary')).toEqual('primary');
         expect(fontColorStyle(undefined, 'default')).toEqual('default');
         expect(fontColorStyle(undefined, 'default')).toEqual('default');
      });
      it('fontSize', function () {
         const fontSize = input.ActualAPI.fontSize;

         expect(fontSize('default', undefined)).toEqual('m');
         expect(fontSize('primary', undefined)).toEqual('3xl');
         expect(fontSize('secondary', undefined)).toEqual('3xl');
         expect(fontSize(undefined, 's')).toEqual('s');
         expect(fontSize(undefined, 's')).toEqual('s');
         expect(fontSize(undefined, 's')).toEqual('s');
      });
      it('validationStatus', function () {
         const validationStatus = input.ActualAPI.validationStatus;

         expect(validationStatus('info', undefined)).toEqual('valid');
         expect(validationStatus('invalid', undefined)).toEqual('invalid');
         expect(validationStatus('danger', undefined)).toEqual('valid');
         expect(validationStatus('success', undefined)).toEqual('valid');
         expect(validationStatus('warning', undefined)).toEqual('valid');
         expect(validationStatus('primary', undefined)).toEqual('valid');
         expect(validationStatus('info', 'invalid')).toEqual('invalid');
         expect(validationStatus('invalid', undefined)).toEqual('invalid');
         expect(validationStatus('danger', 'valid')).toEqual('valid');
         expect(validationStatus('success', 'invalid')).toEqual('invalid');
         expect(validationStatus('warning', 'invalid')).toEqual('invalid');
         expect(validationStatus('primary', 'invalid')).toEqual('invalid');
      });
   });
});
