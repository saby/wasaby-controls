define([
   'Controls/dropdown',
   'Core/core-clone',
   'Types/source',
   'Types/collection',
   'Types/entity',
   'Controls/popup',
   'Controls/_dropdown/Util'
], (dropdown, Clone, sourceLib, collection, entity, popup, dropdownUtil) => {
   describe('Controls/_dropdown:Selector', () => {
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
            title: 'Запись 3'
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
            icon: 'icon-16 icon-Admin icon-primary'
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
         rawData: items
      });

      let config = {
         selectedKeys: ['2'],
         displayProperty: 'title',
         keyProperty: 'id',
         maxVisibleItems: 1,
         source: new sourceLib.Memory({
            keyProperty: 'id',
            data: items
         }),
         closeMenuOnOutsideClick: true
      };

      let getDropdown = function (cfg) {
         let dropdownList = new dropdown.Selector(cfg);
         dropdownList._children = {
            infoboxTarget: {}
         };
         dropdownList.saveOptions(cfg);
         return dropdownList;
      };

      it('data load callback', () => {
         let ddl = getDropdown(config);
         ddl._prepareDisplayState(config, [itemsRecords.at(5)]);
         expect(ddl._text).toEqual('Запись 6');
         expect(ddl._icon).toEqual('icon-16 icon-Admin icon-primary');
         ddl._prepareDisplayState(config, [{ id: null }]);
         expect(ddl._icon).toBeUndefined();
      });

      it('_beforeMount loadSelectedItems', function () {
         const ddl = getDropdown(config);
         let isSelectedItemsLoad = false;
         dropdownUtil.loadSelectedItems = () => {
            isSelectedItemsLoad = true;
         };
         ddl._beforeMount({
            navigation: true
         });
         expect(isSelectedItemsLoad).toBe(false);

         ddl._beforeMount({
            navigation: true,
            selectedKeys: [1, 2, 3]
         });
         expect(isSelectedItemsLoad).toBe(true);
      });

      it('_beforeMount items', function () {
         const ddl = getDropdown(config);
         ddl._beforeMount({
            ...config,
            source: null,
            items: itemsRecords
         });
         expect(ddl._text).toEqual('Запись 2');
      });

      it('_getMoreText', () => {
         let ddl = getDropdown(config);

         // maxVisibleItems = null
         let moreText = ddl._getMoreText(
            [itemsRecords.at(1), itemsRecords.at(3), itemsRecords.at(5)],
            null
         );
         expect(moreText).toEqual('');

         // maxVisibleItems = 1
         moreText = ddl._getMoreText(
            [itemsRecords.at(1), itemsRecords.at(3), itemsRecords.at(5)],
            1
         );
         expect(moreText).toEqual(', еще 2');

         // maxVisibleItems = 2
         moreText = ddl._getMoreText(
            [itemsRecords.at(1), itemsRecords.at(3), itemsRecords.at(5)],
            2
         );
         expect(moreText).toEqual(', еще 1');

         // maxVisibleItems = 2
         moreText = ddl._getMoreText([itemsRecords.at(1), itemsRecords.at(3)], 2);
         expect(moreText).toEqual('');
      });

      it('_getText', () => {
         let ddl = getDropdown(config);
         let selectedItems = [itemsRecords.at(0), itemsRecords.at(2), itemsRecords.at(4)];
         const options = {
            maxVisibleItems: 1,
            displayProperty: 'title'
         };

         // maxVisibleItems = null
         let text = ddl._getText([], {
            emptyText: 'emptyText',
            emptyKey: null
         });
         expect(text).toEqual('emptyText');

         // maxVisibleItems = 1
         text = ddl._getText(selectedItems, options);
         expect(text).toEqual('Запись 1');

         // maxVisibleItems = 2
         options.maxVisibleItems = 2;
         text = ddl._getText(selectedItems, options);
         expect(text).toEqual('Запись 1, Запись 3');

         // maxVisibleItems = null
         options.maxVisibleItems = null;
         text = ddl._getText(selectedItems, options);
         expect(text).toEqual('Запись 1, Запись 3, Запись 5');
      });

      it('check selectedItemsChanged event', () => {
         let ddl = getDropdown(config);
         let keys, text, isKeysChanged;
         ddl._notify = (e, data) => {
            if (e === 'selectedKeysChanged') {
               isKeysChanged = true;
               keys = data[0];
            }
            if (e === 'textValueChanged') {
               text = data[0];
            }
         };
         ddl._selectedItemsChangedHandler([itemsRecords.at(5)], ['6']);
         expect(keys).toEqual(['6']);
         expect(text).toBe('Запись 6');
         expect(isKeysChanged).toBe(true);

         isKeysChanged = false;
         ddl._options.selectedKeys = ['6'];
         ddl._selectedItemsChangedHandler([itemsRecords.at(5)], ['6']);
         expect(isKeysChanged).toBe(false);
      });

      it('_handleMouseDown', () => {
         let isOpened = false;
         let ddl = getDropdown(config);
         ddl.openMenu = () => {
            isOpened = true;
         };

         const event = {
            nativeEvent: { button: 2 },
            stopPropagation: jest.fn()
         };
         ddl._handleMouseDown(event);
         expect(isOpened).toBe(false);

         event.nativeEvent.button = 0;
         ddl._handleMouseDown(event);
         expect(isOpened).toBe(true);
      });

      it('openMenu', async () => {
         let actualOptions = null;
         let target;
         let ddl = getDropdown(config);
         ddl._controller = {
            setMenuPopupTarget: () => {
               target = 'test';
            },
            openMenu: (popupConfig) => {
               actualOptions = popupConfig;
               return Promise.resolve();
            }
         };

         ddl.openMenu();
         expect(target).toEqual('test');

         ddl.openMenu({
            newOptionsPopup: 'test2',
            templateOptions: { customTemplateOption: 'test2' }
         });
         expect(actualOptions.templateOptions.customTemplateOption).toEqual('test2');
         expect(actualOptions.newOptionsPopup).toEqual('test2');

         let actualKey;
         const item = new entity.Model({ rawData: { id: 1 } });
         ddl._controller.openMenu = () => {
            return Promise.resolve([item]);
         };
         ddl._selectedItemsChangedHandler = (innerItems, keys) => {
            actualKey = keys[0];
         };
         await ddl.openMenu();
         expect(actualKey).toEqual(1);
      });

      it('_dataLoadCallback', () => {
         let ddl = getDropdown(config);
         ddl._dataLoadCallback(
            ddl._options,
            new collection.RecordSet({
               rawData: [1, 2, 3]
            })
         );
         expect(ddl._countItems).toEqual(3);

         ddl._options.emptyText = 'empty text';
         ddl._dataLoadCallback(
            ddl._options,
            new collection.RecordSet({
               rawData: [1, 2, 3]
            })
         );
         expect(ddl._countItems).toEqual(4);
      });

      it('_prepareDisplayState empty items', () => {
         let ddl = getDropdown(config);
         ddl._prepareDisplayState(config, []);
         expect(ddl._text).toEqual('');
      });

      it('_prepareDisplayState emptyText=true', () => {
         let newConfig = Clone(config);
         newConfig.emptyText = true;
         let ddl = getDropdown(newConfig);
         ddl._prepareDisplayState(newConfig, [null]);
         expect(ddl._text).toEqual('Не выбрано');
         expect(ddl._icon).toBeNull();

         const emptyItem = new entity.Model({
            rawData: { id: null }
         });
         ddl._prepareDisplayState(newConfig, [emptyItem]);
         expect(ddl._text).toEqual('Не выбрано');
         expect(ddl._icon).toBeNull();
      });

      it('_private::getTooltip', function () {
         let ddl = getDropdown(config);
         ddl._prepareDisplayState(config, [null]);
         expect(ddl._tooltip).toEqual('');

         const selectedItems = [
            new entity.Model({
               rawData: items[0]
            }),
            new entity.Model({
               rawData: items[1]
            }),
            new entity.Model({
               rawData: items[2]
            })
         ];
         ddl._prepareDisplayState(config, selectedItems);
         expect(ddl._tooltip).toEqual('Запись 1, Запись 2, Запись 3');
      });

      it('_selectorTemplateResult', () => {
         let newConfig = Clone(config);
         let ddl = getDropdown(newConfig);
         ddl._beforeMount(config);
         popup.Sticky.closePopup = jest.fn();
         let curItems = new collection.RecordSet({
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
            }),
            selectedItems = new collection.RecordSet({
               keyProperty: 'id',
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
         ddl._controller._items = curItems;
         ddl._controller._source = config.source;
         let newItems = [
            {
               id: '9',
               title: 'Запись 9'
            },
            {
               id: '10',
               title: 'Запись 10'
            },
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
         ];

         ddl._selectorTemplateResult(selectedItems);
         expect(newItems).toEqual(ddl._controller._items.getRawData());
      });

      it('_selectorTemplateResult selectorCallback', () => {
         let newConfig = Clone(config);
         let ddl = getDropdown(newConfig);
         ddl._beforeMount(config);
         ddl._notify = (event, data) => {
            if (event === 'selectorCallback') {
               data[1].at(0).set({ id: '11', title: 'Запись 11' });
            }
         };
         popup.Sticky.closePopup = jest.fn();

         let curItems = new collection.RecordSet({
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
            }),
            selectedItems = new collection.RecordSet({
               keyProperty: 'id',
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
         ddl._controller._items = curItems;
         ddl._controller._source = config.source;
         let newItems = [
            { id: '11', title: 'Запись 11' },
            { id: '9', title: 'Запись 9' },
            { id: '10', title: 'Запись 10' },
            { id: '1', title: 'Запись 1' },
            { id: '2', title: 'Запись 2' },
            { id: '3', title: 'Запись 3' }
         ];

         ddl._selectorTemplateResult(selectedItems);
         expect(newItems).toEqual(ddl._controller._items.getRawData());
      });

      it('_selectorResult', function () {
         let newConfig = Clone(config);
         let ddl = getDropdown(newConfig);
         ddl._beforeMount(config);
         let curItems = new collection.RecordSet({
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
            }),
            selectedItems = new collection.List({
               items: [
                  new entity.Model({
                     keyProperty: 'key',
                     rawData: {
                        id: '1',
                        title: 'Запись 1'
                     }
                  }),
                  new entity.Model({
                     keyProperty: 'key',
                     rawData: {
                        id: '9',
                        title: 'Запись 9'
                     }
                  })
               ]
            });
         let selectedKeys;
         ddl._controller._items = curItems;
         ddl._notify = (e, data) => {
            if (e === 'selectedKeysChanged') {
               selectedKeys = data[0];
            }
         };
         let newItems = [
            {
               id: '9',
               title: 'Запись 9'
            },
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
         ];
         ddl._controller._source = config.source;
         ddl._selectorResult(selectedItems);
         expect(newItems).toEqual(ddl._controller._items.getRawData());
         expect(ddl._controller._menuSource).toBeTruthy();
         expect(selectedKeys).toEqual(['1', '9']);
      });

      describe('controller options', function () {
         const ddl = getDropdown(config);

         it('check options', () => {
            const result = ddl._getControllerOptions({
               nodeFooterTemplate: 'testNodeFooterTemplate'
            });

            expect(result.nodeFooterTemplate).toEqual('testNodeFooterTemplate');
            expect(result.popupClassName).toContain('controls-DropdownList__margin');
         });

         it('popupClassName with header', () => {
            const result = ddl._getControllerOptions({
               nodeFooterTemplate: 'testNodeFooterTemplate',
               headerContentTemplate: 'template'
            });

            expect(result.popupClassName).toContain('controls-DropdownList__margin');
         });

         it('emptyTemplate', () => {
            const result = ddl._getControllerOptions({
               emptyTemplate: 'testEmptyTemplate'
            });

            expect(result.emptyTemplate).toEqual('testEmptyTemplate');
         });

         it('popupClassName with multiSelect', () => {
            const result = ddl._getControllerOptions({
               nodeFooterTemplate: 'testNodeFooterTemplate',
               multiSelect: true
            });

            expect(result.popupClassName).toContain('controls-DropdownList_multiSelect__margin');
         });
      });

      it('_deactivated', function () {
         let opened = true;
         const ddl = getDropdown(config);
         ddl._beforeMount(config);
         ddl._controller.closeMenu = () => {
            opened = false;
         };
         ddl._deactivated();
         expect(opened).toBe(false);
      });
   });
});
