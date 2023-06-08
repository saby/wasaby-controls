define([
   'Controls/_filterPopup/SimplePanel/DropdownViewModel',
   'Types/collection',
   'Types/entity',
   'Controls/list',
   'Core/core-clone'
], (DropdownViewModel, collectionLib, entity, list, clone) => {
   describe('DropdownViewModel', () => {
      let rs = new collectionLib.RecordSet({
         keyProperty: 'id',
         rawData: [
            {
               id: '1',
               title: 'Запись 1',
               parent: null,
               '@parent': true
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
               '@parent': true
            },
            {
               id: '4',
               title: 'Запись 4',
               parent: '1',
               '@parent': true,
               additional: true
            },
            {
               id: '5',
               title: 'Запись 5',
               parent: '4',
               '@parent': false
            },
            {
               id: '6',
               title: 'Запись 6',
               parent: '4',
               '@parent': false,
               additional: true
            },
            {
               id: '7',
               title: 'Запись 7',
               parent: '3',
               '@parent': true,
               additional: true
            },
            {
               id: '8',
               title: 'Запись 8',
               parent: '7',
               '@parent': false,
               additional: true
            }
         ]
      });
      const rs2 = new collectionLib.RecordSet({
         keyProperty: 'id',
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
      });

      let config = {
         items: rs,
         keyProperty: 'id',
         parentProperty: 'parent',
         nodeProperty: '@parent',
         selectedKeys: ['3'],
         itemPadding: {},
         rootKey: null
      };
      const config2 = {
         items: rs2,
         keyProperty: 'id',
         parentProperty: 'parent',
         nodeProperty: '@parent',
         selectedKeys: '3',
         rootKey: null
      };

      let viewModel = new DropdownViewModel(config);
      let viewModel2 = new DropdownViewModel(config2);

      function setViewModelItems(model, items) {
         model.setItems({ items: items });
      }

      it('should pass correct displayProperty to ItemsViewModel', () => {
         const cfg = {
            items: rs,
            keyProperty: 'id',
            parentProperty: 'parent',
            nodeProperty: '@parent',
            selectedKeys: '3',
            displayProperty: 'test',
            rootKey: null
         };
         const model = new DropdownViewModel(cfg);

         expect(model._itemsModel._options.displayProperty).toEqual('test');
      });

      it('check hier items collection', () => {
         expect(viewModel._itemsModel._display.getCount()).toEqual(8);
      });

      it('check empty hierarchy', () => {
         var version = viewModel.getVersion();
         viewModel._options.nodeProperty = null;
         viewModel.setFilter(viewModel.getDisplayFilter());
         expect(viewModel.getVersion() > version).toBe(true);
         expect(viewModel._itemsModel._display.getCount()).toEqual(8);
      });

      it("parentProperty is set but items don't have it", () => {
         viewModel2.setFilter(viewModel2.getDisplayFilter());
         expect(viewModel2._itemsModel._display.getCount()).toEqual(3);
      });

      it('check additional', () => {
         viewModel._options.nodeProperty = null;
         viewModel._options.additionalProperty = 'additional';
         viewModel.setFilter(viewModel.getDisplayFilter());
         expect(viewModel._itemsModel._display.getCount()).toEqual(4);
      });

      it('check additional and hierarchy', () => {
         viewModel._options.additionalProperty = 'additional';
         viewModel._options.nodeProperty = '@parent';
         viewModel.setFilter(viewModel.getDisplayFilter());
         expect(viewModel._itemsModel._display.getCount()).toEqual(4);
      });

      it('items count', () => {
         expect(viewModel._itemsModel._display.getCount()).toEqual(4);
         expect(viewModel._options.items.getCount()).toEqual(8);
      });

      it('check current item data', () => {
         viewModel.reset();
         viewModel.goToNext();
         viewModel.goToNext();
         let current = viewModel.getCurrent();
         let checkData =
            current._isSelected &&
            current.hasChildren &&
            current.item.get(config.keyProperty) === '3' &&
            viewModel.isEnd();
         expect(checkData).toBe(true);
      });

      it('_private::updateSelection', function () {
         let configSelection = clone(config);
         configSelection.selectedKeys = ['1', '3', '5'];
         let expectedKeys = ['1', '3', '5', '6'];
         let viewModelSelection = new DropdownViewModel(configSelection);
         viewModelSelection.updateSelection(rs.at(5));
         expect(viewModelSelection.getSelectedKeys()).toEqual(expectedKeys);

         expectedKeys = ['1', '3', '5', '6', '2'];
         viewModelSelection.updateSelection(rs.at(1));
         expect(viewModelSelection.getSelectedKeys()).toEqual(expectedKeys);

         expectedKeys = ['1', '3', '5', '6'];
         viewModelSelection.updateSelection(rs.at(1));
         expect(viewModelSelection.getSelectedKeys()).toEqual(expectedKeys);

         expectedKeys = ['1'];
         viewModelSelection._options.selectedKeys = [null];
         viewModelSelection.updateSelection(rs.at(0));
         expect(viewModelSelection.getSelectedKeys()).toEqual(expectedKeys);

         expectedKeys = [null];
         viewModelSelection._options.selectedKeys = ['1'];
         viewModelSelection.updateSelection(rs.at(0));
         expect(viewModelSelection.getSelectedKeys()).toEqual(expectedKeys);
      });

      it('_isItemSelected', function () {
         let configSelection = clone(config);
         configSelection.selectedKeys = [[1]];
         let viewModelSelection = new DropdownViewModel(configSelection);
         let item = new entity.Model({
            rawData: { id: [1], title: 'Id is array' }
         });
         let isSelected = viewModelSelection._isItemSelected(item);
         expect(isSelected).toBe(true);

         item.set('id', [2]);
         isSelected = viewModelSelection._isItemSelected(item);
         expect(isSelected).toBe(false);

         viewModelSelection._options.selectedKeys = [1, 2];
         item.set('id', 1);
         isSelected = viewModelSelection._isItemSelected(item);
         expect(isSelected).toBe(true);

         item.set('id', 12);
         isSelected = viewModelSelection._isItemSelected(item);
         expect(isSelected).toBe(false);
      });

      describe('Groups and separator', function () {
         let newConfig = {
            keyProperty: 'id'
         };
         newConfig.groupingKeyCallback = function (item) {
            if (item.get('group') === 'hidden' || !item.get('group')) {
               return list.groupConstants.hiddenGroup;
            }
            return item.get('group');
         };
         newConfig.items = new collectionLib.RecordSet({
            keyProperty: 'id',
            rawData: [
               {
                  id: '1',
                  title: 'Запись 1',
                  parent: null,
                  '@parent': false,
                  recent: true
               },
               {
                  id: '2',
                  title: 'Запись 2',
                  parent: null,
                  '@parent': false,
                  pinned: true
               },
               {
                  id: '3',
                  title: 'Запись 3',
                  parent: null,
                  '@parent': false
               },
               {
                  id: '4',
                  title: 'Запись 4',
                  parent: null,
                  '@parent': false,
                  group: 'group_2'
               },
               {
                  id: '5',
                  title: 'Запись 5',
                  parent: null,
                  '@parent': false,
                  group: 'group_1'
               },
               {
                  id: '6',
                  title: 'Запись 6',
                  parent: null,
                  '@parent': false,
                  group: 'group_1'
               },
               {
                  id: '7',
                  title: 'Запись 7',
                  parent: null,
                  '@parent': false,
                  group: 'group_2'
               },
               {
                  id: '8',
                  title: 'Запись 8',
                  parent: null,
                  '@parent': false,
                  group: 'group_2'
               }
            ]
         });

         let viewModel3 = new DropdownViewModel(newConfig);
         viewModel3._options.additionalProperty = null;
         viewModel3._options.nodeProperty = '@parent';
         it('groupItems', function () {
            expect(viewModel3.getCurrent().isHiddenGroup).toBe(true);
            expect(viewModel3._itemsModel._display.getCount()).toEqual(11);
            expect(viewModel3._itemsModel._display.at(9).getContents().get('group')).toEqual(
               'group_1'
            );
            expect(viewModel3._itemsModel._display.at(10).getContents().get('group')).toEqual(
               'group_1'
            );
         });
         it('historySeparator', function () {
            viewModel3.goToNext();
            expect(
               DropdownViewModel._private.needToDrawSeparator(
                  viewModel3._itemsModel.getCurrent().item,
                  viewModel3._itemsModel.getNext().item
               )
            ).toBe(false);
            viewModel3.goToNext();
            expect(
               DropdownViewModel._private.needToDrawSeparator(
                  viewModel3._itemsModel.getCurrent().item,
                  viewModel3._itemsModel.getNext().item
               )
            ).toBe(true);
            let hasParent = true;
            expect(
               DropdownViewModel._private.needToDrawSeparator(
                  viewModel3._itemsModel.getCurrent().item,
                  viewModel3._itemsModel.getNext().item,
                  hasParent
               )
            ).toBe(false);
         });
         it('needHideGroup', function () {
            let groupItems = {
               empty: [],
               notEmpty: ['test']
            };
            // eslint-disable-next-line consistent-this
            let self = {
               _options: {
                  parentProperty: 'parent',
                  nodeProperty: 'node',
                  rootKey: '1'
               },
               _itemsModel: {
                  _display: {
                     getGroupItems: function (key) {
                        return groupItems[key];
                     }
                  }
               },
               getItems: () => {
                  return new collectionLib.RecordSet({
                     keyProperty: 'id',
                     rawData: [{ id: '1' }, { id: '2' }]
                  });
               }
            };

            expect(DropdownViewModel._private.needHideGroup(self, 'empty')).toBe(true);
            expect(DropdownViewModel._private.needHideGroup(self, 'notEmpty')).toBe(false);

            self.getItems = () => {
               return new collectionLib.RecordSet({
                  keyProperty: 'id',
                  rawData: [{ id: '1', parent: '1' }]
               });
            };
            expect(DropdownViewModel._private.needHideGroup(self, 'notEmpty')).toBe(true);
         });
      });

      it('isGroupNext', function () {
         let newConfig = {
            keyProperty: 'id',
            items: new collectionLib.RecordSet({
               keyProperty: 'id',
               rawData: [
                  { id: 'first', title: 'Запись 1', group: '1' },
                  { id: 'second', title: 'Запись 2', group: '1' },
                  { id: 'third', title: 'Запись 3', group: '2' },
                  { id: 'fourth', title: 'Запись 4', group: '2' }
               ]
            })
         };
         newConfig.groupingKeyCallback = (item) => {
            return item.get('group');
         };
         let model = new DropdownViewModel(newConfig);
         expect(model.isGroupNext()).toBe(false);
         model.goToNext();
         expect(model.isGroupNext()).toBe(false);
         model.goToNext();
         expect(model.isGroupNext()).toBe(true);
         model.goToNext();
         expect(model.isGroupNext()).toBe(false);
      });

      it('getCurrent', function () {
         let curConfig = clone(config);
         curConfig.hasIconPin = true;

         const getItem = () => {
            let ddlViewModel = new DropdownViewModel(curConfig);
            return ddlViewModel.getCurrent();
         };
         let item = getItem();
         expect(item.hasPinned).toBe(false);

         curConfig.items.at(0).set('pinned', false);
         item = getItem();
         expect(item.hasPinned).toBe(true);
      });

      it('_private.getSpacingClassList', () => {
         const options = {
            itemPadding: {},
            multiSelect: true
         };
         let itemData = {
               emptyText: 'test',
               item: {
                  get: () => {
                     return false;
                  }
               }
            },
            hasHierarchy = false;
         let expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__emptyItem-leftPadding_multiSelect controls-SimplePanel-List__item-rightPadding_default';
         let classList = DropdownViewModel._private.getClassList(options, itemData, hasHierarchy);
         expect(classList).toEqual(expectedClassList);

         options.multiSelect = false;
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_default controls-SimplePanel-List__item-rightPadding_default';
         classList = DropdownViewModel._private.getClassList(options, itemData, hasHierarchy);
         expect(classList).toEqual(expectedClassList);

         options.multiSelect = false;
         options.itemPadding.left = 's';
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_s controls-SimplePanel-List__item-rightPadding_default';
         classList = DropdownViewModel._private.getClassList(options, itemData, hasHierarchy);
         expect(classList).toEqual(expectedClassList);

         hasHierarchy = true;
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_s controls-SimplePanel-List__item-rightPadding_hierarchy';
         classList = DropdownViewModel._private.getClassList(options, itemData, hasHierarchy);
         expect(classList).toEqual(expectedClassList);

         itemData.hasClose = true;
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_s controls-SimplePanel-List__item-rightPadding_close';
         classList = DropdownViewModel._private.getClassList(options, itemData, hasHierarchy);
         expect(classList).toEqual(expectedClassList);

         itemData.hasPinned = true;
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_s controls-SimplePanel-List__item-rightPadding_history';
         classList = DropdownViewModel._private.getClassList(options, itemData, hasHierarchy);
         expect(classList).toEqual(expectedClassList);

         options.hasApplyButton = true;
         itemData = {
            item: {
               get: () => {
                  return false;
               }
            },
            index: 1
         };
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_s controls-SimplePanel-List__item-rightPadding_default';
         classList = DropdownViewModel._private.getClassList(options, itemData, false);
         expect(classList).toEqual(expectedClassList);

         options.hasApplyButton = false;
         itemData = {
            item: {
               get: () => {
                  return false;
               }
            }
         };
         hasHierarchy = false;
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_s controls-SimplePanel-List__item-rightPadding_default';
         classList = DropdownViewModel._private.getClassList(options, itemData, hasHierarchy);
         expect(classList).toEqual(expectedClassList);

         itemData = {
            item: {
               get: () => {
                  return false;
               }
            }
         };
         options.itemPadding.right = 'm';
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_s controls-SimplePanel-List__item-rightPadding_m';
         classList = DropdownViewModel._private.getClassList(options, itemData);
         expect(classList).toEqual(expectedClassList);
      });

      it('_private.isHistoryItem', () => {
         var historyItem = new entity.Model({
            rawData: {
               pinned: true
            }
         });
         var simpleItem = new entity.Model({
            rawData: {
               any: 'any'
            }
         });

         expect(!!DropdownViewModel._private.isHistoryItem(historyItem)).toBe(true);
         expect(!!DropdownViewModel._private.isHistoryItem(simpleItem)).toBe(false);
      });

      it('_private.filterAdditional', () => {
         var selfWithAdditionalProperty = {
            _options: {
               additionalProperty: 'additionalProperty'
            }
         };
         var simpleSelf = {
            _options: {}
         };

         var itemWithAdditionalProperty = new entity.Model({
            rawData: {
               additionalProperty: true
            }
         });
         var historyItem = new entity.Model({
            rawData: {
               pinned: true,
               additionalProperty: false
            }
         });
         var simpleItem = new entity.Model({
            rawData: {
               any: 'any'
            }
         });

         expect(
            !!DropdownViewModel._private.filterAdditional.call(
               selfWithAdditionalProperty,
               itemWithAdditionalProperty
            )
         ).toBe(false);
         expect(
            !!DropdownViewModel._private.filterAdditional.call(
               selfWithAdditionalProperty,
               historyItem
            )
         ).toBe(true);
         expect(
            !!DropdownViewModel._private.filterAdditional.call(
               selfWithAdditionalProperty,
               simpleItem
            )
         ).toBe(true);

         expect(
            !!DropdownViewModel._private.filterAdditional.call(
               simpleSelf,
               itemWithAdditionalProperty
            )
         ).toBe(true);
         expect(!!DropdownViewModel._private.filterAdditional.call(simpleSelf, historyItem)).toBe(
            true
         );
         expect(!!DropdownViewModel._private.filterAdditional.call(simpleSelf, simpleItem)).toBe(
            true
         );
      });

      it('destroy', () => {
         viewModel.destroy();
         expect(null).toEqual(viewModel._itemsModel._options);
      });

      it('hasAdditional', () => {
         var model = new DropdownViewModel(config);
         var version = model.getVersion();
         model._options.additionalProperty = 'additional';
         setViewModelItems(model, rs);
         expect(model.getVersion() === version).toBe(true);
         expect(!!model.hasAdditional()).toBe(true);
         version = model.getVersion();
         setViewModelItems(model, rs2);
         expect(model.getVersion() > version).toBe(true);
         expect(!!model.hasAdditional()).toBe(false);

         version = model.getVersion();
         model.setRootKey('test');
         expect(model.getVersion() > version).toBe(true);
         setViewModelItems(model, rs);
         expect(!!model.hasAdditional()).toBe(false);
         setViewModelItems(model, rs2);
         expect(!!model.hasAdditional()).toBe(false);

         model.setRootKey(null);
         expect(model.getVersion() > version).toBe(true);
         model._options.additionalProperty = '';
         setViewModelItems(model, rs);
         expect(!!model.hasAdditional(rs)).toBe(false);
         setViewModelItems(model, rs2);
         expect(!!model.hasAdditional(rs2)).toBe(false);
      });

      it('getEmptyItem', function () {
         const getEmpty = (empConfig) => {
            viewModel = new DropdownViewModel(empConfig);
            return viewModel.getEmptyItem();
         };

         let emptyConfig = clone(config);
         emptyConfig.emptyText = 'Не выбрано';
         emptyConfig.displayProperty = 'title';
         let emptyItem = getEmpty(emptyConfig);
         expect(emptyItem._isSelected).toBe(false);
         expect(emptyItem.emptyText).toEqual(emptyConfig.emptyText);

         emptyConfig.selectedKeys = [];
         emptyItem = getEmpty(emptyConfig);
         expect(emptyItem._isSelected).toBe(true);
         expect(emptyItem.emptyText).toEqual(emptyConfig.emptyText);

         emptyConfig.selectedKeys = ['100'];
         emptyConfig.emptyKey = '100';
         emptyItem = getEmpty(emptyConfig);
         expect(emptyItem._isSelected).toBe(true);
         expect(emptyItem.emptyText).toEqual(emptyConfig.emptyText);

         emptyConfig.emptyKey = 0;
         emptyItem = getEmpty(emptyConfig);
         expect(emptyItem.item.get('id')).toEqual(0);

         // spacingClassList
         let expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__item-leftPadding_default ' +
            'controls-SimplePanel-List__item-rightPadding_default';
         expect(emptyItem.itemClassList).toEqual(expectedClassList);

         emptyConfig.multiSelect = true;
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__emptyItem-leftPadding_multiSelect controls-SimplePanel-List__item-rightPadding_default';
         emptyItem = getEmpty(emptyConfig);
         expect(emptyItem.itemClassList).toEqual(expectedClassList);

         emptyConfig.hasClose = true;
         expectedClassList =
            'controls-SimplePanel-List__row_state_default ' +
            'controls-SimplePanel-List__emptyItem-leftPadding_multiSelect controls-SimplePanel-List__item-rightPadding_close';
         emptyItem = getEmpty(emptyConfig);
         expect(emptyItem.itemClassList).toEqual(expectedClassList);
      });
   });
});
