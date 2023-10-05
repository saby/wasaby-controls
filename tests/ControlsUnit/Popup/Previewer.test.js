define(['Controls/popup', 'Controls/popupTemplateStrategy', 'Vdom/Vdom'], (
   popup,
   popupStrategy,
   Vdom
) => {
   'use strict';
   const SyntheticEvent = Vdom.SyntheticEvent;
   const PreviewerControllerClass = popupStrategy.PreviewerController.constructor;
   describe('Controls/_popup/Previewer', () => {
      it('_contentMouseDownHandler', () => {
         let PWInstance = new popup.PreviewerTarget();
         var result;
         PWInstance.activate = jest.fn();
         PWInstance._isPopupOpened = function () {
            return false;
         };
         PWInstance._debouncedAction = function () {
            result = true;
         };
         var nativeEvent = {
            preventDefault: jest.fn(),
            stopPropagation: jest.fn(),
            which: 1
         };
         var event = new SyntheticEvent(nativeEvent, {});
         PWInstance._options.trigger = 'click';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(true);
         result = false;
         PWInstance._options.trigger = 'hover';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(false);
         PWInstance._options.trigger = 'hoverAndClick';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(true);

         // имитируем нажатие ПКМ
         nativeEvent.which = 3;
         event = new SyntheticEvent(nativeEvent, {});
         result = false;
         PWInstance._options.trigger = 'click';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(false);
         PWInstance._options.trigger = 'hover';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(false);
         PWInstance._options.trigger = 'hoverAndClick';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(false);
         PWInstance.destroy();
      });
      it('contentMouseenterHandler', () => {
         let PWInstance = new popup.PreviewerTarget();
         var cancel = false;
         PWInstance._cancel = function () {
            cancel = true;
         };
         var event = new SyntheticEvent(null, {});
         PWInstance._options.trigger = 'hover';
         PWInstance._isOpened = false;
         PWInstance._contentMouseenterHandler(event);
         expect(cancel).toEqual(false);
         PWInstance._isOpened = true;
         PWInstance._contentMouseenterHandler(event);
         expect(cancel).toEqual(true);
         PWInstance.destroy();
      });
      it('getConfig', () => {
         let PWInstance = new popup.PreviewerTarget();
         let targetPoint = {
            vertical: 'top'
         };
         let direction = {
            horizontal: 'left',
            vertical: 'top'
         };
         let options = {
            isCompoundTemplate: true,
            targetPoint,
            direction
         };
         let fittingMode = {
            vertical: 'adaptive',
            horizontal: 'overflow'
         };
         PWInstance.saveOptions(options);

         let config = PWInstance._getConfig();
         expect(config.targetPoint).toEqual(targetPoint);
         expect(config.direction).toEqual(direction);
         expect(config.isCompoundTemplate).toEqual(true);
         expect(config.fittingMode).toEqual(fittingMode);

         PWInstance.saveOptions({});
         config = PWInstance._getConfig();
         let baseCorner = {
            vertical: 'bottom',
            horizontal: 'right'
         };
         expect(config.targetPoint).toEqual(baseCorner);
         expect(config.hasOwnProperty('verticalAlign')).toEqual(false);
         expect(config.hasOwnProperty('horizontalAlign')).toEqual(false);
      });
   });

   describe('PreviewerController', () => {
      it('beforeElementDestroyed', () => {
         const Controller = new PreviewerControllerClass();
         const fakeItem = {
            childs: []
         };
         let result = Controller.beforeElementDestroyed(fakeItem);
         expect(result).toEqual(true);

         fakeItem.childs = [1, 2, 3]; // не пустой массив
         result = Controller.beforeElementDestroyed(fakeItem);
         expect(result).toEqual(false);

         fakeItem.removeInitiator = 'innerTemplate';
         result = Controller.beforeElementDestroyed(fakeItem);
         expect(result).toEqual(true);
      });
   });
});
