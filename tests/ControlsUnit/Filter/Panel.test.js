define([
   'Controls/filterPopup',
   'Controls/filter',
   'Controls/_filterPopup/DetailPanel',
   'Controls/history',
   'Types/collection',
   'Core/core-clone',
   'Types/deferred',
   'Env/Env',
   'UI/Utils'
], function (
   filterPopup,
   filter,
   FilterPopupDetailPanel,
   history,
   collection,
   Clone,
   defferedLib,
   Env,
   Utils
) {
   describe('FilterPanelVDom', function () {
      var template =
         'tmpl!Controls-demo/Layouts/SearchLayout/FilterButtonTemplate/filterItemsTemplate';
      var config = {
            headingCaption: FilterPopupDetailPanel.default.getDefaultOptions().headingCaption
         },
         items = [
            {
               name: 'list',
               value: 1,
               resetValue: 1,
               visibility: true
            },
            {
               name: 'text',
               value: '123',
               resetValue: '',
               viewMode: 'extended',
               visibility: true
            },
            {
               name: 'bool',
               value: true,
               resetValue: false,
               visibility: false
            }
         ];
      config.items = items;
      config.itemTemplate = template;
      config.additionalTemplate = template;

      function getFilterPanel(FPconfig) {
         var panel2 = new FilterPopupDetailPanel.default(FPconfig);
         panel2._items = FPconfig.items;
         panel2.saveOptions(FPconfig);
         return panel2;
      }

      it('Init', function () {
         var panel = getFilterPanel(config);
         panel._beforeMount(config);
         expect(panel._items).toEqual(config.items);
         expect(panel._isChanged).toBe(true);
      });

      it('historySaveMode', () => {
         const cfg = Clone(config);
         cfg.orientation = 'vertical';
         cfg.historySaveMode = 'favorite';
         let filterPanel = getFilterPanel(cfg);
         filterPanel._beforeMount(cfg);
         expect(filterPanel._historySaveMode === 'favorite').toBe(true);
      });

      it('Init::historyItems fail loading', function (done) {
         var config2 = {
            items: items,
            historyId: 'TEST_PANEL_HISTORY_ID'
         };
         var panel2 = getFilterPanel(config2);
         let hUtilsLoader = filter.HistoryUtils.loadHistoryItems;
         filter.HistoryUtils.loadHistoryItems = () => {
            return defferedLib.Deferred.fail();
         };
         panel2._loadHistoryItems('TEST_PANEL_HISTORY_ID').addCallback(function () {
            expect(panel2._historyItems.getCount()).toEqual(0);
            done();
         });
         filter.HistoryUtils.loadHistoryItems = hUtilsLoader;
      });

      it('before update', function () {
         var panel = getFilterPanel(config);
         panel._beforeMount(config);
         panel._items[2].visibility = false;
         panel._beforeUpdate(config);
         expect(panel._isChanged).toBe(true);
         expect(panel._hasAdditionalParams).toBe(true);
      });

      it('getKeyProperty', () => {
         var panel = getFilterPanel(config);
         const newItems = [
            {
               name: 'test',
               value: 1,
               resetValue: null
            },
            {
               name: 'test1',
               value: 2,
               resetValue: 3
            }
         ];
         const name = panel._getKeyProperty(newItems);
         expect(name === 'name').toBe(true);
      });

      it('before update new items', function () {
         let newConfig = Clone(config);
         newConfig.items[2].visibility = true;
         var panel = getFilterPanel(newConfig);
         panel._beforeMount(newConfig);
         expect(panel._hasAdditionalParams).toBe(false);

         newConfig = Clone(newConfig);
         newConfig.items[2].visibility = false;
         panel._beforeUpdate(newConfig);
         expect(panel._hasAdditionalParams).toBe(true);
      });

      it('apply', async function () {
         const panel = getFilterPanel(config);
         let isNotifyClose = false;
         let isHistoryApplyEventFired = false;
         let innerFilter;

         panel._notify = (e, args, eCfg) => {
            if (e === 'close') {
               isNotifyClose = true;
            } else if (e === 'sendResult') {
               innerFilter = args[0].filter;
            } else if (e === 'historyApply') {
               isHistoryApplyEventFired = true;
            }
            if (eCfg) {
               expect(eCfg.bubbling).toBe(true);
            }
         };
         panel._beforeMount(config);
         panel._children = {
            formController: {
               submit: () => {
                  return defferedLib.Deferred.success([true]);
               }
            }
         };
         panel._applyFilter();
         expect(isNotifyClose).toBe(false);
         expect(isHistoryApplyEventFired).toBe(false);
         panel._children = {
            formController: {
               submit: () => {
                  return defferedLib.Deferred.success([false]);
               }
            }
         };
         await panel._applyFilter();
         expect({ text: '123' }).toEqual(innerFilter);
         expect(isNotifyClose).toBe(true);
         expect(isHistoryApplyEventFired).toBe(false);

         const event = {};
         const historyItems = config.items;
         panel._applyFilter(event, config.items, historyItems);
         expect(isHistoryApplyEventFired).toBe(true);
      });

      it('_applyHistoryFilter', function () {
         var panel = getFilterPanel(config),
            isNotifyClose,
            innerFilter,
            innerItems,
            isValidated = false;
         panel._notify = (e, args) => {
            if (e === 'sendResult') {
               innerFilter = args[0].filter;
               innerItems = args[0].items;
            } else if (e === 'close') {
               isNotifyClose = true;
            }
         };
         panel._beforeMount(config);
         panel._children = {
            formController: {
               submit: () => {
                  isValidated = true;
                  return defferedLib.Deferred.success([]);
               }
            }
         };
         var historyItems = [
            {
               name: 'text',
               value: '123',
               visibility: true
            },
            {
               name: 'bool',
               value: true,
               visibility: true
            },
            {
               name: 'test',
               value: false,
               visibility: true
            }
         ];
         panel._applyHistoryFilter('applyHistoryFilter', historyItems);
         expect({ text: '123', bool: true, test: false }).toEqual(innerFilter);
         expect({ name: 'test', value: false, visibility: true }).toEqual(innerItems[2]);
         expect(isValidated).toBe(false);
         expect(isNotifyClose).toBe(true);
      });

      it('_resetFilter', function () {
         const changedItems = [
            {
               name: 'list',
               value: 5,
               resetValue: 1,
               textValue: 'listValue'
            },
            {
               name: 'text',
               value: '123',
               resetValue: '',
               viewMode: 'extended',
               visibility: true,
               textValue: null
            },
            {
               name: 'bool',
               value: true,
               resetValue: false,
               visibility: false
            },
            {
               name: 'reseted',
               value: 'reset'
            }
         ];
         const resetedItems = [
            {
               name: 'list',
               value: 1,
               resetValue: 1,
               textValue: ''
            },
            {
               name: 'text',
               value: '',
               resetValue: '',
               viewMode: 'extended',
               visibility: false,
               textValue: null
            },
            {
               name: 'bool',
               value: false,
               resetValue: false,
               visibility: false
            },
            {
               name: 'reseted',
               value: 'reset'
            }
         ];
         let itemsChangedResult;
         let panel2 = getFilterPanel({ items: changedItems });
         panel2._notify = (event, data) => {
            if (event === 'itemsChanged') {
               itemsChangedResult = data[0];
            }
         };
         panel2._resetFilter();
         expect({ reseted: 'reset' }).toEqual(panel2._getFilter(panel2._items));
         expect(panel2._items).toEqual(resetedItems);
         expect(itemsChangedResult).toEqual(resetedItems);
         expect(panel2._isChanged).toBe(false);
      });

      it('isChangeValue', function () {
         var panel = getFilterPanel(config);
         panel._resetFilter();
         expect(panel._isChangedValue(panel._items)).toBe(false);
         panel._items.push({
            name: 'reseted',
            value: 'reset'
         });
         panel._resetFilter();
         expect(panel._isChangedValue(panel._items)).toBe(false);
      });

      it('without add params', function () {
         var panel = getFilterPanel(config);
         panel._beforeMount(config);
         panel._items[2].visibility = true;
         expect(panel._hasAddParams(panel._items)).toBe(false);
      });

      it('recordSet', function () {
         var rs = new collection.RecordSet({
               keyProperty: 'id',
               rawData: items
            }),
            options = {};
         options.items = rs;
         options.additionalTemplate = template;
         var panel2 = new FilterPopupDetailPanel.default(options);
         panel2._beforeMount(options);
         panel2._beforeUpdate(options);
         // expect(panel2._isChanged).toBe(false);
         expect(panel2._hasAdditionalParams).toBe(true);
      });

      it('valueChanged, visibilityChanged', function () {
         var panel = getFilterPanel(config);
         var itemsChangedEventFired = false;

         panel._notify = () => {
            itemsChangedEventFired = true;
         };
         panel._beforeMount(config);
         var newItems = Clone(items);
         newItems[0].value = 'testValue2';
         panel._itemsChangedHandler('itemsChanged', newItems);

         expect(panel._items[0].value).toEqual('testValue2');
         expect(itemsChangedEventFired).toBe(true);
      });

      it('resolveItems', function () {
         var panel = getFilterPanel(config);
         var innerItems = ['test'];
         var options = {
            items: innerItems
         };

         panel._resolveItems(options);
         expect(options.items !== panel._items).toBe(true);
         expect(panel._items[0]).toEqual('test');

         var stubLoggerError = jest.spyOn(Utils.Logger, 'error').mockClear().mockImplementation();

         expect(() => {
            panel._resolveItems({});
         }).toThrow();
         stubLoggerError.mockRestore();
      });

      describe('Check history', function () {
         let panel = getFilterPanel(config),
            historyItems;
         beforeEach(function () {
            panel._items = [
               {
                  name: 'Methods',
                  value: '123',
                  resetValue: '',
                  visibility: true,
                  textValue: null
               },
               {
                  name: 'Faces',
                  value: true,
                  resetValue: false,
                  visibility: false
               }
            ];
            historyItems = new collection.RecordSet({
               rawData: [
                  { ObjectData: null },
                  {
                     ObjectData: JSON.stringify([
                        {
                           name: 'Methods',
                           value: '',
                           resetValue: '',
                           visibility: true,
                           textValue: '123'
                        },
                        {
                           name: 'Faces',
                           value: true,
                           resetValue: true,
                           visibility: false
                        }
                     ])
                  },
                  { ObjectData: null },
                  {
                     ObjectData: JSON.stringify([
                        {
                           name: 'Methods',
                           value: '1234',
                           resetValue: '',
                           visibility: true,
                           textValue: '123'
                        },
                        {
                           name: 'Faces',
                           value: true,
                           resetValue: true,
                           visibility: false
                        }
                     ])
                  },
                  { ObjectData: null },
                  {
                     ObjectData: JSON.stringify([
                        {
                           name: 'Methods',
                           value: '1234',
                           resetValue: '',
                           textValue: ''
                        },
                        {
                           name: 'Faces',
                           value: true,
                           resetValue: true
                        }
                     ])
                  },
                  {
                     ObjectData: JSON.stringify([
                        {
                           name: 'Methods',
                           value: '1234',
                           resetValue: '',
                           textValue: null
                        },
                        {
                           name: 'Faces',
                           value: true,
                           resetValue: true
                        }
                     ])
                  }
               ]
            });
         });

         it('filterHistoryItems', function () {
            const wrongHistoryItems = new collection.RecordSet({
               rawData: [
                  {
                     ObjectData: JSON.stringify([
                        {
                           name: 'anotherFilterName',
                           value: '1234',
                           resetValue: '',
                           visibility: true,
                           textValue: '123'
                        },
                        {
                           name: 'anotherFilterName2',
                           value: false,
                           resetValue: true,
                           textValue: 'По лицам'
                        }
                     ])
                  }
               ]
            });
            expect(panel._filterHistoryItems('historyId', historyItems).getCount()).toEqual(1);
            expect(panel._filterHistoryItems('historyId', wrongHistoryItems).getCount()).toEqual(0);
         });

         it('filterHistoryItems with removeOutdatedFiltersFromHistory=false', function () {
            const wrongHistoryItems = new collection.RecordSet({
               rawData: [
                  {
                     ObjectData: JSON.stringify([
                        {
                           name: 'anotherFilterName',
                           value: '1234',
                           resetValue: '',
                           visibility: true,
                           textValue: '123'
                        },
                        {
                           name: 'anotherFilterName2',
                           value: false,
                           resetValue: true,
                           textValue: 'По лицам'
                        }
                     ])
                  }
               ]
            });
            expect(
               panel._filterHistoryItems('historyId', wrongHistoryItems, false).getCount()
            ).toEqual(1);
         });

         it('getFilter', () => {
            const innerItems = [
               {
                  name: 'list',
                  value: 5,
                  resetValue: 1,
                  textValue: 'listValue'
               },
               {
                  name: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true,
                  textValue: null
               },
               {
                  name: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: false
               },
               {
                  name: 'object',
                  value: {},
                  resetValue: null
               }
            ];
            expect(panel._getFilter(innerItems)).toEqual({
               list: 5,
               text: '123',
               object: {}
            });
         });
      });

      it('_prepareItems', function () {
         var panel = getFilterPanel(config);
         var changeItems = [
               {
                  name: 'list',
                  value: 1,
                  resetValue: 1,
                  visibility: true
               },
               {
                  name: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true
               },
               {
                  name: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: false
               },
               {
                  name: 'testObject',
                  value: {},
                  resetValue: {},
                  visibility: true
               }
            ],
            resetItems = [
               {
                  name: 'list',
                  value: 1,
                  resetValue: 1,
                  visibility: false
               },
               {
                  name: 'text',
                  value: '123',
                  resetValue: '',
                  visibility: true
               },
               {
                  name: 'bool',
                  value: true,
                  resetValue: false,
                  visibility: false
               },
               {
                  name: 'testObject',
                  value: {},
                  resetValue: {},
                  visibility: false
               }
            ];
         expect(panel._prepareItems(changeItems)).toEqual(resetItems);
      });

      it('_prepareItems without resetValue', function () {
         var panel = getFilterPanel(config);
         var changeItems = [
               {
                  name: 'list',
                  value: 1,
                  visibility: true
               },
               {
                  name: 'text',
                  value: '123',
                  visibility: true
               },
               {
                  name: 'bool',
                  value: false,
                  visibility: true
               },
               {
                  name: 'testObject',
                  value: [],
                  visibility: true
               }
            ],
            resetItems = [
               {
                  name: 'list',
                  value: 1,
                  visibility: true
               },
               {
                  name: 'text',
                  value: '123',
                  visibility: true
               },
               {
                  name: 'bool',
                  value: false,
                  visibility: false
               },
               {
                  name: 'testObject',
                  value: [],
                  visibility: false
               }
            ];
         expect(panel._prepareItems(changeItems)).toEqual(resetItems);
      });

      it('_isPassedValidation', function () {
         var panel = getFilterPanel(config);
         var validationResult = [null];
         expect(panel._isPassedValidation(validationResult)).toBe(true);

         validationResult = [null, 'Дата заполнена некорректно'];
         expect(panel._isPassedValidation(validationResult)).toBe(false);

         validationResult = ['Дата заполнена некорректно', null];
         expect(panel._isPassedValidation(validationResult)).toBe(false);
      });
   });
});
