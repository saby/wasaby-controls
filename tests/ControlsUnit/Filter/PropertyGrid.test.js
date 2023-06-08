define(['Controls/_filterPopup/Panel/PropertyGrid'], function (PropertyGrid) {
   describe('FilterPropertyGrid', function () {
      var config = {
         items: [
            {
               id: 'list',
               value: 1,
               resetValue: 1,
               visibility: true
            },
            {
               id: 'text',
               value: '123',
               resetValue: '',
               visibility: true
            },
            {
               id: 'bool',
               value: true,
               resetValue: false,
               visibility: false
            }
         ]
      };

      function getPropertyGrid(PGConfig) {
         var pGrid = new PropertyGrid.default(PGConfig);
         pGrid._beforeMount(PGConfig);
         pGrid.saveOptions(PGConfig);
         return pGrid;
      }

      it('_private::getIndexChangedVisibility', function () {
         let pGrid = getPropertyGrid(config);
         var oldItems = [
            {
               id: 'list',
               value: 1,
               resetValue: 1
            },
            {
               id: 'text',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'bool',
               value: false,
               resetValue: false,
               visibility: false
            }
         ];
         var newItems = [
            {
               id: 'list',
               value: 5,
               resetValue: 1
            },
            {
               id: 'text',
               value: '123',
               resetValue: '',
               visibility: true
            },
            {
               id: 'bool',
               value: true,
               resetValue: false,
               visibility: false
            }
         ];
         expect(pGrid._getIndexChangedVisibility(newItems, oldItems)).toEqual(
            1
         );
         oldItems[1].visibility = true;
         newItems[1].visibility = false;
         expect(pGrid._getIndexChangedVisibility(newItems, oldItems)).toEqual(
            -1
         );
         newItems.push({
            id: 'newItem',
            value: 'testValue',
            resetValue: '',
            visibility: true
         });
         expect(pGrid._getIndexChangedVisibility(newItems, oldItems)).toEqual(
            -1
         );
      });

      it('_beforeUpdate', function () {
         var pGrid = getPropertyGrid(config);
         var newItems = [
            {
               id: 'list',
               value: 5,
               resetValue: 1
            },
            {
               id: 'text',
               value: '123',
               resetValue: '',
               visibility: true
            },
            {
               id: 'bool',
               value: true,
               resetValue: false,
               visibility: true
            }
         ];
         pGrid._beforeUpdate({ items: newItems });
         expect(pGrid._changedIndex).toEqual(2);
         expect(pGrid._items).toEqual(newItems);

         pGrid._beforeUpdate({ items: newItems });
         expect(pGrid._changedIndex).toEqual(-1);
      });

      it('_afterMount', function () {
         let pGrid = getPropertyGrid(config);
         let newItems = [
            {
               id: 'list',
               value: 5,
               resetValue: 1
            }
         ];
         let itemsChanged = false;
         pGrid._notify = () => {
            itemsChanged = true;
         };

         pGrid._afterMount({ items: newItems });
         pGrid._items[0].value = 'test';

         expect(itemsChanged).toBe(true);

         // observeItems called second time
         itemsChanged = false;
         pGrid._afterMount();
         pGrid._items[0].value = 'test 2';
         expect(itemsChanged).toBe(true);
      });

      it('_isItemVisible', function () {
         var pGrid = getPropertyGrid(config);
         expect(pGrid._isItemVisible(config.items[0])).toEqual(true);
         expect(pGrid._isItemVisible(config.items[1])).toEqual(true);
         expect(pGrid._isItemVisible(config.items[2])).toEqual(false);
      });

      it('_valueChangedHandler', function () {
         let pGrid = getPropertyGrid(config);
         let result;
         let items = pGrid._items;

         pGrid._notify = (event, data) => {
            if (event === 'itemsChanged') {
               result = data[0];
            }
         };
         pGrid._valueChangedHandler('_valueChangedHandler', 2, true);
         expect(items !== pGrid._items).toBe(true);
         expect(pGrid._items[2].value).toBe(true);
         expect(result[2]).toEqual({
            id: 'bool',
            value: true,
            resetValue: false,
            visibility: false
         });
         let initItems = pGrid._items;
         pGrid._valueChangedHandler('_valueChangedHandler', 2, false);
         expect(pGrid._items[2].value).toBe(false);
         expect(result[2]).toEqual({
            id: 'bool',
            value: false,
            resetValue: false,
            visibility: false
         });
         expect(pGrid._items === initItems).toBe(false);
      });

      it('getLastVisibleItemIndex', function () {
         let pGrid = getPropertyGrid(config);
         var lastVisibleIndex = pGrid._getLastVisibleItemIndex(config.items);
         expect(lastVisibleIndex).toEqual(1);
         var items = [
            {
               id: 'list',
               value: 1,
               resetValue: 1,
               visibility: true
            },
            {
               id: 'text',
               value: '123',
               resetValue: '',
               visibility: true
            },
            {
               id: 'bool',
               value: true,
               resetValue: false,
               visibility: false
            },
            {
               id: 'bool',
               value: '1234',
               resetValue: false,
               visibility: true
            }
         ];
         lastVisibleIndex = pGrid._getLastVisibleItemIndex(items);
         expect(lastVisibleIndex).toEqual(3);
      });

      it('_visibilityChangedHandler', function () {
         let pGrid = getPropertyGrid(config);
         let result;
         pGrid._notify = (event, data) => {
            if (event === 'itemsChanged') {
               result = data[0];
            }
         };
         pGrid._visibilityChangedHandler('visibilityChanged', 2, true);
         expect(pGrid._items[2].visibility).toBe(true);
         expect(result[2]).toEqual({
            id: 'bool',
            value: true,
            resetValue: false,
            visibility: true
         });
         pGrid._visibilityChangedHandler('visibilityChanged', 2, false);
         expect(pGrid._items[2].visibility).toBe(false);
         expect(result[2]).toEqual({
            id: 'bool',
            value: false,
            resetValue: false,
            visibility: false
         });
      });

      it('_afterUpdate', function () {
         let pGrid = getPropertyGrid(config);
         let controlResizeEventFired = false;

         pGrid.activate = jest.fn();
         pGrid._notify = (eventName) => {
            if (eventName === 'controlResize') {
               controlResizeEventFired = true;
            }
         };

         pGrid._changedIndex = -1;
         pGrid._afterUpdate();
         expect(controlResizeEventFired).toBe(false);

         pGrid._changedIndex = 1;
         pGrid._afterUpdate();
         expect(controlResizeEventFired).toBe(true);
      });

      it('update control after change item by property observer', function () {
         const PG = getPropertyGrid(config);
         let itemsChangedFired = false;
         let newItems = config.items;
         PG._afterMount();
         PG._notify = (event, items) => {
            itemsChangedFired = true;
            newItems = items;
         };
         PG._items[0].value = 3;
         expect(itemsChangedFired).toBe(true);
         expect(PG._options.items).not.toEqual(newItems);
      });
   });
});
