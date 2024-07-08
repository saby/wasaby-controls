define(['Controls/lookup', 'Types/entity', 'Types/collection'], function (
   lookup,
   entity,
   collection
) {
   describe('"Controls/_lookup/SelectedCollection', function () {
      function getItems(countItems) {
         var items = [];
         // eslint-disable-next-line no-param-reassign
         for (; countItems; countItems--) {
            items.push(
               new entity.Model({
                  rawData: { id: countItems },
                  keyProperty: 'id'
               })
            );
         }

         return new collection.List({
            items: items
         });
      }

      it('_beforeUpdate', function () {
         // eslint-disable-next-line no-shadow
         let collection = new lookup.Collection();
         let isNotifyCloseInfoBox = false;

         collection._getCounterWidth = () => {
            return 0;
         };
         collection._notify = (eventName) => {
            if (eventName === 'closeInfoBox') {
               isNotifyCloseInfoBox = true;
            }
         };

         collection._stickyOpener = {
            isOpened: () => {
               return false;
            },
            close: jest.fn()
         };

         collection._visibleItems = [];
         collection.saveOptions({
            items: getItems(1)
         });
         collection._beforeUpdate({
            items: getItems(1),
            maxVisibleItems: 1
         });
         expect(isNotifyCloseInfoBox).toBe(false);

         collection._beforeUpdate({
            items: getItems(2),
            maxVisibleItems: 1
         });
         expect(isNotifyCloseInfoBox).toBe(false);

         collection._stickyOpener.isOpened = () => {
            return true;
         };
         collection._beforeUpdate({
            items: getItems(2),
            maxVisibleItems: 1
         });
         expect(isNotifyCloseInfoBox).toBe(false);

         collection._beforeUpdate({
            items: getItems(1),
            maxVisibleItems: 1
         });
         expect(isNotifyCloseInfoBox).toBe(true);
      });

      it('_openInfoBox', async () => {
         const items = [1, 2, 3, 4];
         const lookupCollection = new lookup.Collection();
         const stickyId = 'testId';
         let stickyOptions;
         lookupCollection._stickyOpener = {
            open: (config) => {
               stickyOptions = config;
               return Promise.resolve(stickyId);
            }
         };
         lookupCollection._children = {
            infoBoxLink: {}
         };

         items.clone = () => {
            return items.slice();
         };
         lookupCollection._options.items = items;
         lookupCollection._container = {};
         lookupCollection._notify = () => {
            return Promise.resolve();
         };

         await lookupCollection._openInfoBox();
         expect(stickyOptions.templateOptions.items).toEqual(items);

         lookupCollection._notify = jest.fn();
         await lookupCollection._openInfoBox();
         expect(stickyOptions.templateOptions.items).toEqual(items);
      });

      it('_isShowCounter', function () {
         let collection1 = new lookup.Collection();

         expect(collection1._isShowCounter(1, true, 2)).toBe(false);
         expect(collection1._isShowCounter(2, true, 2)).toBe(false);
         expect(collection1._isShowCounter(3, true, 2)).toBe(true);
         expect(collection1._isShowCounter(3, false, 15)).toBe(true);
      });

      it('_afterMount', function () {
         var isUpdate = false,
            selectedCollection = new lookup.Collection();

         selectedCollection._counterWidth = 0;
         selectedCollection._options.items = getItems(3);
         selectedCollection._options.maxVisibleItems = 5;
         selectedCollection._options.multiLine = true;
         selectedCollection._forceUpdate = function () {
            isUpdate = true;
         };

         selectedCollection._afterMount();
         expect(selectedCollection._counterWidth).toEqual(0);
         expect(isUpdate).toBe(false);

         selectedCollection._options.maxVisibleItems = 2;

         /* selectedCollection._afterMount();
         assert.notEqual(selectedCollection._counterWidth, 0);
         assert.isTrue(isUpdate); */
      });

      it('_itemClick', function () {
         var propagationStopped = false;
         var selectedCollection = new lookup.Collection();
         var model = new entity.Model({
            rawData: {
               id: 'test'
            },
            keyProperty: 'id'
         });
         var currentSelector;
         var event = {
            target: {
               closest: function (cssSelector) {
                  return cssSelector === currentSelector;
               }
            },
            stopPropagation: function () {
               propagationStopped = true;
            },
            nativeEvent: 'nativeEvent'
         };

         jest.spyOn(selectedCollection, '_notify').mockClear().mockImplementation();

         currentSelector = '.js-controls-SelectedCollection__item__caption';
         selectedCollection._itemClick(event, model);
         expect(selectedCollection._notify).toHaveBeenCalledWith('itemClick', [
            model,
            event.nativeEvent
         ]);
         expect(propagationStopped).toBe(true);

         currentSelector = '.js-controls-SelectedCollection__item__cross';
         selectedCollection._itemClick(event, model);
         expect(selectedCollection._notify).toHaveBeenCalledWith('crossClick', [
            model,
            event.nativeEvent
         ]);
         expect(propagationStopped).toBe(true);

         jest.restoreAllMocks();
      });
   });
});
