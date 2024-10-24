define([
   'Controls/historyOld', // for otladka
   'Types/collection',
   'Types/entity',
   'Types/source',
   'Types/util',
   'Core/core-clone',
   'Application/Env',
   'Controls-HistoryLocal/HistoryStore',
   'Controls/dropdown',
   'Browser/Storage'
], (
    historyMod,
    collection,
    entity,
    sourceLib,
    util,
    clone,
    Env,
    {Store},
    {updateRecent, getItemsWithHistory},
    {LocalStorage}
) => {
   describe('History Source', () => {
      const originalGetStore = Env.getStore;
      const originalSetStore = Env.setStore;

      afterEach(() => {
         Env.getStore = originalGetStore;
         Env.setStore = originalSetStore;
         const localStorage = new LocalStorage();
         localStorage.clear();
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
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
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
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
         ]
      };
      let recentData = {
         _type: 'recordset',
         d: [['8', null, 'TEST_HISTORY_ID_V1']],
         s: [
            {n: 'ObjectId', t: 'Строка'},
            {n: 'ObjectData', t: 'Строка'},
            {n: 'HistoryId', t: 'Строка'}
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
               {n: 'id', t: 'Строка'},
               {n: 'title', t: 'Строка'},
               {n: 'parent', t: 'Строка'},
               {n: 'pinned', t: 'Строка'}
            ]
         },
         adapter: new entity.adapter.Sbis(),
         keyProperty: 'id',
         format: [
            {name: 'id', type: 'string'},
            {name: 'title', type: 'string'},
            {name: 'Parent', type: 'string'},
            {name: 'pinned', type: 'string'}
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
            Store.togglePin(
                hSource._$historySource.getHistoryId(),
                innerData.getAll().at(0).getKey()
            );
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
            const history = Store.getLocal(hSource._$historySource.getHistoryId());
            expect(history.pinned.getCount()).toEqual(1);

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
            let oldItems = [...items];
            oldItems = oldItems.map((item) => {
               item.id = Number(item.id);
               return item;
            });
            hSource._$oldItems = new collection.RecordSet({
               rawData: oldItems,
               keyProperty: 'id'
            });
            hSource.query(
                new sourceLib.Query().where({
                   $_history: true
                })
            );
            Store.push(hSource._$historySource.getHistoryId(), '3');
            historyItems = hSource.getItems();
            expect(historyItems.at(0).get('title')).toEqual('Запись 3');
            expect(historyItems.at(1).get('title')).toEqual('Запись 1');
            expect(historyItems.at(2).get('title')).toEqual('Запись 2');
            expect(historyItems.at(3).get('title')).toEqual('Запись 4');
         });
         it('getItems', async function () {
            const localStorage = new LocalStorage();
            localStorage.clear();
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

            expect(historySource.getItems(false)).toBeNull();

            let query = new sourceLib.Query().where({
               $_history: true
            });
            await historySource.query(query);

            expect(historySource.getItems().getRawData()).toEqual(preparedHistoryItems);
         });

         it('updateRecent', async () => {
            let innerMeta = {
               $_history: true
            };
            let initSource = new sourceLib.Memory({
               keyProperty: 'key',
               data: []
            });
            let self = {
               _$originSource: initSource
            };
            const item = new entity.Model({
               rawData: {
                  _type: 'record',
                  d: ['7', 'Запись 7', true],
                  s: [
                     {n: 'id', t: 'Строка'},
                     {n: 'title', t: 'Строка'},
                     {n: 'doNotSaveToHistory', t: 'Логическое'}
                  ]
               },
               adapter: new entity.adapter.Sbis(),
               keyProperty: 'id',
               format: [
                  {name: 'id', type: 'string'},
                  {name: 'title', type: 'string'},
                  {name: 'doNotSaveToHistory', type: 'boolean'}
               ]
            });
            const result = await updateRecent(item, innerMeta, self);

            expect(result).toBe(false);
         });

         it('updateRecent history not loaded', async function () {
            let config2 = clone(config),
                innerMeta = {
                   $_history: true
                };
            let hSource2 = new historyMod.Source(config2);
            await hSource2.update(myItem, innerMeta);
            expect(
                Store.getLocal(hSource2.getHistoryId())
                    .recent.getRecordById(myItem.getKey())
                    .get('Counter')
            ).toEqual(1);
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

      });

      describe('Check getItemsWithHistory', () => {
         const oldItems = [
            {key: '1', title: 'Task in development', parent: null},
            {key: '2', title: 'Error in development', parent: null},
            {key: '3', title: 'Commission', parent: null},
            {key: '4', title: 'Assignment', parent: null},
            {key: '5', title: 'Coordination', '@parent': true},
            {
               key: '100',
               title: 'Не сохраняется в историю',
               parent: null,
               doNotSaveToHistory: true,
            },
            {
               key: '101',
               title: 'Не сохраняется в историю с подменю',
               '@parent': true,
               parent: null,
               doNotSaveToHistory: true,
            },
            {key: '102', title: 'Title 1', parent: '101'},
         ];

         const historyId = 'check_getItemsWithHistory';
         const originSource = new sourceLib.Memory({
            keyProperty: 'key',
            data: oldItems,
         });
         const parentProperty = 'parent';
         const nodeProperty = '@parent';
         const displayProperty = 'title';

         const originRecordSet = new collection.RecordSet({keyProperty: 'key', rawData: oldItems})

         it('without exist history', () => {

            const hItems = getItemsWithHistory(originRecordSet, historyId, originSource, {
               parentProperty,
               nodeProperty,
               root: null,
               displayProperty,
               unpinIfNotExist: false,
               pinned: null,
            }, false);
            hItems.each((historyItem, index) => {
               expect(historyItem.getKey()).toEqual(originRecordSet.at(index).getKey());
            })
         });

         it('with history', async () => {

            await Store.togglePin(historyId, '3');
            await Store.push(historyId, '4');

            const hItems = getItemsWithHistory(originRecordSet, historyId, originSource, {
               parentProperty,
               nodeProperty,
               root: null,
               displayProperty,
               unpinIfNotExist: false,
               pinned: null,
            }, false);

            expect(hItems.at(0).getKey()).toEqual('3');
            expect(hItems.at(0).get('pinned')).toBeTruthy();

            expect(hItems.at(1).getKey()).toEqual('4');
            expect(hItems.at(1).get('recent')).toBeTruthy();
         });

         it('with pinned items as array', async () => {

             const hItems = getItemsWithHistory(originRecordSet, historyId, originSource, {
                 parentProperty,
                 nodeProperty,
                 root: null,
                 displayProperty,
                 unpinIfNotExist: false,
                 pinned: [2,4],
             }, false);

             expect(hItems.at(0).getKey()).toEqual('2');
             expect(hItems.at(0).get('pinned')).toBeTruthy();

             expect(hItems.at(1).getKey()).toEqual('4');
             expect(hItems.at(1).get('pinned')).toBeTruthy();
         });
      });
   });
});
