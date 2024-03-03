define(['Controls/history', 'Types/collection', 'Types/entity', 'Types/source'], (
   historyMod,
   collection,
   entity,
   sourceLib
) => {
   describe('history:FilterSource', () => {
      let pinnedData = {
         _type: 'recordset',
         d: [['8', null, 'TEST_HISTORY_ID_V1']],
         s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' }
         ]
      };

      let recentData = {
         _type: 'recordset',
         d: [
            ['1', null, 'TEST_HISTORY_ID_V1'],
            ['2', null, 'TEST_HISTORY_ID_V1'],
            ['3', null, 'TEST_HISTORY_ID_V1'],
            ['4', null, 'TEST_HISTORY_ID_V1'],
            ['5', null, 'TEST_HISTORY_ID_V1'],
            ['6', null, 'TEST_HISTORY_ID_V1'],
            ['7', null, 'TEST_HISTORY_ID_V1'],
            ['8', null, 'TEST_HISTORY_ID_V1'],
            ['9', null, 'TEST_HISTORY_ID_V1'],
            ['10', null, 'TEST_HISTORY_ID_V1']
         ],
         s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' }
         ]
      };

      let getItem = (id, objectData, hId) => {
         return new entity.Model({
            rawData: {
               d: [id, objectData, hId],
               s: [
                  {
                     n: 'ObjectId',
                     t: 'Строка'
                  },
                  {
                     n: 'ObjectData',
                     t: 'Строка'
                  },
                  {
                     n: 'HistoryId',
                     t: 'Строка'
                  }
               ]
            },
            adapter: new entity.adapter.Sbis()
         });
      };

      function createRecordSet(data) {
         return new collection.RecordSet({
            rawData: data,
            keyProperty: 'ObjectId',
            adapter: new entity.adapter.Sbis()
         });
      }

      let historyInstance = {
         recent: createRecordSet(recentData),
         pinned: createRecordSet(pinnedData)
      };

      it('fillRecent', () => {
         let itemsRecent = new collection.RecordSet({
            adapter: new entity.adapter.Sbis(),
            keyProperty: 'ObjectId'
         });

         let self = {
            historySource: {
               _$recent: 11
            }
         };
         historyMod.FilterSource._private.fillRecent(self, historyInstance, itemsRecent);

         expect(itemsRecent.getCount()).toEqual(9);

         itemsRecent.clear();
         historyInstance.recent.add(getItem('11', null, 'TEST_HISTORY_ID_V1'));
         historyMod.FilterSource._private.fillRecent(self, historyInstance, itemsRecent);
         expect(itemsRecent.getCount()).toEqual(9);

         itemsRecent.clear();
         historyInstance.pinned.clear();
         historyMod.FilterSource._private.fillRecent(self, historyInstance, itemsRecent);
         expect(itemsRecent.getCount()).toEqual(10);

         itemsRecent.clear();
         historyInstance.recent.removeAt(10);
         historyMod.FilterSource._private.fillRecent(self, historyInstance, itemsRecent);
         expect(itemsRecent.getCount()).toEqual(10);

         itemsRecent.clear();
         historyInstance.recent.removeAt(9);
         historyInstance.recent.add(getItem('11', '{}', 'TEST_HISTORY_ID_V1'));
         historyInstance.recent.add(getItem('11', null, 'TEST_HISTORY_ID_V1'));
         historyMod.FilterSource._private.fillRecent(self, historyInstance, itemsRecent);
         expect(itemsRecent.getCount()).toEqual(10);

         itemsRecent.clear();
         self.historySource._$recent = 5;
         historyMod.FilterSource._private.fillRecent(self, historyInstance, itemsRecent);
         expect(itemsRecent.getCount()).toEqual(4);

         itemsRecent.clear();
         historyInstance.pinned.add(getItem('12', '{title: 123}', 'TEST_HISTORY_ID_V1'));
         historyMod.FilterSource._private.fillRecent(self, historyInstance, itemsRecent);
         expect(itemsRecent.getCount()).toEqual(3);

         itemsRecent.clear();
         self.historySource._$pinned = false;
         historyMod.FilterSource._private.fillRecent(self, historyInstance, itemsRecent);
         expect(itemsRecent.getCount()).toEqual(4);
      });

      it('serialize', function () {
         let instValue = new entity.Date();
         let data = { id: '1', value: instValue, resetValue: null };
         JSON.stringify(
            { value: instValue },
            historyMod.FilterSource._private.getSerialize().serialize
         );

         let serializeData = JSON.stringify(
            data,
            historyMod.FilterSource._private.getSerialize().serialize
         );
         let result = JSON.parse(
            serializeData,
            historyMod.FilterSource._private.getSerialize().deserialize
         );
         expect(data).toEqual(result);
      });

      it('findItem', function () {
         let newItem = {
            configs: undefined,
            items: [1, 2, 3]
         };
         let historyItems = new collection.RecordSet({
            rawData: [{ ObjectData: JSON.stringify('test') }]
         });
         let result = historyMod.FilterSource._private.findItem({}, historyItems, newItem);
         expect(result).toBeNull();

         historyItems.add(
            new entity.Model({
               rawData: {
                  ObjectData: JSON.stringify(
                     newItem,
                     historyMod.FilterSource._private.getSerialize().serialize
                  )
               }
            })
         );
         result = historyMod.FilterSource._private.findItem({}, historyItems, newItem);
         expect(result).toBeTruthy();

         newItem.items.push(new entity.Date(2019, 5, 1));
         historyItems.add(
            new entity.Model({
               rawData: {
                  ObjectData: JSON.stringify(
                     newItem,
                     historyMod.FilterSource._private.getSerialize().serialize
                  )
               }
            })
         );
         result = historyMod.FilterSource._private.findItem({}, historyItems, newItem);
         expect(result).toBeTruthy();
      });

      it('query', function (done) {
         const query = new sourceLib.Query();
         const filterSource = new historyMod.FilterSource({
            historySource: {}
         });

         query.where({
            $_history: true
         });

         filterSource.historySource = {
            query: () => {
               return Promise.reject();
            },
            getHistoryId: () => {
               return 'test';
            },
            getHistoryIds: jest.fn(),
            saveHistory: jest.fn()
         };
         const query1 = filterSource.query(query);
         const query2 = filterSource.query(query);
         expect(query1 === query2).toBe(true);
         filterSource.query(query).addCallback((result) => {
            const isEmptyResultOnError = !result.getAll().getCount();
            expect(isEmptyResultOnError).toBe(true);
            done();
         });
      });

      it('_private::destroy', () => {
         const self = {
            _history: {
               recent: createRecordSet(recentData)
            }
         };

         expect(self._history.recent.getCount()).toEqual(11);

         historyMod.FilterSource._private.destroy(self, '1');
         expect(self._history.recent.getCount()).toEqual(10);

         historyMod.FilterSource._private.destroy(self, ['2']);
         expect(self._history.recent.getCount()).toEqual(9);

         historyMod.FilterSource._private.destroy(self, 'noDataWithThisKey');
         expect(self._history.recent.getCount()).toEqual(9);
      });
   });
});
