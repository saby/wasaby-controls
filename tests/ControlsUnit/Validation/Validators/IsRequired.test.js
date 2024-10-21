define(['Controls/validate'], function (validate) {
   'use strict';

   describe('Controls.Validators', function () {
      describe('IsRequired', function () {
         it('Valid "qwe"', function () {
            expect(
               validate.isRequired({
                  value: 'qwe'
               })
            ).toEqual(true);
         });

         it('Invalid ""', function () {
            expect(
               validate.isRequired({
                  value: ''
               })
            ).not.toEqual(true);
         });

         it('Valid "" if doNotValidate', function () {
            expect(
               validate.isRequired({
                  value: '',
                  doNotValidate: true
               })
            ).toEqual(true);
         });

         it('Valid {}', function () {
            expect(
               validate.isRequired({
                  value: {}
               })
            ).not.toEqual(true);
         });

         it('Valid Date', function () {
            expect(
               validate.isRequired({
                  value: new Date()
               })
            ).toEqual(true);
         });

         it('Array validation', function () {
            expect(
               validate.isRequired({
                  value: []
               })
            ).toEqual('Поле обязательно для заполнения');
            expect(
               validate.isRequired({
                  value: [null]
               })
            ).toEqual('Поле обязательно для заполнения');
            expect(
               validate.isRequired({
                  value: ['test']
               })
            ).toEqual(true);
         });
      });
   });
});
