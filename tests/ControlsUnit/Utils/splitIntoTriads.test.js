define(['Controls/baseDecorator'], function (decorator) {
   'use strict';

   describe('Controls.Utils.splitIntoTriads', function () {
      it('Tests', function () {
         expect(decorator.splitIntoTriads('1')).toEqual('1');
         expect(decorator.splitIntoTriads('11')).toEqual('11');
         expect(decorator.splitIntoTriads('111')).toEqual('111');
         expect(decorator.splitIntoTriads('1111')).toEqual('1 111');
         expect(decorator.splitIntoTriads('11111')).toEqual('11 111');
         expect(decorator.splitIntoTriads('111111')).toEqual('111 111');
         expect(decorator.splitIntoTriads('-111')).toEqual('-111');
         expect(decorator.splitIntoTriads('-111111')).toEqual('-111 111');
      });
   });
});
