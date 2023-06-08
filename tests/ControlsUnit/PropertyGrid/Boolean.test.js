define(['Controls/_propertyGrid/defaultEditors/Boolean'], function (Boolean) {
   'use strict';

   describe('Boolean', function () {
      const config = {
         value: 'test'
      };
      // eslint-disable-next-line no-new-wrappers
      var boolean = new Boolean(config);
      boolean._beforeMount(config);

      describe('_valueChanged', function () {
         it('force update', () => {
            boolean._valueChanged({}, false);
            expect(boolean.value).toEqual(false);
         });
      });
      describe('_beforeUpdate', function () {
         it('new value', () => {
            boolean._beforeUpdate({ propertyValue: true });
            expect(boolean.value).toEqual(true);
         });
      });
   });
});
