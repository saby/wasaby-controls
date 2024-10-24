define([
   'Controls/menu',
   'Types/source',
   'Core/core-clone',
   'Controls/display',
   'Controls/baseTree',
   'Types/collection',
   'Types/di'
], function (menu, source, Clone, display, baseTree, collection) {
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
            let result = menuRender._isHistorySeparatorVisible(groupListModel.at(1));
            expect(!!result).toBe(false);

            groupListModel.at(1).getContents().set('pinned', true);
            result = menuRender._isHistorySeparatorVisible(groupListModel.at(1));
            expect(result).toBe(true);

            groupListModel.at(2).getContents().set('pinned', true);
            result = menuRender._isHistorySeparatorVisible(groupListModel.at(2));
            expect(result).toBe(false);
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
