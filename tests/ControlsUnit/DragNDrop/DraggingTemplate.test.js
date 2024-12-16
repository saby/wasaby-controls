define(['Controls/dragnDrop'], function (dragnDrop) {
   'use strict';

   function crateEntity(itemsCount) {
      return new dragnDrop.ListItems({
         items: {
            length: itemsCount
         }
      });
   }

   var avatar = new dragnDrop.DraggingTemplate({ entity: crateEntity(1) });

   describe('Controls.DragNDrop.DraggingTemplate', function () {
      it('itemsCount = 1', function () {
         avatar._beforeMount({ entity: crateEntity(1) });
         expect(avatar._itemsCount).toEqual(undefined);
      });
      it('itemsCount > 1', function () {
         avatar._beforeMount({ entity: crateEntity(2) });
         expect(avatar._itemsCount).toEqual(2);
      });
      it('itemsCount = 999(max)', function () {
         avatar._beforeMount({ entity: crateEntity(999) });
         expect(avatar._itemsCount).toEqual(999);
      });
      it('itemsCount = 1000', function () {
         avatar._beforeMount({ entity: crateEntity(1000) });
         expect(avatar._itemsCount).toEqual('999+');
      });
   });
});
