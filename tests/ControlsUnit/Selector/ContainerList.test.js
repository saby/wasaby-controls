define(['Controls/lookupPopup', 'Types/entity'], function (
   lookupPopup,
   entity
) {
   function getModel(id) {
      return new entity.Model({
         keyProperty: 'id',
         rawData: {
            id: id
         }
      });
   }

   describe('Controls/_lookupPopup/Container', function () {
      it('getItemActivateResult', function () {
         var itemKey;
         var selectedKeys = [1, 2, 3];

         itemKey = 4;
         expect(
            lookupPopup.ListContainer._private.getItemActivateResult(
               itemKey,
               selectedKeys,
               true
            )
         ).toEqual([[1, 2, 3, 4], [4], []]);

         itemKey = 1;
         expect(
            lookupPopup.ListContainer._private.getItemActivateResult(
               itemKey,
               selectedKeys,
               true
            )
         ).toEqual([[2, 3], [], [1]]);

         selectedKeys = [];
         itemKey = 1;
         expect(
            lookupPopup.ListContainer._private.getItemActivateResult(
               itemKey,
               selectedKeys,
               false
            )
         ).toEqual([[1], [1], []]);

         selectedKeys = [1];
         itemKey = 2;
         expect(
            lookupPopup.ListContainer._private.getItemActivateResult(
               itemKey,
               selectedKeys,
               false
            )
         ).toEqual([[2], [2], [1]]);

         selectedKeys = [2];
         itemKey = 2;
         expect(
            lookupPopup.ListContainer._private.getItemActivateResult(
               itemKey,
               selectedKeys,
               false
            )
         ).toEqual([[2], [], []]);
      });

      it('getMarkedKeyBySelectedKeys', function () {
         let selectedKeys = [1, 2, 3];
         expect(
            lookupPopup.ListContainer._private.getMarkedKeyBySelectedKeys(
               selectedKeys
            )
         ).toEqual(null);

         selectedKeys = [1];
         expect(
            lookupPopup.ListContainer._private.getMarkedKeyBySelectedKeys(
               selectedKeys
            )
         ).toEqual(1);
      });

      it('getSelectedKeysFromOptions', function () {
         let options = {
            selectedKeys: [1, 2, 3]
         };

         let optionsMultiSelect = {
            multiSelect: true,
            selectedKeys: [1, 2, 3]
         };

         expect(
            lookupPopup.ListContainer._private.getSelectedKeysFromOptions(
               options
            )
         ).toEqual([]);
         expect(
            lookupPopup.ListContainer._private.getSelectedKeysFromOptions(
               optionsMultiSelect
            )
         ).toEqual([1, 2, 3]);
      });

      it('getItemActions', function () {
         var options = {};

         var itemActionsEmpty = [];
         var itemActions = [{ id: 'test' }];

         options.itemActions = itemActionsEmpty;
         expect(
            lookupPopup.ListContainer._private.getItemActions({}, options)[0].id
         ).toEqual('selector.action');

         options.itemActions = itemActions;
         expect(
            lookupPopup.ListContainer._private.getItemActions({}, options)[0].id
         ).toEqual('test');
         expect(
            lookupPopup.ListContainer._private.getItemActions({}, options)[1].id
         ).toEqual('selector.action');

         options.selectionType = 'leaf';
         options.itemActions = itemActionsEmpty;
         expect(
            !!lookupPopup.ListContainer._private.getItemActions({}, options)[0]
         ).toBe(false);
         options.itemActions = itemActions;
         expect(
            lookupPopup.ListContainer._private.getItemActions({}, options)
               .length
         ).toEqual(1);
      });

      it('getItemActionVisibilityCallback', function () {
         var actionVisibility = true;
         var visibilityCallback = function (action, item, isEditing) {
            return actionVisibility || isEditing;
         };
         var itemNode = new entity.Model({
            keyProperty: 'id',
            rawData: {
               id: 'test',
               'Раздел@': true
            }
         });

         var itemLeaf = new entity.Model({
            keyProperty: 'id',
            rawData: {
               id: 'test',
               'Раздел@': false
            }
         });

         // Without user callback
         expect(
            lookupPopup.ListContainer._private.getItemActionVisibilityCallback(
               {}
            )({ id: 'test' })
         ).toBe(true);

         // With user callback
         expect(
            lookupPopup.ListContainer._private.getItemActionVisibilityCallback({
               itemActionVisibilityCallback: visibilityCallback
            })({ id: 'test' })
         ).toBe(true);
         actionVisibility = false;
         expect(
            !!lookupPopup.ListContainer._private.getItemActionVisibilityCallback(
               { itemActionVisibilityCallback: visibilityCallback }
            )({ id: 'test' })
         ).toBe(false);

         // With user callback and selector action
         actionVisibility = true;
         expect(
            !!lookupPopup.ListContainer._private.getItemActionVisibilityCallback(
               { itemActionVisibilityCallback: visibilityCallback }
            )({ id: 'test' }, itemNode)
         ).toBe(true);
         actionVisibility = false;
         expect(
            !!lookupPopup.ListContainer._private.getItemActionVisibilityCallback(
               { itemActionVisibilityCallback: visibilityCallback }
            )({ id: 'test' }, itemLeaf)
         ).toBe(false);
         actionVisibility = true;

         actionVisibility = false;
         expect(
            lookupPopup.ListContainer._private.getItemActionVisibilityCallback({
               itemActionVisibilityCallback: visibilityCallback
            })({ id: 'test' }, itemLeaf, true)
         ).toBe(true);

         expect(
            lookupPopup.ListContainer._private.getItemActionVisibilityCallback({
               itemActionVisibilityCallback: visibilityCallback,
               multiSelect: true,
               selectedKeys: [],
               selectionType: 'node'
            })({ id: 'selector.action' }, itemNode)
         ).toBe(true);
         expect(
            lookupPopup.ListContainer._private.getItemActionVisibilityCallback({
               itemActionVisibilityCallback: visibilityCallback,
               multiSelect: true,
               selectedKeys: ['test'],
               selectionType: 'node'
            })({ id: 'selector.action' }, itemNode)
         ).toBe(false);

         expect(
            lookupPopup.ListContainer._private.getItemActionVisibilityCallback({
               itemActionVisibilityCallback: visibilityCallback,
               multiSelect: true,
               selectedKeys: [],
               nodeProperty: 'Раздел@',
               selectionType: 'all'
            })({ id: 'selector.action' }, itemLeaf)
         ).toBe(false);
         expect(
            lookupPopup.ListContainer._private.getItemActionVisibilityCallback({
               itemActionVisibilityCallback: visibilityCallback,
               multiSelect: true,
               selectedKeys: ['test'],
               nodeProperty: 'Раздел@',
               selectionType: 'all'
            })({ id: 'selector.action' }, itemLeaf)
         ).toBe(false);
      });

      it('itemActivate', function () {
         const self = {
            _options: {
               keyProperty: 'id'
            }
         };
         let selectCompleted = false;
         let clickSelection = false;
         let isByItemActivate = false;
         let excludedKeysChanged = false;
         let selectedItem;

         self._notify = function (eventName, args) {
            if (eventName === 'listSelectedKeysChanged') {
               clickSelection = true;
            }
            if (eventName === 'listExcludedKeysChanged') {
               excludedKeysChanged = true;
            }
            if (eventName === 'selectComplete') {
               selectCompleted = true;
               isByItemActivate = args[1];
            }
         };

         selectedItem = getModel('test');
         self._options.selectedKeys = [];
         self._options.multiSelect = false;
         lookupPopup.ListContainer._private.itemActivate(self, selectedItem);
         expect(selectCompleted).toBe(true);
         expect(clickSelection).toBe(true);
         expect(isByItemActivate).toBe(true);

         selectCompleted = false;
         clickSelection = false;
         self._options.selectedKeys = [];
         self._options.multiSelect = true;
         lookupPopup.ListContainer._private.itemActivate(self, selectedItem);
         expect(selectCompleted).toBe(true);
         expect(clickSelection).toBe(true);

         selectCompleted = false;
         clickSelection = false;
         self._options.selectedKeys = [1];
         self._options.multiSelect = true;
         lookupPopup.ListContainer._private.itemActivate(self, selectedItem);
         expect(clickSelection).toBe(true);
         expect(selectCompleted).toBe(false);

         self._options.selectedKeys = [null];
         self._options.excludedKeys = [];
         self._options.multiSelect = true;
         lookupPopup.ListContainer._private.itemActivate(self, selectedItem);
         expect(excludedKeysChanged).toBe(true);
      });

      it('_itemActivate handler', function () {
         var listContainer = new lookupPopup.ListContainer();
         var selectedKeys = [];
         var options = {
            keyProperty: 'id',
            multiSelect: false,
            nodeProperty: 'Раздел@',
            selectedKeys: selectedKeys
         };
         var selectCompleted = false;
         var selectedItem = new entity.Model({
            keyProperty: 'id',
            rawData: {
               id: 'test',
               'Раздел@': false
            }
         });
         var otherSelectedItem = new entity.Model({
            keyProperty: 'id',
            rawData: {
               id: 'test1',
               'Раздел@': false
            }
         });

         listContainer.saveOptions(options);
         listContainer._notify = function (event, result) {
            if (event === 'selectComplete') {
               selectCompleted = true;
            }
            if (event === 'listSelectedKeysChanged') {
               selectedKeys = result[1];
            }
         };

         listContainer._itemActivate(null, selectedItem);

         expect(selectedKeys.length).toEqual(1);
         expect(selectedKeys[0]).toEqual('test');
         expect(selectCompleted).toBe(true);

         selectCompleted = false;
         listContainer._itemActivate(null, otherSelectedItem);

         expect(selectedKeys.length).toEqual(1);
         expect(selectedKeys[0]).toEqual('test1');
         expect(selectCompleted).toBe(true);
      });

      describe('_itemActivate handler', () => {
         const options = {
            keyProperty: 'id',
            multiSelect: false,
            nodeProperty: 'node',
            selectedKeys: []
         };

         let listContainer;
         let selectedKeys;

         beforeEach(() => {
            listContainer = new lookupPopup.ListContainer();
            listContainer._notify = function (event, result) {
               if (event === 'listSelectedKeysChanged') {
                  selectedKeys = result[1];
               }
            };
         });

         afterEach(() => {
            selectedKeys = [];
         });

         describe('selectionType=all', () => {
            beforeEach(() => {
               listContainer.saveOptions({ ...options, selectionType: 'all' });
            });

            it('should select node', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: true
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });

            it('should select hiddenNode', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: false
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });

            it('should select leaf', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: null
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });
         });

         describe('selectionType=allBySelectAction', () => {
            beforeEach(() => {
               listContainer.saveOptions({
                  ...options,
                  selectionType: 'allBySelectAction'
               });
            });

            it('should select node', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: true
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });

            it('should select hiddenNode', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: false
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });

            it('should select leaf', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: null
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });
         });

         describe('selectionType=node', () => {
            beforeEach(() => {
               listContainer.saveOptions({ ...options, selectionType: 'node' });
            });

            it('should select node', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: true
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });

            it('should select hiddenNode', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: false
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });

            it('should not select leaf', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: null
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual(undefined);
            });
         });

         describe('selectionType=leaf', () => {
            beforeEach(() => {
               listContainer.saveOptions({ ...options, selectionType: 'leaf' });
            });

            it('should not select node', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: true
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual(undefined);
            });

            it('should select hiddenNode', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: false
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });

            it('should select leaf', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: null
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });
         });

         describe('selectionType=leaf and onlyLeaf=true', () => {
            beforeEach(() => {
               listContainer.saveOptions({
                  ...options,
                  selectionType: 'leaf',
                  onlyLeaf: true
               });
            });

            it('should not select node', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: true
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual(undefined);
            });

            it('should not select hiddenNode', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: false
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual(undefined);
            });

            it('should select leaf', () => {
               const item = new entity.Model({
                  keyProperty: 'id',
                  rawData: {
                     id: 'test1',
                     node: null
                  }
               });

               listContainer._itemActivate(null, item);

               expect(selectedKeys[0]).toEqual('test1');
            });
         });
      });

      it('_beforeMount', () => {
         const listContainer = new lookupPopup.ListContainer();
         let options = {
            multiSelect: true,
            selectedKeys: [1, 2, 3]
         };

         listContainer._beforeMount(options);
         expect(listContainer._selectedKeys).toEqual([1, 2, 3]);
         expect(listContainer._markedKey).toEqual(null);

         options.selectedKeys = [1];
         listContainer._beforeMount(options);
         expect(listContainer._selectedKeys).toEqual([1]);
         expect(listContainer._markedKey).toEqual(1);

         options.multiSelect = false;
         listContainer._beforeMount(options);
         expect(listContainer._selectedKeys).toEqual([]);
         expect(listContainer._markedKey).toEqual(1);
      });
   });
});
