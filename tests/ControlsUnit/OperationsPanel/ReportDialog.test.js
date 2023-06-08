define(['Controls/operationsPopup'], function (operationsPopup) {
   'use strict';

   describe('Controls/_operationsPopup/ReportDialog', function () {
      var reportDialog = new operationsPopup.ReportDialog();

      it('success', function () {
         reportDialog._beforeMount({
            operationsCount: 10,
            operationsSuccess: 10
         });
         expect(reportDialog._message).toEqual(
            '10 запись(-и,-ей) успешно обработана(-ы)'
         );
      });
      it('error without errors list', function () {
         reportDialog._beforeMount({
            operationsCount: 10,
            operationsSuccess: 6
         });
         expect(reportDialog._message).toEqual(
            'Выполнение операции завершилось ошибкой'
         );
      });
      it('error with errors list', function () {
         reportDialog._beforeMount({
            operationsCount: 10,
            operationsSuccess: 6,
            errors: ['error1']
         });
         expect(reportDialog._message).toEqual(
            '4 из 10 операций были обработаны с ошибкой'
         );
      });
   });
});
