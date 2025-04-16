define(['Controls/filterPopup', 'Types/util', 'Types/collection', 'Types/deferred'], function (
   filterPopup,
   util,
   collection
) {
   describe('Filter:SimplePanel', function () {
      let defaultItems = [
         [
            { key: 0, title: 'все страны' },
            { key: 1, title: 'Россия' },
            { key: 2, title: 'США' },
            { key: 3, title: 'Великобритания' }
         ],

         [
            { key: 0, title: 'все жанры' },
            { key: 1, title: 'фантастика' },
            { key: 2, title: 'фэнтези' },
            { key: 3, title: 'мистика' }
         ]
      ];

      let defaultItemsConfig = [
         {
            name: 'first',
            displayProperty: 'title',
            keyProperty: 'key',
            selectedKeys: [0],
            emptyText: 'empty text',
            hasMoreButton: false,
            items: new collection.RecordSet({
               keyProperty: 'id',
               rawData: defaultItems[0]
            })
         },
         {
            name: 'second',
            displayProperty: 'title',
            keyProperty: 'key',
            selectedKeys: [0],
            emptyText: 'empty text2',
            hasMoreButton: false,
            items: new collection.RecordSet({
               keyProperty: 'id',
               rawData: defaultItems[1]
            })
         }
      ];

      let defaultConfig = {
         items: new collection.RecordSet({
            keyProperty: 'id',
            rawData: defaultItemsConfig
         })
      };

      let getPanel = function (config) {
         let panel = new filterPopup.SimplePanel();
         panel.saveOptions(config);
         return panel;
      };

      describe('_getMenuMultipleConfig', () => {
         it('returns items only with 2 and more elements in collection', (done) => {
            const panel = getPanel(defaultConfig);
            const itemsConfig = util.object.clone(defaultItemsConfig);
            itemsConfig[0].items.clear();
            const items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: itemsConfig
            });
            panel._getMenuMultipleConfig(items).then((result) => {
               const itemWithEmptyCollection = Object.values(result).find((resultItem) => {
                  return resultItem.name === defaultItemsConfig[0].name;
               });
               expect(itemWithEmptyCollection).not.toBeDefined();
               done();
            });
         });
         it('returns item with 1 element with hasMore data', (done) => {
            const panel = getPanel(defaultConfig);
            const item = util.object.clone(defaultItemsConfig[0]);
            const record = item.items.at(0);
            item.items.clear();
            item.hasMoreButton = true;
            item.items.add(record);
            const items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [item]
            });
            panel._getMenuMultipleConfig(items).then((resultItems) => {
               expect(Object.keys(resultItems).length === 1).toBe(true);
               done();
            });
         });

         it('minVisibleItems option', (done) => {
            const panel = getPanel(defaultConfig);
            const item = util.object.clone(defaultItemsConfig[0]);
            item.minVisibleItems = item.items.getCount() + 1;
            const item2 = util.object.clone(item);
            item2.name = 'item2';
            const items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [item, util.object.clone(item)]
            });
            panel._getMenuMultipleConfig(items).then((resultItems) => {
               expect(Object.keys(resultItems).length === 1).toBe(true);
               done();
            });
         });
      });

      it('_beforeMount', async function () {
         let panel = getPanel(defaultConfig);
         await panel._beforeMount(defaultConfig);
         expect(Object.keys(panel._menuConfigs)).toEqual(['first', 'second']);
      });

      it('_beforeUpdate', async function () {
         let panel = getPanel(defaultConfig);
         await panel._beforeMount(defaultConfig);

         let items = util.object.clone(defaultItemsConfig);
         items[0].selectedKeys = [1];
         let newConfig = {
            ...defaultConfig,
            items: new collection.RecordSet({
               keyProperty: 'id',
               rawData: items
            })
         };

         panel._applyButtonVisible = false;
         await panel._beforeUpdate(defaultConfig);
         expect(panel._applyButtonVisible).toBe(false);

         await panel._beforeUpdate(newConfig);
         expect(panel._applyButtonVisible).toBe(true);
      });

      it('_itemClickHandler', async function () {
         let actualResult;
         let panel = getPanel(defaultConfig);
         await panel._beforeMount(defaultConfig);
         panel._notify = (event, data) => {
            if (event === 'sendResult') {
               actualResult = data[0];
            }
         };
         let item = defaultItemsConfig[0].items.at(2),
            expectedResult = {
               action: 'itemClick',
               selectedKeys: [2],
               name: 'first',
               searchValue: undefined,
               textValue: 'США'
            };
         panel._itemClickHandler('itemClickEvent', item, 'itemClickEvent', 'first');
         expect(actualResult).toEqual(expectedResult);
      });

      it('_closeClick', function () {
         let isClosed = false;
         let panel = getPanel(defaultConfig);
         panel._notify = (event) => {
            if (event === 'close') {
               isClosed = true;
            }
         };
         panel._closeClick();
         expect(isClosed).toBe(true);
      });

      it('_applySelection', async function () {
         let actualResult;
         let panel = getPanel(defaultConfig);
         panel._notify = (event, data) => {
            if (event === 'sendResult') {
               actualResult = data[0];
            }
         };
         let expectedResult = {
            action: 'applyClick',
            event: 'applyClickEvent',
            selectedKeys: {
               first: [0],
               second: [0]
            }
         };
         await panel._beforeMount(defaultConfig);

         panel._applySelection('applyClickEvent');
         expect(actualResult).toEqual(expectedResult);
      });

      it('_afterOpenDialogCallback', async function () {
         let actualResult;
         let panel = getPanel(defaultConfig);
         panel._notify = (event, data) => {
            if (event === 'sendResult') {
               actualResult = data[0];
            }
         };
         let expectedResult = {
            action: 'moreButtonClick',
            name: 'first',
            selectedItems: [],
            searchValue: undefined
         };
         await panel._beforeMount(defaultConfig);

         panel._afterOpenDialogCallback([], defaultItemsConfig[0].name);
         expect(actualResult).toEqual(expectedResult);
      });

      it('_isEqualKeys', function () {
         const panel = getPanel(defaultConfig);
         let isEqual = panel._isEqualKeys([1, 2, 3], [1, 2, 3, 4]);
         expect(isEqual).toBe(false);
         isEqual = panel._isEqualKeys([1, 2, 3], [1, 2, 3]);
         expect(isEqual).toBe(true);
         isEqual = panel._isEqualKeys([null], []);
         expect(isEqual).toBe(false);
         isEqual = panel._isEqualKeys([null], [1, 2, 3]);
         expect(isEqual).toBe(false);
         isEqual = panel._isEqualKeys([3, 5, 4], [1, 2, 3]);
         expect(isEqual).toBe(false);
      });
   });
});
