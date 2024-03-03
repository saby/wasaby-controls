/**
 * Created by ps.borisov on 16.02.2018.
 */
define([
   'Controls/event',
   'Controls/tabs',
   'Controls/_tabs/Buttons/Marker',
   'Types/source',
   'Types/entity',
   'Types/collection'
], function (event, tabsMod, Marker, sourceLib, entity, collection) {
   describe('Controls/_tabs/Buttons', function () {
      const data = [
         {
            id: 1,
            title: 'Первый',
            align: 'left'
         },
         {
            id: 2,
            title: 'Второй'
         },
         {
            id: 3,
            title: 'Третий',
            align: 'left'
         },
         {
            id: 4,
            title: 'Четвертый'
         },
         {
            id: 5,
            title: 'Пятый'
         },
         {
            id: 6,
            title: 'Шестой',
            align: 'left'
         },
         {
            id: 7,
            title: 'Седьмой'
         },
         {
            id: 8,
            title: 'Восьмой'
         },
         {
            id: 9,
            title: 'Девятый',
            align: 'left'
         },
         {
            id: 10,
            title: 'Десятый'
         },
         {
            id: 11,
            title: 'Одиннадцатый'
         },
         {
            id: 12,
            title: 'Двенадцатый',
            align: 'left'
         },
         {
            id: 13,
            title: 'Тринадцатый'
         }
      ];

      describe('_beforeUpdate', () => {
         const items = new collection.RecordSet({
            rawData: data,
            keyProperty: 'id'
         });

         let tabs;

         beforeEach(function () {
            tabs = new tabsMod.Buttons();

            tabs._beforeMount({
               items: items,
               selectedKey: 1
            });
            tabs._options.items = items;
            tabs._options.selectedKey = 1;
            tabs._options.keyProperty = 'id';

            tabs._container = {
               getBoundingClientRect: () => {
                  return {
                     left: 0,
                     right: 0
                  };
               }
            };

            for (let i = 0; i < data.length; i++) {
               tabs._children[`TabContent${i}`] = {
                  getBoundingClientRect: () => {
                     return {
                        left: i * 10,
                        right: i * 10,
                        width: i * 10
                     };
                  }
               };
            }
         });

         it("should't update _isAnimatedMakerVisible if align changed", function () {
            tabs._beforeUpdate({
               items: items,
               selectedKey: 2
            });
            expect(tabs._isAnimatedMakerVisible).toBe(false);
         });

         it("should't update marker model if selectedKey changed", function () {
            jest
               .spyOn(Marker.default, 'getComputedStyle')
               .mockClear()
               .mockReturnValue({ borderLeftWidth: 0, borderRightWidth: 0 });
            tabs._wrapperIncludesTarget = () => {
               return true;
            };

            tabs._mouseEnterHandler({
               nativeEvent: {}
            });
            expect(tabs._marker.getOffset()).toBe(0);

            tabs._beforeUpdate({
               items: items,
               selectedKey: 3,
               keyProperty: 'id'
            });
            expect(tabs._marker.getOffset()).toBe(20);
         });

         it('marker should be native after the mouseout event', function () {
            jest
               .spyOn(Marker.default, 'getComputedStyle')
               .mockClear()
               .mockReturnValue({ borderLeftWidth: 0, borderRightWidth: 0 });
            tabs._wrapperIncludesTarget = () => {
               return true;
            };

            tabs._mouseEnterHandler({
               nativeEvent: {}
            });
            expect(tabs._isAnimatedMakerVisible).toBe(true);
            tabs._wrapperIncludesTarget = () => {
               return false;
            };
            tabs._mouseOutHandler({
               nativeEvent: {}
            });
            expect(tabs._isAnimatedMakerVisible).toBe(false);
         });

         it("should't update _isAnimatedMakerVisible if items changed", function () {
            const items2 = new collection.RecordSet({
               rawData: data,
               keyProperty: 'id'
            });

            tabs._beforeUpdate({
               items: items2,
               selectedKey: 3
            });
            expect(tabs._isAnimatedMakerVisible).toBe(false);
         });
      });

      describe('_afterRender', () => {
         let tabs;

         const items = new collection.RecordSet({
            rawData: data,
            keyProperty: 'id'
         });

         beforeEach(function () {
            tabs = new tabsMod.Buttons();

            tabs._beforeMount({
               items: items,
               selectedKey: 1
            });
            tabs._options.items = items;
            tabs._options.selectedKey = 1;
            tabs._children = {
               wrapper: {
                  scrollWidth: 200,
                  clientWidth: 100,
                  scrollTo: jest.fn()
               },
               tab1: {
                  scrollIntoView: jest.fn()
               }
            };
         });

         it("should't scroll into view if selectedKey does not changed", () => {
            tabs._afterRender({ selectedKey: 1 });
            expect(tabs._children.tab1.scrollIntoView).not.toHaveBeenCalled();
         });
      });

      it('prepareItemOrder', function () {
         var expected = '-ms-flex-order: 2; order: 2;';
         const tabInstance = new tabsMod.Buttons();
         tabInstance._itemsOrder = [2];
         expect(expected).toEqual(tabInstance._prepareItemOrder(0));
      });
      it('initItems by source', async function () {
         var tabInstance = new tabsMod.Buttons(),
            source = new sourceLib.Memory({
               data: data,
               keyProperty: 'id'
            });

         const result = await tabInstance._initItems(source, tabInstance);

         var itemsOrder = result.itemsOrder;
         expect(1).toEqual(itemsOrder[0]);
         expect(30).toEqual(itemsOrder[1]);
         expect(5).toEqual(itemsOrder[11]);
         expect(36).toEqual(itemsOrder[10]);
         expect(37).toEqual(tabInstance._lastRightOrder);
      });
      it('initItems by items', function () {
         const tabInstance = new tabsMod.Buttons();
         let items = new collection.RecordSet({
            rawData: data,
            keyProperty: 'id'
         });

         const result = tabInstance._prepareItems(items);
         const itemsOrder = result.itemsOrder;
         expect(1).toEqual(itemsOrder[0]);
         expect(30).toEqual(itemsOrder[1]);
         expect(5).toEqual(itemsOrder[11]);
         expect(36).toEqual(itemsOrder[10]);
         expect(37).toEqual(tabInstance._lastRightOrder);
      });
      it('prepareItemClass', function () {
         var item = {
               align: 'left',
               karambola: '15',
               _order: '144'
            },
            item2 = {
               karambola: '10',
               _order: '2',
               type: 'photo'
            },
            item3 = {
               karambola: '10',
               _order: '2',
               isMainTab: true
            },
            item4 = {
               karambola: '10',
               _order: '2',
               isMainTab: false
            },
            options = {
               style: 'additional',
               inlineHeight: 's',
               selectedKey: '15',
               keyProperty: 'karambola',
               theme: 'default',
               horizontalPadding: 'xs',
               canShrink: true
            },
            expected =
               'controls-Tabs__item' +
               ' controls-Tabs__item-selected' +
               ' controls-Tabs__item_inlineHeight-s' +
               ' controls-Tabs_horizontal-padding-xs_first' +
               ' controls-Tabs__item-maxWidth' +
               ' controls-Tabs__item_align_left' +
               ' controls-Tabs__item_extreme' +
               ' controls-Tabs__item_extreme_first' +
               ' controls-Tabs__item_notShrink',
            expected2 =
               'controls-Tabs__item' +
               ' controls-Tabs__item-unselected' +
               ' controls-Tabs__item_inlineHeight-s' +
               ' controls-Tabs__item-maxWidth' +
               ' controls-Tabs__item_align_right' +
               ' controls-Tabs__item_default' +
               ' controls-Tabs__item_type_photo' +
               ' controls-Tabs__item_notShrink',
            expected3 =
               'controls-Tabs__item' +
               ' controls-Tabs__item-unselected' +
               ' controls-Tabs__item_inlineHeight-s' +
               ' controls-Tabs__item-maxWidth' +
               ' controls-Tabs__item_align_right' +
               ' controls-Tabs__item_default' +
               ' controls-Tabs__item_canShrink',
            expected4 =
               'controls-Tabs__item' +
               ' controls-Tabs__item-unselected' +
               ' controls-Tabs__item_inlineHeight-s' +
               ' controls-Tabs_horizontal-padding-xs_last' +
               ' controls-Tabs__item-maxWidth' +
               ' controls-Tabs__item_align_right' +
               ' controls-Tabs__item_extreme' +
               ' controls-Tabs__item_extreme_last' +
               ' controls-Tabs__item_notShrink';
         const tabInstance = new tabsMod.Buttons();
         tabInstance.saveOptions(options);
         tabInstance._lastRightOrder = 144;
         tabInstance._itemsOrder = [1, 2, 2, 144];
         tabInstance._hasMainTab = true;
         tabInstance._itemsArray = [item, item2, item3, item4];
         expect(expected).toEqual(tabInstance._prepareItemClass(item, 0));
         expect(expected2).toEqual(tabInstance._prepareItemClass(item2, 1));
         expect(expected3).toEqual(tabInstance._prepareItemClass(item3, 2));
         expect(expected4).toEqual(tabInstance._prepareItemClass(item4, 3));
      });
      it('prepareItemSelected', function () {
         var item = {
               karambola: '15',
               _order: '2',
               type: 'photo'
            },
            item2 = {
               karambola: '10',
               _order: '2',
               type: 'photo'
            },
            item3 = {
               karambola: '10',
               _order: '2',
               type: 'photo',
               isMainTab: true
            },
            options = {
               style: 'additional',
               selectedKey: '15',
               keyProperty: 'karambola'
            },
            expected = 'controls-Tabs__item_view_selected controls-text-secondary',
            expected2 = 'controls-Tabs__item_state_default controls-text-tabs-unselected',
            expected3 = 'controls-Tabs__item_view_main';
         const tabs = new tabsMod.Buttons();
         tabs.saveOptions(options);
         expect(expected).toEqual(tabs._prepareItemSelectedClass(item));
         expect(expected2).toEqual(tabs._prepareItemSelectedClass(item2));
         expect(expected3).toEqual(tabs._prepareItemSelectedClass(item3));
      });

      describe('_prepareItemMarkerClass', () => {
         describe('Main tab', () => {
            const item = {
               karambola: '15',
               isMainTab: true
            };
            const options = {
               selectedKey: '15',
               keyProperty: 'karambola',
               markerThickness: 'l'
            };
            it('should return marker css class if tab selected', () => {
               const tabs = new tabsMod.Buttons();
               tabs.saveOptions(options);

               expect(tabs._prepareItemMarkerClass(item)).toEqual(
                  'controls-marker_main controls-marker_tabsMain'
               );
            });

            it("should't return marker css class if tab not selected", () => {
               const tabs = new tabsMod.Buttons();
               tabs.saveOptions({
                  selectedKey: '16',
                  keyProperty: 'karambola'
               });

               expect(tabs._prepareItemMarkerClass(item)).toEqual(
                  'controls-marker_main controls-marker_tabsMain controls-marker_state-default'
               );
            });
         });

         describe('Regular tab', () => {
            const item = {
               karambola: '15'
            };
            const options = {
               selectedKey: '15',
               keyProperty: 'karambola',
               direction: 'horizontal'
            };
            it('should return marker css class if tab selected', () => {
               const tabs = new tabsMod.Buttons();
               tabs.saveOptions(options);

               expect(tabs._prepareItemMarkerClass(item)).toEqual(
                  'controls-marker controls-marker_horizontal controls-marker_tabsThickness_horizontal controls-marker_style-tabsprimary'
               );
            });
         });
      });

      it('_prepareItemMarkerClass', function () {
         var item = {
               karambola: '15',
               _order: '2',
               type: 'photo'
            },
            item2 = {
               karambola: '10',
               _order: '2',
               type: 'photo'
            },
            options = {
               style: 'additional',
               selectedKey: '15',
               keyProperty: 'karambola',
               theme: 'default',
               direction: 'horizontal'
            };
         const tabs = new tabsMod.Buttons();
         tabs.saveOptions(options);

         expect(tabs._prepareItemMarkerClass(item)).toEqual(
            'controls-marker controls-marker_horizontal controls-marker_tabsThickness_horizontal controls-marker_style-tabssecondary'
         );
         expect(tabs._prepareItemMarkerClass(item2)).toEqual(
            'controls-marker controls-marker_horizontal controls-marker_tabsThickness_horizontal controls-marker_state-default'
         );
      });

      it('_beforeMount with received state', function () {
         var tabs = new tabsMod.Buttons(),
            receivedState = {
               items: [{ id: '1' }],
               itemsArray: [{ id: '1' }],
               itemsOrder: 'itemsOrder'
            },
            options = {
               source: null
            };
         tabs._beforeMount(options, null, receivedState);
         expect(tabs._items).toEqual(receivedState.items);
         expect(tabs._itemsOrder).toEqual(receivedState.itemsOrder);
         expect(tabs._itemsArray).toEqual(receivedState.itemsArray);
      });

      it('_onItemClick', function () {
         var tabs = new tabsMod.Buttons(),
            notifyCorrectCalled = false;
         tabs._notify = function (eventName) {
            if (eventName === 'selectedKeyChanged') {
               notifyCorrectCalled = true;
            }
         };
         let event1 = {
            nativeEvent: {
               button: 1
            }
         };
         tabs._onItemClick(event1, 1);
         expect(notifyCorrectCalled).toEqual(false);

         event1.nativeEvent.button = 0;
         tabs._onItemClick(event1, 1);
         expect(notifyCorrectCalled).toEqual(true);
      });

      describe('_updateMarker', () => {
         it('should update marker model', () => {
            const tabs = new tabsMod.Buttons();

            jest
               .spyOn(Marker.default, 'getComputedStyle')
               .mockClear()
               .mockReturnValue({ borderLeftWidth: 0, borderRightWidth: 0 });

            let items = new collection.RecordSet({
               rawData: data,
               keyProperty: 'id'
            });

            const getBoundingClientRect = () => {
               return { width: 10, left: 20, right: 30 };
            };

            tabs._container = { getBoundingClientRect };

            tabs._children = {};
            for (let i = 0; i < data.length; i++) {
               tabs._children[`TabContent${i}`] = { getBoundingClientRect };
            }

            tabs._beforeUpdate({ items, selectedKey: 1 });
            tabs._updateMarker();
            expect(tabs._marker.getOffset()).toEqual(0);
            expect(tabs._marker.getWidth()).toEqual(10);
         });
      });

      describe('_prepareItemStyles', () => {
         it('flex-order without width restrictions', () => {
            const tabs = new tabsMod.Buttons();
            const orders = [1, 2, 3, 4];
            tabs._itemsOrder = orders;
            const item = {};
            const index = 3;
            const styleValue = tabs._prepareItemStyles(item, index);
            expect(styleValue.includes(`order: ${orders[index]};`)).toBe(true);
         });
         it('number width restrictions', () => {
            const tabs = new tabsMod.Buttons();
            tabs._itemsOrder = [1, 2, 3, 4];
            const item = {
               width: 123,
               maxWidth: 1234,
               minWidth: 12
            };
            const index = 3;
            const styleValue = tabs._prepareItemStyles(item, index);
            expect(styleValue.includes(`width: ${item.width}px`)).toBe(true);
            expect(styleValue.includes('flex-shrink: 0')).toBe(true);
            expect(styleValue.includes(`max-width: ${item.maxWidth}px`)).toBe(true);
            expect(styleValue.includes(`min-width: ${item.minWidth}px`)).toBe(true);
         });
         it('percent width restrictions', () => {
            const tabs = new tabsMod.Buttons();
            tabs._itemsOrder = [1, 2, 3, 4];
            const item = {
               width: '20%',
               maxWidth: '25%',
               minWidth: '10%'
            };
            const index = 3;
            const styleValue = tabs._prepareItemStyles(item, index);
            expect(styleValue.includes(`width: ${item.width}`)).toBe(true);
            expect(styleValue.includes('flex-shrink: 0')).toBe(true);
            expect(styleValue.includes(`max-width: ${item.maxWidth}`)).toBe(true);
            expect(styleValue.includes(`min-width: ${item.minWidth}`)).toBe(true);
         });
      });
      describe('_tabCanShrink', () => {
         it('should return true', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: true };
            const item = {
               isMainTab: true
            };
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(true);
         });
         it('should return true', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: true };
            const item = {
               minWidth: '20px'
            };
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(true);
         });
         it('should return true', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: true };
            const item = {
               maxWidth: '20px'
            };
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(true);
         });
         it('should return false', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: true };
            const item = {
               width: '20px'
            };
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(false);
         });
         it('should return true', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: true };
            const item = { canShrink: false };
            tabs._hasMainTab = false;
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(false);
         });
         it('should return true', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: true };
            const item = { canShrink: true };
            tabs._hasMainTab = true;
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(true);
         });
         it('should return true', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: true };
            const item = {};
            tabs._hasMainTab = false;
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(true);
         });
         it('should return false', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: true };
            const item = {};
            tabs._hasMainTab = true;
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(false);
         });
         it('should return false', () => {
            const tabs = new tabsMod.Buttons();
            tabs._options = { canShrink: false };
            const item = {};
            const result = tabs._tabCanShrink(item);
            expect(result).toBe(false);
         });
      });
   });
});
