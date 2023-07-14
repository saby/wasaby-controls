define([
   'Controls/lookupPopup',
   'Types/entity',
   'Types/source',
   'Types/collection',
   'Controls/operations',
   'Controls/_lookupPopup/Container',
   'Controls/error'
], function (
   lookupPopup,
   entity,
   sourceLib,
   collection,
   operations,
   LookupPopupContainer,
   errorLib
) {
   var getRawData = function (id) {
      return {
         id: id
      };
   };

   var getItems = function () {
      var items = [];
      var i;

      for (i = 0; i < 5; i++) {
         items.push(
            new entity.Model({
               rawData: getRawData(i),
               keyProperty: 'id'
            })
         );
      }

      return items;
   };

   describe('Controls/_lookupPopup/Container', function () {
      it('_beforeUnmount', () => {
         const container = new LookupPopupContainer();

         container._loadingIndicatorId = 'testId';
         container._beforeUnmount();

         expect(container._loadingIndicatorId).toBeNull();
      });

      it('_private::getInitialSelectedItems', () => {
         const self = {};
         self._selectedKeys = [1];
         const options = {
            selectedItems: new collection.List({ items: getItems() }),
            _dataOptionsValue: {
               keyProperty: 'id'
            }
         };

         expect(
            LookupPopupContainer._private.getInitialSelectedItems(self, options).getCount()
         ).toEqual(1);
      });

      it('getFilteredItems', function () {
         var items = ['toRemoveItem', 'toSaveItem', 'toSaveItem'];
         var filterFunc = function (item) {
            return item !== 'toRemoveItem';
         };
         var retTrue = function () {
            return true;
         };

         expect(LookupPopupContainer._private.getFilteredItems(items, retTrue)).toEqual(items);
         expect(LookupPopupContainer._private.getFilteredItems(items, filterFunc)).toEqual([
            'toSaveItem',
            'toSaveItem'
         ]);
      });

      it('getKeysByItems', function () {
         expect(LookupPopupContainer._private.getKeysByItems(getItems(), 'id')).toEqual([
            0, 1, 2, 3, 4
         ]);
      });

      it('getEmptyItems', function () {
         var listWithItems = new collection.List({ items: getItems() });

         expect(LookupPopupContainer._private.getEmptyItems(listWithItems).getCount()).toEqual(0);
         expect(LookupPopupContainer._private.getEmptyItems(listWithItems)._moduleName).toEqual(
            'Types/collection:List'
         );
      });

      it('getValidSelectionType', function () {
         expect(LookupPopupContainer._private.getValidSelectionType('all')).toEqual('all');
         expect(LookupPopupContainer._private.getValidSelectionType('leaf')).toEqual('leaf');
         expect(LookupPopupContainer._private.getValidSelectionType('node')).toEqual('node');
         expect(LookupPopupContainer._private.getValidSelectionType('test')).toEqual('all');
      });

      it('getFilterFunction', function () {
         var retFalse = function () {
            return false;
         };

         expect(LookupPopupContainer._private.getFilterFunction()()).toBe(true);
         expect(LookupPopupContainer._private.getFilterFunction(retFalse)()).toBe(false);
      });

      it('getSelectedKeys', function () {
         var options = {
            selectionFilter: function (item) {
               var id = item.get('id');
               return id !== 1 && id !== 3;
            },
            _dataOptionsValue: {
               keyProperty: 'id'
            }
         };

         options.selectedItems = new collection.List({ items: getItems() });
         options.selectedItems.at(0).set('id', 'testId');
         expect(LookupPopupContainer._private.getSelectedKeys(options)).toEqual(['testId', 2, 4]);

         options.selectedItems = null;
         options.selectedKeys = ['testId'];
         expect(LookupPopupContainer._private.getSelectedKeys(options)).toEqual(['testId']);
      });

      describe('prepareFilter', () => {
         let filter, source;

         beforeEach(() => {
            source = new sourceLib.Memory();
            filter = {
               searchParam: 'test',
               parent: 123
            };
         });

         it('searchParam and parentProperty are deleted from filter on select', () => {
            const selection = operations.selectionToRecord(
               { selected: [1, 2], excluded: [3, 4] },
               source.getAdapter()
            );
            const preparedFilter = LookupPopupContainer._private.prepareFilter({
               filter,
               selection,
               searchParam: 'searchParam',
               parentProperty: 'parent'
            });

            expect(preparedFilter.selection.get('marked')).toEqual(['1', '2']);
            expect(preparedFilter.selection.get('excluded')).toEqual(['3', '4']);
            expect(preparedFilter !== filter).toBe(true);
            expect(!preparedFilter.searchParam).toBe(true);
            expect(!preparedFilter.parent).toBe(true);
         });

         it('searchParam not deleted from filter on select all', () => {
            const selection = operations.selectionToRecord(
               { selected: [null], excluded: [null] },
               source.getAdapter()
            );
            const preparedFilter = LookupPopupContainer._private.prepareFilter({
               filter,
               selection,
               searchParam: 'searchParam'
            });
            expect(preparedFilter.selection.get('marked')).toEqual([null]);
            expect(preparedFilter.selection.get('excluded')).toEqual([null]);
            expect(preparedFilter !== filter).toBe(true);
            expect(preparedFilter.searchParam === 'test').toBe(true);
         });

         it('searchParam not deleted from filter on select all in hierarchy list', () => {
            let selection = operations.selectionToRecord(
               { selected: ['testRoot'], excluded: [null] },
               source.getAdapter()
            );
            let preparedFilter = LookupPopupContainer._private.prepareFilter({
               filter,
               selection,
               searchParam: 'searchParam',
               root: 'testRoot'
            });
            expect(preparedFilter.searchParam === 'test').toBe(true);

            selection = operations.selectionToRecord(
               { selected: [1], excluded: [null] },
               source.getAdapter()
            );
            preparedFilter = LookupPopupContainer._private.prepareFilter({
               filter,
               selection,
               searchParam: 'searchParam',
               root: 1
            });
            expect(preparedFilter.searchParam === 'test').toBe(true);
         });

         it('entries and selectionWithPath are deleted from filter on select', () => {
            filter = {
               searchParam: 'test',
               parent: 123,
               entries: [],
               selectionWithPath: []
            };
            source = new sourceLib.Memory();
            const selection = operations.selectionToRecord(
               { selected: [1, 2], excluded: [3, 4] },
               source.getAdapter()
            );
            const preparedFilter = LookupPopupContainer._private.prepareFilter({
               filter,
               selection,
               searchParam: 'searchParam',
               parentProperty: 'parent'
            });
            expect(preparedFilter.entries).not.toBeDefined();
            expect(preparedFilter.selectionWithPath).not.toBeDefined();
         });

         it('prepare filter with selected node and searchParam', () => {
            const selection = operations.selectionToRecord(
               { selected: [1, 2], excluded: [3, 4] },
               source.getAdapter()
            );
            const items = new collection.RecordSet({
               rawData: [
                  {
                     id: 1,
                     isNode: true
                  }
               ]
            });
            const preparedFilter = LookupPopupContainer._private.prepareFilter({
               filter,
               selection,
               searchParam: 'searchParam',
               root: 1,
               nodeProperty: 'isNode',
               items
            });
            expect(preparedFilter.searchParam).toEqual('test');
         });

         it('prepare filter with selected node and searchParam, selectionType is node', () => {
            const selection = operations.selectionToRecord(
               { selected: [1, 2], excluded: [3, 4] },
               source.getAdapter()
            );
            const items = new collection.RecordSet({
               rawData: [
                  {
                     id: '1',
                     isNode: true
                  }
               ]
            });
            const preparedFilter = LookupPopupContainer._private.prepareFilter({
               filter,
               selection,
               searchParam: 'searchParam',
               root: 'testRoot',
               nodeProperty: 'isNode',
               items,
               selectionType: 'node'
            });
            expect(preparedFilter.searchParam).not.toBeDefined();
         });
      });

      it('prepareResult', function () {
         var result = 'result';
         var selectedKeys = [];
         var keyProperty = 'id';
         var selectCompleteInitiator = true;

         expect(
            LookupPopupContainer._private.prepareResult(
               result,
               selectedKeys,
               keyProperty,
               selectCompleteInitiator
            )
         ).toEqual({
            resultSelection: result,
            initialSelection: selectedKeys,
            keyProperty: keyProperty,
            selectCompleteInitiator: selectCompleteInitiator
         });
      });

      it('getCrudWrapper', function () {
         var source = new sourceLib.Memory();
         var crudWrapper = LookupPopupContainer._private.getCrudWrapper(source);

         expect(['Controls/dataSource:CrudWrapper', 'Controls/_dataSource/CrudWrapper']).toContain(
            crudWrapper._moduleName
         );
      });

      it('_selectedKeysChanged', function () {
         let container = new LookupPopupContainer();
         let eventFired = false;

         container._notify = (e) => {
            if (e === 'selectedKeysChanged') {
               eventFired = true;
            }
         };

         container._selectedKeysChanged();
         expect(eventFired).toBe(true);
      });

      it('_excludedKeysChanged', function () {
         let container = new LookupPopupContainer();
         let eventFired = false;

         container._notify = (e) => {
            if (e === 'excludedKeysChanged') {
               eventFired = true;
            }
         };

         container._excludedKeysChanged();
         expect(eventFired).toBe(true);
      });

      it('_private::prepareRecursiveSelection', () => {
         let items = new collection.RecordSet({
            rawData: [
               {
                  id: 0,
                  parent: null,
                  '@parent': false
               },
               {
                  id: 1,
                  parent: null,
                  '@parent': true
               },
               {
                  id: 2,
                  parent: null,
                  '@parent': true
               },
               {
                  id: 3,
                  parent: 2,
                  '@parent': false
               },
               {
                  id: 4,
                  parent: 2,
                  '@parent': false
               }
            ],
            keyProperty: 'id'
         });
         let selection = {
            selected: [0, 1, 2, 'notInRecordSet'],
            excluded: [3]
         };

         let preparedSelection = LookupPopupContainer._private.prepareNotRecursiveSelection(
            selection,
            items,
            'id',
            'parent',
            '@parent'
         );

         expect(preparedSelection).toEqual({
            selected: [0, 1, 2, 'notInRecordSet'],
            excluded: [3, 2]
         });
      });

      it('_private::prepareRecursiveSelection for all selected', () => {
         let items = new collection.RecordSet({
            rawData: [
               {
                  id: 0,
                  parent: null,
                  '@parent': false
               },
               {
                  id: 1,
                  parent: null,
                  '@parent': true
               },
               {
                  id: 2,
                  parent: null,
                  '@parent': true
               },
               {
                  id: 3,
                  parent: 2,
                  '@parent': false
               },
               {
                  id: 4,
                  parent: 2,
                  '@parent': false
               }
            ],
            keyProperty: 'id'
         });
         let selection = {
            selected: [null],
            excluded: [null, 3]
         };

         let preparedSelection = LookupPopupContainer._private.prepareNotRecursiveSelection(
            selection,
            items,
            'id',
            'parent',
            '@parent',
            null
         );

         expect(preparedSelection).toEqual({
            selected: [null, 2],
            excluded: [null, 3, 2]
         });
      });

      it('_private::getSelection', () => {
         let selectionType = 'invalidSelectionType';
         let selection = {
            selected: [1, 2, 3],
            excluded: [1]
         };
         let adapter = new sourceLib.Memory().getAdapter();
         let selectionRecord = LookupPopupContainer._private.getSelection(
            selection,
            adapter,
            selectionType,
            false
         );

         expect(selectionRecord.getRawData()).toEqual({
            marked: ['1', '2', '3'],
            excluded: ['1'],
            type: 'all',
            recursive: false
         });

         selectionType = 'node';
         selectionRecord = LookupPopupContainer._private.getSelection(
            selection,
            adapter,
            selectionType,
            true
         );
         expect(selectionRecord.getRawData()).toEqual({
            marked: ['1', '2', '3'],
            excluded: ['1'],
            type: 'node',
            recursive: true
         });
      });

      describe('_selectComplete', function () {
         const getContainer = () => {
            let container = new LookupPopupContainer(),
               items = getItems(),
               recordSet = new collection.List({ items: items });

            container.saveOptions({
               recursiveSelection: true,
               selectionLoadMode: true,
               _dataOptionsValue: {
                  source: new sourceLib.Memory(),
                  items: recordSet,
                  filter: {}
               }
            });

            recordSet.getRecordById = function (id) {
               return items[id];
            };

            container._selectedKeys = [];
            container._excludedKeys = [];

            container._notify = function (eventName, result) {
               if (eventName === 'selectionLoad') {
                  container.isSelectionLoad = true;
                  container.loadDef = result[0];
               }
            };
            return container;
         };

         it('selected keys is empty', async function () {
            let container = getContainer();
            let clearRecordSet = new collection.List({
               items: getItems().slice()
            });

            clearRecordSet.clear();
            container._selectComplete();

            expect(container.isSelectionLoad).toBe(true);

            const result = await container.loadDef;

            expect(result.resultSelection.isEqual(clearRecordSet)).toEqual(true);
         });

         it('single select', async function () {
            let container = getContainer();
            container._selectedKeys = [1];
            container._selectCompleteInitiator = true;
            container._selectComplete();

            const result = await container.loadDef;

            expect(result.resultSelection.at(0).getRawData()).toEqual(getItems()[1].getRawData());

            container._selectCompleteInitiator = false;
            container._selectComplete();

            const result1 = await container.loadDef;

            expect(result1.resultSelection.getCount()).toEqual(0);
         });

         it('selectionLoadMode: false', async function () {
            let container = getContainer();
            container._selectedKeys = [1];
            container._options.selectionLoadMode = false;
            container._selectComplete();

            const result = await container.loadDef;

            expect(result.selection.get('marked')).toEqual(['1']);
         });

         it('multi select, check toggle indicator', async function () {
            let hideIndicatorParam,
               indicatorId = 'fw54dw54d46q46d5',
               isShowIndicator = false,
               isHideIndicator = false,
               container = getContainer(),
               loadDef;

            container._notify = function (eventName, result) {
               switch (eventName) {
                  case 'showIndicator':
                     isShowIndicator = true;
                     return indicatorId;

                  case 'hideIndicator':
                     isHideIndicator = true;
                     hideIndicatorParam = result[0];
                     break;

                  case 'selectionLoad':
                     loadDef = result[0];
                     break;
                  default:
                     break;
               }
            };
            container._selectedKeys = [1];
            container._options.multiSelect = true;
            container._selectComplete();

            expect(isShowIndicator).toBe(true);

            await loadDef;

            expect(isHideIndicator).toBe(true);
            expect(hideIndicatorParam).toEqual(indicatorId);
         });

         it('query returns error', async function () {
            let isIndicatorHidden = false;
            const container = getContainer();
            const source = new sourceLib.Memory();

            source.query = () => {
               return Promise.reject(new Error('testError'));
            };

            // здесь тест сознательно кидает ошибку, отключаем её обработку
            jest.spyOn(errorLib, 'process').mockImplementation();

            container._options._dataOptionsValue = {
               source: source,
               items: new collection.List(),
               filter: {}
            };

            container._notify = function (eventName) {
               if (eventName === 'hideIndicator') {
                  isIndicatorHidden = true;
               }
               if (eventName === 'showIndicator') {
                  isIndicatorHidden = false;
                  return 'testId';
               }
            };
            container._selectedKeys = [1, 2];
            container._options.multiSelect = true;
            await expect(container._selectComplete()).rejects.toThrow('testError');
            expect(isIndicatorHidden).toBe(true);

            expect(errorLib.process).toHaveBeenCalledTimes(1);
         });
      });
   });
});
