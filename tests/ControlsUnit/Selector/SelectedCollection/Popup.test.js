define(['Controls/lookupPopup', 'Types/entity', 'Types/collection'], function (
   lookupPopup,
   entity,
   collection
) {
   describe('Controls/_lookupPopup/SelectedCollection/Popup', function () {
      it('_crossClick', function () {
         var item = new entity.Model({
               rawData: { id: 1 },
               keyProperty: 'id'
            }),
            item2 = new entity.Model({
               rawData: { id: 2 },
               keyProperty: 'id'
            }),
            scPopup = new lookupPopup.Collection();

         scPopup._options.clickCallback = jest.fn();
         scPopup._items = new collection.List({
            items: [item, item2]
         });

         scPopup._crossClick(null, item);
         expect(scPopup._items.at(0)).toEqual(item2);
         expect(scPopup._items.getCount()).toEqual(1);

         scPopup._crossClick(null, item2);
         expect(scPopup._items.getCount()).toEqual(0);
      });

      it('_itemClick', function () {
         var callCloseInfoBox = false,
            scPopup = new lookupPopup.Collection();

         scPopup._options.clickCallback = jest.fn();
         scPopup._notify = function (eventType) {
            if (eventType === 'close') {
               callCloseInfoBox = true;
            }
         };

         scPopup._itemClick();
         expect(callCloseInfoBox).toBe(true);
      });
   });
});
