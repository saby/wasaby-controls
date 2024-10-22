define([
   'Controls/history', // for otladka
   'Types/collection',
   'Types/entity',
   'Types/source',
   'Types/util',
   'Core/core-clone',
   'Application/Env',
   'Controls-HistoryLocal/HistoryStore'
], (historyMod, collection, entity, sourceLib, util, clone, Env, { Store }) => {
   describe('History Source', () => {
      const originalGetStore = Env.getStore;
      const originalSetStore = Env.setStore;

      afterEach(() => {
         Env.getStore = originalGetStore;
         Env.setStore = originalSetStore;
      });
      let items = [
         {
            id: '1',
            title: 'Запись 1',
            parent: null,
            '@parent': false
         },
         {
            id: '2',
            title: 'Запись 2',
            parent: null,
            '@parent': false
         },
         {
            id: '3',
            title: 'Запись 3',
            parent: null,
            '@parent': true,
            icon: 'icon-medium icon-Doge icon-primary'
         },
         {
            id: '4',
            title: 'Запись 4',
            parent: null,
            '@parent': false
         },
         {
            id: '5',
            title: 'Запись 5',
            parent: null,
            '@parent': false
         },
         {
            id: '6',
            title: 'Запись 6',
            parent: null,
            '@parent': false
         },
         {
            id: '7',
            title: 'Запись 7',
            parent: '3',
            '@parent': false
         },
         {
            id: '8',
            title: 'Запись 8',
            parent: null,
            '@parent': false
         }
      ];

      let pinnedData = {
         _type: 'recordset',
         d: [
            ['5', null, 'TEST_HISTORY_ID_V1'],
            ['idNotExistInData', null, 'TEST_HISTORY_ID_V1']
         ],
         s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' }
         ]
      };
      let frequentData = {
         _type: 'recordset',
         d: [
            ['6', null, 'TEST_HISTORY_ID_V1'],
            ['4', null, 'TEST_HISTORY_ID_V1'],
            ['9', null, 'TEST_HISTORY_ID_V1']
         ],
         s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' }
         ]
      };
      let recentData = {
         _type: 'recordset',
         d: [['8', null, 'TEST_HISTORY_ID_V1']],
         s: [
            { n: 'ObjectId', t: 'Строка' },
            { n: 'ObjectData', t: 'Строка' },
            { n: 'HistoryId', t: 'Строка' }
         ]
      };

      function createRecordSet(data) {
         return new collection.RecordSet({
            rawData: data,
            keyProperty: 'ObjectId',
            adapter: new entity.adapter.Sbis()
         });
      }

      let data = new sourceLib.DataSet({
         rawData: {
            frequent: createRecordSet(frequentData),
            pinned: createRecordSet(pinnedData),
            recent: createRecordSet(recentData)
         },
         itemsProperty: '',
         keyProperty: 'ObjectId'
      });

      let myItem = new entity.Model({
         rawData: {
            _type: 'record',
            d: ['7', 'Запись 7', '3', null],
            s: [
               { n: 'id', t: 'Строка' },
               { n: 'title', t: 'Строка' },
               { n: 'parent', t: 'Строка' },
               { n: 'pinned', t: 'Строка' }
            ]
         },
         adapter: new entity.adapter.Sbis(),
         keyProperty: 'id',
         format: [
            { name: 'id', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'Parent', type: 'string' },
            { name: 'pinned', type: 'string' }
         ]
      });
      let config = {
         originSource: new sourceLib.Memory({
            keyProperty: 'id',
            data: items
         }),
         historySource: new historyMod.Service({
            historyId: 'TEST_HISTORY_ID'
         }),
         parentProperty: 'parent'
      };
      let hSource = new historyMod.Source(config);
      let meta, hS, historyItems;

      // overload history source method query, it must return items to test
      config.historySource.query = function () {
         return Promise.resolve(data);
      };

      config.historySource.saveHistory = jest.fn();

      describe('getSourceByMeta', function () {
         it('$_pinned', function () {
            meta = {
               $_pinned: true
            };
            hS = hSource._getSourceByMeta(meta, hSource._$historySource, hSource._$originSource);
            expect(hS._$historyId).toEqual(config.historySource._$historyId);
         });
         it('$_favorite', function () {
            meta = {
               $_favorite: true
            };
            hS = hSource._getSourceByMeta(meta, hSource._$historySource, hSource._$originSource);
            expect(hS._$historyId).toEqual(config.historySource._$historyId);
         });
         it('$_history', function () {
            meta = {
               $_history: true
            };
            hS = hSource._getSourceByMeta(meta, hSource._$historySource, hSource._$originSource);
            expect(hS._$historyId).toEqual(config.historySource._$historyId);
         });
         it('originalSource', function () {
            meta = {};
            hS = hSource._getSourceByMeta(meta, hSource._$historySource, hSource._$originSource);
            expect(!!hS._$historyId).toEqual(false);
         });
      });

      describe('serialize tests', function () {
         it('clone', function () {
            var sourceClone = util.object.clone(hSource);
            expect(sourceClone instanceof historyMod.Source).toBe(true);
         });
      });

      describe('checkHistory', function () {
         it('query', async function () {
            let query = new sourceLib.Query().where();
            let innerData = await hSource.query(query);
            let originHSource = hSource._$historySource;
            let originSource = hSource._$originSource;
            var errorSource = {
               query: function () {
                  return Promise.reject(new Error('testError'));
               },
               getKeyProperty: () => 'id'
            };

            let records = innerData.getAll();
            expect(records.at(0).has('pinned')).toBe(false);

            query = new sourceLib.Query().where({
               $_history: true
            });
            innerData = await hSource.query(query);
            records = innerData.getAll();
            expect(records.at(0).get('pinned')).toBe(true);
            expect(hSource._$history.pinned.getCount()).toEqual(1);

            hSource._$historySource = errorSource;
            innerData = await hSource.query(query);

            records = innerData.getAll();
            expect(records.at(0).has('pinned')).toBe(false);
            hSource._$historySource = originHSource;

            hSource._$originSource = errorSource;
            return hSource.query(query).catch(function (error) {
               expect(error instanceof Error).toBe(true);
               hSource._$originSource = originSource;
            });
         });
         it('query with parent', async function () {
            let itemsWithChildren = items.slice();
            itemsWithChildren.push(
               {
                  id: 'children_1',
                  title: 'Запись 8',
                  parent: '1',
                  '@parent': false
               },
               {
                  id: 'children_2',
                  title: 'Запись 8',
                  parent: '1',
                  '@parent': false
               }
            );
            let hSourceWithChildren = new historyMod.Source({
               ...config,
               originSource: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: itemsWithChildren
               })
            });
            let query = new sourceLib.Query().where({
               $_history: true
            });
            let innerData = await hSourceWithChildren.query(query);
            let records = innerData.getAll();

            expect(records.getCount()).toEqual(10);

            query = new sourceLib.Query().where({
               $_history: true,
               parent: '1'
            });
            innerData = await hSourceWithChildren.query(query);

            records = innerData.getAll();
            expect(records.getCount()).toEqual(10);
         });

         it('getItemsWithHistory number id', function () {
            let newData = new sourceLib.DataSet({
               rawData: {
                  frequent: createRecordSet(frequentData),
                  pinned: createRecordSet(pinnedData),
                  recent: createRecordSet(recentData)
               },
               itemsProperty: '',
               keyProperty: 'ObjectId'
            });
            let oldItems = [...items];
            oldItems = oldItems.map((item) => {
               item.id = Number(item.id);
               return item;
            });
            hSource._$oldItems = new collection.RecordSet({
               rawData: oldItems,
               keyProperty: 'id'
            });
            hSource._initHistory(newData, hSource._$oldItems);
            historyItems = hSource.getItems();
            expect(historyItems.at(0).get('title')).toEqual('Запись 5');
            expect(historyItems.at(1).get('title')).toEqual('Запись 4');
            expect(historyItems.at(2).get('title')).toEqual('Запись 6');
            expect(historyItems.at(3).get('title')).toEqual('Запись 8');
         });
         it('getItems', async function () {
            await Store.togglePin('NEW_TEST_HISTORY_ID', '2');
            await Store.push('NEW_TEST_HISTORY_ID', '3');
            let historyConfig = {
               originSource: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: [
                     {
                        id: '1',
                        title: '1'
                     },
                     {
                        id: '2',
                        title: '2'
                     },
                     {
                        id: '3',
                        title: '3'
                     }
                  ]
               }),
               historySource: new historyMod.Service({
                  historyId: 'NEW_TEST_HISTORY_ID'
               }),
               parentProperty: 'parent'
            };

            const preparedHistoryItems = [
               {
                  id: '2',
                  title: '2',
                  pinned: true,
                  recent: false,
                  frequent: false,
                  HistoryId: 'NEW_TEST_HISTORY_ID',
                  copyOriginalId: '2',
                  copyOriginalParent: null,
                  parent: null
               },
               {
                  id: '3',
                  title: '3',
                  pinned: false,
                  recent: true,
                  frequent: false,
                  HistoryId: 'NEW_TEST_HISTORY_ID',
                  copyOriginalId: '3',
                  copyOriginalParent: null,
                  parent: null
               },
               {
                  HistoryId: 'NEW_TEST_HISTORY_ID',
                  copyOriginalId: '1',
                  copyOriginalParent: '',
                  frequent: false,
                  id: '1',
                  pinned: false,
                  recent: false,
                  title: '1'
               }
            ];

            let historySource = new historyMod.Source(historyConfig);
            expect(historySource.getItems()).toBeNull();

            let query = new sourceLib.Query().where({
               $_history: true
            });
            await historySource.query(query);

            expect(historySource.getItems().getRawData()).toEqual(preparedHistoryItems);
         });
         it('checkPinnedAmount', function () {
            let list = new collection.RecordSet();

            for (var i = 0; i < historyMod.Constants.MAX_HISTORY; i++) {
               list.add(new entity.Model());
            }

            expect(hSource._checkPinnedAmount(list)).toBe(false);

            list.remove(list.at(9));
            expect(hSource._checkPinnedAmount(list)).toBe(true);
         });

         it('getKeyProperty', function () {
            let initSource = new sourceLib.Memory({
               keyProperty: 'key',
               data: []
            });
            let self = {
               _$originSource: initSource
            };
            expect(hSource._getKeyProperty.call(self)).toEqual('key');

            self._$originSource = new sourceLib.PrefetchProxy({
               target: initSource,
               data: {
                  query: {}
               }
            });
            expect(hSource._getKeyProperty.call(self)).toEqual('key');
         });

         it('_updateRecent', async () => {
            let innerMeta = {
               $_history: true
            };
            const item = new entity.Model({
               rawData: {
                  _type: 'record',
                  d: ['7', 'Запись 7', true],
                  s: [
                     { n: 'id', t: 'Строка' },
                     { n: 'title', t: 'Строка' },
                     { n: 'doNotSaveToHistory', t: 'Логическое' }
                  ]
               },
               adapter: new entity.adapter.Sbis(),
               keyProperty: 'id',
               format: [
                  { name: 'id', type: 'string' },
                  { name: 'title', type: 'string' },
                  { name: 'doNotSaveToHistory', type: 'boolean' }
               ]
            });
            const result = await hSource._updateRecent(item, innerMeta);

            expect(result).toBe(false);
         });

         it('updateRecent history not loaded', async function () {
            let config2 = clone(config),
               updatedData,
               innerMeta = {
                  $_history: true
               };
            config2.historySource.update = function (innerData) {
               updatedData = innerData;
            };
            let hSource2 = new historyMod.Source(config2);
            await hSource2.update(myItem, innerMeta);
            expect(myItem).toEqual(updatedData);
         });
         it('prepareItems', async () => {
            let historySource = new historyMod.Source(config);
            let query = new sourceLib.Query().where({
               $_history: true
            });
            await historySource.query(query);
            let currentItems = historySource.getItems();
            let newItems = historySource.prepareItems(
               new collection.RecordSet({
                  rawData: items,
                  keyProperty: 'id'
               })
            );
            expect(currentItems).not.toEqual(newItems);
         });
         it('prepareHistoryItems', async function () {
            let newData = new sourceLib.DataSet({
               rawData: {
                  frequent: createRecordSet(frequentData),
                  pinned: createRecordSet(pinnedData),
                  recent: createRecordSet(recentData)
               },
               itemsProperty: '',
               keyProperty: 'ObjectId'
            });
            let memorySource = new sourceLib.Memory({
               keyProperty: 'id',
               data: items
            });
            const res = await memorySource.query();

            let sourceItems = res.getAll();
            let preparedHistory = hSource._prepareHistoryItems.apply(
               { _$originSource: hSource._$originSource },
               [newData.getRow().get('frequent'), sourceItems]
            );
            expect(preparedHistory.getCount()).toEqual(2);
            preparedHistory.forEach(function (historyItem) {
               expect(historyItem.getId() === '9').toBe(false);
            });
         });

         it('initHistory', async function () {
            let newData = new sourceLib.DataSet({
               rawData: {
                  frequent: createRecordSet(frequentData),
                  pinned: createRecordSet(pinnedData),
                  recent: createRecordSet(recentData)
               },
               itemsProperty: '',
               keyProperty: 'ObjectId'
            });
            let memorySource = new sourceLib.Memory({
               keyProperty: 'id',
               data: items
            });
            const res = await memorySource.query();

            const oldPinned = hSource._$pinned;
            const oldHSource = hSource._$historySource;
            hSource._$pinned = ['1', '2'];
            hSource._$historySource = {
               getHistoryId: () => {
                  'TEST_ID';
               }
            };
            let sourceItems = res.getAll();
            hSource._initHistory(newData, sourceItems);
            expect(hSource._$history.pinned.getCount()).toEqual(3);
            expect(hSource._$recentCount).toEqual(1);
            hSource._$history.pinned.forEach(function (pinnedItem) {
               expect(pinnedItem.getId() === '9').toBe(false);
            });

            newData = new sourceLib.DataSet({
               rawData: {
                  frequent: createRecordSet(frequentData),
                  pinned: createRecordSet(pinnedData),
                  recent: createRecordSet(recentData)
               },
               itemsProperty: '',
               keyProperty: 'ObjectId'
            });
            hSource._initHistory(newData, sourceItems);
            expect(hSource._$history.pinned.getCount()).toEqual(3);
            hSource._$pinned = oldPinned;
            hSource._$historySource = oldHSource;
         });

         it('initHistory source no pinned items', async function () {
            let newData = new sourceLib.DataSet({
               rawData: {
                  frequent: createRecordSet(frequentData),
                  pinned: createRecordSet(pinnedData),
                  recent: createRecordSet(recentData)
               },
               itemsProperty: '',
               keyProperty: 'ObjectId'
            });
            let itemsWithoutId = items.slice(1);
            let memorySource = new sourceLib.Memory({
               keyProperty: 'id',
               data: itemsWithoutId
            });
            const res = await memorySource.query();

            let oldPinned = hSource._$pinned;
            let oldOSource = hSource._$originSource;
            let oldHSource = hSource._$historySource;
            let sourceItems = res.getAll();
            hSource._initHistory(newData, sourceItems);
            expect(hSource._$history.pinned.getCount()).toEqual(1);
            hSource._$history.pinned.forEach(function (pinnedItem) {
               // eslint-disable-next-line eqeqeq
               expect(pinnedItem.getId() == '1').toBe(false);
               // eslint-disable-next-line eqeqeq
               expect(pinnedItem.getId() == '9').toBe(false);
            });
            hSource._$pinned = oldPinned;
            hSource._$originSource = oldOSource;
            hSource._$historySource = oldHSource;
         });

         it('_private:getPinnedIds', function () {
            let pinnedIds = hSource._getPinnedIds(hSource._$history.pinned);
            expect(pinnedIds).toEqual(['5']);
         });

         it('_private:getFrequentIds', function () {
            let frequentIds = hSource._getFrequentIds(hSource._$history.frequent, ['5']);
            expect(frequentIds).toEqual(['6', '4']);
         });

         it('_private:getRecentIds', function () {
            let recentIds = hSource._getRecentIds(hSource._$history.recent, ['5'], ['6', '4']);
            expect(recentIds).toEqual(['8']);
         });

         it('_private:getFilterHistory', function () {
            let expectedResult = {
               pinned: ['5'],
               frequent: ['6', '4'],
               recent: ['8']
            };
            let actualResult = hSource._getFilterHistory(hSource._$history);
            expect(expectedResult).toEqual(actualResult);

            // 1 pinned + 5 recent
            expectedResult = {
               pinned: ['5'],
               frequent: ['6', '4'],
               recent: ['8', '1', '2', '3', '7']
            };
            let recentFilteredData = {
               _type: 'recordset',
               d: [
                  ['8', null, 'TEST_HISTORY_ID_V1'],
                  ['1', null, 'TEST_HISTORY_ID_V1'],
                  ['2', null, 'TEST_HISTORY_ID_V1'],
                  ['3', null, 'TEST_HISTORY_ID_V1'],
                  ['4', null, 'TEST_HISTORY_ID_V1'],
                  ['5', null, 'TEST_HISTORY_ID_V1'],
                  ['6', null, 'TEST_HISTORY_ID_V1'],
                  ['7', null, 'TEST_HISTORY_ID_V1']
               ],
               s: [
                  { n: 'ObjectId', t: 'Строка' },
                  { n: 'ObjectData', t: 'Строка' },
                  { n: 'HistoryId', t: 'Строка' }
               ]
            };
            hSource._$history.recent = createRecordSet(recentFilteredData);
            hSource._$recentCount = 8;
            actualResult = hSource._getFilterHistory(hSource._$history);
            expect(expectedResult).toEqual(actualResult);

            // 6 pinned
            expectedResult = {
               pinned: ['8', '1', '2', '5', '9', '10'],
               frequent: ['6'],
               recent: ['3', '4', '7']
            };
            let pinnedFilteredData = {
               _type: 'recordset',
               d: [
                  ['8', null, 'TEST_HISTORY_ID_V1'],
                  ['1', null, 'TEST_HISTORY_ID_V1'],
                  ['2', null, 'TEST_HISTORY_ID_V1'],
                  ['5', null, 'TEST_HISTORY_ID_V1'],
                  ['9', null, 'TEST_HISTORY_ID_V1'],
                  ['10', null, 'TEST_HISTORY_ID_V1']
               ],
               s: [
                  { n: 'ObjectId', t: 'Строка' },
                  { n: 'ObjectData', t: 'Строка' },
                  { n: 'HistoryId', t: 'Строка' }
               ]
            };
            hSource._$history.pinned = createRecordSet(pinnedFilteredData);
            hSource._$recentCount = 3;
            actualResult = hSource._getFilterHistory(hSource._$history);
            expect(expectedResult).toEqual(actualResult);

            // 8 pinned
            expectedResult = {
               pinned: ['8', '1', '2', '3', '4', '5', '9', '10'],
               frequent: [],
               recent: ['6', '7']
            };
            pinnedFilteredData = {
               _type: 'recordset',
               d: [
                  ['8', null, 'TEST_HISTORY_ID_V1'],
                  ['1', null, 'TEST_HISTORY_ID_V1'],
                  ['2', null, 'TEST_HISTORY_ID_V1'],
                  ['3', null, 'TEST_HISTORY_ID_V1'],
                  ['4', null, 'TEST_HISTORY_ID_V1'],
                  ['5', null, 'TEST_HISTORY_ID_V1'],
                  ['9', null, 'TEST_HISTORY_ID_V1'],
                  ['10', null, 'TEST_HISTORY_ID_V1']
               ],
               s: [
                  { n: 'ObjectId', t: 'Строка' },
                  { n: 'ObjectData', t: 'Строка' },
                  { n: 'HistoryId', t: 'Строка' }
               ]
            };
            hSource._$history.pinned = createRecordSet(pinnedFilteredData);
            hSource._$recentCount = 2;
            actualResult = hSource._getFilterHistory(hSource._$history);
            expect(expectedResult).toEqual(actualResult);
         });
      });
      describe('check source original methods', function () {
         it('create', async function () {
            const item = await hSource.create({
               id: '666',
               title: 'Запись 666',
               parent: null,
               '@parent': false
            });

            expect(item.get('title')).toEqual('Запись 666');
         });

         it('getKeyProperty', () => {
            expect(hSource.getKeyProperty()).toEqual('id');
         });

         it('serialization', function () {
            const someConfig = {
               source: hSource
            };
            const configClone = util.object.clone(someConfig);
            expect(configClone.source instanceof historyMod.Source).toBeTruthy();
         });

         it('serialization with dataLoadCallback on state', function () {
            const someConfig = {
               source: hSource
            };
            hSource.setDataLoadCallback(jest.fn());
            const configClone = util.object.clone(someConfig);
            expect(configClone.source instanceof historyMod.Source).toBeTruthy();
         });

         it('unpin if not exist', () => {
            let source = new historyMod.Source({
               originSource: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: items
               }),
               historySource: new historyMod.Service({
                  historyId: 'TEST_HISTORY_ID'
               }),
               parentProperty: 'parent'
            });
            let itemUnpinned = false;
            const history = {
               pinned: [1]
            };
            const oldItems = new collection.RecordSet({
               rawData: [],
               keyProperty: 'id'
            });
            const newItems = oldItems.clone();
            source._itemNotExist = () => {
               itemUnpinned = true;
            };
            source._fillItems(history, 'pinned', oldItems, newItems);
            expect(itemUnpinned).toBe(false);

            itemUnpinned = false;
            source = new historyMod.Source({
               unpinIfNotExist: false,
               originSource: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: items
               }),
               historySource: new historyMod.Service({
                  historyId: 'TEST_HISTORY_ID'
               }),
               parentProperty: 'parent'
            });
            source._itemNotExist = () => {
               itemUnpinned = true;
            };
            source._fillItems(history, 'pinned', oldItems, newItems);
            expect(itemUnpinned).toBe(false);
         });
      });
   });
});
