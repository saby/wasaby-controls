define([
   'Controls/menu',
   'Types/source',
   'Core/core-clone',
   'Controls/display',
   'Controls/baseTree',
   'Types/collection',
   'Types/entity',
   'Controls/list',
   'Controls/popup',
   'EnvTouch/EnvTouch',
   'Controls/searchBreadcrumbsGrid'
], function (
   menu,
   source,
   Clone,
   display,
   baseTree,
   collection,
   entity,
   ControlsConstants,
   popup,
   EnvTouch,
   searchBreadcrumbsGrid
) {
   describe('Menu:Control', function () {
      function getDefaultItems() {
         return [
            { key: 0, title: 'все страны' },
            { key: 1, title: 'Россия' },
            { key: 2, title: 'США' },
            { key: 3, title: 'Великобритания' }
         ];
      }

      function getDefaultOptions() {
         return {
            displayProperty: 'title',
            keyProperty: 'key',
            selectedKeys: [],
            root: null,
            source: new source.Memory({
               keyProperty: 'key',
               data: getDefaultItems()
            }),
            itemPadding: {},
            subMenuLevel: 0,
            maxHistoryVisibleItems: 10
         };
      }

      let defaultItems = getDefaultItems();
      let defaultOptions = getDefaultOptions();

      let getListModel = function (items, { parentProperty, nodeProperty, root } = {}) {
         const defaultConfig = {
            collection: new collection.RecordSet({
               rawData: items || defaultItems,
               keyProperty: 'key'
            }),
            keyProperty: 'key'
         };
         if (parentProperty) {
            return new baseTree.Tree({
               ...defaultConfig,
               parentProperty,
               nodeProperty,
               root
            });
         }
         return new display.Collection(defaultConfig);
      };

      let getEmptyItem = function (itemText, key) {
         return new display.CollectionItem({
            contents: new entity.Model({
               keyProperty: 'id',
               rawData: {
                  id: key || null,
                  title: itemText
               }
            })
         });
      };

      let getMenu = function (config) {
         const menuControl = new menu.Control(config);
         menuControl.saveOptions(config || defaultOptions);
         menuControl._stack = new popup.StackOpener();
         menuControl._selectedKeys = [];
         menuControl._excludedKeys = [];
         menuControl._emptyItem = getEmptyItem(
            config && config.emptyText,
            config && config.emptyKey
         );
         return menuControl;
      };

      describe('loadItems', () => {
         it('loadItems returns items', async () => {
            const menuControl = getMenu();
            const items = await menuControl._loadItems(defaultOptions);
            expect(items.getRawData().length).toEqual(defaultItems.length);
         });

         it('with root', () => {
            const menuOptions = Clone(defaultOptions);
            menuOptions.source = new source.Memory({
               keyProperty: 'key',
               data: [
                  { key: 'all', title: 'все страны', node: true },
                  { key: '1', title: 'Россия', parent: 'all' },
                  { key: '2', title: 'США', parent: 'all' }
               ]
            });
            menuOptions.root = 'all';
            menuOptions.parentProperty = 'parent';
            menuOptions.nodeProperty = 'node';
            const menuControl = getMenu(menuOptions);
            return menuControl._loadItems(menuOptions).addCallback((items) => {
               expect(items.getCount()).toEqual(2);
            });
         });

         it('with filter', () => {
            const menuOptions = Clone(defaultOptions);
            menuOptions.filter = {
               title: 'все страны'
            };
            const menuControl = getMenu(menuOptions);
            return menuControl._loadItems(menuOptions).addCallback((items) => {
               expect(items.getCount()).toEqual(1);
            });
         });

         it('with navigation', async () => {
            const menuOptions = Clone(defaultOptions);
            menuOptions.navigation = {
               view: 'page',
               source: 'page',
               sourceConfig: { pageSize: 2, page: 0, hasMore: false }
            };
            const menuControl = getMenu(menuOptions);
            const items = await menuControl._loadItems(menuOptions);
            expect(items.getCount()).toEqual(2);
         });

         it('with dataLoadCallback in options', async () => {
            let isDataLoadCallbackCalled = false;
            let menuControl = getMenu();
            let menuOptions = Clone(defaultOptions);
            menuOptions.dataLoadCallback = () => {
               isDataLoadCallbackCalled = true;
            };
            await menuControl._loadItems(menuOptions);
            expect(isDataLoadCallbackCalled).toBe(false);
         });

         it('query returns error', async () => {
            const options = Clone(defaultOptions);
            const menuControl = getMenu();

            options.source.query = () => {
               const error = new Error();
               error.processed = true;
               return Promise.reject(error);
            };

            await menuControl._loadItems(options).catch(() => {
               expect(menuControl._errorConfig).not.toBeNull();
            });
         });

         it('dataLoadErrback', async () => {
            let isDataLoadErrbackCalled = false;
            const options = Clone(defaultOptions);
            const menuControl = getMenu();
            menuControl._options.dataLoadErrback = () => {
               isDataLoadErrbackCalled = true;
            };

            options.source.query = () => {
               const error = new Error();
               error.processed = true;
               return Promise.reject(error);
            };

            await menuControl._loadItems(options).catch(() => {
               expect(menuControl._errorConfig).not.toBeNull();
               expect(isDataLoadErrbackCalled).toBe(true);
            });
         });
      });

      describe('_beforeUpdate', () => {
         it('source is changed', async () => {
            let isClosed = false;
            const menuControl = getMenu();
            await menuControl._beforeMount(defaultOptions);
            const newMenuOptions = { ...defaultOptions };

            menuControl._closeSubMenu = () => {
               isClosed = true;
            };
            newMenuOptions.source = new source.Memory({
               keyProperty: 'key'
            });
            await menuControl._beforeUpdate(newMenuOptions);
            expect(menuControl._notifyResizeAfterRender).toBe(true);
            expect(isClosed).toBe(true);
         });

         it('source is changed, update markerController', async () => {
            let isClosed = false;
            const menuControl = getMenu();
            await menuControl._beforeMount(defaultOptions);
            const newMenuOptions = { ...defaultOptions };

            menuControl._closeSubMenu = () => {
               isClosed = true;
            };
            newMenuOptions.source = new source.Memory({
               keyProperty: 'key'
            });
            await menuControl._beforeUpdate(newMenuOptions);
            expect(menuControl._notifyResizeAfterRender).toBe(true);
            expect(isClosed).toBe(true);
         });

         it('searchValue is changed', async () => {
            let isClosed = false;
            let isViewModelCreated = false;
            const menuControl = getMenu();
            menuControl._listModel = getListModel();
            await menuControl._beforeMount(defaultOptions);
            const newMenuOptions = { ...defaultOptions, searchParam: 'title' };

            menuControl._closeSubMenu = () => {
               isClosed = true;
            };
            menuControl._createViewModel = () => {
               isViewModelCreated = true;
            };
            newMenuOptions.sourceController = {
               getItems: () =>
                  new collection.RecordSet({
                     keyProperty: 'key',
                     rawData: []
                  })
            };
            newMenuOptions.searchValue = '123';
            await menuControl._beforeUpdate(newMenuOptions);
            expect(menuControl._notifyResizeAfterRender).toBe(true);
            expect(isClosed).toBe(true);
            expect(isViewModelCreated).toBe(true);
         });
      });

      describe('_beforeMount', () => {
         const menuControl = getMenu();
         const menuOptions = { ...defaultOptions };
         menuControl._markerController = null;

         it('_loadItems return error', async () => {
            menuControl._loadItems = () => {
               const error = new Error();
               error.processed = true;
               return Promise.reject(error);
            };
            await menuControl._beforeMount(menuOptions);

            expect(menuControl._markerController).toBeNull();
         });

         it('sourceController don`t return items', () => {
            let isErrorProcessed = false;
            menuControl._listModel = {
               setMarkedKey: jest.fn(),
               getItemBySourceKey: () => {
                  return null;
               }
            };
            menuOptions.sourceController = {
               getLoadError: () => {
                  return new Error('error');
               },
               hasLoaded: () => {
                  return true;
               },
               subscribe: () => {
                  return null;
               },
               unsubscribe: () => {
                  return null;
               }
            };
            menuControl._processError = () => {
               isErrorProcessed = true;
            };
            menuControl._beforeMount(menuOptions);
            expect(isErrorProcessed).toBe(true);
         });
      });

      describe('getCollection', function () {
         let menuControl = new menu.Control({});
         let items = new collection.RecordSet({
            rawData: defaultItems.map((item) => {
               item.group = item.key < 2 ? '1' : '2';
               return item;
            }),
            keyProperty: 'key'
         });

         it('check uniq', function () {
            let doubleItems = new collection.RecordSet({
               rawData: [
                  { key: 1, title: 'Россия' },
                  { key: 1, title: 'Россия' },
                  { key: 1, title: 'Россия' },
                  { key: 1, title: 'Россия' },
                  { key: 1, title: 'Россия' }
               ],
               keyProperty: 'key'
            });
            let listModel = menuControl._getCollection(doubleItems, {
               keyProperty: 'key',
               itemPadding: {}
            });
            expect(listModel.getCount()).toEqual(1);
         });

         it('check history filter', function () {
            let isFilterApply = false;
            menuControl._limitHistoryFilter = () => {
               isFilterApply = true;
            };
            menuControl._getCollection(items, {
               allowPin: true,
               root: null,
               itemPadding: {}
            });

            expect(isFilterApply).toBe(false);
         });
      });

      it('_getLeftPadding', function () {
         const menu1 = getMenu();
         let menuOptions = {
            itemPadding: {},
            markerVisibility: 'hidden'
         };
         let leftSpacing = menu1._getLeftPadding(menuOptions);
         expect(leftSpacing).toEqual('m');

         menuOptions.multiSelect = true;
         leftSpacing = menu1._getLeftPadding(menuOptions);
         expect(leftSpacing).toEqual('s');

         menuOptions.itemPadding.left = 'xs';
         leftSpacing = menu1._getLeftPadding(menuOptions);
         expect(leftSpacing).toEqual('xs');

         menuOptions.itemPadding.left = undefined;
         menuOptions.markerVisibility = 'visible';
         leftSpacing = menu1._getLeftPadding(menuOptions);
         expect(leftSpacing).toEqual('s');
      });

      describe('_addEmptyItem', function () {
         let menuRender, menuOptions, items;
         beforeEach(function () {
            menuRender = getMenu();
            items = new collection.RecordSet({
               rawData: {
                  _type: 'recordset',
                  d: [],
                  s: [
                     { n: 'id', t: 'Строка' },
                     { n: 'title', t: 'Строка' },
                     { n: 'parent', t: 'Строка' },
                     { n: 'node', t: 'Строка' }
                  ]
               },
               keyProperty: 'id',
               adapter: new entity.adapter.Sbis()
            });
            menuOptions = {
               emptyText: 'Not selected',
               emptyKey: null,
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKeys: []
            };
         });

         it('check items count', function () {
            menuRender._addSingleSelectionItem('Not selected', null, items, menuOptions);
            expect(menuRender._emptyItem.contents.get('title')).toEqual('Not selected');
            expect(menuRender._emptyItem.contents.get('id')).toEqual(null);
         });

         it('check parentProperty', function () {
            menuRender._addSingleSelectionItem('text', null, items, {
               ...menuOptions,
               parentProperty: 'parent',
               root: null
            });
            expect(menuRender._emptyItem.contents.get('parent')).toEqual(null);
         });

         it('check nodeProperty', function () {
            menuRender._addSingleSelectionItem('text', null, items, {
               ...menuOptions,
               nodeProperty: 'node'
            });
            expect(menuRender._emptyItem.contents.get('node')).toEqual(null);
         });

         it('check model', function () {
            let isCreatedModel;
            jest
               .spyOn(menuRender, '_createModel')
               .mockClear()
               .mockImplementation((model, config) => {
                  isCreatedModel = true;
                  return new entity.Model(config);
               });

            items = new collection.RecordSet({
               rawData: Clone(defaultItems),
               keyProperty: 'id'
            });

            menuRender._addSingleSelectionItem('emptyText', null, items, menuOptions);
            expect(items.at(0).get('id')).toBeUndefined();
            expect(isCreatedModel).toBe(true);
            jest.restoreAllMocks();
         });
      });

      describe('_isExpandButtonVisible', function () {
         let menuControl, items;
         beforeEach(() => {
            const records = [];
            for (let i = 0; i < 15; i++) {
               records.push({ key: String(i), doNotSaveToHistory: undefined });
            }
            menuControl = getMenu();
            items = new collection.RecordSet({
               rawData: records,
               keyProperty: 'key'
            });
         });

         it('expandButton visible, history menu', () => {
            const newMenuOptions = {
               allowPin: true,
               root: null,
               maxHistoryVisibleItems: 10
            };

            const result = menuControl._isExpandButtonVisible(items, newMenuOptions);
            expect(result).toBe(true);
            expect(menuControl._visibleIds.length).toEqual(10);
         });

         it('expandButton visible, history menu with fixed item', () => {
            const newMenuOptions = {
               allowPin: true,
               root: null,
               maxHistoryVisibleItems: 10
            };
            items.append([
               new entity.Model({
                  rawData: {
                     key: 'doNotSaveToHistory',
                     doNotSaveToHistory: true
                  },
                  keyProperty: 'key'
               })
            ]);

            const result = menuControl._isExpandButtonVisible(items, newMenuOptions);
            expect(result).toBe(true);
            expect(menuControl._visibleIds.length).toEqual(11);
         });

         it('expandButton hidden, visibleItems.length = 11, history menu with fixed item', () => {
            const newMenuOptions = {
               allowPin: true,
               root: null,
               maxHistoryVisibleItems: 10
            };
            const itemsData = [];
            for (let i = 0; i < 11; i++) {
               itemsData.push({
                  key: String(i),
                  doNotSaveToHistory: undefined
               });
            }
            itemsData.push({
               key: 'doNotSaveToHistory',
               doNotSaveToHistory: true
            });
            items = new collection.RecordSet({
               rawData: itemsData,
               keyProperty: 'key'
            });

            const result = menuControl._isExpandButtonVisible(items, newMenuOptions);
            expect(result).toBe(false);
            expect(menuControl._visibleIds.length).toEqual(12);
         });

         it('expandButton hidden, history menu', () => {
            const newMenuOptions = {
               allowPin: true,
               subMenuLevel: 1,
               maxHistoryVisibleItems: 10
            };

            const result = menuControl._isExpandButtonVisible(items, newMenuOptions);
            expect(result).toBe(false);
            expect(menuControl._visibleIds.length).toEqual(0);
         });

         it('expandButton hidden, history menu, with parent', () => {
            let records = [];
            for (let i = 0; i < 20; i++) {
               records.push({ parent: i < 15 });
            }
            items = new collection.RecordSet({
               rawData: records,
               keyProperty: 'key'
            });
            const newMenuOptions = {
               allowPin: true,
               root: null,
               parentProperty: 'parent',
               maxHistoryVisibleItems: 10
            };

            const result = menuControl._isExpandButtonVisible(items, newMenuOptions);
            expect(result).toBe(false);
            expect(menuControl._visibleIds.length).toEqual(5);
         });
      });

      describe('_toggleExpanded', function () {
         let menuControl;
         let filterIsRemoved;
         let filterIsAdded;
         let isClosed;

         beforeEach(() => {
            isClosed = false;
            filterIsRemoved = false;
            filterIsAdded = false;
            menuControl = getMenu();
            menuControl._listModel = {
               removeFilter: () => {
                  filterIsRemoved = true;
               },
               addFilter: () => {
                  filterIsAdded = true;
               }
            };
            menuControl._closeSubMenu = () => {
               isClosed = true;
            };
         });

         it('expand', function () {
            menuControl._expander = false;
            menuControl._toggleExpanded();

            expect(isClosed).toBe(true);
            expect(menuControl._expander).toBe(true);
            expect(filterIsRemoved).toBe(true);
            expect(filterIsAdded).toBe(false);
         });

         it('collapse', function () {
            menuControl._expander = true;
            menuControl._toggleExpanded();

            expect(isClosed).toBe(true);
            expect(menuControl._expander).toBe(false);
            expect(filterIsRemoved).toBe(false);
            expect(filterIsAdded).toBe(true);
         });
      });

      describe('_itemClick', function () {
         let menuControl;
         let selectedItem, selectedKeys, pinItem, item;
         let isTouchStub;

         beforeEach(function () {
            menuControl = getMenu();
            menuControl._listModel = getListModel();
            isTouchStub = jest
               .spyOn(EnvTouch.TouchDetect.getInstance(), 'isTouch')
               .mockClear()
               .mockReturnValue(false);

            menuControl._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  selectedKeys = data[0];
               } else if (e === 'itemClick') {
                  selectedItem = data[0];
               } else if (e === 'pinClick') {
                  pinItem = data[0];
               }
            };
            item = new entity.Model({
               rawData: defaultItems[1],
               keyProperty: 'key'
            });
         });
         it('check selected item', function () {
            menuControl._markerController = null;
            menuControl._itemClick('itemClick', item, {});
            expect(selectedItem.getKey()).toEqual(1);
            expect(menuControl._markerController).toBeNull();
         });

         it('multiSelect=true', function () {
            menuControl._options.multiSelect = true;

            menuControl._itemClick('itemClick', item, {});
            expect(selectedItem.getKey()).toEqual(1);

            menuControl._selectionChanged = true;
            menuControl._itemClick('itemClick', item, {});
            expect(selectedKeys[0]).toEqual(1);
         });

         it('multiSelect=true, click on fixed item', function () {
            menuControl._options.multiSelect = true;
            item = item.clone();
            item.set('pinned', true);

            menuControl._itemClick('itemClick', item, {});
            expect(selectedItem.getKey()).toEqual(1);

            menuControl._selectionChanged = true;
            menuControl._itemClick('itemClick', item, {});
            expect(selectedItem.getKey()).toEqual(1);
         });

         it('multiSelect=true, click on history item', function () {
            menuControl._options.multiSelect = true;
            item = item.clone();
            item.set('pinned', true);
            item.set('HistoryId', null);

            menuControl._itemClick('itemClick', item, {});
            expect(selectedItem.getKey()).toEqual(1);

            menuControl._selectionChanged = true;
            selectedItem = null;
            menuControl._itemClick('itemClick', item, {});
            expect(selectedItem.getKey()).toEqual(1);
         });

         it('check pinClick', function () {
            let isPinClick = false;
            let nativeEvent = {
               target: {
                  closest: () => {
                     return isPinClick;
                  }
               }
            };
            menuControl._itemClick('itemClick', item, nativeEvent);
            expect(pinItem).not.toBeDefined();

            isPinClick = true;
            menuControl._itemClick('itemClick', item, nativeEvent);
            expect(pinItem.getId()).toEqual(item.getId());
         });

         it('select empty item', function () {
            let emptyMenuControl = getMenu({
               ...defaultOptions,
               emptyKey: null,
               emptyText: 'Not selected',
               multiSelect: true
            });
            let emptyItems = Clone(defaultItems);
            emptyItems.push({
               key: null,
               title: 'Not selected'
            });
            emptyMenuControl._listModel = getListModel(emptyItems);
            emptyMenuControl._notify = (e, data) => {
               if (e === 'selectedKeysChanged') {
                  selectedKeys = data[0];
               }
            };

            emptyMenuControl._selectionChanged = true;
            emptyMenuControl._itemClick('itemClick', item, {});
            expect(selectedKeys[0]).toEqual(1);

            emptyMenuControl._itemClick('itemClick', item, {});
            expect(selectedKeys[0]).toBeUndefined();

            emptyMenuControl._itemClick('itemClick', item, {});
            expect(selectedKeys[0]).toEqual(1);
         });

         describe('check touch devices', function () {
            beforeEach(() => {
               isTouchStub.mockReturnValue(true);
               selectedItem = null;
            });

            it('submenu is not open, item is list', function () {
               jest.spyOn(menuControl, '_handleCurrentItem').mockClear().mockImplementation();
               menuControl._itemClick('itemClick', item, {});
               expect(selectedItem.getKey()).toEqual(1);
            });

            it('submenu is not open, item is node', function () {
               jest.spyOn(menuControl, '_handleCurrentItem').mockClear().mockImplementation();
               item.set('node', true);
               menuControl._options.nodeProperty = 'node';
               menuControl._itemClick('itemClick', item, {});
               expect(menuControl._handleCurrentItem).toHaveBeenCalledTimes(1);
               expect(selectedItem).toBeNull();
               jest.restoreAllMocks();
            });

            it('submenu is open', function () {
               menuControl._subDropdownItem = menuControl._listModel.at(1).getContents();
               menuControl._itemClick('itemClick', menuControl._listModel.at(1).getContents(), {});
               expect(selectedItem.getKey()).toEqual(1);
            });
         });
      });

      describe('_itemMouseMove', function () {
         let menuControl, handleStub;
         let isTouchStub;
         let currentTarget = {
            closest: () => {
               return 'container';
            }
         };
         let collectionItem = new entity.Model({
            keyProperty: 'id'
         });

         beforeEach(() => {
            menuControl = getMenu();
            menuControl._listModel = getListModel();
            menuControl._container = 'container';
            isTouchStub = jest
               .spyOn(EnvTouch.TouchDetect.getInstance(), 'isTouch')
               .mockClear()
               .mockReturnValue(false);
            handleStub = jest
               .spyOn(menuControl, '_startOpeningTimeout')
               .mockClear()
               .mockImplementation();
         });

         it('menu:Control in item', function () {
            menuControl._itemMouseMove('mousemove', collectionItem, {
               currentTarget: {
                  closest: () => {
                     return 'newContainer';
                  }
               },
               nativeEvent: 'nativeEvent'
            });
            expect(handleStub).not.toHaveBeenCalled();
         });

         it('on groupItem', function () {
            menuControl._itemMouseMove('mousemove', new display.GroupItem());
            expect(handleStub).not.toHaveBeenCalled();
         });

         it('on collectionItem', function () {
            menuControl._itemMouseEnter('mouseenter', collectionItem, {
               currentTarget,
               nativeEvent: 'nativeEvent'
            });
            expect(menuControl._hoveredTarget).toEqual(currentTarget);
            menuControl._itemMouseMove('mousemove', collectionItem, {
               currentTarget: {
                  closest: () => {
                     return 'container';
                  }
               },
               nativeEvent: 'nativeEvent'
            });
            expect(handleStub).toHaveBeenCalledTimes(1);
            expect(menuControl._enterEvent).toEqual('nativeEvent');
         });

         it('on touch devices', function () {
            isTouchStub.mockReturnValue(true);
            menuControl._itemMouseMove('mousemove', collectionItem, { currentTarget });
            expect(handleStub).not.toHaveBeenCalled();
         });

         describe('close opened menu', function () {
            let isClosed = false;
            beforeEach(() => {
               menuControl._children.Sticky = {
                  close: () => {
                     isClosed = true;
                  }
               };
               menuControl._subMenu = true;
            });

            it('subMenu is close', function () {
               menuControl._itemMouseMove('mousemove', collectionItem, {
                  currentTarget,
                  nativeEvent: 'nativeEvent'
               });
               expect(handleStub).toHaveBeenCalledTimes(1);
               expect(isClosed).toBe(false);
            });

            it('subMenu is open, mouse on current item = subDropdownItem', function () {
               this._subDropdownItem = collectionItem;
               menuControl._itemMouseMove('mousemove', collectionItem, {
                  currentTarget,
                  nativeEvent: 'nativeEvent'
               });
               expect(handleStub).toHaveBeenCalledTimes(1);
               expect(isClosed).toBe(false);
            });
         });

         jest.restoreAllMocks();
      });

      it('_startOpeningTimeout', () => {
         let isHandledItem = false;
         jest.useFakeTimers();
         let menuControl = getMenu();
         menuControl._handleCurrentItem = () => {
            isHandledItem = true;
         };
         menuControl._startOpeningTimeout();
         jest.advanceTimersByTime(400);
         expect(isHandledItem).toBe(true);
         jest.useRealTimers();
      });

      it('getTemplateOptions sourceProperty', async function () {
         let actualConfig;
         let menuControl = getMenu();
         menuControl._options.sourceProperty = 'source';
         menuControl._listModel = getListModel();
         const item = new entity.Model({
            rawData: {
               source: 'testSource'
            },
            keyProperty: 'source'
         });
         menuControl._getSourceSubMenu = (isLoadedChildItems, config) => {
            actualConfig = config;
            return Promise.resolve('source');
         };
         menuControl._sourceController = { setRoot: jest.fn() };

         await menuControl._getTemplateOptions(item);
         expect(actualConfig).toEqual('testSource');
      });

      it('isSelectedKeysChanged', function () {
         let menuControl = getMenu();
         let initKeys = [];
         let result = menuControl._isSelectedKeysChanged([], initKeys);
         expect(result).toBe(false);

         result = menuControl._isSelectedKeysChanged([2], initKeys);
         expect(result).toBe(true);

         initKeys = [2, 1];
         result = menuControl._isSelectedKeysChanged([1, 2], initKeys);
         expect(result).toBe(false);
      });

      it('_getSelectedItems', () => {
         const menuControl = getMenu({
            ...defaultOptions,
            emptyKey: null,
            emptyText: 'emptyText'
         });
         const emptyItem = {
            key: null,
            title: 'Not selected'
         };
         let itemsWithEmpty = Clone(defaultItems);
         itemsWithEmpty.push(emptyItem);
         menuControl._listModel = getListModel(itemsWithEmpty);
         const result = menuControl._getSelectedItems();
         expect(result[0].getKey()).toBeNull();
      });

      it('_getMarkedKey', function () {
         let menuControl = getMenu();
         menuControl._listModel = getListModel([
            { key: 1, title: 'Россия' },
            { key: 2, title: 'США', pinned: true }
         ]);

         // empty item
         let result = menuControl._getMarkedKey([], {
            emptyKey: 'emptyKey',
            multiSelect: true,
            emptyText: 'emptyText'
         });
         expect(result).toEqual('emptyKey');

         // fixed item
         result = menuControl._getMarkedKey([2], {
            emptyKey: 'emptyKey',
            multiSelect: true
         });
         expect(result).toEqual(2);

         // item out of list
         result = menuControl._getMarkedKey([123], {
            emptyKey: 'emptyKey',
            multiSelect: true
         });
         expect(result).not.toBeDefined();

         // single selection
         result = menuControl._getMarkedKey([1, 2], {
            emptyKey: 'emptyKey',
            multiSelect: false
         });
         expect(result).toEqual(1);

         result = menuControl._getMarkedKey(['emptyKey'], {
            emptyKey: 'emptyKey',
            multiSelect: false,
            emptyText: 'emptyText'
         });
         expect(result).toEqual('emptyKey');
      });

      it('setSubMenuPosition', function () {
         let menuControl = getMenu();
         menuControl._openSubMenuEvent = {
            clientX: 25
         };

         menuControl._subMenu = {
            getBoundingClientRect: () => {
               return {
                  left: 10,
                  top: 10,
                  height: 200,
                  width: 100
               };
            }
         };

         menuControl._setSubMenuPosition();
         expect(menuControl._subMenuPosition).toEqual({
            // т.к. left < clientX, прибавляем ширину к left
            left: 110,
            top: 10,
            height: 200
         });
      });

      describe('_separatorMouseEnter', function () {
         let isClosed,
            isMouseInArea = true,
            menuControl = getMenu();
         beforeEach(() => {
            isClosed = false;
            menuControl._children = {
               Sticky: {
                  close: () => {
                     isClosed = true;
                  }
               }
            };

            menuControl._subMenu = true;
            menuControl._setSubMenuPosition = jest.fn();
            menuControl._isMouseInOpenedItemAreaCheck = function () {
               return isMouseInArea;
            };
         });

         it('isMouseInOpenedItemArea = true', function () {
            menuControl._subDropdownItem = true;
            menuControl._separatorMouseEnter('mouseenter', { nativeEvent: {} });
            expect(isClosed).toBe(false);
         });

         it('isMouseInOpenedItemArea = true, subMenu is close', function () {
            menuControl._subDropdownItem = false;
            menuControl._separatorMouseEnter('mouseenter', { nativeEvent: {} });
            expect(isClosed).toBe(false);
         });

         it('isMouseInOpenedItemArea = false', function () {
            menuControl._subDropdownItem = true;
            isMouseInArea = false;
            menuControl._separatorMouseEnter('mouseenter', { nativeEvent: {} });
            expect(isClosed).toBe(true);
         });
      });

      it('_footerMouseEnter', function () {
         let isClosed = false;
         let menuControl = getMenu();
         menuControl._subMenu = true;
         let event = {
            nativeEvent: {}
         };

         menuControl._children = {
            Sticky: {
               close: () => {
                  isClosed = true;
               }
            }
         };
         menuControl._isMouseInOpenedItemAreaCheck = function () {
            return false;
         };
         menuControl._setSubMenuPosition = jest.fn();
         menuControl._subDropdownItem = true;
         menuControl._footerMouseEnter(event);
         expect(isClosed).toBe(true);

         menuControl._isMouseInOpenedItemAreaCheck = function () {
            return true;
         };
         menuControl._subDropdownItem = true;
         isClosed = false;
         menuControl._footerMouseEnter(event);
         expect(isClosed).toBe(false);
      });

      it('_openSelectorDialog', function () {
         let menuOptions = Clone(defaultOptions);
         menuOptions.selectorTemplate = {
            templateName: 'DialogTemplate.wml',
            templateOptions: {
               option1: '1',
               option2: '2'
            },
            isCompoundTemplate: false
         };
         let menuControl = getMenu(menuOptions);
         menuControl._listModel = getListModel();
         menuControl._emptyItem = null;
         let selectedItems;
         menuControl._notify = (event, data) => {
            if (event === 'moreButtonClick') {
               selectedItems = data[0];
            }
         };

         menuControl._openSelectorDialog(menuOptions);
         expect(selectedItems.getCount()).toEqual(0);
      });

      it('_openSelectorDialog with empty item', () => {
         let emptyMenuControl = getMenu({
            ...defaultOptions,
            emptyKey: null,
            emptyText: 'Not selected',
            multiSelect: true,
            selectedKeys: ['Not selected'],
            selectorTemplate: {}
         });
         let items = Clone(defaultItems);
         const emptyItem = {
            key: null,
            title: 'Not selected'
         };
         items.push(emptyItem);
         emptyMenuControl._listModel = getListModel(items);
         let selectedItems;
         emptyMenuControl._notify = (event, data) => {
            if (event === 'moreButtonClick') {
               selectedItems = data[0];
            }
         };
         emptyMenuControl._openSelectorDialog();
         expect(selectedItems.getCount()).toBe(0);
      });

      describe('displayFilter', function () {
         let menuControl = getMenu();
         const hierarchyOptions = {
            parentProperty: 'parent',
            nodeProperty: 'node',
            root: null
         };
         menuControl._listModel = getListModel(null, hierarchyOptions);
         let item = new entity.Model({
            rawData: { key: '1', parent: null },
            keyProperty: 'key'
         });
         const treeItem = menuControl._listModel.getItems()[1];
         let isVisible;

         it('item parent = null, root = null', function () {
            isVisible = menuControl.constructor._displayFilter(
               { historyId: '', source: null },
               item,
               0,
               treeItem
            );
            expect(isVisible).toBe(true);
         });

         it('item parent = undefined, root = null', function () {
            item.set('parent', undefined);
            isVisible = menuControl.constructor._displayFilter(
               { historyId: '', source: null },
               item,
               0,
               treeItem
            );
            expect(isVisible).toBe(true);
         });

         it('item parent = 1, root = null', function () {
            item.set('parent', '1');
            const items = new collection.RecordSet({
               rawData: defaultItems,
               keyProperty: 'key'
            });
            items.add(item);
            isVisible = menuControl.constructor._displayFilter(
               { historyId: '', source: null },
               item,
               0,
               treeItem
            );
            expect(isVisible).toBe(false);
         });
      });

      describe('historyFilter', () => {
         let menuControl = getMenu();
         menuControl._visibleIds = [2, 6, 8];
         let itemKey;
         const item = {
            getKey: () => {
               return itemKey;
            }
         };

         const collectionItem = new display.CollectionItem({
            contents: item
         });

         const groupItem = new display.GroupItem({
            contents: 'group'
         });

         it('group item', function () {
            const isVisible = menuControl._limitHistoryCheck('group', 0, groupItem);
            expect(isVisible).toBe(true);
         });

         it('invisible item', function () {
            itemKey = 1;
            const isVisible = menuControl._limitHistoryCheck(item, 0, collectionItem);
            expect(isVisible).toBe(false);
         });

         it('visible item', function () {
            itemKey = 6;
            const isVisible = menuControl._limitHistoryCheck(item, 0, collectionItem);
            expect(isVisible).toBe(true);
         });
      });

      describe('groupMethod', function () {
         let menuControl = getMenu();
         let menuOptions = { groupProperty: 'group', root: null };
         let item = new entity.Model({
            rawData: { key: '1' },
            keyProperty: 'key'
         });

         it('item hasn`t group', function () {
            menuControl._setGroupKey(menuOptions, item);
            expect(item.get('group')).toEqual(ControlsConstants.groupConstants.hiddenGroup);
         });

         it('group = 0', function () {
            item.set('group', 0);
            menuControl._setGroupKey(menuOptions, item);
            expect(item.get('group')).toEqual(0);
         });

         it('item is history', function () {
            item.set('pinned', true);
            menuControl._setGroupKey(menuOptions, item);
            expect(item.get('group')).toEqual(ControlsConstants.groupConstants.hiddenGroup);
         });

         it('item is history, root = 2', function () {
            menuOptions.root = 2;
            menuControl._setGroupKey(menuOptions, item);
            expect(item.get('group')).toEqual(ControlsConstants.groupConstants.hiddenGroup);
         });
      });

      it('_changeIndicatorOverlay', function () {
         let menuControl = getMenu();
         let indicatorConfig = {
            delay: 100,
            overlay: 'default'
         };
         menuControl._changeIndicatorOverlay('showIndicator', indicatorConfig);
         expect(indicatorConfig.overlay).toEqual('none');
      });

      it('getCollection', function () {
         let menuControl = getMenu();
         let listModel = menuControl._getCollection(
            new collection.RecordSet({
               keyProperty: 'key'
            }),
            {
               searchParam: 'title',
               searchValue: 'searchText',
               itemPadding: {},
               keyProperty: 'key'
            }
         );
         expect(listModel).toBeInstanceOf(searchBreadcrumbsGrid.SearchGridCollection);
      });

      // TODO тестируем только публичные методы
      // it('_itemActionClick', function() {
      //    let isHandlerCalled = false;
      //    let menuControl = getMenu();
      //    menuControl._listModel = getListModel();
      //    let action = {
      //       id: 1,
      //       icon: 'icon-Edit',
      //       iconStyle: 'secondary',
      //       title: 'edit',
      //       showType: 2,
      //       handler: function() {
      //          isHandlerCalled = true;
      //       }
      //    };
      //    let clickEvent = {
      //       stopPropagation: () => {}
      //    };
      //
      //    menuControl._itemActionClick('itemActionClick', menuControl._listModel.at(1), action, clickEvent);
      //    assert.isTrue(isHandlerCalled);
      // });

      describe('_subMenuResult', function () {
         let menuControl, stubClose, eventResult, nativeEvent;
         beforeEach(() => {
            menuControl = getMenu();
            menuControl._notify = (event, data) => {
               eventResult = data[0];
               nativeEvent = data[1];
            };
            stubClose = jest.spyOn(menuControl, '_closeSubMenu').mockClear().mockImplementation();
         });

         it('menuOpened event', function () {
            const data = { container: 'subMenu' };
            menuControl._listModel = {
               getFirst: () => {
                  return new display.CollectionItem({
                     contents: new entity.Model({
                        rawData: {
                           key: '1'
                        },
                        keyProperty: 'key'
                     })
                  });
               }
            };
            menuControl._subDropdownItem = new entity.Model({
               rawData: {
                  key: '1'
               },
               keyProperty: 'key'
            });
            menuControl._subMenuResult('click', 'menuOpened', data);
            expect(menuControl._subMenu).toEqual(data.container);
         });
         it('pinClick event', function () {
            menuControl._subMenuResult('click', 'pinClick', { item: 'item1' });
            expect(eventResult).toEqual({ item: 'item1' });
            expect(stubClose).toHaveBeenCalledTimes(1);
         });
         it('itemClick event', function () {
            menuControl._subMenuResult('click', 'itemClick', { item: 'item2' }, 'testEventName');
            expect(nativeEvent).toEqual('testEventName');
            expect(eventResult).toEqual({ item: 'item2' });
            expect(stubClose).toHaveBeenCalledTimes(1);
         });
         it('itemClick event return false', function () {
            menuControl._notify = (event, data) => {
               eventResult = data[0];
               nativeEvent = data[1];
               return false;
            };
            menuControl._subMenuResult('click', 'itemClick', { item: 'item2' }, 'testEvent');
            expect(nativeEvent).toEqual('testEvent');
            expect(eventResult).toEqual({ item: 'item2' });
            expect(stubClose).not.toHaveBeenCalled();
         });
      });

      it('_subMenuDataLoadCallback', function () {
         const menuControl = getMenu();
         const listModelItems = getDefaultItems();
         menuControl._listModel = {
            getSourceCollection: () => {
               return new collection.RecordSet({
                  rawData: listModelItems,
                  keyProperty: 'key'
               });
            }
         };
         let items = new collection.RecordSet({
            rawData: [
               {
                  key: '1',
                  icon: 'icon',
                  caption: 'caption'
               }
            ],
            keyProperty: 'key'
         });

         menuControl._subMenuDataLoadCallback(items);
         expect(menuControl._listModel.getSourceCollection().getFormat().getCount()).toEqual(4);
      });

      describe('multiSelect: true', () => {
         it('_beforeUpdate hook', async () => {
            const options = {
               ...getDefaultOptions(),
               selectedKeys: [null]
            };
            const menuControl = new menu.Control(options);
            await menuControl._beforeMount(options);
            menuControl.saveOptions(options);

            menuControl._beforeUpdate(options);
            expect(menuControl._markedKey).toEqual(null);
         });
      });
   });
});
