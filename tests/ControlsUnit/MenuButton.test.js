define([
   'Controls/dropdown',
   'Types/source',
   'Core/core-clone',
   'Controls/history',
   'Types/deferred',
   'Types/entity',
   'Types/collection',
   'Controls/popup'
], (
   dropdown,
   sourceLib,
   Clone,
   history,
   defferedLib,
   entity,
   collection,
   popup
) => {
   describe('MenuButton', () => {
      let items;

      let itemsRecords;

      let config;

      let testConfig;

      let menu;

      beforeEach(() => {
         items = [
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
               icon: 'icon-medium icon-Doge icon-primary'
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
               title: 'Запись 6'
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
         itemsRecords = new collection.RecordSet({
            keyProperty: 'id',
            rawData: Clone(items)
         });
         config = {
            icon: 'icon-medium icon-Doge icon-primary',
            viewMode: 'link',
            buttonStyle: 'secondary',
            fontColorStyle: 'link',
            showHeader: true,
            keyProperty: 'id',
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: items
            }),
            readOnly: false
         };
         testConfig = {
            selectedKeys: [2],
            keyProperty: 'id',
            emptyText: true,
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: items
            }),
            nodeProperty: 'node',
            itemTemplateProperty: 'itemTemplate',
            readOnly: false
         };
         menu = new dropdown.Button(config);
      });

      it('check item click', () => {
         let testEvent;
         menu._notify = (e, d) => {
            expect(e === 'menuItemActivate' || e === 'onMenuItemActivate').toBe(
               true
            );
            testEvent = d[1];
            if (e === 'onMenuItemActivate') {
               return false;
            }
         };
         let nativeEvent = {
            keyCode: 28
         };
         let eventResult = menu._onItemClickHandler(
            [
               {
                  id: '1',
                  title: 'Запись 1'
               }
            ],
            nativeEvent
         );

         expect(eventResult).toBe(false);
         expect(testEvent).toEqual(nativeEvent);
      });

      it('before mount navigation', async () => {
         let navigationConfig = Clone(testConfig);
         navigationConfig.navigation = {
            view: 'page',
            source: 'page',
            sourceConfig: { pageSize: 2, page: 0, hasMore: false }
         };
         const beforeMountResult = await menu._beforeMount(navigationConfig);
         expect(beforeMountResult.items.getCount()).toEqual(2);
      });

      it('check received state', () => {
         return menu
            ._beforeMount(config, null, { items: itemsRecords.clone() })
            .then(() => {
               expect(menu._controller._items.getRawData()).toEqual(
                  itemsRecords.getRawData()
               );
            });
      });

      it('received state, selectedItems = [null]', () => {
         let selectedItemsChangeCalled = false,
            selectedItems = [];
         const cfg = {
            selectedKeys: [null],
            keyProperty: 'id',
            selectedItemsChangedCallback: function (innerItems) {
               selectedItems = innerItems;
               selectedItemsChangeCalled = true;
            },
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: items
            })
         };
         return menu
            ._beforeMount(cfg, {}, { items: itemsRecords.clone() })
            .then(() => {
               expect(selectedItems).toEqual([]);
               expect(selectedItemsChangeCalled).toBe(true);
            });
      });

      it('before mount filter', async () => {
         let filterConfig = Clone(testConfig);
         filterConfig.filter = { id: ['3', '4'] };
         const beforeMountResult = await menu._beforeMount(filterConfig);
         expect(beforeMountResult.items.getCount()).toEqual(2);
      });

      it('received state, selectedItems = [null], emptyText is NOT set', () => {
         let selectedItemsChangeCalled = false,
            selectedItems = [];
         const cfg = {
            selectedKeys: [null],
            keyProperty: 'id',
            selectedItemsChangedCallback: function (innerItems) {
               selectedItems = innerItems;
               selectedItemsChangeCalled = true;
            },
            source: new sourceLib.Memory({
               keyProperty: 'id',
               data: items
            })
         };
         return menu._beforeMount(cfg, null, null).then(() => {
            expect(selectedItems).toEqual([]);
            expect(selectedItemsChangeCalled).toBe(true);
         });
      });

      it('lazy load', () => {
         config.lazyItemsLoading = true;
         menu._beforeMount(config);
         expect(menu._controller._items).toBeNull();
      });

      it('notify footerClick', () => {
         let isClosed = false,
            isFooterClicked = false;
         menu._notify = function (e) {
            if (e === 'footerClick') {
               isFooterClicked = true;
            }
         };
         popup.Sticky.closePopup = () => {
            isClosed = true;
         };
         menu._$active = true;
         menu._onResult('footerClick');
         expect(isClosed).toBe(false);
         expect(isFooterClicked).toBe(true);
      });

      it('check item click', () => {
         let closed = false;
         let closeByNodeClick = false;
         menu._onItemClickHandler = function () {
            return closeByNodeClick;
         };
         menu._beforeMount(config);
         menu._controller._items = itemsRecords.clone();
         popup.Sticky.closePopup = () => {
            closed = true;
         };
         popup.Sticky.openPopup = jest.fn();

         // returned false from handler and no hierarchy
         menu._onResult('itemClick', menu._controller._items.at(4));
         expect(closed).toBe(false);

         // returned undefined from handler and there is hierarchy
         closed = false;
         closeByNodeClick = false;
         menu._onResult('itemClick', menu._controller._items.at(5));
         expect(closed).toBe(false);

         // returned undefined from handler and no hierarchy
         closed = false;
         menu._isOpened = true;
         closeByNodeClick = undefined;
         menu._onResult('itemClick', menu._controller._items.at(4));
         expect(closed).toBe(true);

         // returned true from handler and there is hierarchy
         closed = false;
         closeByNodeClick = undefined;
         menu._onResult('itemClick', menu._controller._items.at(5));
         expect(closed).toBe(true);
      });

      it('_dataLoadCallback', () => {
         let loadedItems = new collection.RecordSet({ rawData: [] });
         menu._dataLoadCallback({}, loadedItems);
         expect(menu._hasItems).toBe(false);

         loadedItems = new collection.RecordSet({ rawData: [{ id: 1 }] });
         menu._dataLoadCallback({}, loadedItems);
         expect(menu._hasItems).toBe(true);
      });

      it('check target', () => {
         let actualTarget;
         menu._controller = {
            openMenu: () => {
               return Promise.resolve();
            },
            loadDependencies: () => {
               return Promise.resolve();
            },
            setMenuPopupTarget: (target) => {
               actualTarget = target;
            }
         };
         menu._children = {
            content: 'testTarget'
         };
         menu.openMenu();
         expect(actualTarget).toEqual('testTarget');
      });

      it('open menu by key, check popupOptions', () => {
         let actualConfig;
         menu._controller = {
            openMenu: (cfg) => {
               actualConfig = cfg;
               return Promise.resolve();
            },
            loadDependencies: () => {
               return Promise.resolve();
            },
            setMenuPopupTarget: jest.fn()
         };
         menu._children = {
            content: 'testTarget'
         };
         menu.openMenu(
            {
               closeOnOutsideClick: false,
               templateOptions: {
                  option1: 'test'
               }
            },
            '4'
         );
         expect(actualConfig.closeOnOutsideClick).toBe(false);
         expect(actualConfig.templateOptions.option1).toEqual('test');
      });
   });
});
