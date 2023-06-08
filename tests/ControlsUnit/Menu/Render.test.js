define([
   'Controls/menu',
   'Types/source',
   'Core/core-clone',
   'Controls/display',
   'Controls/baseTree',
   'Types/collection',
   'Types/entity',
   'Types/di'
], function (menu, source, Clone, display, baseTree, collection, entity) {
   describe('Menu:Render', function () {
      let defaultItems = [
         { key: 0, title: 'все страны' },
         { key: 1, title: 'Россия' },
         { key: 2, title: 'США' },
         { key: 3, title: 'Великобритания' }
      ];

      let getListModel = function (items, nodeProperty) {
         return new baseTree.Tree({
            collection: new collection.RecordSet({
               rawData: Clone(items || defaultItems),
               keyProperty: 'key'
            }),
            keyProperty: 'key',
            nodeProperty
         });
      };

      let defaultOptions = {
         listModel: getListModel(),
         keyProperty: 'key',
         itemPadding: {}
      };

      let getRender = function (config) {
         const renderConfig = config || defaultOptions;
         const menuControl = new menu.Render(renderConfig);
         menuControl.saveOptions(renderConfig);
         return menuControl;
      };

      it('_itemMouseMove', function () {
         let menuRender = getRender();
         let actualData;
         let isStopped = false;
         menuRender._notify = (e, d) => {
            if (e === 'itemMouseMove') {
               actualData = d;
            }
         };
         const event = {
            type: 'click',
            stopPropagation: () => {
               isStopped = true;
            }
         };
         menuRender._itemMouseMove(event, { key: 1 }, 'event');
         expect(actualData[0]).toEqual({ key: 1 });
         expect(actualData[1]).toEqual('event');
         expect(isStopped).toBe(true);
      });

      describe('grouping', function () {
         let getGroup = (item) => {
            if (!item.get('group')) {
               return 'CONTROLS_HIDDEN_GROUP';
            }
            return item.get('group');
         };
         it('_isGroupVisible simple', function () {
            let groupListModel = getListModel([
               { key: 0, title: 'все страны' },
               { key: 1, title: 'Россия', icon: 'icon-add' },
               { key: 2, title: 'США', group: '2' },
               { key: 3, title: 'Великобритания', group: '2' },
               { key: 4, title: 'Великобритания', group: '2' },
               { key: 5, title: 'Великобритания', group: '3' }
            ]);
            groupListModel.setGroup(getGroup);

            let menuRender = getRender({ listModel: groupListModel });

            let result = menuRender._isGroupVisible(groupListModel.at(0));
            expect(result).toBe(false);

            result = menuRender._isGroupVisible(groupListModel.at(3));
            expect(result).toBe(true);
         });

         it('_isGroupVisible one group', function () {
            let groupListModel = getListModel([
               { key: 0, title: 'все страны', group: '2' },
               {
                  key: 1,
                  title: 'Россия',
                  icon: 'icon-add',
                  group: '2'
               },
               { key: 2, title: 'США', group: '2' },
               { key: 3, title: 'Великобритания', group: '2' },
               { key: 4, title: 'Великобритания', group: '2' }
            ]);
            groupListModel.setGroup(getGroup);

            let menuRender = getRender({ listModel: groupListModel });

            let result = menuRender._isGroupVisible(groupListModel.at(0));
            expect(result).toBe(false);
         });

         it('_isHistorySeparatorVisible', function () {
            let groupListModel = getListModel([
               { key: 0, title: 'все страны' },
               { key: 1, title: 'Россия', icon: 'icon-add' },
               { key: 2, title: 'США', group: '2' },
               { key: 3, title: 'Великобритания', group: '2' },
               { key: 4, title: 'Великобритания', group: '2' },
               { key: 5, title: 'Великобритания', group: '3' }
            ]);
            groupListModel.setGroup(getGroup);

            let menuRender = getRender({
               listModel: groupListModel,
               allowPin: true
            });
            let result = menuRender._isHistorySeparatorVisible(
               groupListModel.at(1)
            );
            expect(!!result).toBe(false);

            groupListModel.at(1).getContents().set('pinned', true);
            result = menuRender._isHistorySeparatorVisible(
               groupListModel.at(1)
            );
            expect(result).toBe(true);

            groupListModel.at(2).getContents().set('pinned', true);
            result = menuRender._isHistorySeparatorVisible(
               groupListModel.at(2)
            );
            expect(result).toBe(false);
         });

         describe('check class separator', function () {
            let groupListModel,
               menuRender,
               expectedClasses = 'controls-Menu__row-separator';
            beforeEach(function () {
               groupListModel = getListModel([
                  { key: 0, title: 'все страны' },
                  { key: 1, title: 'Россия', icon: 'icon-add' },
                  { key: 2, title: 'США', group: '2' },
                  { key: 3, title: 'Великобритания', group: '2' },
                  { key: 4, title: 'Великобритания', group: '2' },
                  { key: 5, title: 'Великобритания', group: '3' }
               ]);
               groupListModel.setGroup(getGroup);

               menuRender = getRender({
                  listModel: groupListModel,
                  itemPadding: {}
               });
            });

            it('collectionItem', function () {
               let actualClasses = menuRender._getClassList(
                  groupListModel.at(1)
               );
               expect(
                  actualClasses.indexOf('controls-Menu__row-separator') !== -1
               ).toBe(true);
            });

            it('next item is groupItem', function () {
               // Collection: [GroupItem, CollectionItem, CollectionItem, GroupItem,...]
               let actualClasses = menuRender._getClassList(
                  groupListModel.at(2)
               );
               expect(actualClasses.indexOf(expectedClasses) === -1).toBe(true);
            });

            it('history separator is visible', function () {
               menuRender._options.allowPin = true;
               groupListModel.at(1).getContents().set('pinned', true);
               let actualClasses = menuRender._getClassList(
                  groupListModel.at(1)
               );
               expect(actualClasses.indexOf(expectedClasses) === -1).toBe(true);
            });

            it('history separator is unvisible', function () {
               menuRender._options.allowPin = false;
               groupListModel.at(1).getContents().set('pinned', true);
               let actualClasses = menuRender._getClassList(
                  groupListModel.at(1)
               );
               expect(actualClasses.indexOf(expectedClasses) === -1).toBe(
                  false
               );
            });
         });
      });

      describe('_getClassList', function () {
         let menuRender, renderOptions;
         beforeEach(function () {
            menuRender = getRender();
            renderOptions = {
               listModel: getListModel(),
               keyProperty: 'id',
               displayProperty: 'title',
               selectedKeys: [],
               itemPadding: {
                  top: 'null',
                  left: 'l',
                  right: 'l'
               },
               theme: 'theme'
            };
            menuRender.saveOptions(renderOptions);
         });

         it('row_state default|readOnly', function () {
            let expectedClasses = 'controls-Menu__row_state_default';
            let actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(0)
            );
            expect(actualClasses.indexOf(expectedClasses) !== -1).toBe(true);

            renderOptions.listModel.at(0).getContents().set('readOnly', true);
            expectedClasses = 'controls-Menu__row_state_readOnly';
            actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(0)
            );
            expect(actualClasses.indexOf(expectedClasses) !== -1).toBe(true);
         });

         it('emptyItem', function () {
            let expectedClasses = 'controls-Menu__defaultItem';
            let actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(1)
            );
            expect(actualClasses.indexOf(expectedClasses) !== -1).toBe(true);

            menuRender._options.emptyText = 'Text';
            menuRender._options.emptyKey = 0;
            expectedClasses = 'controls-Menu__emptyItem';
            actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(0)
            );
            expect(actualClasses.indexOf(expectedClasses) !== -1).toBe(true);

            menuRender._options.multiSelect = true;
            actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(0)
            );
            expect(actualClasses.indexOf(expectedClasses) !== -1).toBe(true);
         });

         it('pinned', function () {
            let expectedClasses = 'controls-Menu__row_pinned';
            let actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(0)
            );
            expect(actualClasses.indexOf(expectedClasses) === -1).toBe(true);

            renderOptions.listModel.at(0).getContents().set('pinned', true);
            actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(0)
            );
            expect(actualClasses.indexOf(expectedClasses) === -1).toBe(true);

            renderOptions.listModel
               .at(0)
               .getContents()
               .set('HistoryId', 'test');
            actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(0)
            );
            expect(actualClasses.indexOf(expectedClasses) !== -1).toBe(true);
         });

         it('lastItem', function () {
            let expectedClasses = 'controls-Menu__row-separator';
            let actualClasses = menuRender._getClassList(
               renderOptions.listModel.at(0)
            );
            expect(actualClasses.indexOf(expectedClasses) !== -1).toBe(true);

            actualClasses = menuRender._getClassList(
               menuRender._options.listModel.at(3)
            );
            expect(actualClasses.indexOf(expectedClasses) === -1).toBe(true);
         });
      });

      it('_getItemData', function () {
         let menuRender = getRender();
         let itemData = menuRender._getItemData(
            menuRender._options.listModel.at(0)
         );
         expect(itemData.itemClassList).toBeTruthy();
         expect(itemData.treeItem).toBeTruthy();
         expect(itemData.multiSelectTpl).toBeTruthy();
         expect(itemData.item).toBeTruthy();
         expect(itemData.isSelected).toBeTruthy();
         expect(itemData.getPropValue).toBeTruthy();
         expect(itemData.isFixedItem).toBe(false);
      });

      it('_getIconSize', () => {
         let menuRender = getRender();
         let item = new entity.Model({
            rawData: { iconSize: 's' }
         });
         let result = menuRender._getIconSize(item);
         expect(result).not.toBeDefined();

         menuRender._iconPadding = 's';
         result = menuRender._getIconSize(item);
         expect(result).toEqual('');

         item = new entity.Model({
            rawData: { iconSize: 's', icon: 'icon-test' }
         });
         result = menuRender._getIconSize(item);
         expect(result).toEqual('s');
      });

      describe('getIconPadding', function () {
         let menuRender = getRender();
         let iconItems = [
            { key: 0, title: 'все страны' },
            { key: 1, title: 'Россия', icon: 'icon-add' },
            { key: 2, title: 'США' },
            { key: 3, title: 'Великобритания' }
         ];
         let renderOptions = {
            listModel: getListModel(iconItems),
            iconSize: 'm',
            root: null
         };

         it('simple', () => {
            const iconPadding = menuRender.getIconPadding(renderOptions);
            expect(iconPadding).toEqual('m');
         });

         it('iconSize set on item', () => {
            const itemsIconSize = [
               {
                  key: 1,
                  title: 'Россия',
                  icon: 'icon-add',
                  iconSize: 'l'
               }
            ];
            const iconPadding = menuRender.getIconPadding({
               listModel: getListModel(itemsIconSize),
               root: null
            });
            expect(iconPadding).toEqual('l');
         });

         it('with headingIcon', () => {
            delete iconItems[1].icon;
            renderOptions.listModel = getListModel(iconItems);
            renderOptions.headingIcon = 'icon-Add';
            const iconPadding = menuRender.getIconPadding(renderOptions);
            expect(iconPadding).toEqual('');
         });

         it('hierarchy collection', () => {
            iconItems = [
               { key: 0, title: 'все страны', node: true },
               {
                  key: 1,
                  title: 'Россия',
                  icon: 'icon-add',
                  parent: 0
               },
               { key: 2, title: 'США' },
               { key: 3, title: 'Великобритания' }
            ];
            let listModel = getListModel(iconItems);
            listModel.setFilter((item) => {
               return item.get('parent') === undefined;
            });
            let hierarchyRenderOptions = {
               listModel,
               iconSize: 'm',
               root: null
            };
            let hierarchyMenuRender = getRender();
            let iconPadding = hierarchyMenuRender.getIconPadding(
               hierarchyRenderOptions
            );
            expect(iconPadding).toEqual('');

            listModel = getListModel(iconItems);
            listModel.setFilter((item) => {
               return item.get('parent') === 0;
            });
            hierarchyRenderOptions = {
               listModel,
               iconSize: 'm',
               root: 0,
               parentProperty: 'parent'
            };
            hierarchyMenuRender = getRender(hierarchyRenderOptions);
            iconPadding = hierarchyMenuRender.getIconPadding(
               hierarchyRenderOptions
            );
            expect(iconPadding).toEqual('m');
         });
      });

      describe('_beforeUnmount', () => {
         it('empty item must be removed from collection', () => {
            const listModel = getListModel();
            const menuRenderConfig = {
               listModel: listModel,
               emptyText: 'emptyText',
               itemPadding: {},
               selectedKeys: [],
               emptyKey: 'testKey',
               keyProperty: 'key'
            };
            const menuRender = getRender(menuRenderConfig);
            menuRender._beforeMount(menuRenderConfig);
            menuRender._beforeUnmount();
            expect(listModel.getSourceCollection().getCount()).toEqual(4);
         });
      });
   });
});
