/**
 * Created by ee.volkova1 on 14.06.2018.
 */
define(['Controls/extendedDecorator'], function (decorator) {
   'use strict';

   describe('Controls.extendedDecorator.Phone', function () {
      var result;

      it('Empty number', function () {
         result = decorator.FormatPhone('');
         expect(result).toEqual('');
      });

      it('Only letters in number', function () {
         result = decorator.FormatPhone('hhhhh');
         expect(result).toEqual('');
      });

      it('City Number with 8', function () {
         result = decorator.FormatPhone('84942228771');
         expect(result).toEqual('8 (4942) 22-87-71');
      });

      it('City Number with +7', function () {
         result = decorator.FormatPhone('+74942228772');
         expect(result).toEqual('+7 (4942) 22-87-72');
      });

      it('Country Number with 8', function () {
         result = decorator.FormatPhone('84943121750');
         expect(result).toEqual('8 (49431) 2-17-50');
      });

      it('Country Number with +7', function () {
         result = decorator.FormatPhone('+74943121751');
         expect(result).toEqual('+7 (49431) 2-17-51');
      });

      it('Country Number with wrong hyphens', function () {
         result = decorator.FormatPhone('+7494-3121-752');
         expect(result).toEqual('+7 (49431) 2-17-52');
      });

      it('City Number with additional number', function () {
         result = decorator.FormatPhone('84942228771112');
         expect(result).toEqual('8 (4942) 22-87-71 доб. 112');
      });

      it('City Number with wrong hyphens, wrong round brackets and additional number', function () {
         result = decorator.FormatPhone('84942-228771-(113)');
         expect(result).toEqual('8 (4942) 22-87-71 доб. 113');
      });

      it('Country Number with letters', function () {
         result = decorator.FormatPhone('84942ff228771');
         expect(result).toEqual('8 (4942) 22-87-71');
      });

      it('Mobile number without 8 or +7', function () {
         result = decorator.FormatPhone('9206469857');
         expect(result).toEqual('(920)-646-98-57');
      });

      it('Mobile number with 8', function () {
         result = decorator.FormatPhone('89206469857');
         expect(result).toEqual('8 (920) 646-98-57');
      });

      it('Mobile number with +7', function () {
         result = decorator.FormatPhone('+79206469858');
         expect(result).toEqual('+7 (920) 646-98-58');
      });

      it('Foreign number with 1 symbol of code', function () {
         result = decorator.FormatPhone('12555555555');
         expect(result).toEqual('12555555555');
      });

      it('Foreign number with 2 symbols of code', function () {
         result = decorator.FormatPhone('492555555555');
         expect(result).toEqual('492555555555');
      });

      it('Foreign number with 3 symbols of code', function () {
         result = decorator.FormatPhone('420055555555');
         expect(result).toEqual('420055555555');
      });

      it('Little (less then 5 symbols) number without code', function () {
         result = decorator.FormatPhone('8371');
         expect(result).toEqual('8 (371)');
      });
   });
});
