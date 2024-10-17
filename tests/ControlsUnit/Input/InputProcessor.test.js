define(['Controls/baseDecorator', 'Controls/input'], function (formatter, inputMod) {
   'use strict';

   describe('Controls/_input/Mask/InputProcessor', function () {
      var Formatter = formatter.Formatter,
         replacer = ' ',
         format = formatter.FormatBuilder.getFormat(
            'dd.dd',
            {
               d: '[0-9]'
            },
            replacer
         ),
         clearData = Formatter.clearData(format, '1 . 4'),
         result;

      describe('getClearSplitValue', function () {
         it('Test_01', function () {
            result = inputMod.MaskInputProcessor.getClearSplitValue(
               {
                  before: '1',
                  after: '. 4',
                  delete: ' ',
                  insert: '2'
               },
               clearData
            );
            expect(result).toEqual({
               before: '1',
               after: ' 4',
               delete: ' ',
               insert: '2'
            });
         });
      });
      describe('input', function () {
         describe('insert', function () {
            it('Test_01', function () {
               result = inputMod.MaskInputProcessor.input(
                  {
                     before: '1',
                     after: '.3 ',
                     delete: ' ',
                     insert: '2'
                  },
                  'insert',
                  replacer,
                  format,
                  format
               );
               expect(result).toEqual({
                  value: '12. 3',
                  position: 3,
                  format: format
               });
            });
            it('Test_03', function () {
               var innerFormat = formatter.FormatBuilder.getFormat(
                  'dd.dd',
                  {
                     d: '[0-9]'
                  },
                  ''
               );
               result = inputMod.MaskInputProcessor.input(
                  {
                     before: '1',
                     after: '3',
                     delete: '',
                     insert: '2'
                  },
                  'insert',
                  '',
                  innerFormat,
                  innerFormat
               );
               expect(result).toEqual({
                  value: '12.3',
                  position: 3,
                  format: innerFormat
               });
            });
            it('Test_04', function () {
               var newFormat = formatter.FormatBuilder.getFormat(
                  'dd-dd',
                  {
                     d: '[0-9]'
                  },
                  ''
               );
               var oldFormat = formatter.FormatBuilder.getFormat(
                  'dd-dd-dd',
                  {
                     d: '[0-9]'
                  },
                  ''
               );
               result = inputMod.MaskInputProcessor.input(
                  {
                     before: '',
                     after: '',
                     delete: '12-34-56',
                     insert: '4'
                  },
                  'insert',
                  '',
                  oldFormat,
                  newFormat
               );
               expect(result).toEqual({
                  value: '4',
                  position: 1,
                  format: newFormat
               });
            });
         });
         describe('delete', function () {
            it('Test_01', function () {
               result = inputMod.MaskInputProcessor.input(
                  {
                     before: '',
                     after: '',
                     delete: '1 . 4',
                     insert: ''
                  },
                  'delete',
                  replacer,
                  format,
                  format
               );
               expect(result).toEqual({
                  value: '  .  ',
                  position: 0,
                  format: format
               });
            });
         });
         describe('deleteForward', function () {
            it('Test_01', function () {
               result = inputMod.MaskInputProcessor.input(
                  {
                     before: '1',
                     after: '. 4',
                     delete: '2',
                     insert: ''
                  },
                  'deleteForward',
                  replacer,
                  format,
                  format
               );
               expect(result).toEqual({
                  value: '1 . 4',
                  position: 3,
                  format: format
               });
            });
            it('Test_02', function () {
               result = inputMod.MaskInputProcessor.input(
                  {
                     before: '12',
                     after: '34',
                     delete: '.',
                     insert: ''
                  },
                  'deleteForward',
                  replacer,
                  format,
                  format
               );
               expect(result).toEqual({
                  value: '12. 4',
                  position: 4,
                  format: format
               });
            });
         });
         describe('deleteBackward', function () {
            it('Test_01', function () {
               result = inputMod.MaskInputProcessor.input(
                  {
                     before: '1',
                     after: '.34',
                     delete: '2',
                     insert: ''
                  },
                  'deleteBackward',
                  replacer,
                  format,
                  format
               );
               expect(result).toEqual({
                  value: '1 .34',
                  position: 1,
                  format: format
               });
            });
            it('Test_02', function () {
               result = inputMod.MaskInputProcessor.input(
                  {
                     before: '12',
                     after: '34',
                     delete: '.',
                     insert: ''
                  },
                  'deleteBackward',
                  replacer,
                  format,
                  format
               );
               expect(result).toEqual({
                  value: '1 .34',
                  position: 1,
                  format: format
               });
            });
         });
      });
   });
});
