define(['Controls/_input/Password/ViewModel'], function (ViewModelModule) {
   const ViewModel = ViewModelModule.ViewModel;
   describe('Controls/_input/Password/ViewModel', function () {
      var currentModel;
      var changeVisibilityPassword = function (model, value) {
         model.options = {
            passwordVisible: value,
            readOnly: model.options.readOnly,
            autoComplete: model.options.autoComplete
         };
      };
      it('Init value to null.', function () {
         currentModel = new ViewModel(
            {
               readOnly: false,
               autoComplete: false,
               passwordVisible: false
            },
            null
         );
         expect(currentModel.value).toEqual(null);
         expect(currentModel.displayValue).toEqual('');

         currentModel.handleInput({
            before: '',
            insert: 'a',
            after: '',
            delete: ''
         });
         expect(currentModel.value).toEqual('a');
         expect(currentModel.displayValue).toEqual('•');
      });
      describe('Auto-completion is disabled and mode is edit and password is hidden and value is equal "12345".', function () {
         beforeEach(function () {
            currentModel = new ViewModel(
               {
                  readOnly: false,
                  autoComplete: false,
                  passwordVisible: false
               },
               '12345'
            );
         });

         it('Create an instance.', function () {
            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
            expect(currentModel.options).toEqual({
               readOnly: false,
               autoComplete: false,
               passwordVisible: false
            });
         });
         it('Change value to "54321".', function () {
            currentModel.value = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('•••••');
         });
         it('Change displayValue to "54321".', function () {
            currentModel.displayValue = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Insert "a" between "12" and "345".', function () {
            currentModel.handleInput({
               before: '••',
               insert: 'a',
               after: '•••',
               delete: ''
            });

            expect(currentModel.value).toEqual('12a345');
            expect(currentModel.displayValue).toEqual('••••••');
         });
         it('Change password visibility to true.', function () {
            changeVisibilityPassword(currentModel, true);

            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('12345');
         });
      });
      describe('Auto-completion is enabled and mode is edit and password is hidden and value is equal "12345".', function () {
         beforeEach(function () {
            currentModel = new ViewModel(
               {
                  readOnly: false,
                  autoComplete: true,
                  passwordVisible: false
               },
               '12345'
            );
         });

         it('Create an instance.', function () {
            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('12345');
            expect(currentModel.options).toEqual({
               readOnly: false,
               autoComplete: true,
               passwordVisible: false
            });
         });
         it('Change value to "54321".', function () {
            currentModel.value = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Change displayValue to "54321".', function () {
            currentModel.displayValue = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Insert "a" between "12" and "345".', function () {
            currentModel.handleInput({
               before: '12',
               insert: 'a',
               after: '345',
               delete: ''
            });

            expect(currentModel.value).toEqual('12a345');
            expect(currentModel.displayValue).toEqual('12a345');
         });
         it('Change password visibility to true.', function () {
            changeVisibilityPassword(currentModel, true);

            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('12345');
         });
      });
      describe('Auto-completion is disabled and mode is edit and password is visible and value is equal "12345".', function () {
         beforeEach(function () {
            currentModel = new ViewModel(
               {
                  readOnly: false,
                  autoComplete: false,
                  passwordVisible: true
               },
               '12345'
            );
         });

         it('Create an instance.', function () {
            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('12345');
            expect(currentModel.options).toEqual({
               readOnly: false,
               autoComplete: false,
               passwordVisible: true
            });
         });
         it('Change value to "54321".', function () {
            currentModel.value = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Change displayValue to "54321".', function () {
            currentModel.displayValue = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Insert "a" between "12" and "345".', function () {
            currentModel.handleInput({
               before: '12',
               insert: 'a',
               after: '345',
               delete: ''
            });

            expect(currentModel.value).toEqual('12a345');
            expect(currentModel.displayValue).toEqual('12a345');
         });
         it('Change password visibility to false.', function () {
            changeVisibilityPassword(currentModel, false);

            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
         });
      });
      describe('Auto-completion is enabled and mode is edit and password is visible and value is equal "12345".', function () {
         beforeEach(function () {
            currentModel = new ViewModel(
               {
                  readOnly: false,
                  autoComplete: true,
                  passwordVisible: true
               },
               '12345'
            );
         });

         it('Create an instance.', function () {
            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('12345');
            expect(currentModel.options).toEqual({
               readOnly: false,
               autoComplete: true,
               passwordVisible: true
            });
         });
         it('Change value to "54321".', function () {
            currentModel.value = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Change displayValue to "54321".', function () {
            currentModel.displayValue = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Insert "a" between "12" and "345".', function () {
            currentModel.handleInput({
               before: '12',
               insert: 'a',
               after: '345',
               delete: ''
            });

            expect(currentModel.value).toEqual('12a345');
            expect(currentModel.displayValue).toEqual('12a345');
         });
         it('Change password visibility to false.', function () {
            changeVisibilityPassword(currentModel, false);

            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('12345');
         });
      });
      describe('Auto-completion is disabled and mode is read and password is hidden and value is equal "12345".', function () {
         beforeEach(function () {
            currentModel = new ViewModel(
               {
                  readOnly: true,
                  autoComplete: false,
                  passwordVisible: false
               },
               '12345'
            );
         });

         it('Create an instance.', function () {
            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
            expect(currentModel.options).toEqual({
               readOnly: true,
               autoComplete: false,
               passwordVisible: false
            });
         });
         it('Change value to "54321".', function () {
            currentModel.value = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('•••••');
         });
         it('Change displayValue to "54321".', function () {
            currentModel.displayValue = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Insert "a" between "12" and "345".', function () {
            currentModel.handleInput({
               before: '••',
               insert: 'a',
               after: '•••',
               delete: ''
            });

            expect(currentModel.value).toEqual('12a345');
            expect(currentModel.displayValue).toEqual('••••••');
         });
         it('Change password visibility to true.', function () {
            changeVisibilityPassword(currentModel, true);

            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
         });
      });
      describe('Auto-completion is enabled and mode is read and password is hidden and value is equal "12345".', function () {
         beforeEach(function () {
            currentModel = new ViewModel(
               {
                  readOnly: true,
                  autoComplete: true,
                  passwordVisible: false
               },
               '12345'
            );
         });

         it('Create an instance.', function () {
            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
            expect(currentModel.options).toEqual({
               readOnly: true,
               autoComplete: true,
               passwordVisible: false
            });
         });
         it('Change value to "54321".', function () {
            currentModel.value = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('•••••');
         });
         it('Change displayValue to "54321".', function () {
            currentModel.displayValue = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Insert "a" between "12" and "345".', function () {
            currentModel.handleInput({
               before: '12',
               insert: 'a',
               after: '345',
               delete: ''
            });

            expect(currentModel.value).toEqual('12a345');
            expect(currentModel.displayValue).toEqual('••••••');
         });
         it('Change password visibility to true.', function () {
            changeVisibilityPassword(currentModel, true);

            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
         });
      });
      describe('Auto-completion is disabled and mode is read and password is visible and value is equal "12345".', function () {
         beforeEach(function () {
            currentModel = new ViewModel(
               {
                  readOnly: true,
                  autoComplete: false,
                  passwordVisible: true
               },
               '12345'
            );
         });

         it('Create an instance.', function () {
            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
            expect(currentModel.options).toEqual({
               readOnly: true,
               autoComplete: false,
               passwordVisible: true
            });
         });
         it('Change value to "54321".', function () {
            currentModel.value = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('•••••');
         });
         it('Change displayValue to "54321".', function () {
            currentModel.displayValue = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Insert "a" between "12" and "345".', function () {
            currentModel.handleInput({
               before: '12',
               insert: 'a',
               after: '345',
               delete: ''
            });

            expect(currentModel.value).toEqual('12a345');
            expect(currentModel.displayValue).toEqual('••••••');
         });
         it('Change password visibility to false.', function () {
            changeVisibilityPassword(currentModel, false);

            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
         });
      });
      describe('Auto-completion is enabled and mode is read and password is visible and value is equal "12345".', function () {
         beforeEach(function () {
            currentModel = new ViewModel(
               {
                  readOnly: true,
                  autoComplete: true,
                  passwordVisible: true
               },
               '12345'
            );
         });

         it('Create an instance.', function () {
            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
            expect(currentModel.options).toEqual({
               readOnly: true,
               autoComplete: true,
               passwordVisible: true
            });
         });
         it('Change value to "54321".', function () {
            currentModel.value = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('•••••');
         });
         it('Change displayValue to "54321".', function () {
            currentModel.displayValue = '54321';

            expect(currentModel.value).toEqual('54321');
            expect(currentModel.displayValue).toEqual('54321');
         });
         it('Insert "a" between "12" and "345".', function () {
            currentModel.handleInput({
               before: '12',
               insert: 'a',
               after: '345',
               delete: ''
            });

            expect(currentModel.value).toEqual('12a345');
            expect(currentModel.displayValue).toEqual('••••••');
         });
         it('Change password visibility to false.', function () {
            changeVisibilityPassword(currentModel, false);

            expect(currentModel.value).toEqual('12345');
            expect(currentModel.displayValue).toEqual('•••••');
         });
      });
   });
});
