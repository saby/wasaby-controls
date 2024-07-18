define(['Controls/popup', 'Types/collection', 'Core/helpers/Number/randomId'], function (
   popupMod,
   collection,
   randomId
) {
   'use strict';
   describe('Controls/_popup/Manager/Container', function () {
      let id;
      const items = new collection.List();
      const popupContainer = new popupMod.ContainerForTest();

      const getItem = (popupId, TYPE, data = {}) => {
         return {
            id: popupId,
            modal: data.modal,
            currentZIndex: data.currentZIndex,
            controller: {
               TYPE
            },
            popupState: 'created'
         };
      };

      it('add popupItem', function () {
         id = randomId('popup-');
         items.add({
            id: id,
            popupOptions: {},
            controller: {}
         });
         popupContainer.setPopupItems(items);
         expect(popupContainer._popupItems.getCount()).toEqual(1);
      });

      it('remove popupItem', function () {
         items.removeAt(0);
         popupContainer.setPopupItems(items);
         expect(popupContainer._popupItems.getCount()).toEqual(0);
      });

      it('set overlay id', () => {
         const Container = new popupMod.ContainerForTest();
         const list = new collection.List();

         list.add(getItem(0, 'InfoBox', { modal: true, currentZIndex: 40 }));
         list.add(getItem(1, 'InfoBox', { modal: false, currentZIndex: 10 }));
         list.add(getItem(2, 'InfoBox', { modal: true, currentZIndex: 20 }));
         list.add(getItem(3, 'InfoBox', { modal: false, currentZIndex: 30 }));
         Container.setPopupItems(list);
         expect(Container._overlayIndex).toEqual(0);

         list.removeAt(0);
         Container.setPopupItems(list);
         expect(Container._overlayIndex).toEqual(1);

         list.removeAt(1);
         Container.setPopupItems(list);
         expect(Container._overlayIndex).toEqual(undefined);
         Container.destroy();
      });

      it('popup items redraw promise', () => {
         const Container = new popupMod.ContainerForTest();
         Container._calcOverlayIndex = jest.fn();
         let isRedrawPromiseResolve = false;
         const redrawPromise = Container.setPopupItems({}).then(() => {
            isRedrawPromiseResolve = true;
            expect(isRedrawPromiseResolve).toEqual(true);
            Container.destroy();
         });
         Container._afterUpdate();
         return redrawPromise;
      });
   });
});
