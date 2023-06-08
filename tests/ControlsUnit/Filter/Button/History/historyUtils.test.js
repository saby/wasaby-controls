define([
   'Controls/filter',
   'Controls/history',
   'Env/Env',
   'Types/collection',
   'Types/source'
], function (filter, history, Env, collection, sourceLib) {
   describe('Filter.Button.HistoryUtils', function () {
      var historyId = 'TEST_HISTORY_ID_UTILS';

      it('getHistorySource', function () {
         var isServerSide = Env.constants.isServerSide;
         Env.constants.isServerSide = false;
         var hSource = filter.HistoryUtils.getHistorySource({
            historyId: historyId
         });
         expect(hSource instanceof history.FilterSource).toBe(true);
         var hSource2 = filter.HistoryUtils.getHistorySource({
            historyId: historyId
         });
         expect(hSource === hSource2).toBe(true);
         Env.constants.isServerSide = isServerSide;
      });

      it('getHistorySource isServerSide', function () {
         var hSource = filter.HistoryUtils.getHistorySource({
            historyId: historyId
         });
         var hSource2 = filter.HistoryUtils.getHistorySource({
            historyId: historyId
         });
         expect(hSource === hSource2).toBe(true);
      });

      it('prependNewItems', function () {
         let initItems = [
            { key: 0, title: 'все страны' },
            { key: 1, title: 'Россия' },
            { key: 2, title: 'США' },
            { key: 3, title: 'Великобритания' }
         ];
         let hasMoreData = true;
         let items = new collection.RecordSet({
               keyProperty: 'key',
               rawData: initItems,
               metaData: { test: true }
            }),
            sourceController = {
               hasMoreData: () => {
                  return hasMoreData;
               }
            },
            source = new sourceLib.Memory({
               keyProperty: 'key',
               data: initItems
            });
         let newItems = new collection.RecordSet({
            keyProperty: 'key',
            rawData: [{ key: 18, title: '18 record' }]
         });
         let expectedItems = [{ key: 18, title: '18 record' }].concat(
            initItems.slice(0, 3)
         );

         let resultItems = filter.HistoryUtils.getItemsWithHistory(
            items,
            newItems,
            sourceController,
            source,
            'key'
         );
         expect(resultItems.getCount()).toEqual(4);
         expect(resultItems.getRawData()).toEqual(expectedItems);
         expect(resultItems.getMetaData()).toEqual({ test: true });

         newItems = new collection.RecordSet({
            keyProperty: 'key',
            rawData: [
               { key: 20, title: '20 record' },
               { key: 1, title: 'Россия' }
            ]
         });
         resultItems = filter.HistoryUtils.getItemsWithHistory(
            items,
            newItems,
            sourceController,
            source,
            'key'
         );
         expect(resultItems.getCount()).toEqual(4);
         expect(resultItems.at(0).getId()).toEqual(20);
         expect(resultItems.at(1).getId()).toEqual(1);
         expect(resultItems.at(2).getId()).toEqual(0);
         expect(resultItems.at(3).getId()).toEqual(2);

         items = new collection.RecordSet({
            keyProperty: 'key',
            rawData: initItems,
            model: 'Types/entity:Record',
            metaData: { test: true }
         });
         resultItems = filter.HistoryUtils.getItemsWithHistory(
            items,
            newItems,
            sourceController,
            source,
            'key'
         );
         expect(resultItems.getModel()).toEqual(items.getModel());

         let folderKey;
         sourceController = {
            hasMoreData: (direction, key) => {
               folderKey = key;
            }
         };
         resultItems = filter.HistoryUtils.getItemsWithHistory(
            items,
            newItems,
            sourceController,
            source,
            'key',
            'folder1'
         );
         expect(resultItems.getModel()).toEqual(items.getModel());
         expect(folderKey).toEqual('folder1');
      });

      it('isHistorySource', function () {
         let origSource = new sourceLib.Memory({
            keyProperty: 'key',
            data: []
         });
         let hSource = new history.Source({
            originSource: origSource,
            historySource: new history.Service({
               historyId: 'TEST'
            })
         });

         expect(filter.HistoryUtils.isHistorySource(hSource)).toBe(true);
         expect(filter.HistoryUtils.isHistorySource(origSource)).toBe(false);
      });

      it('getUniqItems', function () {
         let initItems = [
            { key: 1, title: 'все страны' },
            { key: 2, title: 'Россия' }
         ];
         let oldItems = new collection.RecordSet({
            keyProperty: 'key',
            rawData: initItems,
            metaData: { test: true }
         });

         let newItems = new collection.RecordSet({
            keyProperty: 'key',
            rawData: [...initItems, { key: 5, title: 'New item' }]
         });

         let resultItems = filter.HistoryUtils.getUniqItems(
            oldItems,
            newItems,
            'key'
         );
         expect(resultItems.getCount()).toEqual(3);
         expect(resultItems.getMetaData()).toBeTruthy();
      });
   });
});
