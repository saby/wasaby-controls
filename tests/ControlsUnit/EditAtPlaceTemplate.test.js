define(['Controls/editableArea'], function (editableArea) {
   'use strict';

   describe('Controls.EditAtPlace', function () {
      it('_editorValueChangeHandler', function () {
         var instance = new editableArea.Base();
         instance._notify = function (eventName, eventArgs, eventOptions) {
            expect(eventName).toEqual('valueChanged');
            expect(eventArgs).toBeInstanceOf(Array);
            expect(eventArgs[0]).toEqual('test');
            expect(eventOptions).not.toBeDefined();
         };

         instance._editorValueChangeHandler({}, 'test');
      });
   });
});
