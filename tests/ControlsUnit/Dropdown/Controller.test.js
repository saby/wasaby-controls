define([
   'Controls/dropdown',
   'Types/source',
   'Core/core-clone',
   'Types/collection',
   'Controls/history',
   'Types/deferred',
   'Types/entity',
   'Core/core-instance',
   'Controls/popup'
], (dropdown, sourceLib, clone, collection, history, deferredLib, entity, cInstance, popup) => {
   describe('Dropdown/Controller', () => {
      let items = [
         {
            id: '1',
            title: 'Запись 1'
         },
         {
            id: '2',
            title: 'Запись 2'
         },
         {
            id: '3',
            title: 'Запись 3',
            icon: 'icon-16 icon-Admin icon-primary'
         },
         {
            id: '4',
            title: 'Запись 4'
         },
         {
            id: '5',
            title: 'Запись 5'
         },
         {
            id: '6',
            title: 'Запись 6',
            node: true
         },
         {
            id: '7',
            title: 'Запись 7'
         },
         {
            id: '8',
            title: 'Запись 8'
         }
      ];

      let itemsRecords = new collection.RecordSet({
         keyProperty: 'id',
         rawData: clone(items)
      });

      let config = {
         selectedKeys: [2],
         keyProperty: 'id',
         emptyText: true,
         source: new sourceLib.Memory({
            keyProperty: 'id',
            data: items,
            filter: (item, query) => {
               return !query.id || query.id.includes(item.get('id'));
            }
         }),
         nodeProperty: 'node',
         itemTemplateProperty: 'itemTemplate'
      };

      let configLazyLoad = {
         lazyItemsLoading: true,
         selectedKeys: [2],
         keyProperty: 'id',
         source: new sourceLib.Memory({
            keyProperty: 'id',
            data: items
         })
      };

      let getDropdownController = function (cfg) {
         return new dropdown._Controller({ ...cfg });
      };

      it('reload', async function () {
         let newOptions = clone(config);
         const newItems = [
            {
               id: '1',
               title: 'Тест 1'
            },
            {
               id: '2',
               title: 'Тест 2'
            }
         ];
         const newSource = new sourceLib.Memory({
            keyProperty: 'id',
            data: newItems
         });

         let dropdownController = getDropdownController(newOptions);
         dropdownController._options.source = newSource;
         await dropdownController.reload();

         expect(dropdownController._items.at(0).get('title')).toEqual('Тест 1');
      });

      it('handleClose', function () {
         let newOptions = clone(config);
         let dropdownController = getDropdownController(newOptions);
         dropdownController._items = new collection.RecordSet({});
         dropdownController._options.searchParam = 'title';
         dropdownController.handleClose('searchValue');
         expect(dropdownController._items).toBeNull();
      });

      describe('update', function () {
         let dropdownController, opened, updatedItems;
         beforeEach(function () {
            opened = false;
            dropdownController = getDropdownController(config);
            dropdownController._sticky.open = () => {
               opened = true;
            };

            updatedItems = clone(items);
            updatedItems.push({
               id: '9',
               title: 'Запись 9'
            });
         });

         it('new templateOptions', function () {
            dropdownController._loadItemsTempPromise = {};
            dropdownController.update({
               ...config,
               headTemplate: 'headTemplate.wml',
               source: undefined
            });
            expect(dropdownController._loadMenuTempPromise).toBeNull();
            expect(opened).toBe(false);

            dropdownController._open = function () {
               opened = true;
            };

            dropdownController._isOpened = true;
            dropdownController._items = itemsRecords.clone();
            dropdownController._source = 'testSource';
            dropdownController._sourceController = { hasMoreData: jest.fn() };
            dropdownController._options = {};
            dropdownController.update({
               ...config,
               headTemplate: 'headTemplate.wml',
               source: undefined
            });
            expect(opened).toBe(true);
         });

         it('new source', async () => {
            dropdownController._items = itemsRecords.clone();
            dropdownController._source = true;

            await dropdownController.update({
               selectedKeys: [2],
               keyProperty: 'id',
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: updatedItems
               })
            });

            expect(dropdownController._items.getCount()).toEqual(updatedItems.length);
            expect(
               cInstance.instanceOfModule(dropdownController._source, 'Types/source:Base')
            ).toBe(true);
            expect(opened).toBe(false);
         });

         it('new source when items is loading', () => {
            dropdownController._items = itemsRecords.clone();
            dropdownController._source = true;
            dropdownController._sourceController = {
               isLoading: () => {
                  return true;
               }
            };
            dropdownController.update({
               selectedKeys: [2],
               keyProperty: 'id',
               lazyItemsLoading: true,
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: updatedItems
               })
            });
            expect(dropdownController._source).toBe(true);
            expect(dropdownController._items).toBeNull();
         });

         it('new source and selectedKeys', async () => {
            dropdownController._items = itemsRecords.clone();
            dropdownController._source = true;

            let stub = jest
               .spyOn(dropdownController, '_updateSelectedItems')
               .mockClear()
               .mockImplementation();
            await dropdownController.update({
               selectedKeys: [3],
               keyProperty: 'id',
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: updatedItems
               })
            });
            expect(dropdownController._items.getCount()).toEqual(updatedItems.length);
            expect(stub).toHaveBeenCalledTimes(1);
         });
         it('new source and dropdown is open', async () => {
            dropdownController._items = itemsRecords.clone();
            dropdownController._isOpened = true;
            dropdownController._sourceController = {
               hasMoreData: jest.fn(),
               isLoading: jest.fn()
            };
            dropdownController._open = function () {
               opened = true;
            };
            await dropdownController.update({
               selectedKeys: [2],
               keyProperty: 'id',
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: updatedItems
               })
            });

            expect(opened).toBe(true);
         });

         it('change filter', async () => {
            let configFilter = clone(config),
               selectedItems = [];
            configFilter.selectedKeys = ['2'];
            configFilter.selectedItemsChangedCallback = function (innerItems) {
               selectedItems = innerItems;
            };

            await dropdownController.update({ ...configFilter });

            expect(selectedItems[0].getRawData()).toEqual(itemsRecords.at(1).getRawData());
         });

         it('_getLoadItemsPromise', () => {
            let loadedItems;
            dropdownController._items = null;
            dropdownController._loadItemsPromise = null;
            dropdownController._options.source = null;
            let promise = dropdownController._getLoadItemsPromise();

            promise.then((innerItems) => {
               loadedItems = innerItems;
            });

            expect(loadedItems).toBeFalsy();
         });

         it('without loaded items', async () => {
            let configItems = clone(config),
               selectedItems = [];
            configItems.selectedItemsChangedCallback = function (innerItems) {
               selectedItems = innerItems;
            };
            dropdownController._items = null;
            var newConfig = clone(configItems);
            newConfig.source = new sourceLib.Memory({
               keyProperty: 'id',
               data: items
            });
            newConfig.selectedKeys = ['4'];
            await dropdownController.update(newConfig);

            expect(selectedItems.length).toEqual(1);
         });

         it('change selectedKeys', () => {
            let selectedItems = [];
            let selectedItemsChangedCallback = function (innerItems) {
               selectedItems = innerItems;
            };
            dropdownController._items = itemsRecords.clone();
            dropdownController.update({
               selectedKeys: [6],
               keyProperty: 'id',
               filter: config.filter,
               selectedItemsChangedCallback: selectedItemsChangedCallback
            });
            expect(selectedItems[0].getRawData()).toEqual(items[5]);
         });

         it('change readOnly', () => {
            let readOnlyConfig = clone(config),
               isClosed = false;

            dropdownController._sticky.close = () => {
               isClosed = true;
            };
            readOnlyConfig.readOnly = true;
            dropdownController.update(readOnlyConfig);
            expect(isClosed).toBe(true);
         });

         it('_reloadSelectedItems', () => {
            let isReloaded = false;
            let configSelectedKeys = clone(config);
            configSelectedKeys.navigation = true;
            configSelectedKeys.selectedKeys = ['20'];
            dropdownController._items = itemsRecords;
            dropdownController._reloadSelectedItems = () => {
               isReloaded = true;
            };

            dropdownController.update({ ...configSelectedKeys });
            expect(isReloaded).toBe(true);
         });
      });

      it('getItemByKey', () => {
         let dropdownController = getDropdownController(config);
         let itemsWithoutKeyProperty = new collection.RecordSet({
            rawData: items
         });

         let item = dropdownController._getItemByKey(itemsWithoutKeyProperty, '1', 'id');
         expect(item.get('title')).toEqual('Запись 1');

         item = dropdownController._getItemByKey(itemsWithoutKeyProperty, 'anyTestId', 'id');
         expect(item).not.toBeDefined();
      });

      it('loadDependencies', async () => {
         const controller = getDropdownController(config);
         let innerItems;
         let menuSource;

         await controller.loadDependencies();
         innerItems = controller._items;
         menuSource = controller._menuSource;

         await controller.loadDependencies();
         expect(innerItems === controller._items).toBe(true);
         expect(menuSource === controller._menuSource).toBe(true);
      });

      it('loadDependencies, loadItemsTemplates', async () => {
         let actualOptions;
         const controller = getDropdownController(config);

         jest
            .spyOn(controller, '_loadItemsTemplates')
            .mockClear()
            .mockImplementation((options) => {
               actualOptions = options;
               return Promise.resolve(true);
            });

         // items not loaded, loadItemsTemplates was called
         await controller.loadDependencies();
         expect(actualOptions).toBeTruthy();

         // items already loaded, loadItemsTemplates was called
         actualOptions = null;
         await controller.loadDependencies();
         expect(actualOptions).toBeTruthy();
      });

      it('loadDependencies, load rejected', () => {
         const controller = getDropdownController(config);

         jest
            .spyOn(controller, '_getLoadItemsPromise')
            .mockClear()
            .mockImplementation(() => {
               return Promise.resolve(true);
            });

         jest
            .spyOn(controller, '_loadItemsTemplates')
            .mockClear()
            .mockImplementation(() => {
               return Promise.resolve(true);
            });

         jest
            .spyOn(controller, 'loadMenuTemplates')
            .mockClear()
            .mockImplementation(() => {
               // eslint-disable-next-line prefer-promise-reject-errors
               return Promise.reject('error');
            });

         // items is loaded, loadItemsTemplates was called
         return expect(controller.loadDependencies()).rejects.toMatch('error');
      });

      it('loadDependencies, _loadDependsPromise', async () => {
         const controller = getDropdownController(config);

         controller.loadDependencies();
         expect(controller._loadMenuTempPromise).toBeTruthy();
         expect(controller._loadDependsPromise).toBeTruthy();

         controller._loadMenuTempPromise = null;
         await controller.loadDependencies();
         expect(controller._loadMenuTempPromise).toBeFalsy();
      });

      it('check empty item update', () => {
         let dropdownController = getDropdownController(config),
            selectedItems = [];
         let selectedItemsChangedCallback = function (innerItems) {
            selectedItems = innerItems;
         };

         // emptyText + selectedKeys = [null]
         dropdownController._updateSelectedItems({
            selectedKeys: [null],
            keyProperty: 'id',
            emptyText: '123',
            emptyKey: null,
            selectedItemsChangedCallback: selectedItemsChangedCallback
         });
         expect(selectedItems).toEqual([null]);

         // emptyText + selectedKeys = []
         dropdownController._updateSelectedItems({
            selectedKeys: [],
            keyProperty: 'id',
            emptyText: '123',
            emptyKey: null,
            selectedItemsChangedCallback: selectedItemsChangedCallback
         });
         expect(selectedItems).toEqual([null]);

         // emptyText + selectedKeys = [] + emptyKey = 100
         dropdownController._updateSelectedItems({
            selectedKeys: [],
            keyProperty: 'id',
            emptyText: '123',
            emptyKey: 100,
            selectedItemsChangedCallback: selectedItemsChangedCallback
         });
         expect(selectedItems).toEqual([null]);

         // emptyText + selectedKeys = [123]
         dropdownController._updateSelectedItems({
            selectedKeys: [123],
            keyProperty: 'id',
            emptyText: 'text',
            selectedItemsChangedCallback: selectedItemsChangedCallback
         });
         expect(selectedItems).toEqual([null]);

         // emptyText + selectedKeys = [undefined] (combobox)
         dropdownController.setSelectedKeys(null);
         dropdownController._updateSelectedItems({
            selectedKeys: [undefined],
            keyProperty: 'id',
            emptyText: 'text',
            emptyKey: null,
            selectedItemsChangedCallback: selectedItemsChangedCallback
         });
         expect(selectedItems).toEqual([]);

         // selectedKeys = []
         let newItems = new collection.RecordSet({
            keyProperty: 'id',
            rawData: [
               { id: null, title: 'All' },
               { id: '1', title: 'first' }
            ]
         });
         dropdownController._items = newItems;
         dropdownController._updateSelectedItems({
            selectedKeys: [],
            keyProperty: 'id',
            emptyText: undefined,
            emptyKey: null,
            selectedItemsChangedCallback: selectedItemsChangedCallback
         });
         expect(selectedItems).toEqual([newItems.at(0)]);
      });

      it('reloadOnOpen', () => {
         let dropdownController = getDropdownController({ ...config });
         dropdownController._items = itemsRecords.clone();
         dropdownController._options.reloadOnOpen = true;

         jest
            .spyOn(dropdownController, '_open')
            .mockClear()
            .mockImplementation(() => {
               return Promise.resolve();
            });
         dropdownController.openMenu();
         expect(dropdownController._items).toBeNull();
         expect(dropdownController._loadDependsPromise).toBeNull();
      });

      it('_loadItemsTemplates', async () => {
         let dropdownController = getDropdownController(config);
         dropdownController._items = new collection.RecordSet({
            keyProperty: 'id',
            rawData: []
         });
         await dropdownController._loadItemsTemplates(dropdownController, config);

         expect(dropdownController._loadItemsTempPromise.isReady()).toBe(true);
      });

      it('_loadItems', async () => {
         const controllerConfig = { ...config };
         controllerConfig.dataLoadCallback = function (loadedItems) {
            const item = new entity.Record({
               rawData: {
                  id: '9',
                  title: 'Запись 9'
               }
            });
            loadedItems.add(item);
         };
         let dropdownController = getDropdownController(controllerConfig);
         await dropdownController._loadItems(controllerConfig);

         const menuItems = await dropdownController._menuSource.query();

         expect(!!menuItems.getRecordById('9')).toBe(true);

         dropdownController._sourceController = {
            load: () => {
               // eslint-disable-next-line prefer-promise-reject-errors
               return Promise.reject('error');
            }
         };
         await dropdownController._loadItems(controllerConfig).then(jest.fn(), (error) => {
            expect(error).toEqual('error');
         });
      });

      describe('load items by selectedKeys', () => {
         let dropdownController;
         let newConfig;
         let selectedItems;
         beforeEach(() => {
            newConfig = { ...config };
            newConfig.selectedKeys = ['8'];
            dropdownController = getDropdownController(newConfig);

            selectedItems = new collection.RecordSet({
               rawData: [
                  {
                     id: '1',
                     title: 'Запись 1'
                  },
                  {
                     id: '2',
                     title: 'Запись 2'
                  },
                  {
                     id: '3',
                     title: 'Запись 3'
                  }
               ],
               keyProperty: 'id'
            });
         });

         describe('loadSelectedItems', () => {
            it('loadSelectedItems selectedKey = 8', async () => {
               const newCfg = { ...config };
               newCfg.selectedKeys = ['8'];
               dropdownController = getDropdownController(newCfg);
               await dropdownController.loadSelectedItems();
               expect(dropdownController._selectedItems.getCount()).toEqual(1);
               expect(dropdownController._selectedItems.at(0).getKey()).toEqual('8');
               expect(dropdownController._items).toBeNull();
               expect(dropdownController._sourceController).toBeNull();
            });

            it('loadSelectedItems selectedAllKey', async () => {
               let actualSelectedItems;
               const newCfg = { ...config };
               newCfg.selectedKeys = [null];
               newCfg.selectedAllText = 'text';
               newCfg.selectedItemsChangedCallback = (selectedItemsCallback) => {
                  actualSelectedItems = selectedItemsCallback;
               };
               dropdownController = getDropdownController(newCfg);
               await dropdownController.loadSelectedItems();
               expect(dropdownController._selectedItems.getCount()).toEqual(0);
               expect(actualSelectedItems[0]).toEqual(null);
            });
         });

         it('_resolveLoadedItems', () => {
            const loadedItems = new collection.RecordSet({
               rawData: [
                  {
                     id: '2',
                     title: 'Запись 2'
                  }
               ],
               keyProperty: 'id'
            });
            dropdownController._source = 'testSource';
            dropdownController._selectedItems = selectedItems;
            const result = dropdownController._resolveLoadedItems(newConfig, loadedItems);
            expect(result.getCount()).toEqual(3);

            // reopen the dropdown, if open
            dropdownController._isOpened = true;
            let opened = false;
            dropdownController._open = () => {
               opened = true;
            };
            dropdownController._resolveLoadedItems(newConfig, loadedItems);
            expect(opened).toBe(true);
         });
      });

      it('_private::getItemsTemplates', () => {
         let dropdownController = getDropdownController(config);

         dropdownController._items = new collection.RecordSet({
            keyProperty: 'id',
            rawData: [
               {
                  id: 1,
                  itemTemplate: 'first'
               },
               {
                  id: 2,
                  itemTemplate: 'second'
               },
               {
                  id: 3
               },
               {
                  id: 4,
                  itemTemplate: 'second'
               },
               {
                  id: 5,
                  itemTemplate: 'five'
               }
            ]
         });
         expect(dropdownController._getItemsTemplates(config)).toEqual(['first', 'second', 'five']);
      });

      it('_open lazyLoad', () => {
         let dropdownController = getDropdownController(configLazyLoad);
         dropdownController.update(configLazyLoad);

         dropdownController._sticky.open = jest.fn();
         dropdownController._sticky.close = jest.fn();
         dropdownController._open();
      });

      it('getPreparedItem', () => {
         let dropdownController = getDropdownController(configLazyLoad);
         let actualSource;

         dropdownController._prepareItem = (item, key, source) => {
            actualSource = source;
         };

         dropdownController._source = 'testSource';
         dropdownController.getPreparedItem('item', 'key');
         expect(actualSource).toEqual('testSource');
      });

      describe('menuPopupOptions', () => {
         let newConfig, dropdownController;
         beforeEach(() => {
            newConfig = clone(config);
            newConfig.menuPopupOptions = {
               fittingMode: {
                  vertical: 'adaptive',
                  horizontal: 'overflow'
               },
               direction: 'top',
               target: 'testTarget',
               templateOptions: {
                  closeButtonVisibility: true
               }
            };
            dropdownController = getDropdownController(newConfig);
            dropdownController._sourceController = {
               hasMoreData: jest.fn()
            };
         });

         it('only popupOptions', () => {
            dropdownController._popupOptions = {
               opener: 'test'
            };
            const resultPopupConfig = dropdownController._getPopupOptions();
            expect(resultPopupConfig.fittingMode).toEqual({
               vertical: 'adaptive',
               horizontal: 'overflow'
            });
            expect(resultPopupConfig.direction).toEqual('top');
            expect(resultPopupConfig.target).toEqual('testTarget');
            expect(resultPopupConfig.opener).toEqual('test');
         });

         it('templateOptions', () => {
            dropdownController._menuSource = 'testSource';
            dropdownController._popupOptions = {
               opener: 'test'
            };
            const resultPopupConfig = dropdownController._getPopupOptions();

            expect(resultPopupConfig.templateOptions.closeButtonVisibility).toBe(true);
            expect(resultPopupConfig.templateOptions.source).toEqual('testSource');
            expect(resultPopupConfig.templateOptions.dataLoadCallback).toEqual(
               dropdownController._options.dataLoadCallback
            );
            expect(resultPopupConfig.opener).toEqual('test');
         });

         it('check merge popupOptions', () => {
            dropdownController._popupOptions = {
               opener: 'test'
            };
            const resultPopupConfig = dropdownController._getPopupOptions({
               testPopupOptions: 'testValue'
            });

            expect(resultPopupConfig.direction).toEqual('top');
            expect(resultPopupConfig.target).toEqual('testTarget');
            expect(resultPopupConfig.testPopupOptions).toEqual('testValue');
            expect(resultPopupConfig.opener).toEqual('test');
         });

         it('check keyProperty option', () => {
            dropdownController._popupOptions = {};
            dropdownController._options.keyProperty = 'key';
            dropdownController._source = new history.Source({});
            dropdownController._items = new collection.RecordSet({
               rawData: [
                  {
                     id: '1',
                     HistoryId: 'test'
                  }
               ]
            });
            let resultPopupConfig = dropdownController._getPopupOptions();

            expect(resultPopupConfig.templateOptions.keyProperty).toEqual('copyOriginalId');

            dropdownController._source = 'originalSource';
            resultPopupConfig = dropdownController._getPopupOptions();

            expect(resultPopupConfig.templateOptions.keyProperty).toEqual('key');
         });
      });

      it('_beforeUnmount', function () {
         let isCanceled = false,
            opened = true;
         let dropdownController = getDropdownController(configLazyLoad);
         dropdownController._sticky.close = () => {
            opened = false;
         };
         dropdownController._sourceController = {
            cancelLoading: () => {
               isCanceled = true;
            }
         };
         dropdownController._options.openerControl = {
            _notify: jest.fn()
         };
         dropdownController.destroy();
         expect(!!dropdownController._sourceController).toBe(false);
         expect(isCanceled).toBe(true);
         expect(opened).toBe(false);
      });

      describe('openMenu', () => {
         let dropdownController = getDropdownController(config);
         let openConfig;

         beforeEach(() => {
            dropdownController._sourceController = {
               hasMoreData: () => {
                  return false;
               }
            };
            dropdownController._source = 'testSource';
            dropdownController._items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: items
            });
            jest
               .spyOn(popup.Sticky, '_openPopup')
               .mockClear()
               .mockImplementation((popupConfig) => {
                  openConfig = popupConfig;
                  return Promise.resolve(true);
               });
         });

         it('simple', async () => {
            await dropdownController.openMenu({ testOption: 'testValue' });
            expect(openConfig.testOption).toEqual('testValue');
         });

         describe('one item', () => {
            beforeEach(() => {
               dropdownController._items = new collection.RecordSet({
                  keyProperty: 'id',
                  rawData: [
                     {
                        id: 1,
                        title: 'testTitle'
                     }
                  ]
               });
               dropdownController._options.footerContentTemplate = null;
               dropdownController._options.emptyText = null;
               openConfig = null;
            });

            it('with footer', async () => {
               dropdownController._options.footerContentTemplate = {};

               await dropdownController.openMenu({ testOption: 'testValue' });
               expect(openConfig.testOption).toEqual('testValue');
            });

            it('with emptyText', async () => {
               dropdownController._options.emptyText = '123';

               await dropdownController.openMenu({ testOption: 'testValue' });
               expect(openConfig.testOption).toEqual('testValue');
            });

            it('simple', async () => {
               dropdownController._isOpened = false;
               const innerItems = await dropdownController.openMenu();
               expect(innerItems[0].get('id')).toEqual(1);
               expect(openConfig).toEqual(null);
            });
         });
      });

      it('closeMenu', () => {
         let dropdownController = getDropdownController(config);
         let closed = false;
         dropdownController._sticky.close = () => {
            closed = true;
         };

         dropdownController.closeMenu();
         expect(closed).toBe(true);
      });

      it('_private::getNewItems', function () {
         let curItems = new collection.RecordSet({
               rawData: [
                  {
                     id: '1',
                     title: 'Запись 1'
                  },
                  {
                     id: '2',
                     title: 'Запись 2'
                  },
                  {
                     id: '3',
                     title: 'Запись 3'
                  }
               ]
            }),
            selectedItems = new collection.RecordSet({
               rawData: [
                  {
                     id: '1',
                     title: 'Запись 1'
                  },
                  {
                     id: '9',
                     title: 'Запись 9'
                  },
                  {
                     id: '10',
                     title: 'Запись 10'
                  }
               ]
            });
         let dropdownController = getDropdownController(config);
         let newItems = [selectedItems.at(1), selectedItems.at(2)];
         let result = dropdownController._getNewItems(curItems, selectedItems, 'id');

         expect(newItems).toEqual(result);
      });

      it('_private::getSourceController', async function () {
         let dropdownController = getDropdownController(config);
         dropdownController.setItems(configLazyLoad.items);
         expect(dropdownController._sourceController).toBeFalsy();

         await dropdownController.loadItems();

         expect(dropdownController._sourceController).toBeTruthy();

         let historyConfig = { ...config, historyId: 'TEST_HISTORY_ID' };
         dropdownController = getDropdownController(historyConfig);
         const sourceController = await dropdownController._getSourceController(historyConfig);
         expect(
            cInstance.instanceOfModule(
               sourceController.getState().source,
               'Controls/history:Source'
            )
         ).toBe(true);
         expect(dropdownController._sourceController).toBeTruthy();
      });

      let historySource, dropdownController;
      describe('history', () => {
         beforeEach(function () {
            historySource = new history.Source({
               originSource: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: items
               }),
               historySource: new history.Service({
                  historyId: 'TEST_HISTORY_ID_DDL_CONTROLLER'
               })
            });
            historySource.query = function () {
               var def = new deferredLib.Deferred();
               def.addCallback(function (set) {
                  return set;
               });
               def.callback(itemsRecords.clone());
               return def;
            };

            // historySource.getItems = () => {};

            let historyConfig = { ...config, source: historySource };
            dropdownController = getDropdownController(historyConfig);
            dropdownController._items = itemsRecords.clone();
            dropdownController._children = {
               DropdownOpener: {
                  close: jest.fn(),
                  isOpened: jest.fn()
               }
            };
         });

         it('update new historySource', function () {
            return dropdownController
               .update({
                  selectedKeys: [2],
                  keyProperty: 'id',
                  source: historySource,
                  filter: {}
               })
               .then(() => {
                  expect(dropdownController._filter).toEqual({
                     $_history: true
                  });
               });
         });

         it('isHistoryMenu', () => {
            dropdownController._source = historySource;
            dropdownController._items = new collection.RecordSet({
               rawData: [
                  {
                     id: '1',
                     title: 'title'
                  }
               ]
            });
            let result = dropdownController._isHistoryMenu();
            expect(result).toBe(false);

            dropdownController._items.at(0).set('HistoryId', 'test');
            result = dropdownController._isHistoryMenu();
            expect(result).toBe(true);
         });
      });
   });
});
