define(['Controls/input'], function (input) {
   'use strict';

   describe('Controls/_input/Text/ViewModel', function () {
      var ctrl;

      beforeEach(function () {
         ctrl = new input.TextViewModel({}, '');
      });
      describe('handleInput', function () {
         it('Delete part of the value.', function () {
            ctrl.handleInput(
               {
                  before: 'test',
                  insert: '',
                  after: ' value',
                  delete: 'delete'
               },
               'delete'
            );

            expect(ctrl.value).toEqual('test value');
            expect(ctrl.displayValue).toEqual('test value');
            expect(ctrl.selection).toEqual({
               start: 4,
               end: 4
            });
         });
         it('Insert unresolved characters.', function () {
            ctrl.options = {
               constraint: '[0-9]'
            };
            ctrl.handleInput(
               {
                  before: '123',
                  insert: 'test 456',
                  after: '789',
                  delete: ''
               },
               'insert'
            );

            expect(ctrl.value).toEqual('123456789');
            expect(ctrl.displayValue).toEqual('123456789');
            expect(ctrl.selection).toEqual({
               start: 6,
               end: 6
            });
         });
         it('Insert a value greater than the allowed length.', function () {
            ctrl.options = {
               maxLength: 4
            };
            ctrl.handleInput(
               {
                  before: 'test',
                  insert: ' value',
                  after: '',
                  delete: ''
               },
               'insert'
            );

            expect(ctrl.value).toEqual('test');
            expect(ctrl.displayValue).toEqual('test');
            expect(ctrl.selection).toEqual({
               start: 4,
               end: 4
            });
         });
         it('Insert a unicode before greater than the allowed length.', function () {
            ctrl.options = {
               maxLength: 4
            };
            ctrl.handleInput(
               {
                  before: 'hi ',
                  insert: '😁',
                  after: '',
                  delete: ''
               },
               'insert'
            );

            expect(ctrl.value).toEqual('hi 😁');
            expect(ctrl.displayValue).toEqual('hi 😁');
         });
         it('Insert a unicode insert greater than the allowed length.', function () {
            ctrl.options = {
               maxLength: 4
            };
            ctrl.handleInput(
               {
                  before: '😁',
                  insert: ' smile',
                  after: '',
                  delete: ''
               },
               'insert'
            );

            expect(ctrl.value).toEqual('😁 sm');
            expect(ctrl.displayValue).toEqual('😁 sm');
         });
      });
   });
});
