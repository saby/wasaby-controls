define(['Controls/_input/Phone/ViewModel'], function (ViewModelModule) {
   'use strict';

   describe('Controls.Input.Phone.ViewModel', function () {
      const ViewModel = ViewModelModule.ViewModel;
      var model;
      it('isFilled', function () {
         model = new ViewModel({}, '123');
         expect(model.isFilled()).toEqual(false);

         model = new ViewModel({}, '1234');
         expect(model.isFilled()).toEqual(true);

         model = new ViewModel({}, '12345');
         expect(model.isFilled()).toEqual(true);

         model = new ViewModel({}, '123456');
         expect(model.isFilled()).toEqual(true);
      });

      describe('handleInput', function () {
         [
            {
               inputType: 'insert',
               splitValue: {
                  after: '',
                  before: '',
                  delete: '',
                  insert: '8-916-865-43-21'
               },
               respValue: '89168654321',
               respDisplayValue: '8 (916) 865-43-21'
            }
         ].forEach(function (test, testNumber) {
            it(`${test.inputType} ${testNumber}`, function () {
               const viewModel = new ViewModel({}, '');
               viewModel.handleInput(test.splitValue, test.inputType);
               expect(viewModel.value).toEqual(test.respValue);
               expect(viewModel.displayValue).toEqual(test.respDisplayValue);
            });
         });
      });
   });
});
