define([
   'Controls/menu',
   'Types/source',
   'Core/core-clone',
   'Controls/display',
   'Types/collection'
], function (menu, source, Clone, display, collection) {
   describe('Menu:Popup', function () {
      it('_beforeMount', function () {
         let iconIsUpdated = false;
         const menuPopup = new menu.Popup();
         menuPopup._updateHeadingIcon = () => {
            iconIsUpdated = true;
         };
         const options = {
            items: new collection.RecordSet({
               rawData: [
                  {
                     id: 1,
                     title: 'text',
                     icon: 'icon',
                     parent: null
                  }
               ]
            })
         };
         menuPopup._beforeMount(options);
         expect(iconIsUpdated).toBe(true);
      });

      it('_dataLoadCallback', function () {
         let menuPopup = new menu.Popup();
         let items = new collection.RecordSet({
            rawData: [
               {
                  id: 1,
                  title: 'text',
                  parent: null
               },
               {
                  id: 2,
                  title: 'text',
                  icon: 'icon',
                  parent: null
               }
            ]
         });
         menuPopup._headingIcon = 'testIcon';
         menuPopup._dataLoadCallback(
            { parentProperty: 'parent', root: null },
            items
         );
         expect(menuPopup._headingIcon).toEqual('testIcon');

         menuPopup._dataLoadCallback(
            { parentProperty: 'parent', root: 4 },
            items
         );
         expect(menuPopup._headingIcon).toBeNull();

         menuPopup._headingIcon = 'testIcon';
         items.at(1).set('icon', null);
         menuPopup._dataLoadCallback(
            { parentProperty: 'parent', root: null },
            items
         );
         expect(menuPopup._headingIcon).toBeNull();

         menuPopup._headingIcon = 'testIcon';
         menuPopup._dataLoadCallback({ parentProperty: 'parent' }, items);
         expect(menuPopup._headingIcon).toBeNull();
      });

      it('_dataLoadErrback', function () {
         let actualError = '';
         let menuPopup = new menu.Popup();
         menuPopup._headingCaption = 'testCaption';
         menuPopup._headerTemplate = 'testTemplate';
         menuPopup._dataLoadErrback(
            {
               dataLoadErrback: (error) => {
                  actualError = error;
               }
            },
            'error'
         );
         expect(menuPopup._headingCaption).toBeNull();
         expect(menuPopup._headerTemplate).toBeNull();
         expect(menuPopup._headerVisible).toBe(false);
         expect(actualError).toEqual('error');
      });

      it('_dataLoadCallback headingIconSize', function () {
         let menuPopup = new menu.Popup();
         let items = new collection.RecordSet({
            rawData: [
               {
                  id: 1,
                  title: 'text',
                  iconSize: 'm',
                  parent: null
               },
               {
                  id: 2,
                  title: 'text',
                  icon: 'icon',
                  iconSize: 'm',
                  parent: null
               }
            ]
         });
         menuPopup._headingIcon = 'testIcon';
         menuPopup._dataLoadCallback(
            { parentProperty: 'parent', iconSize: 's', root: null },
            items
         );
         expect(menuPopup._headingIcon).toEqual('testIcon');
         expect(menuPopup._headingIconSize).toEqual('m');

         menuPopup._headingIconSize = null;
         menuPopup._dataLoadCallback(
            { parentProperty: 'parent', root: 4 },
            items
         );
         expect(menuPopup._headingIcon).toBeNull();
         expect(menuPopup._headingIconSize).toBeNull();

         menuPopup._headingIcon = 'testIcon';
         items.at(1).set('iconSize', null);
         menuPopup._dataLoadCallback(
            { parentProperty: 'parent', iconSize: 's', root: null },
            items
         );
         expect(menuPopup._headingIcon).toEqual('testIcon');
         expect(menuPopup._headingIconSize).toEqual('s');
      });

      describe('_beforeUpdate', () => {
         it('popup directions', () => {
            let menuPopup = new menu.Popup();
            let directionOptions = {
               stickyPosition: {
                  direction: {
                     vertical: 'top',
                     horizontal: 'left'
                  }
               }
            };
            menuPopup._options = {
               stickyPosition: {}
            };

            menuPopup._beforeUpdate(directionOptions);
            expect(menuPopup._verticalDirection).toEqual('top');
            expect(menuPopup._horizontalDirection).toEqual('left');

            menuPopup._beforeUpdate({
               ...directionOptions,
               footerContentTemplate: 'test'
            });
            expect(menuPopup._verticalDirection).toEqual('bottom');
            expect(menuPopup._horizontalDirection).toEqual('left');
         });

         it('headerContentTemplate changed', function () {
            let menuPopup = new menu.Popup();
            let menuPopupOptions = {
               stickyPosition: {}
            };

            menuPopupOptions.headerContentTemplate = 'testTemplate';
            menuPopup._beforeUpdate(menuPopupOptions);
            expect(menuPopup._headerTemplate).toEqual('testTemplate');

            menuPopupOptions = { ...menuPopupOptions };
            menuPopupOptions.headerContentTemplate = 'testTemplate2';
            menuPopup._beforeUpdate(menuPopupOptions);
            expect(menuPopup._headerTemplate).toEqual('testTemplate2');

            menuPopupOptions = { ...menuPopupOptions };
            menuPopupOptions.headerContentTemplate = null;
            menuPopup._beforeUpdate(menuPopupOptions);
            expect(menuPopup._headerTemplate).toEqual(null);
         });
      });

      it('_calmTimer', function () {
         const menuPopop = new menu.Popup();
         const menuOptions = {
            trigger: 'hover',
            headerContentTemplate: 'testTemplate'
         };
         let isClose = false;
         menuPopop._notify = function (eventName) {
            if (isClose) {
               expect(eventName).toEqual('close');
            } else {
               expect('false').toBe(true);
            }
         };
         jest.useFakeTimers();
         menuPopop._beforeMount(menuOptions);
         expect(!!menuPopop._calmTimer).toBe(true);
         menuPopop._mouseEvent({ type: 'mouseenter' });
         menuPopop._mouseEvent({ type: 'mouseleave' });
         isClose = true;
         jest.advanceTimersByTime(1500);

         menuPopop._mouseEvent({ type: 'mouseenter' });
         menuPopop._mouseEvent({ type: 'mouseleave' });
         menuPopop._mouseEvent({ type: 'mouseenter' });
         isClose = false;
         jest.advanceTimersByTime(1500);
         jest.useRealTimers();
      });

      it('_prepareSubMenuConfig', function () {
         const menuPopup = new menu.Popup();
         menuPopup._options = { root: '1' };
         const popupOptions = {
            direction: {
               horizontal: 'left'
            },
            targetPoint: {
               horizontal: 'left'
            },
            className: ''
         };
         menuPopup._horizontalDirection = 'right';

         menuPopup._prepareSubMenuConfig(
            { stopPropagation: jest.fn() },
            popupOptions,
            'right',
            'right'
         );
         expect(popupOptions.direction.horizontal).toEqual('right');
         expect(popupOptions.className).toEqual(
            ' controls-Menu__subMenu_marginLeft'
         );

         popupOptions.className = '';
         menuPopup._prepareSubMenuConfig(
            { stopPropagation: jest.fn() },
            popupOptions,
            'right',
            'left'
         );
         expect(popupOptions.direction.horizontal).toEqual('right');
         expect(popupOptions.className).toEqual(
            ' controls-Menu__subMenu_marginLeft-revert'
         );
      });
   });
});
