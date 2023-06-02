define(['Controls/baseDecorator'], function (formatter) {
   'use strict';

   describe('Controls._input.Base.formatter', function () {
      describe('paste', function () {
         it('In an empty string insert "test" to the zero position.', function () {
            expect(formatter.paste('', 'test', 0)).toEqual('test');
         });
         it('In an empty string insert "test" to the tenth position.', function () {
            expect(formatter.paste('', 'test', 10)).toEqual('test');
         });
         it('In "origin" insert "test" on the zero position.', function () {
            expect(formatter.paste('origin', 'test', 0)).toEqual('testorigin');
         });
         it('In "origin" insert "test" on the third position.', function () {
            expect(formatter.paste('origin', 'test', 3)).toEqual('oritestgin');
         });
         it('In "origin" insert "test" on the tenth position.', function () {
            expect(formatter.paste('origin', 'test', 10)).toEqual('origintest');
         });
         it('In "origin" insert "test" minus the tenth position.', function () {
            expect(formatter.paste('origin', 'test', -10)).toEqual(
               'testorigin'
            );
         });
      });
   });
});
