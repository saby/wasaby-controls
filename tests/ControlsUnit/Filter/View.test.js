define([
   'Controls/filter',
   'Core/core-clone',
   'Types/source',
   'Types/collection',
   'Controls/history',
   'Types/chain',
   'Controls/_dropdown/dropdownHistoryUtils',
   'Application/Env',
   'Controls/error',
   'Core/nativeExtensions'
], function (filter, Clone, sourceLib, collection, history, chain, historyUtils, Env, errorLib) {
   describe('Filter:View', function () {
      // region
      // Этот код с подменой isNewEnvironment удалить нельзя, т.к. в этом модуле тесты проверяют функционал,
      // который используется в WS3 окружении - это ветки где вызов метода isNewEnvironment() ожидается false.
      // метод isNewEnvironment из 'Core/helpers/isNewEnvironment'
      const headData = Env.getStore('HeadData');
      let isNewEnvironment;

      before(() => {
         isNewEnvironment = headData.get('isNewEnvironment');
         headData.set('isNewEnvironment', false);
      });

      after(() => {
         headData.set('isNewEnvironment', isNewEnvironment);
      });

      // endregion

      let defaultItems = [
         [
            { id: 1, title: 'My' },
            { id: 2, title: 'My department' }
         ],

         [
            { id: 1, title: 'In any state' },
            { id: 2, title: 'In progress' },
            { id: 3, title: 'Completed' },
            {
               id: 4,
               title: 'Completed positive'
            },
            {
               id: 5,
               title: 'Completed negative'
            },
            { id: 6, title: 'Deleted' },
            { id: 7, title: 'Drafts' }
         ]
      ];

      let defaultSource = [
         {
            name: 'document',
            value: null,
            resetValue: null,
            textValue: '',
            emptyText: 'All documents',
            editorOptions: {
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: defaultItems[0]
               }),
               displayProperty: 'title',
               keyProperty: 'id'
            },
            viewMode: 'frequent'
         },
         {
            name: 'state',
            value: [1],
            resetValue: [null],
            textValue: '',
            emptyText: 'all state',
            editorOptions: {
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: defaultItems[1]
               }),
               displayProperty: 'title',
               keyProperty: 'id',
               multiSelect: true
            },
            viewMode: 'frequent'
         },
         {
            name: 'author',
            value: 'Ivanov K.K.',
            textValue: 'Author: Ivanov K.K.',
            resetValue: '',
            viewMode: 'basic',
            editorOptions: {}
         },
         {
            name: 'sender',
            value: '',
            resetValue: '',
            viewMode: 'extended',
            visibility: false
         },
         {
            name: 'responsible',
            value: '',
            resetValue: '',
            viewMode: 'extended',
            visibility: false
         }
      ];

      let defaultConfig = {
         source: defaultSource
      };

      let getView = function (config) {
         let view = new filter.View();
         let defaultOptions = filter.View.getDefaultOptions();
         const options = { ...defaultOptions, ...config };
         view.saveOptions(options);
         return view;
      };

      let getItems = function (items) {
         return new collection.RecordSet({
            keyProperty: 'id',
            rawData: items
         });
      };

      it('_beforeMount from receivedState', function () {
         let view = getView(defaultConfig);
         let receivedState = {
            configs: {
               document: {
                  items: getItems(Clone(defaultItems[0])),
                  displayProperty: 'title',
                  keyProperty: 'id'
               },
               state: {
                  items: getItems(Clone(defaultItems[1])),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true
               }
            }
         };
         let expectedDisplayText = {
            document: {},
            state: {
               text: 'In any state',
               title: 'In any state',
               hasMoreText: ''
            }
         };
         view._beforeMount(defaultConfig, {}, receivedState);

         expect(view._displayText).toEqual(expectedDisplayText);
         expect(view._filterText).toBe('Author: Ivanov K.K.');
         expect(view._configs.document.sourceController).toBeTruthy();
         expect(view._configs.state.sourceController).toBeTruthy();

         defaultConfig.source[0].editorOptions.selectorTemplate = 'New Template';
         view._beforeMount(defaultConfig, {}, receivedState);
      });

      it('_beforeMount from options', function (done) {
         const config = Clone(defaultConfig);
         let view = getView(config);
         let expectedDisplayText = {
            state: {
               text: 'In any state',
               title: 'In any state',
               hasMoreText: ''
            },
            document: {}
         };
         const testHSource = new history.Source({
            originSource: config.source[1].editorOptions.source,
            historySource: new history.Service({
               historyId: 'testhistorySource'
            })
         });
         testHSource._$historySource.query = () => {
            return Promise.reject();
         };
         testHSource.prepareItems = () => {
            return new collection.RecordSet({
               rawData: Clone(defaultItems[1])
            });
         };
         config.source[1].editorOptions.source = testHSource;
         config.panelTemplateName = 'panelName';
         view._beforeMount(config).addCallback(function (state) {
            expect(view._displayText).toEqual(expectedDisplayText);
            expect(view._filterText).toBe('Author: Ivanov K.K.');
            expect(view._configs.document).not.toBeDefined();
            expect(view._configs.state.sourceController).toBeTruthy();
            expect(state.configs.state.source).not.toBeDefined();
            done();
         });
      });

      it('_beforeUpdate', async function () {
         let view = getView(defaultConfig);
         await view._beforeMount(defaultConfig);
         view._beforeUpdate(defaultConfig);

         let expectedDisplayText = {
            document: { text: 'My', title: 'My', hasMoreText: '' },
            state: {
               text: 'In any state',
               title: 'In any state',
               hasMoreText: ''
            }
         };

         let newConfig = Clone(defaultConfig);
         newConfig.panelTemplateName = 'panelName';
         newConfig.source[0].value = 1;
         newConfig.source[0].editorOptions.source = new sourceLib.Memory({
            keyProperty: 'id',
            data: Clone(defaultItems[0])
         });
         view._configs = {};
         view._displayText = {};

         // isNeedReload = true
         await view._beforeUpdate(newConfig);
         await view._reload();
         expect(view._displayText).toEqual(expectedDisplayText);

         newConfig = Clone(defaultConfig);
         newConfig.panelTemplateName = 'panelName';
         newConfig.source[0].value = 2;
         newConfig.source[1].value = [5];
         expectedDisplayText = {
            document: {
               text: 'My department',
               title: 'My department',
               hasMoreText: ''
            },
            state: {
               text: 'Completed negative',
               title: 'Completed negative',
               hasMoreText: ''
            }
         };

         // isNeedReload = false
         await view._beforeUpdate(newConfig);
         expect(view._displayText).toEqual(expectedDisplayText);

         newConfig = Clone(defaultConfig);
         newConfig.panelTemplateName = 'panelName';
         newConfig.source[0].viewMode = 'basic';
         newConfig.source[2].viewMode = 'frequent';
         newConfig.source[2].editorOptions.source = new sourceLib.Memory({
            keyProperty: 'id',
            data: defaultItems[0]
         });

         // isNeedReload = true
         await view._beforeUpdate(newConfig);
         expect(Object.keys(view._configs).length).toEqual(2);
      });

      it('reload check configs', function (done) {
         let view = getView(defaultConfig);
         view._source = defaultConfig.source;
         view._displayText = {};
         view._configs = {
            document: {
               items: Clone(defaultItems[1]),
               displayProperty: 'title',
               keyProperty: 'id',
               sourceController: 'old sourceController'
            },
            state: {}
         };
         view._reload().addCallback(() => {
            expect(view._configs.document.items.getCount()).toEqual(2);
            done();
         });
         expect(view._configs.document.items.length).toEqual(7);
      });

      it('_beforeUpdate with opened filterPopupOpener', async function () {
         let filterReopened = false;
         const source = [
            {
               name: 'document',
               value: null,
               resetValue: null,
               textValue: '',
               emptyText: 'All documents',
               editorOptions: {
                  keyProperty: 'id'
               }
            }
         ];
         let view = getView({ source });
         view._options.source = source;
         let newConfig = {
            source: [
               {
                  name: 'document',
                  value: 1,
                  resetValue: 2,
                  textValue: '',
                  emptyText: 'All documents',
                  editorOptions: {
                     keyProperty: 'key'
                  }
               }
            ]
         };
         view._configs = {};
         view._displayText = {};
         view._isDetailPanelOpened = true;
         view._getFilterPopupOpener = () => {
            return {
               isOpened: () => {
                  return true;
               }
            };
         };
         view.openDetailPanel = () => {
            filterReopened = true;
         };
         await view._beforeUpdate(newConfig);

         expect(filterReopened).toBe(true);
      });

      it('_clearConfigs', function () {
         let view = getView(defaultConfig);
         let source = Clone(defaultSource);
         source.splice(1, 1); // delete 'state' item
         let configs = {
            document: {
               displayProperty: 'title',
               keyProperty: 'id'
            },
            state: {
               displayProperty: 'title',
               keyProperty: 'id'
            }
         };
         view._clearConfigs(source, configs);
         expect(configs.document).toBeTruthy();
         expect(configs.state).toBeFalsy();
      });

      it('_getItemsForReload', function () {
         let view = getView(defaultConfig);
         let oldItems = defaultConfig.source;
         let newItems = Clone(defaultConfig.source);

         let result = !!view._getItemsForReload(oldItems, newItems).length;
         expect(result).toBe(false);

         newItems[0].viewMode = 'basic';
         result = !!view._getItemsForReload(oldItems, newItems).length;
         expect(result).toBe(false);
         const configs = { author: {} };
         newItems[2].viewMode = 'frequent';
         result = !!view._getItemsForReload(oldItems, newItems, configs).length;
         expect(result).toBe(false);
         expect(configs.author).not.toBeDefined();

         oldItems = [];
         result = !!view._getItemsForReload(oldItems, newItems).length;
         expect(result).toBe(false);
      });

      it('openDetailPanel', function () {
         let view = getView(defaultConfig),
            popupOptions;
         view._filterPopupOpener = {
            open: (options) => {
               popupOptions = options;
            },
            isOpened: () => {
               return false;
            }
         };
         view._container = {};
         view._detailPanelTemplateName = 'detailPanelTemplateName.wml';
         view._source = defaultConfig.source;
         view._options.theme = 'default';

         view.openDetailPanel();

         expect(popupOptions.template).toBe('detailPanelTemplateName.wml');
         expect(popupOptions.templateOptions.items.length).toBe(5);
         expect(popupOptions.fittingMode).toEqual({
            horizontal: 'overflow',
            vertical: 'overflow'
         });

         view._options.detailPanelTemplateName = null;
         view._configs = {};
         view.openDetailPanel();
      });

      it('_openPanel', async function () {
         let view = getView(defaultConfig),
            popupOptions,
            filterClassName = '';
         let event = {
            currentTarget: {
               getElementsByClassName: () => {
                  return [filterClassName];
               }
            }
         };
         view._filterPopupOpener = {
            open: (options) => {
               popupOptions = options;
            },
            isOpened: () => {
               return false;
            }
         };
         view._children = {
            state: 'div_state_filter'
         };
         view._container = {
            0: 'filter_container'
         };
         view._options.panelTemplateName = 'panelTemplateName.wml';
         view._options.theme = 'default';
         view._source = defaultConfig.source;
         view._configs = {
            document: {
               items: new collection.RecordSet({
                  rawData: Clone(defaultItems[0])
               }),
               displayProperty: 'title',
               keyProperty: 'id',
               source: defaultSource[0].editorOptions.source
            },
            state: {
               items: new collection.RecordSet({
                  rawdata: Clone(defaultItems[1])
               }),
               displayProperty: 'title',
               keyProperty: 'id',
               source: defaultSource[1].editorOptions.source,
               multiSelect: true
            }
         };
         await view._openPanel();

         expect(popupOptions.template).toBe('panelTemplateName.wml');
         expect(popupOptions.templateOptions.items.getCount()).toBe(2);
         expect(popupOptions.className).toBe(
            'controls-FilterView-SimplePanel__buttonTarget-popup controls_popupTemplate_theme-default controls_filter_theme-default controls_filterPopup_theme-default controls_dropdownPopup_theme-default'
         );
         expect(view._configs.document).toBeDefined();
         filterClassName = 'div_second_filter';
         await view._openPanel(event, 'state');

         expect(popupOptions.target).toBe('div_state_filter');
         expect(popupOptions.className).toBe(
            'controls-FilterView-SimplePanel-popup controls_popupTemplate_theme-default controls_filter_theme-default controls_filterPopup_theme-default controls_dropdownPopup_theme-default'
         );
         view._children.state = null;
         await view._openPanel(event, 'state');

         expect(popupOptions.target).toBe('div_second_filter');
         expect(popupOptions.className).toBe(
            'controls-FilterView-SimplePanel-popup controls_popupTemplate_theme-default controls_filter_theme-default controls_filterPopup_theme-default controls_dropdownPopup_theme-default'
         );
         await view._openPanel('click');

         expect(popupOptions.target).toEqual('filter_container');
         view._configs.state.sourceController = {
            isLoading: () => {
               return true;
            }
         };
         popupOptions = null;
         view._openPanel('click');
         expect(popupOptions).toBeNull();
      });

      it('_openPanel with error', async () => {
         let view = getView(defaultConfig);
         await view._beforeMount(defaultConfig);

         jest.spyOn(view, '_loadUnloadedFrequentItems').mockRejectedValue(42);
         jest.spyOn(view, '_sourcesIsLoaded').mockReturnValue(true);
         let stub = jest.spyOn(errorLib, 'process').mockImplementation();

         view._configs = {};
         view._options.panelTemplateName = 'panelTemplateName.wml';

         await view._openPanel();

         expect(stub).toHaveBeenNthCalledWith(1, {
            error: 42
         });
         view._open = jest.fn();
         await view._openPanel();

         expect(Object.keys(view._configs)).toHaveLength(0);
      });

      it('_needShowFastFilter', () => {
         let view = getView({});
         let source = Clone(defaultSource);
         source[0].viewMode = 'basic';
         source[1].viewMode = 'basic';

         expect(view._needShowFastFilter(defaultSource)).toBe(true);
         expect(view._needShowFastFilter(source)).toBe(false);
      });

      it('_open', function () {
         let view = getView(defaultConfig),
            popupOptions,
            isOpened = true;
         view._filterPopupOpener = {
            open: (options) => {
               popupOptions = options;
            },
            isOpened: () => {
               return isOpened;
            }
         };
         view._container = {};
         view._options.theme = 'default';

         isOpened = false;
         view._open([1, 2, 4], { template: 'templateName' });

         expect(popupOptions.template).toBe('templateName');
         expect(popupOptions.templateOptions.items).toEqual([1, 2, 4]);
      });

      it('_isFastReseted', function () {
         let view = getView(defaultConfig);
         view._source = defaultConfig.source;

         let isFastReseted = view._isFastReseted();
         expect(isFastReseted).toBe(false);

         view._source = Clone(defaultConfig.source);
         view._source[1].value = view._source[1].resetValue;
         isFastReseted = view._isFastReseted();
         expect(isFastReseted).toBe(true);
      });

      describe('calculateStateSourceControllers', () => {
         it('not calculate state for unloaded filter', () => {
            let view = getView(defaultConfig);
            let methodCalled = false;
            const getSourceController = () => {
               methodCalled = true;
               return {
                  calculateState: () => {
                     return true;
                  }
               };
            };
            view._getSourceController = getSourceController;
            const items = [
               {
                  name: 'document',
                  viewMode: 'frequent',
                  value: ['1'],
                  resetValue: [],
                  editorOptions: {
                     source: new sourceLib.Memory({
                        keyProperty: 'id',
                        data: []
                     })
                  }
               }
            ];
            const configs = {
               document: {
                  name: 'document'
               }
            };
            view._calculateStateSourceControllers(items, configs);
            expect(methodCalled).toBe(false);
         });
      });

      it('_resetFilterText', function () {
         let view = getView(defaultConfig),
            isOpened = true,
            closed,
            filterChanged;
         view._filterPopupOpener = {
            isOpened: () => {
               return isOpened;
            },
            close: () => {
               closed = true;
            }
         };
         view._notify = (event, data) => {
            if (event === 'filterChanged') {
               filterChanged = data[0];
            }
         };
         view._displayText = {};
         view._source = Clone(defaultConfig.source);
         view._source[2].textValue = 'test';
         view._configs = {
            document: {
               items: getItems(Clone(defaultItems[0])),
               displayProperty: 'title',
               keyProperty: 'id'
            },
            state: {
               items: getItems(Clone(defaultItems[1])),
               displayProperty: 'title',
               keyProperty: 'id',
               multiSelect: true
            }
         };
         view._resetFilterText();
         expect(closed).toBe(true);
         expect(view._source[2].value).toBe('');
         expect(view._source[2].textValue).toBe('');
         expect(filterChanged).toEqual({ state: [1] });
         expect(view._displayText).toEqual({
            document: {},
            state: {
               text: 'In any state',
               title: 'In any state',
               hasMoreText: ''
            }
         });

         view._source.push({
            name: 'date',
            value: [new Date(2019, 5, 1), new Date(2019, 5, 31)],
            resetValue: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
            editorOptions: {
               option1: '1',
               option2: '2'
            },
            type: 'dateRange',
            viewMode: 'basic'
         });
         closed = false;
         view._resetFilterText();
         expect(closed).toBe(true);
         expect(view._source[2].value).toBe('');
         expect(view._source[5].value).toEqual([new Date(2019, 5, 1), new Date(2019, 5, 31)]);
      });

      it('_getDateRangeItem', () => {
         let view = getView(defaultConfig);
         let source = [...defaultSource];
         let dateItem = {
            name: 'date',
            value: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
            resetValue: [new Date(2019, 7, 1), new Date(2019, 7, 31)],
            editorOptions: {
               option1: '1',
               option2: '2'
            },
            type: 'dateRange',
            viewMode: 'basic'
         };
         source.push(dateItem);
         let item = view._getDateRangeItem(source);
         expect(item).toEqual(dateItem);
      });

      describe('_getFastText', function () {
         it('with items', () => {
            let view = getView(defaultConfig);
            let config = {
               displayProperty: 'title',
               keyProperty: 'id',
               emptyText: 'empty text',
               emptyKey: 'empty',
               items: new collection.RecordSet({
                  rawData: [
                     { id: null, title: 'Reset' },
                     { id: '1', title: 'Record 1' },
                     { id: '2', title: 'Record 2' },
                     { id: '3', title: 'Record 3' }
                  ]
               })
            };
            let display = view._getFastText(config, [null]);
            expect(display.text).toBe('Reset');

            display = view._getFastText(config, ['empty']);
            expect(display.text).toBe('empty text');
         });
      });

      it('_getKeysUnloadedItems', function () {
         let view = getView(defaultConfig);
         let config = {
            displayProperty: 'title',
            keyProperty: 'id',
            emptyText: 'empty text',
            emptyKey: 'empty',
            items: new collection.RecordSet({
               rawData: [
                  { id: '1', title: 'Record 1' },
                  { id: '2', title: 'Record 2' },
                  { id: '3', title: 'Record 3' }
               ]
            })
         };
         let keys = view._getKeysUnloadedItems(config, null);
         expect(keys[0]).toBe(null);

         keys = view._getKeysUnloadedItems(config, 'empty');
         expect(!!keys.length).toBe(false);
      });

      it('_resolveItems', function () {
         let view = getView(defaultConfig);

         let date = new Date();
         date.setSQLSerializationMode(Date.SQL_SERIALIZE_MODE_TIME);
         view._resolveItems([{ date }]);
         expect(view._source[0].date.getSQLSerializationMode()).toBe(
            date.getSQLSerializationMode()
         );
      });

      it('_resolveItems check _hasResetValues', function () {
         let view = getView(defaultConfig);
         let items = [
            { name: '1', value: '', resetValue: null },
            { name: '2', value: '', resetValue: undefined }
         ];
         view._resolveItems(items);
         expect(view._hasResetValues).toBe(true);

         items = [
            { name: '1', value: '' },
            { name: '2', value: '' }
         ];
         view._resolveItems(items);
         expect(view._hasResetValues).toBe(false);
      });

      it('_getFolderIds', function () {
         let view = getView(defaultConfig);
         const items = new collection.RecordSet({
            rawData: [
               {
                  key: '1',
                  title: 'In any state',
                  node: true,
                  parent: null
               },
               {
                  key: '2',
                  title: 'In progress',
                  node: false,
                  parent: 1
               },
               {
                  key: '3',
                  title: 'Completed',
                  node: false,
                  parent: 1
               },
               {
                  key: '4',
                  title: 'Completed positive',
                  node: true,
                  parent: 1
               },
               { key: '5', title: 'Completed positive', node: true }
            ],
            keyProperty: 'key'
         });
         const folders = view._getFolderIds(items, {
            nodeProperty: 'node',
            parentProperty: 'parent',
            keyProperty: 'key'
         });
         expect(folders).toEqual(['1', '5']);
      });

      it('_loadSelectedItems', async function () {
         let view = getView(defaultConfig);
         let source = [...defaultSource];
         source[1].value = [1];
         let isDataLoad;
         source[1].editorOptions.dataLoadCallback = () => {
            isDataLoad = true;
         };
         let configs = {
            document: {
               items: new collection.RecordSet({
                  rawData: Clone(defaultItems[0]),
                  keyProperty: 'id'
               }),
               source: source[0].editorOptions.source,
               emptyText: 'All documents',
               emptyKey: null,
               displayProperty: 'title',
               keyProperty: 'id'
            },
            state: {
               items: new collection.RecordSet({
                  rawData: defaultItems[1].slice(1),
                  keyProperty: 'id'
               }),
               source: source[1].editorOptions.source,
               emptyText: 'all state',
               emptyKey: null,
               sourceController: {
                  hasMoreData: () => {
                     return true;
                  }
               },
               displayProperty: 'title',
               keyProperty: 'id',
               multiSelect: true
            }
         };
         expect(configs.state.items.getCount()).toBe(6);

         let stub = jest.spyOn(historyUtils, 'getSourceFilter').mockImplementation();

         await view._loadSelectedItems(source, configs);

         expect(configs.state.popupItems.getCount()).toBe(6);
         expect(configs.state.items.getCount()).toBe(7);
         expect(configs.state.items.at(0).getRawData()).toEqual({
            id: 1,
            title: 'In any state'
         });
         expect(isDataLoad).toBe(true);
         expect(stub).not.toHaveBeenCalled();
      });

      it('_setValue', function () {
         let view = getView(defaultConfig);
         view._source = [
            {
               name: 'document',
               value: '',
               resetValue: false,
               emptyText: 'Test',
               emptyKey: null
            }
         ];
         view._configs = {
            document: {
               items: Clone(defaultItems[0]),
               displayProperty: 'title',
               keyProperty: 'id',
               emptyText: 'Test',
               emptyKey: null,
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: defaultItems[0]
               })
            }
         };
         view._setValue([null], 'document');
         expect(view._source[0].value).toBe(null);

         // emptyKey is not set
         view._source = [
            {
               name: 'document',
               value: '',
               resetValue: false,
               emptyText: 'Test'
            }
         ];
         view._configs = {
            document: {
               items: Clone(defaultItems[0]),
               displayProperty: 'title',
               keyProperty: 'id',
               emptyText: 'Test',
               emptyKey: null,
               source: new sourceLib.Memory({
                  idProperty: 'id',
                  data: defaultItems[0]
               })
            }
         };
         view._setValue([null], 'document');
         expect(view._source[0].value).toBe(false);

         view._source[0].resetValue = [];
         view._setValue([null], 'document');
         expect(view._source[0].value).toEqual([]);
      });

      it('_getPopupConfig', function () {
         let isLoading = false;
         let source = Clone(defaultSource);
         source[0].editorOptions.itemTemplate = 'new';
         source[0].editorOptions.navigation = {
            source: 'page',
            sourceConfig: {
               pageSize: 1,
               page: 0
            }
         };
         let navItems = getItems(Clone(defaultItems[0]));
         navItems.setMetaData({ more: true });
         let configs = {
            document: {
               items: navItems,
               itemTemplate: 'old',
               keyProperty: 'id',
               source: new sourceLib.Memory({
                  keyProperty: 'id',
                  data: defaultItems[0]
               })
            },
            state: {
               items: Clone(defaultItems[1]),
               sourceController: {
                  load: () => {
                     isLoading = true;
                     return Promise.resolve();
                  },
                  hasMoreData: () => {
                     return true;
                  },
                  setFilter: jest.fn()
               },
               displayProperty: 'title',
               keyProperty: 'id',
               multiSelect: true
            }
         };

         let view = getView(defaultConfig);
         view._children = {};
         view._onSelectorTemplateResult = jest.fn();
         view._getStackOpener = jest.fn();
         view._getDialogOpener = jest.fn();

         let resultItems = view._getPopupConfig(configs, source);
         expect(isLoading).toBe(true);
         expect(resultItems[0].hasMoreButton).toBe(true);
         expect(resultItems[0].displayProperty).toEqual('title');
         expect(resultItems[0].itemTemplate).toEqual('new');
      });

      it('_beforeUpdate loadSelectedItems', async function () {
         let filterView = getView(defaultConfig);
         let source = [...defaultSource];
         source[1].value = [1];
         let configs = {
            document: {
               items: new collection.RecordSet({
                  rawData: Clone(defaultItems[0]),
                  keyProperty: 'id'
               }),
               source: source[0].editorOptions.source,
               sourceController: {
                  hasMoreData: () => {
                     return false;
                  }
               },
               displayProperty: 'title',
               keyProperty: 'id'
            },
            state: {
               items: new collection.RecordSet({
                  rawData: defaultItems[1].slice(1),
                  keyProperty: 'id'
               }),
               source: source[1].editorOptions.source,
               sourceController: {
                  hasMoreData: () => {
                     return false;
                  }
               },
               displayProperty: 'title',
               keyProperty: 'id',
               multiSelect: true
            }
         };
         filterView._displayText = {};
         filterView._beforeMount(defaultConfig);
         filterView._configs = configs;
         await filterView._beforeUpdate({ source: source });
         expect(configs.state.popupItems.getCount()).toBe(7);
         expect(configs.state.items.getCount()).toBe(7);
         expect(configs.state.items.at(0).getRawData()).toEqual({
            id: 1,
            title: 'In any state'
         });
      });

      describe('View::resultHandler', function () {
         let view;
         beforeEach(function () {
            view = getView(defaultConfig);
            view._displayText = {};
            view._source = Clone(defaultConfig.source);
            view._configs = {
               document: {
                  items: getItems(Clone(defaultItems[0])),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  sourceController: {
                     hasMoreData: () => {
                        return true;
                     }
                  }
               },
               state: {
                  items: getItems(Clone(defaultItems[1])),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  multiSelect: true,
                  sourceController: {
                     hasMoreData: () => {
                        return true;
                     }
                  }
               }
            };
            view._filterPopupOpener = { close: jest.fn() };
         });

         it('_resultHandler itemClick', function () {
            let filterChanged;
            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  filterChanged = data[0];
               }
            };
            let eventResult = {
               action: 'itemClick',
               id: 'state',
               selectedKeys: [2]
            };
            view._resultHandler(eventResult);
            expect(view._source[1].value).toEqual([2]);
            expect(view._displayText).toEqual({
               document: {},
               state: {
                  text: 'In progress',
                  title: 'In progress',
                  hasMoreText: ''
               }
            });
            expect(filterChanged).toEqual({
               author: 'Ivanov K.K.',
               state: [2]
            });

            eventResult.selectedKeys = [null];
            view._resultHandler(eventResult);
            expect(view._source[1].value).toEqual(defaultSource[1].resetValue);
            expect(view._displayText).toEqual({ document: {}, state: {} });
            expect(filterChanged).toEqual({ author: 'Ivanov K.K.' });
         });

         it('_resultHandler closed', function () {
            let openerClosed = false;
            let eventResult = {
               action: 'itemClick',
               id: 'state',
               selectedKeys: [2]
            };
            view._filterPopupOpener = {
               close: () => {
                  openerClosed = true;
               }
            };

            view._resultHandler(eventResult);
            expect(openerClosed).toBe(true);
         });

         it('_resultHandler applyClick', function () {
            let filterChanged;
            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  filterChanged = data[0];
               }
            };
            let eventResult = {
               action: 'applyClick',
               selectedKeys: { state: [1, 2] }
            };
            view._resultHandler(eventResult);
            expect(view._source[1].value).toEqual([1, 2]);
            expect(view._displayText).toEqual({
               document: {},
               state: {
                  text: 'In any state',
                  title: 'In any state, In progress',
                  hasMoreText: ', еще 1'
               }
            });
            expect(filterChanged).toEqual({
               author: 'Ivanov K.K.',
               state: [1, 2]
            });
         });

         it('_resultHandler selectorResult', function () {
            let filterChanged;
            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  filterChanged = data[0];
               }
            };
            view._configs.state.items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: Clone(defaultItems[1])
            });
            let newItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [
                  { id: 3, title: 'Completed' },
                  { id: 20, title: 'new item' },
                  { id: 28, title: 'new item 2' }
               ]
            });
            let eventResult = {
               action: 'selectorResult',
               id: 'state',
               data: newItems
            };
            view._resultHandler(eventResult);
            expect(view._source[1].value).toEqual([3, 20, 28]);
            expect(view._displayText).toEqual({
               document: {},
               state: {
                  text: 'Completed',
                  title: 'Completed, new item, new item 2',
                  hasMoreText: ', еще 2'
               }
            });
            expect(filterChanged).toEqual({
               author: 'Ivanov K.K.',
               state: [3, 20, 28]
            });
            expect(view._configs.state.items.getCount()).toBe(9);

            newItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [{ id: 15, title: 'Completed' }] // without id field
            });
            eventResult.data = newItems;
            view._resultHandler(eventResult);
            expect(view._configs.state.items.getCount()).toBe(10);
         });

         it('selectorResult selectorCallback', function () {
            view._notify = (event, data) => {
               if (event === 'selectorCallback') {
                  data[1].at(0).set({ id: 11, title: 'item 11' });
               }
            };
            view._configs.state.items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: Clone(defaultItems[1])
            });
            view._idOpenSelector = 'state';
            let newItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [
                  { id: 3, title: 'Completed' },
                  { id: 20, title: 'new item' },
                  { id: 28, title: 'new item 2' }
               ]
            });
            view._onSelectorTemplateResult(newItems);
            expect(view._source[1].value).toEqual([11, 20, 28]);
            expect(view._displayText).toEqual({
               document: {},
               state: {
                  text: 'item 11',
                  title: 'item 11, new item, new item 2',
                  hasMoreText: ', еще 2'
               }
            });
         });

         it('_resultHandler filterDetailPanelResult', function () {
            let filterChanged;
            let historyEventFired;

            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  filterChanged = data[0];
               }
               if (event === 'historyApply') {
                  historyEventFired = true;
               }
            };
            view._source = [
               {
                  name: 'author',
                  value: '',
                  textValue: 'Author: Ivanov K.K.',
                  resetValue: '',
                  viewMode: 'basic'
               },
               {
                  name: 'sender',
                  value: 'Sander123',
                  resetValue: '',
                  viewMode: 'extended',
                  visibility: false
               },
               {
                  name: 'responsible',
                  value: '',
                  resetValue: '',
                  viewMode: 'extended',
                  visibility: false
               },
               {
                  name: 'document',
                  value: '11111',
                  resetValue: '',
                  textValue: 'new document',
                  viewMode: 'frequent',
                  visibility: false
               }
            ];

            let eventResult = {
               id: 'state',
               items: [
                  {
                     name: 'author',
                     value: '',
                     textValue: 'Author: Ivanov K.K.'
                  },
                  { name: 'sender', value: 'Sander123', visibility: false },
                  { name: 'responsible', value: '', visibility: false },
                  {
                     name: 'document',
                     value: '11111',
                     resetValue: '',
                     textValue: 'new document',
                     visibility: false
                  }
               ],
               history: [{ test: 'test' }]
            };
            view._resultHandler(eventResult);
            expect(view._source[1].value).toEqual('Sander123');
            expect(view._source[1].viewMode).toEqual('extended');
            expect(view._source[3].textValue).toEqual('new document');
            expect(filterChanged).toEqual({
               document: '11111',
               sender: 'Sander123'
            });
            expect(view._displayText).toEqual({
               document: {
                  hasMoreText: '',
                  text: 'new document',
                  title: 'new document'
               }
            });
            expect(historyEventFired).toBe(true);
         });

         it('_onSelectorTemplateResult', function () {
            let filterChanged;
            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  filterChanged = data[0];
               }
            };
            view._configs.state.items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: Clone(defaultItems[1])
            });
            let newItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [
                  { id: 3, title: 'Completed' },
                  { id: 20, title: 'new item' },
                  { id: 28, title: 'new item 2' }
               ]
            });
            view._idOpenSelector = 'state';
            view._onSelectorTemplateResult(newItems);
            expect(view._source[1].value).toEqual([3, 20, 28]);
            expect(view._displayText).toEqual({
               document: {},
               state: {
                  text: 'Completed',
                  title: 'Completed, new item, new item 2',
                  hasMoreText: ', еще 2'
               }
            });
            expect(filterChanged).toEqual({
               author: 'Ivanov K.K.',
               state: [3, 20, 28]
            });
         });
      });

      describe('View hierarchyList', function () {
         let view;
         beforeEach(function () {
            let documentItems = [
               { id: -1, title: 'Folder 1', node: true },
               { id: -2, title: 'Folder 2', node: true },
               { id: 1, title: 'In any state', parent: -1 },
               { id: 2, title: 'In progress', parent: -1 },
               { id: 3, title: 'Completed', parent: -1 },
               { id: 4, title: 'Deleted', parent: -2 },
               { id: 5, title: 'Drafts', parent: -2 }
            ];
            let hierarchySource = [
               {
                  name: 'document',
                  value: { '-1': [-1], '-2': [] },
                  resetValue: [],
                  textValue: '',
                  emptyText: 'All documents',
                  editorOptions: {
                     source: new sourceLib.Memory({
                        keyProperty: 'id',
                        data: documentItems
                     }),
                     displayProperty: 'title',
                     keyProperty: 'id',
                     nodeProperty: 'node',
                     parentProperty: 'parent',
                     multiSelect: true
                  },
                  viewMode: 'frequent'
               }
            ];
            view = getView({ source: hierarchySource });
            view._displayText = {};
            view._source = Clone(hierarchySource);
            view._configs = {
               document: {
                  items: new collection.RecordSet({
                     keyProperty: 'id',
                     rawData: documentItems
                  }),
                  displayProperty: 'title',
                  keyProperty: 'id',
                  nodeProperty: 'node',
                  parentProperty: 'parent',
                  multiSelect: true,
                  sourceController: {
                     hasMoreData: () => {
                        return true;
                     }
                  }
               }
            };
            view._sStickyOpener = { close: jest.fn() };
         });

         it('updateText', function () {
            view._updateText(view._source, view._configs);
            expect(view._displayText.document).toEqual({
               text: 'Folder 1',
               title: 'Folder 1',
               hasMoreText: ''
            });
         });

         it('itemClick', function () {
            let filterChanged;
            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  filterChanged = data[0];
               }
            };
            let eventResult = {
               action: 'itemClick',
               id: 'document',
               selectedKeys: { '-1': [1], '-2': [-2, 4] }
            };
            view._configs.document.multiSelect = false;
            view._resultHandler(eventResult);
            expect(view._source[0].value).toEqual({ '-1': [1], '-2': [-2] });
            expect(filterChanged).toEqual({
               document: { '-1': [1], '-2': [-2] }
            });
         });

         it('applyClick', function () {
            let filterChanged;
            view._notify = (event, data) => {
               if (event === 'filterChanged') {
                  filterChanged = data[0];
               }
            };
            let eventResult = {
               action: 'applyClick',
               selectedKeys: { document: { '-1': [1, 2], '-2': [-2, 4] } }
            };
            view._resultHandler(eventResult);
            expect(view._source[0].value).toEqual({ '-1': [1, 2], '-2': [-2] });
            expect(view._displayText.document).toEqual({
               text: 'In any state',
               title: 'In any state, In progress, Folder 2',
               hasMoreText: ', еще 2'
            });
            expect(filterChanged).toEqual({
               document: { '-1': [1, 2], '-2': [-2] }
            });

            eventResult = {
               action: 'applyClick',
               selectedKeys: { document: { '-1': [], '-2': [] } }
            };
            view._resultHandler(eventResult);
            expect(view._source[0].value).toEqual([]);
            expect(view._displayText.document).toEqual({});

            eventResult = {
               action: 'applyClick',
               selectedKeys: { document: { '-2': [4] } }
            };
            view._resultHandler(eventResult);
            expect(view._source[0].value).toEqual({ '-1': [], '-2': [4] });
            expect(view._displayText.document).toEqual({
               text: 'Deleted',
               title: 'Deleted',
               hasMoreText: ''
            });
         });

         it('moreButtonClick', function () {
            let isClosed;
            view._notify = jest.fn();
            let eventResult = {
               action: 'moreButtonClick',
               id: 'document'
            };
            view._filterPopupOpener = {
               close: () => {
                  isClosed = true;
               }
            };
            view._resultHandler(eventResult);
            expect(view._idOpenSelector).toBe('document');
            expect(isClosed).toBe(true);
         });

         it('_setItems', function () {
            let newItems = new collection.RecordSet({
               rawData: [
                  { id: 6, title: 'item folder 1', parent: -1 },
                  { id: 7, title: 'item2 folder 1', parent: -1 },
                  { id: 8, title: 'item folder 2', parent: -2 }
               ],
               keyProperty: 'id'
            });
            let expectedResult = [
               {
                  id: -1,
                  title: 'Folder 1',
                  node: true,
                  parent: null
               },
               {
                  id: 6,
                  title: 'item folder 1',
                  parent: -1,
                  node: null
               },
               {
                  id: 7,
                  title: 'item2 folder 1',
                  parent: -1,
                  node: null
               },
               {
                  id: 1,
                  title: 'In any state',
                  parent: -1,
                  node: null
               },
               {
                  id: -2,
                  title: 'Folder 2',
                  node: true,
                  parent: null
               },
               {
                  id: 8,
                  title: 'item folder 2',
                  parent: -2,
                  node: null
               },
               {
                  id: 4,
                  title: 'Deleted',
                  parent: -2,
                  node: null
               }
            ];
            view._setItems(
               view._configs.document,
               view._source[0],
               chain.factory(newItems).toArray()
            );

            expect(view._configs.document.popupItems.getRawData()).toEqual(expectedResult);
            expect(view._configs.document.items.getCount()).toEqual(10);

            view._source[0].editorOptions.source = new history.Source({
               originSource: new sourceLib.Memory({
                  keyProperty: 'key',
                  data: []
               }),
               historySource: new history.Service({
                  historyId: 'TEST_HISTORY_ID'
               })
            });
            let historyItems;
            view._source[0].editorOptions.source.prepareItems = (items) => {
               historyItems = items;
               return items;
            };
            view._setItems(
               view._configs.document,
               view._source[0],
               chain.factory(newItems).toArray()
            );
            expect(historyItems.getRawData()).toEqual(expectedResult);
         });

         it('loadItemsFromSource', async () => {
            let actualFilter;
            view._configs.document.sourceController = {
               setFilter: (queryFilter) => {
                  actualFilter = queryFilter;
               },
               load: jest.fn().mockRejectedValue('rejected')
            };
            view._configs.document.historyId = 'testId';
            await view._loadItemsFromSource(view._configs.document, view._source);
            expect(actualFilter).toEqual({ historyId: 'testId' });
         });
      });

      describe('View history', function () {
         let view, hSource, stores;
         const originalGetStore = Env.getStore;
         const originalSetStore = Env.setStore;
         beforeEach(function () {
            Env.getStore = (key) => {
               return stores[key];
            };
            Env.setStore = (key, value) => {
               stores[key] = value;
            };
            stores = {};
            view = getView(defaultConfig);
            view._source = Clone(defaultConfig.source);
            view._displayText = {};
            view._source = Clone(defaultConfig.source);
            view._configs = {
               document: {
                  items: Clone(defaultItems[0]),
                  displayProperty: 'title',
                  keyProperty: 'id'
               },
               state: {}
            };
            view._filterPopupOpener = { close: jest.fn() };
            hSource = new history.Source({
               originSource: new sourceLib.Memory({
                  keyProperty: 'key',
                  data: []
               }),
               historySource: new history.Service({
                  historyId: 'TEST_HISTORY_ID'
               })
            });
         });

         it('_updateHistory', function () {
            let resultHistoryItems, resultMeta;
            hSource.update = (historyItems, meta) => {
               resultHistoryItems = historyItems;
               resultMeta = meta;
            };
            view._source[0].editorOptions.source = hSource;
            let items = [{ key: 1 }];
            view._updateHistory('document', items);
            expect(resultHistoryItems).toEqual(items);
            expect(resultMeta).toEqual({ $_history: true });
         });

         it('_reload', async function () {
            view._source[0].editorOptions.source = hSource;
            await view._reload(false, true).addCallback((receivedState) => {
               expect(receivedState.configs.document.source).not.toBeDefined();
               expect(receivedState.configs.state.source).toBeTruthy();

               expect(view._configs.document.source).toBeTruthy();
               expect(view._configs.state.source).toBeTruthy();
            });
         });

         it('ignore load callback in receivedState', () => {
            const item = {
               name: 'test',
               editorOptions: {
                  dataLoadCallback: () => {
                     return false;
                  },
                  field: 'test'
               }
            };

            view._loadItems(item);
            expect(view._configs.test.dataLoadCallback).not.toBeDefined();
            expect(view._configs.test.field).toBe('test');
         });

         it('_getPopupConfig historySource', function () {
            hSource.prepareItems = () => {
               return new collection.RecordSet({
                  rawData: Clone(defaultItems[1])
               });
            };
            hSource.originSource = new sourceLib.Memory({
               keyProperty: 'key',
               data: defaultItems[0]
            });
            view._source[0].editorOptions.source = hSource;
            view._source[1].editorOptions.source = null;
            view._configs.document.sourceController = {
               setFilter: jest.fn(),
               load: () => {
                  return Promise.resolve();
               },
               hasMoreData: () => {
                  return true;
               }
            };
            let resultItems = view._getPopupConfig(view._configs, view._source);
            expect(resultItems[0].loadDeferred).toBeTruthy();

            jest.spyOn(view, '_loadItemsFromSource').mockReturnValue({
               isReady: () => {
                  return false;
               }
            });

            view._getPopupConfig(view._configs, view._source);
            expect(view._loadItemsFromSource).toHaveBeenCalledTimes(1);
         });
         describe('showSelector', () => {
            it('not try open dialog with not frequent item', () => {
               let openFired = false;
               const view2 = getView(defaultConfig);
               view2._source = defaultConfig.source;
               view2._stackOpener = {
                  open: () => {
                     openFired = true;
                  }
               };
               view2._loadDeferred = {
                  isReady: () => {
                     return true;
                  }
               };
               view2._showSelector('notExistId');
               expect(openFired).toBe(false);
            });

            it('dialog opened', (done) => {
               let openFired = false;
               let source = [
                  {
                     name: 'document',
                     value: null,
                     resetValue: null,
                     viewMode: 'frequent',
                     editorOptions: {
                        multiSelect: false,
                        source: new sourceLib.Memory({
                           data: [
                              {
                                 id: 0,
                                 title: 'Мой документ'
                              }
                           ]
                        }),
                        selectorTemplate: {
                           templateName: 'templateName',
                           templateOptions: {
                              option1: 'option'
                           }
                        }
                     }
                  }
               ];
               const view2 = getView({
                  source
               });
               view2._configs = {};
               view2._source = source;
               view2._loadDeferred = {
                  isReady: () => {
                     return true;
                  }
               };
               view2._stackOpener = {
                  open: () => {
                     openFired = true;
                     return Promise.resolve();
                  }
               };
               view2._showSelector('document').then(() => {
                  expect(openFired).toBe(true);
                  expect(!!view2._configs.document).toBe(true);
                  done();
               });
            });
            it('dialog opened with first frequent item', (done) => {
               let openFired = false;
               let source = [
                  {
                     name: 'document',
                     value: null,
                     resetValue: null,
                     viewMode: 'frequent',
                     editorOptions: {
                        multiSelect: false,
                        source: new sourceLib.Memory({
                           data: [
                              {
                                 id: 0,
                                 title: 'Мой документ'
                              }
                           ]
                        }),
                        selectorTemplate: {
                           templateName: 'templateName',
                           templateOptions: {
                              option1: 'option'
                           }
                        }
                     }
                  }
               ];
               const view2 = getView({
                  source
               });
               view2._configs = {};
               view2._source = source;
               view2._loadDeferred = {
                  isReady: () => {
                     return true;
                  }
               };
               view2._stackOpener = {
                  open: () => {
                     openFired = true;
                     return Promise.resolve();
                  }
               };
               view2._showSelector().then(() => {
                  expect(openFired).toBe(true);
                  expect(!!view2._configs.document).toBe(true);
                  done();
               });
            });
         });

         describe('_resetDisplayText', () => {
            it('change viewMode', () => {
               const oldSource = [
                  {
                     name: 'frequent',
                     viewMode: 'frequent'
                  }
               ];
               const newSource = [
                  {
                     name: 'frequent',
                     viewMode: 'extended'
                  }
               ];
               const control = getView({ source: [] });
               const displayText = {
                  frequent: { text: 'filter' }
               };

               control._resetDisplayText(oldSource, newSource, displayText);
               expect({
                  frequent: {}
               }).toEqual(displayText);
            });
         });
         afterEach(function () {
            Env.getStore = originalGetStore;
            Env.setStore = originalSetStore;
         });
      });
   });
});
