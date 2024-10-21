define(['Controls/_popupTemplateStrategy/BaseController', 'Controls/popupTemplateStrategy'], (
   BaseController,
   popupStrategy
) => {
   'use strict';
   describe('Controls/_popupTemplateStrategy/BaseController', () => {
      new popupStrategy.Controller().init();
      // eslint-disable-next-line no-param-reassign
      BaseController = BaseController.default;
      it('Controller popup sizes', () => {
         let BCInstacne = new BaseController();
         let config = {
            popupOptions: {
               maxWidth: 200,
               width: 150,
               maxHeight: 200
            }
         };

         let container = {
            getBoundingClientRect: () => {
               return {
                  width: 100,
                  height: 100
               };
            }
         };

         BCInstacne._getMargins = jest.fn();
         BCInstacne._getPopupSizes(config, container);
         expect(config.sizes.width).toEqual(150);
         expect(config.sizes.height).toEqual(100);

         config.popupOptions.className = '1';
         BCInstacne._getPopupSizes(config, container);

         config.popupOptions = {};

         BCInstacne._getPopupSizes(config, container);

         expect(config.sizes.width).toEqual(100);
         expect(config.sizes.height).toEqual(100);
      });

      it('search maximized popup', () => {
         let BCInstacne = new BaseController();
         let hasMaximizePopup = BCInstacne._isAboveMaximizePopup({});
         expect(hasMaximizePopup).toEqual(false);

         BCInstacne._goUpByControlTree = () => {
            return [
               {
                  _moduleName: 'Controls/popupTemplateStrategy:Popup',
                  _options: {
                     maximize: true
                  }
               }
            ];
         };

         hasMaximizePopup = BCInstacne._isAboveMaximizePopup({});
         expect(hasMaximizePopup).toEqual(true);
      });

      it('getFakeDivMargins', () => {
         let BCInstacne = new BaseController();
         BCInstacne._getFakeDiv = () => {
            return {
               currentStyle: {
                  marginTop: '10.2px',
                  marginLeft: '11.4px'
               }
            };
         };
         BCInstacne._getContainerStyles = (container) => {
            return container.currentStyle;
         };

         const item = {
            popupOptions: {}
         };

         const margins = BCInstacne._getFakeDivMargins(item);
         expect(margins.left).toEqual(11.4);
         expect(margins.top).toEqual(10.2);
      });

      it('getMargins', () => {
         let BCInstacne = new BaseController();
         let margins = {
            top: 1,
            left: 2
         };
         BCInstacne._getFakeDivMargins = () => {
            return margins;
         };
         let item = {
            popupOptions: {
               maxWidth: 200,
               width: 150,
               maxHeight: 200
            }
         };
         expect({
            left: 0,
            top: 0,
            right: 0
         }).toEqual(BCInstacne._getMargins(item));

         item.popupOptions.className = '1';
         expect({
            left: 2,
            top: 1,
            right: 0
         }).toEqual(BCInstacne._getMargins(item));

         margins = {
            top: 3,
            left: 4,
            right: 0
         };
         expect({
            left: 2,
            top: 1,
            right: 0
         }).toEqual(BCInstacne._getMargins(item));

         item.popupOptions.className = '2';
         expect({
            left: 4,
            top: 3,
            right: 0
         }).toEqual(BCInstacne._getMargins(item));
      });
   });
});
