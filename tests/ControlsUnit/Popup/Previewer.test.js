define(['Controls/popupTargets', 'Controls/popupTemplateStrategy', 'Vdom/Vdom'], (
   popup,
   popupStrategy,
   Vdom
) => {
   'use strict';
   const DEFAULT_PROPS = {
      trigger: 'hoverAndClick',
      actionOnScroll: 'close',
      shouldWaitCursorToStop: true
   };
   const SyntheticEvent = Vdom.SyntheticEvent;
   const PreviewerControllerClass = popupStrategy.PreviewerController.constructor;
   describe('Controls/_popup/Previewer', () => {
      it('_contentMouseDownHandler', () => {
         let PWInstance = new popup.PreviewerTarget(DEFAULT_PROPS);
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
         PWInstance.props.trigger = 'click';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(true);
         result = false;
         PWInstance.props.trigger = 'hover';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(false);
         PWInstance.props.trigger = 'hoverAndClick';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(true);

         // имитируем нажатие ПКМ
         nativeEvent.which = 3;
         event = new SyntheticEvent(nativeEvent, {});
         result = false;
         PWInstance.props.trigger = 'click';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(false);
         PWInstance.props.trigger = 'hover';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(false);
         PWInstance.props.trigger = 'hoverAndClick';
         PWInstance._contentMouseDownHandler(event);
         expect(result).toEqual(false);
      });
      it('contentMouseenterHandler', () => {
         let PWInstance = new popup.PreviewerTarget({
            ...DEFAULT_PROPS,
            shouldWaitCursorToStop: true
         });
         var cancel = false;
         PWInstance._cancel = function () {
            cancel = true;
         };
         var event = new SyntheticEvent(null, {});
         PWInstance.props.trigger = 'hover';
         PWInstance._isOpened = false;
         PWInstance._contentMouseEnterHandler(event);
         expect(cancel).toEqual(false);
         PWInstance._isOpened = true;
         PWInstance._contentMouseEnterHandler(event);
         expect(cancel).toEqual(true);
      });
      it('getConfig', () => {
         let PWInstance = new popup.PreviewerTarget(DEFAULT_PROPS);
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
         PWInstance.props = options;

         let config = PWInstance._getConfig();
         expect(config.targetPoint).toEqual(targetPoint);
         expect(config.direction).toEqual(direction);
         expect(config.isCompoundTemplate).toEqual(true);
         expect(config.fittingMode).toEqual(fittingMode);

         PWInstance.props = {};
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
