define([
   'Core/core-clone',
   'Core/core-merge',
   'Controls/_input/Number/ViewModel'
], function (cClone, cMerge, ViewModel) {
   describe('Controls._input.Number.ViewModel', function () {
      describe('handleInput', function () {
         const defaultOptions = {
            useGrouping: false,
            onlyPositive: false
         };
         const model = new ViewModel.default(defaultOptions, null);
         const getSelection = function (value) {
            return {
               start: value,
               end: value
            };
         };

         beforeEach(function () {
            model.options = cClone(defaultOptions);
         });

         it('Enter "1".', function () {
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '1',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('1');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "test1test2test3test".', function () {
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: 'test1test2test3test',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('123');
            expect(model.selection).toEqual(getSelection(3));
         });
         it('Enter "1". No fractional part.', function () {
            model.options = cMerge(model.options, {
               precision: 0
            });
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '1',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('1');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "1.1". No fractional part.', function () {
            model.options = cMerge(model.options, {
               precision: 0
            });
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '1.1',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('1');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "-1".', function () {
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '-1',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('-1');
            expect(model.selection).toEqual(getSelection(2));
         });
         it('Enter "-1". Only positive numbers.', function () {
            model.options = cMerge(model.options, {
               onlyPositive: true
            });
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '-1',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('1');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "-". Only positive numbers.', function () {
            model.options = cMerge(model.options, {
               onlyPositive: true
            });
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '-',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('');
            expect(model.selection).toEqual(getSelection(0));
         });
         it('Enter "6" at the end of the integer part. The maximum length of the integer part equal 5.', function () {
            model.options = cMerge(model.options, {
               integersLength: 5
            });
            model.handleInput(
               {
                  after: '.0',
                  before: '12345',
                  insert: '6',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('12345.60');
            expect(model.selection).toEqual(getSelection(7));
         });
         it('Enter "6" at the end of the integer part. The maximum length of the integer part equal 5. No fractional part.', function () {
            model.options = cMerge(model.options, {
               precision: 0,
               integersLength: 5
            });
            model.handleInput(
               {
                  after: '',
                  before: '12345',
                  insert: '6',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('12345');
            expect(model.selection).toEqual(getSelection(5));
         });
         it('Enter "6" at the end of the integer part. The maximum length of the integer part equal 5. The maximum length of the fractional part equal 1.', function () {
            model.options = cMerge(model.options, {
               precision: 1,
               integersLength: 5
            });
            model.handleInput(
               {
                  after: '.0',
                  before: '12345',
                  insert: '6',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('12345.6');
            expect(model.selection).toEqual(getSelection(7));
         });
         it('Enter "-". No fractional part.', function () {
            model.options = cMerge(model.options, {
               precision: 0
            });

            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '-',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('-');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "-" front "0". No fractional part.', function () {
            model.options = cMerge(model.options, {
               precision: 0
            });

            model.handleInput(
               {
                  after: '0',
                  before: '',
                  insert: '-',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('-');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "4" at the start of the integer part. The maximum length of the integer part equal 3. No fractional part.', function () {
            model.options = cMerge(model.options, {
               precision: 0,
               integersLength: 3
            });
            model.handleInput(
               {
                  after: '123',
                  before: '',
                  insert: '4',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('423');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "0". No fractional part.', function () {
            model.options = cMerge(model.options, {
               precision: 0
            });
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '0',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('0');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "-" before is "0". No fractional part.', function () {
            model.options = cMerge(model.options, {
               precision: 0
            });
            model.handleInput(
               {
                  after: '0',
                  before: '',
                  insert: '-',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('-');
            expect(model.selection).toEqual(getSelection(1));
         });
         it('Enter "." before is "123 456"', function () {
            model._displayValue = '123 456';
            model.handleInput(
               {
                  after: '',
                  before: '123 456',
                  insert: '.',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('123 456.0');
            expect(model.selection).toEqual(getSelection(8));
         });
         it('Enter "12,34".', function () {
            model.handleInput(
               {
                  after: '',
                  before: '',
                  insert: '12,34',
                  delete: ''
               },
               'insert'
            );

            expect(model.displayValue).toEqual('12.34');
            expect(model.selection).toEqual(getSelection(5));
         });
         it('Remove "." use backspace.', function () {
            model.options = cMerge(model.options, {
               integersLength: 3
            });
            model.handleInput(
               {
                  after: '45',
                  before: '123',
                  delete: '.',
                  insert: ''
               },
               'deleteBackward'
            );

            expect(model.displayValue).toEqual('12.45');
            expect(model.selection).toEqual(getSelection(2));
         });
         it('Remove "." use delete.', function () {
            model.options = cMerge(model.options, {
               integersLength: 3
            });
            model.handleInput(
               {
                  after: '45',
                  before: '123',
                  delete: '.',
                  insert: ''
               },
               'deleteForward'
            );

            expect(model.displayValue).toEqual('123.5');
            expect(model.selection).toEqual(getSelection(4));
         });
         it('Remove "." use delete with useAdditionToMaxPrecision.', function () {
            model.options = cMerge(model.options, {
               integersLength: 3,
               precision: 2,
               useAdditionToMaxPrecision: true
            });
            model.handleInput(
               {
                  after: '45',
                  before: '123',
                  delete: '.',
                  insert: ''
               },
               'deleteForward'
            );

            expect(model.displayValue).toEqual('123.50');
            expect(model.selection).toEqual(getSelection(4));
         });
         it('Keep removing use delete before equal 0.00.', function () {
            model.options = cMerge(model.options, {
               integersLength: 3,
               precision: 2,
               useAdditionToMaxPrecision: true
            });
            let value = '123.45';
            let splittedValue = value.split('.');
            const inputCfg = {
               after: splittedValue[1],
               before: splittedValue[0],
               delete: '.',
               insert: ''
            };
            model.handleInput(inputCfg, 'deleteForward');

            expect(model.displayValue).toEqual('123.50');

            value = model.displayValue;
            splittedValue = value.split('.');
            inputCfg.before = splittedValue[0];
            inputCfg.after = splittedValue[1];
            model.handleInput(inputCfg, 'deleteForward');

            expect(model.displayValue).toEqual('123.00');
         });
         it('Remove and replace with zero.', function () {
            model.options = cMerge(model.options, {
               precision: 2,
               useAdditionToMaxPrecision: true
            });
            model.handleInput(
               {
                  after: '5',
                  before: '123.',
                  delete: '4',
                  insert: ''
               },
               'deleteBackward'
            );

            expect(model.displayValue).toEqual('123.50');
            expect(model.selection).toEqual(getSelection(4));
         });

         it('Test1', function () {
            model.value = '123';

            expect(model._convertToValue('123 456')).toEqual('123456');
         });
         it('Test2', function () {
            model.value = null;

            expect(model._convertToValue('123 456')).toEqual(123456);
         });
         it('Test3', function () {
            model.value = 123;

            expect(model._convertToValue('123 456')).toEqual(123456);
         });
      });

      describe('_convertToDisplayValue', function () {
         [
            {
               options: {
                  precision: 2,
                  showEmptyDecimals: true,
                  useAdditionToMaxPrecision: true
               },
               value: 12.3,
               displayValue: '12.30'
            },
            {
               options: {
                  precision: 2,
                  showEmptyDecimals: true,
                  useAdditionToMaxPrecision: true
               },
               value: 12,
               displayValue: '12.00'
            },
            {
               options: {
                  precision: 10,
                  showEmptyDecimals: false
               },
               value: 12,
               displayValue: '12'
            },
            {
               options: {
                  precision: 2,
                  useGrouping: true,
                  showEmptyDecimals: true,
                  useAdditionToMaxPrecision: true
               },
               value: 123456.3,
               displayValue: '123 456.30'
            },
            {
               options: {},
               value: 1e19,
               displayValue: '10000000000000000000'
            }
         ].forEach(function (test) {
            it(`value: ${
               test.value
            }, displayValue: ${test.displayValue}, options: ${JSON.stringify(test.options)}`, function () {
               const model = new ViewModel.default(test.options, null);
               expect(model._convertToDisplayValue(test.value)).toEqual(
                  test.displayValue
               );
            });
         });
      });

      describe('_getStartingPosition', function () {
         it('123', function () {
            const model = new ViewModel.default({}, '123');

            expect(model.selection.start).toEqual(3);
            expect(model.selection.end).toEqual(3);
         });
         it('123.456', function () {
            const model = new ViewModel.default({}, '123.456');

            expect(model.selection.start).toEqual(3);
            expect(model.selection.end).toEqual(3);
         });
      });
   });
});
