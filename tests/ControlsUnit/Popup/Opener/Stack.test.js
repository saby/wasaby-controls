/* eslint-disable */
define([
   'Controls/_popupTemplateStrategy/Stack/StackStrategy',
   'Controls/popup',
   'Controls/popupTemplateStrategy',
   'Controls-demo/Popup/TestMaximizedStack',
   'Controls/_popupTemplateStrategy/BaseController',
   'Controls/_popupTemplateStrategy/Stack/Template/StackContent',
   'Env/Env'
], (
   StackStrategyMod,
   popupMod,
   popupStrategy,
   TestMaximizedStack,
   BaseController,
   StackContent,
   Env
) => {
   'use strict';
   var StackStrategyClass = StackStrategyMod.StackStrategy;
   var StackStrategy = popupStrategy.StackStrategy;
   var Controller = popupMod.Controller;
   // eslint-disable-next-line no-param-reassign
   BaseController = new BaseController.default();
   // eslint-disable-next-line no-param-reassign
   StackContent = StackContent.default;
   Controller.setRightPanelBottomTemplate('rightTemplate');
   StackStrategy._goUpByControlTree = () => {
      return [];
   };

   describe('Controls/_popupStrategy/Stack/Opener/StackContent', () => {
      it('canResize', () => {
         let stackC = new StackContent();
         expect(false).toEqual(stackC._canResize(1, 2, 3, null));
         expect(false).toEqual(stackC._canResize(1, 2, null, 4));
         expect(false).toEqual(stackC._canResize(1, null, 3, 4));
         expect(false).toEqual(stackC._canResize(null, 2, 3, 4));
         expect(false).toEqual(stackC._canResize(1, 2, 3, 3));
         expect(true).toEqual(stackC._canResize(1, 2, 3, 4));
         stackC.destroy();
      });
   });

   describe('Controls/_popup/Opener/Stack', () => {
      StackStrategy.getMaxPanelWidth = ({ right = 0 } = {}) => {
         return 1000 - right;
      };
      popupStrategy.StackController._getWindowSize = () => {
         return {
            width: 1000,
            height: 1000
         };
      };
      popupStrategy.StackController._getContainerWidth = function (items) {
         return items ? items.templateWidth : 0;
      };

      popupStrategy.StackController._getSideBarWidth = function () {
         return 200;
      };

      new popupStrategy.Controller().init();

      let item = {
         popupOptions: {
            minWidth: 600,
            maxWidth: 800,
            templateOptions: {}
         }
      };

      it('Should return correct maximized state', () => {
         const isServerSide = Env.constants.isServerSide;
         Env.constants.isServerSide = false;

         jest
            .spyOn(popupStrategy.StackController, '_getStackParentCoords')
            .mockClear()
            .mockImplementation();
         let innerItem = {
            popupOptions: {
               minimizedWidth: 1,
               templateOptions: {
                  maximized: false
               }
            }
         };
         let result = popupStrategy.StackController.getMaximizedState(innerItem);
         expect(result).toBe(false);
         innerItem = {
            popupOptions: {
               minWidth: 800,
               maxWidth: 900,
               width: 900
            }
         };
         result = popupStrategy.StackController.getMaximizedState(innerItem);
         expect(result).toBe(true);
         innerItem = {
            popupOptions: {
               minWidth: 800,
               maxWidth: 1300,
               width: 950
            }
         };
         result = popupStrategy.StackController.getMaximizedState(innerItem);
         expect(result).toBe(true);

         Env.constants.isServerSide = true;

         innerItem = {
            popupOptions: {
               minWidth: 800,
               maxWidth: 900,
               width: 900
            }
         };
         result = popupStrategy.StackController.getMaximizedState(innerItem);
         expect(result).toBe(true);

         Env.constants.isServerSid = isServerSide;
         jest.restoreAllMocks();
      });

      it('stack with config sizes', () => {
         var position = StackStrategy.getPosition(
            {
               top: 0,
               right: 0,
               height: 20
            },
            item
         );
         expect(position.maxWidth === item.popupOptions.maxWidth).toBe(true);
         expect(position.top === 0).toBe(true);
         expect(position.right === 0).toBe(true);
         expect(position.position === 'fixed').toBe(true);
      });

      it('stack shadow', () => {
         let baseGetItemPosition = popupStrategy.StackController._getItemPosition;
         popupStrategy.StackController._updateItemPosition = (popupItem) => {
            if (!popupItem.position) {
               popupItem.position = {};
            }
         };
         popupStrategy.StackController._updatePopupWidth = jest.fn();
         popupStrategy.StackController._stack.add({
            position: { width: 720 },
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 600,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            position: { width: 600 },
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            position: { width: 50, right: 950 },
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            position: { width: 840 },
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 600,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 720,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 200,
            currentZIndex: 10,
            popupState: 'destroying',
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 200,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });

         popupStrategy.StackController._update();
         expect(popupStrategy.StackController._stack.at(0).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(1).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(2).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(3).position.hidden).toBe(false);
         expect(popupStrategy.StackController._stack.at(4).position.hidden).toBe(false);
         expect(popupStrategy.StackController._stack.at(5).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(6).position.hidden).toBe(false);

         // 7 индекс не интересен, потому что popupState: 'destroying'. Проверяем, что не повлиял на 8 индекс
         // assert.isTrue(popupStrategy.StackController._stack.at(7).position.hidden);
         expect(popupStrategy.StackController._stack.at(8).position.hidden).toBe(false);

         popupStrategy.StackController._stack.add({
            containerWidth: 1100,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 850,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 950,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 1100,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 850,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            containerWidth: 950,
            currentZIndex: 10,
            popupOptions: { stackClassName: '' }
         });
         popupStrategy.StackController._stack.add({
            position: {},
            currentZIndex: 10,
            containerWidth: 711,
            popupOptions: { stackClassName: '' }
         });

         popupStrategy.StackController._update();
         popupStrategy.StackController._getItemPosition = baseGetItemPosition;

         expect(popupStrategy.StackController._stack.at(0).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(1).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(2).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(3).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(4).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(5).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(6).position.hidden).toBe(true);

         // 7 индекс не интересен, потому что popupState: 'destroying'. Проверяем, что не повлиял на 8 индекс
         // assert.isTrue(popupStrategy.StackController._stack.at(7).position.hidden);
         expect(popupStrategy.StackController._stack.at(8).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(9).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(10).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(11).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(12).position.hidden).toBe(false);
         expect(popupStrategy.StackController._stack.at(13).position.hidden).toBe(true);
         expect(popupStrategy.StackController._stack.at(14).position.hidden).toBe(false);
         expect(popupStrategy.StackController._stack.at(15).position.hidden).toBe(false);
      });

      it('validate Configuration', () => {
         let innerItem = {
            popupOptions: {
               width: 1000,
               minWidth: 700,
               maxWidth: 600
            }
         };
         popupStrategy.StackController._validateConfiguration(innerItem, 'width');
         expect(700).toEqual(innerItem.popupOptions.width);
         expect(700).toEqual(innerItem.popupOptions.minWidth);
         expect(700).toEqual(innerItem.popupOptions.maxWidth);

         innerItem = {
            popupOptions: {
               width: 1000,
               minWidth: 700
            }
         };
         expect(1000).toEqual(innerItem.popupOptions.width);
         expect(700).toEqual(innerItem.popupOptions.minWidth);
      });

      it('prepareSize', () => {
         let storages = [{ width: 1 }, { width: 2 }, { width: 3 }];
         let result = popupStrategy.StackController._prepareSize(storages, 'width');
         expect(1).toEqual(result);

         storages = [{ width: NaN }, { width: 2 }, { width: 3 }];
         result = popupStrategy.StackController._prepareSize(storages, 'width');
         expect(2).toEqual(result);

         storages = [{ width: NaN }, { width: '100%' }, { width: 3 }];
         result = popupStrategy.StackController._prepareSize(storages, 'width');
         expect(3).toEqual(result);

         storages = [{ width: NaN }, { width: '100%' }, { width: '3px' }];
         result = popupStrategy.StackController._prepareSize(storages, 'width');
         expect(3).toEqual(result);
      });
      it('stack default position', () => {
         let upd = popupStrategy.StackController._update;
         let notUpdate = true;
         popupStrategy.StackController._update = () => {
            notUpdate = !notUpdate;
         };
         popupStrategy.StackController._getWindowSize = () => {
            return {
               width: 1920,
               height: 950
            };
         }; // Этот метод зовет получение размеров окна, для этих тестов не нужно
         popupStrategy.StackController._getStackParentCoords = () => {
            return {
               top: 0,
               right: 0
            };
         }; // Этот метод зовет получение размеров окна, для этих тестов не нужно
         let itemConfig = {
            id: '555444333',
            popupOptions: item.popupOptions
         };
         itemConfig.popupOptions.template = TestMaximizedStack;
         itemConfig.popupOptions.minimizedWidth = undefined;
         popupStrategy.StackController.getDefaultConfig(itemConfig);
         popupStrategy.StackController.getDefaultConfig(itemConfig);
         popupStrategy.StackController.getDefaultConfig(itemConfig);

         expect(itemConfig.position.top).toEqual(0);
         expect(itemConfig.position.right).toEqual(0);
         expect(itemConfig.position.width).toEqual(800);
         expect(itemConfig.popupOptions.content).toEqual(StackContent);
         expect(itemConfig.position.hidden).toEqual(undefined);

         let itemCount = 0;
         let items = popupStrategy.StackController._stack;
         for (let i = 0; i < items.getCount(); i++) {
            if (items.at(i).id === itemConfig.id) {
               itemCount++;
            }
         }
         expect(itemCount).toEqual(1);
         expect(notUpdate).toEqual(true);
         popupStrategy.StackController._update = upd;
      });

      it('stack maximized default options', () => {
         let itemConfig = {
            popupOptions: {
               templateOptions: {},
               template: TestMaximizedStack
            }
         };
         popupStrategy.StackController.getDefaultConfig(itemConfig);
         expect(itemConfig.popupOptions.currentMinWidth).toEqual(500);
         expect(itemConfig.popupOptions.currentMaxWidth).toEqual(1000);
         expect(itemConfig.popupOptions.currentWidth).toEqual(800);

         itemConfig = {
            popupOptions: {
               minWidth: 600,
               maxWidth: 900,
               templateOptions: {},
               template: TestMaximizedStack
            }
         };
         popupStrategy.StackController.getDefaultConfig(itemConfig);
         expect(itemConfig.popupOptions.minWidth).toEqual(600);
         expect(itemConfig.popupOptions.maxWidth).toEqual(900);
         expect(itemConfig.popupOptions.width).toEqual(800);
      });
      it('last stack className', () => {
         let baseGetItemPosition = popupStrategy.StackController._getItemPosition;
         popupStrategy.StackController._getItemPosition = (items) => {
            return items.position;
         };
         popupStrategy.StackController._stack.clear();
         popupStrategy.StackController._getDefaultConfig({
            position: { width: 720 },
            popupOptions: { className: '' }
         });
         expect(
            popupStrategy.StackController._stack
               .at(0)
               .popupOptions.className.indexOf('controls-Stack__last-item') >= 0
         ).toBe(true);
         popupStrategy.StackController._update();
         expect(
            popupStrategy.StackController._stack
               .at(0)
               .popupOptions.className.indexOf('controls-Stack__last-item') >= 0
         ).toBe(true);
         popupStrategy.StackController._stack.add({
            containerWidth: 1100,
            popupOptions: { className: '' }
         });
         popupStrategy.StackController._update();
         expect(
            popupStrategy.StackController._stack
               .at(0)
               .popupOptions.className.indexOf('controls-Stack__last-item') < 0
         ).toBe(true);
         expect(
            popupStrategy.StackController._stack
               .at(1)
               .popupOptions.className.indexOf('controls-Stack__last-item') >= 0
         ).toBe(true);
         popupStrategy.StackController._stack.add({
            containerWidth: 720,
            popupOptions: { className: '' }
         });
         popupStrategy.StackController._update();
         expect(
            popupStrategy.StackController._stack
               .at(0)
               .popupOptions.className.indexOf('controls-Stack__last-item') < 0
         ).toBe(true);
         expect(
            popupStrategy.StackController._stack
               .at(1)
               .popupOptions.className.indexOf('controls-Stack__last-item') < 0
         ).toBe(true);
         expect(
            popupStrategy.StackController._stack
               .at(2)
               .popupOptions.className.indexOf('controls-Stack__last-item') >= 0
         ).toBe(true);
         popupStrategy.StackController._getItemPosition = baseGetItemPosition;
      });
      it('stack panel maximized', () => {
         // Этот метод зовет получение размеров окна, для этих тестов не нужно
         popupStrategy.StackController._update = jest.fn();

         // Этот метод зовет получение размеров окна, для этих тестов не нужно
         popupStrategy.StackController._prepareSizes = jest.fn();
         popupStrategy.StackController._getWindowSize = () => {
            return {
               width: 1920,
               height: 950
            };
         }; // Этот метод зовет получение размеров окна, для этих тестов не нужно

         let popupOptions = {
            minimizedWidth: 900,
            minWidth: 800,
            maxWidth: 1200,
            templateOptions: {}
         };
         let itemConfig = {
            popupOptions: popupOptions
         };

         StackStrategy.getMaxPanelWidth = ({ right = 0 }) => {
            return 1600 - right;
         };

         expect(StackStrategy.isMaximizedPanel(itemConfig)).toEqual(true);

         itemConfig.popupOptions.template = TestMaximizedStack;
         popupStrategy.StackController.getDefaultConfig(itemConfig);
         expect(itemConfig.popupOptions.maximized).toEqual(false); // default value
         expect(
            itemConfig.popupOptions.templateOptions.hasOwnProperty('maximizeButtonVisibility')
         ).toEqual(true);

         const stubSavePopupWidth = jest
            .spyOn(popupStrategy.StackController, '_savePopupWidth')
            .mockClear()
            .mockImplementation();
         popupStrategy.StackController.elementMaximized(itemConfig, {}, false);
         expect(itemConfig.popupOptions.maximized).toEqual(false);
         expect(itemConfig.popupOptions.templateOptions.maximized).toEqual(false);
         expect(stubSavePopupWidth).toHaveBeenCalledTimes(1);
         let position = StackStrategy.getPosition(
            {
               top: 0,
               right: 0
            },
            itemConfig
         );
         expect(position.width).toEqual(popupOptions.minimizedWidth);

         popupStrategy.StackController.elementMaximized(itemConfig, {}, true);
         expect(itemConfig.popupOptions.maximized).toEqual(true);
         expect(itemConfig.popupOptions.templateOptions.maximized).toEqual(true);
         position = StackStrategy.getPosition(
            {
               top: 0,
               right: 0
            },
            itemConfig
         );
         expect(position.maxWidth).toEqual(popupOptions.maxWidth);

         popupStrategy.StackController._prepareMaximizedState(itemConfig);
         expect(itemConfig.popupOptions.templateOptions.maximizeButtonVisibility).toEqual(true);

         StackStrategy.getMaxPanelWidth = ({ right = 0 }) => {
            return 800 - right;
         };
         popupStrategy.StackController._prepareMaximizedState(itemConfig);
         expect(itemConfig.popupOptions.templateOptions.maximizeButtonVisibility).toEqual(false);
         delete itemConfig.popupOptions.width;
      });

      it('stack maximized with propStorageId', async () => {
         let popupWidth;
         const baseParentPosition = StackStrategy._getParentPosition;
         const parentPosition = {
            right: 0
         };
         StackStrategy._getParentPosition = () => {
            return parentPosition;
         };
         StackStrategy.getMaxPanelWidth = ({ right = 0 }) => {
            return 1600 - right;
         };
         const controller = new popupStrategy.StackControllerClass();
         controller._getPopupWidth = (popupItem) => {
            controller._writeCompatiblePopupWidth(popupItem, popupWidth);
            return Promise.resolve(popupWidth);
         };
         controller._prepareSizes = jest.fn();
         controller._getStackParentCoords = () => {
            return {
               top: 0,
               right: 0,
               width: 1600,
               height: 1000
            };
         };
         controller._updatePopupWidth = jest.fn();
         controller._updateSideBarVisibility = jest.fn();
         controller._savePopupWidth = () => {
            return Promise.resolve();
         };

         const innerItem = {
            popupOptions: {
               propStorageId: 'storage',
               minWidth: 700,
               maxWidth: 1000,
               templateOptions: {}
            }
         };

         popupWidth = 900;
         await controller.getDefaultConfig(innerItem);
         controller.elementUpdated(innerItem, {});
         expect(innerItem.popupOptions.maximized).toBe(true);

         popupWidth = 800;
         await controller.getDefaultConfig(innerItem);
         controller.elementUpdated(innerItem, {});
         expect(innerItem.popupOptions.maximized).toBe(false);

         await controller.popupMovingSize(innerItem, { x: 150 });
         expect(innerItem.popupOptions.maximized).toBe(true);

         StackStrategy._getParentPosition = baseParentPosition;
      });

      it('stack right position with side parent position', () => {
         const baseParentPosition = StackStrategy._getParentPosition;
         const parentPosition = {
            right: 0
         };
         StackStrategy._getParentPosition = () => {
            return parentPosition;
         };
         StackStrategy.getMaxPanelWidth = ({ right = 0 }) => {
            return 1600 - right;
         };

         const popupOptions = {
            minWidth: 900,
            maxWidth: 1200,
            templateOptions: {}
         };
         const itemConfig = {
            popupOptions: popupOptions
         };

         const position = StackStrategy.getPosition(
            {
               top: 0,
               right: 100
            },
            itemConfig
         );

         // Тут странно, надо посмотреть внимательнее
         expect(position.right).toEqual(100);

         StackStrategy._getParentPosition = baseParentPosition;
      });

      it('stack state', () => {
         let itemConfig = {
            id: '22',
            childs: [],
            popupOptions: item.popupOptions
         };

         // Этот метод зовет получение размеров окна, для этих тестов не нужно
         popupStrategy.StackController._update = jest.fn();

         // Этот метод зовет получение размеров окна, для этих тестов не нужно
         popupStrategy.StackController._prepareSizes = jest.fn();
         popupStrategy.StackController._getWindowSize = () => {
            return {
               width: 1920,
               height: 950
            };
         }; // Этот метод зовет получение размеров окна, для этих тестов не нужно

         popupStrategy.StackController.elementCreatedWrapper(itemConfig, {
            querySelector: () => null
         });

         // Зависит от того где запускаем тесты, под нодой или в браузере
         expect(
            itemConfig.popupState === BaseController.POPUP_STATE_CREATED ||
               itemConfig.popupState === BaseController.POPUP_STATE_CREATING
         ).toBe(true);

         expect(itemConfig.popupState).toEqual(BaseController.POPUP_STATE_CREATED);

         itemConfig.popupOptions.className = '';
         popupStrategy.StackController.elementUpdatedWrapper(itemConfig, {});
         popupStrategy.StackController.elementUpdatedWrapper(itemConfig, {});
         popupStrategy.StackController.elementUpdatedWrapper(itemConfig, {});

         // класс обновился, потому что состояние было opened. После множ. update класс не задублировался
         expect(itemConfig.popupState).toEqual(BaseController.POPUP_STATE_UPDATING);
         expect(itemConfig.popupOptions.className).toEqual('');

         popupStrategy.StackController.elementAfterUpdatedWrapper(itemConfig, {});
         expect(itemConfig.popupState).toEqual(BaseController.POPUP_STATE_UPDATED);

         itemConfig.popupState = 'notOpened';
         itemConfig.popupOptions.className = '';
         popupStrategy.StackController.elementUpdatedWrapper(itemConfig, {});

         // класс не обновился, потому что состояние не opened
         expect(itemConfig.popupOptions.className).toEqual('');

         popupStrategy.StackController.elementDestroyedWrapper(itemConfig, {});

         // Зависит от того где запускаем тесты, под нодой или в браузере
         expect(
            itemConfig.popupState === BaseController.POPUP_STATE_DESTROYING ||
               itemConfig.popupState === BaseController.POPUP_STATE_DESTROYED
         ).toBe(true);

         itemConfig._destroyDeferred.addCallback(function () {
            expect(itemConfig.popupState).toEqual(BaseController.POPUP_STATE_DESTROYED);
         });
      });

      it('stack update childs position', () => {
         let defaultPosition = {
               width: 0
            },
            itemConfig = {
               controller: popupStrategy.StackController,
               position: defaultPosition,
               childs: [
                  {
                     controller: popupStrategy.StackController,
                     position: defaultPosition
                  },
                  {
                     controller: popupStrategy.StickyController,
                     position: defaultPosition
                  }
               ],
               popupOptions: item.popupOptions
            };
         popupStrategy.StackController.elementUpdatedWrapper(itemConfig, {});
         const updateItemPositionSpy = jest
            .spyOn(popupStrategy.StackController, '_update')
            .mockClear();

         popupStrategy.StackController.elementAfterUpdated(itemConfig, {});
         expect(updateItemPositionSpy).toHaveBeenCalled();
      });

      it('stack from target container', () => {
         var position = StackStrategy.getPosition(
            {
               top: 100,
               right: 100,
               height: 20
            },
            item
         );
         expect(position.maxWidth).toEqual(item.popupOptions.maxWidth);
         expect(position.top === 100).toBe(true);
         expect(position.right === 100).toBe(true);
         expect(position.bottom === 0).toBe(true);
         expect(position.height === undefined).toBe(true);
      });
      it('stack without config sizes', () => {
         StackStrategy.getMaxPanelWidth = ({ right = 0 } = {}) => {
            return 1000 - right;
         };
         let innerItem = {
            popupOptions: {},
            containerWidth: 800
         };
         var position = StackStrategy.getPosition(
            {
               top: 0,
               right: 0,
               height: 20
            },
            innerItem
         );
         expect(position.width).toEqual(undefined);
         expect(position.top === 0).toBe(true);
         expect(position.right === 0).toBe(true);
         expect(position.bottom === 0).toBe(true);
         expect(position.height === undefined).toBe(true);

         innerItem.containerWidth = 1200;
         position = StackStrategy.getPosition(
            {
               top: 0,
               right: 0
            },
            innerItem
         );
         expect(position.width).toEqual(undefined);
      });

      it('stack with wrong options type', () => {
         let innerItem = {
            popupOptions: {
               minWidth: '600',
               maxWidth: '800'
            }
         };
         var position = StackStrategy.getPosition(
            {
               top: 0,
               right: 0
            },
            innerItem
         );
         expect(position.maxWidth).toEqual(parseInt(innerItem.popupOptions.maxWidth, 10));
      });

      it('stack reduced width', () => {
         StackStrategy.getMaxPanelWidth = ({ right = 0 } = {}) => {
            return 1000 - right;
         };
         let innerItem = {
            popupOptions: {
               minWidth: 600,
               maxWidth: 1800
            }
         };
         var position = StackStrategy.getPosition(
            {
               top: 0,
               right: 0
            },
            innerItem
         );
         expect(position.top === 0).toBe(true);
         expect(position.right === 0).toBe(true);
      });

      it('stack reset offset', () => {
         let innerItem = {
            popupOptions: {
               minWidth: 800,
               maxWidth: 1800
            }
         };
         var position = StackStrategy.getPosition(
            {
               top: 0,
               right: 300
            },
            innerItem
         );
         expect(position.width).toEqual(innerItem.popupOptions.minWidth);
         expect(position.top === 0).toBe(true);

         // maxPanelWidthWithOffset = 600
         expect(position.right === 300).toBe(true);
      });

      it('stack width', () => {
         const minWidth = 800;
         let innerItem = {
            popupOptions: {
               minWidth,
               width: 900,
               maxWidth: 1200
            }
         };
         let position = StackStrategy.getPosition(
            {
               top: 0,
               right: 400
            },
            innerItem
         );
         expect(position.width).toEqual(minWidth);

         innerItem.popupOptions.width = 1200;
         position = StackStrategy.getPosition(
            {
               top: 0,
               right: 400
            },
            innerItem
         );
         expect(position.maxWidth).toEqual(minWidth);
         expect(position.width).toEqual(minWidth);

         // maxPanelWidthWithOffset = 600
         expect(position.right).toEqual(400);
      });

      it('stack max width', () => {
         StackStrategy.getMaxPanelWidth = ({ right = 0 } = {}) => {
            return 1000 - right;
         };
         let tCoords = {
            right: 100
         };
         let popupOptions = {};
         let maxWidth = StackStrategy._calculateMaxWidth(popupOptions, tCoords);
         expect(maxWidth).toEqual(900);

         popupOptions.maxWidth = 400;
         maxWidth = StackStrategy._calculateMaxWidth(popupOptions, tCoords);
         expect(maxWidth).toEqual(400);

         popupOptions.maxWidth = 2000;
         maxWidth = StackStrategy._calculateMaxWidth(popupOptions, tCoords);
         expect(maxWidth).toEqual(900);

         popupOptions.minWidth = 1000;
         maxWidth = StackStrategy._calculateMaxWidth(popupOptions, tCoords);
         expect(maxWidth).toEqual(1000);
      });

      it('stack optimize open', () => {
         const Controller1 = popupStrategy.StackController;
         Controller1._stack.clear();
         const basePrepareSize = Controller1._prepareSizes;
         const basePrepareSizeWithoutDom = Controller1._prepareSizeWithoutDOM;
         const baseUpdate = Controller1._update;
         const baseGetItemPosition = Controller1._getItemPosition;
         let isPrepareSizeCalled = false;
         let isPrepareSizeWithoutDomCalled = false;
         let isUpdateCalled = false;
         let isCalcPoistionCalled = false;

         Controller1._prepareSizes = () => {
            isPrepareSizeCalled = true;
         };
         Controller1._prepareSizeWithoutDOM = () => {
            isPrepareSizeWithoutDomCalled = true;
         };
         Controller1._update = () => {
            isUpdateCalled = true;
         };
         Controller1._getItemPosition = () => {
            isCalcPoistionCalled = true;
            return { width: 720 };
         };
         let innerItem = {
            position: { width: 720 },
            popupOptions: { stackClassName: '' }
         };

         Controller1.getDefaultConfig(innerItem);
         expect(isPrepareSizeCalled).toEqual(false);
         expect(isPrepareSizeWithoutDomCalled).toEqual(true);
         expect(isUpdateCalled).toEqual(false);

         isPrepareSizeWithoutDomCalled = false;
         Controller1.elementCreated(innerItem);
         expect(isPrepareSizeCalled).toEqual(false);
         expect(isPrepareSizeWithoutDomCalled).toEqual(true);
         expect(isUpdateCalled).toEqual(false);
         expect(isCalcPoistionCalled).toEqual(true);

         isPrepareSizeWithoutDomCalled = false;
         Controller1._stack.add({
            position: { width: 720 },
            popupOptions: { stackClassName: '' }
         });
         Controller1.elementCreated(innerItem);
         expect(isPrepareSizeCalled).toEqual(true);
         expect(isPrepareSizeWithoutDomCalled).toEqual(false);
         expect(isUpdateCalled).toEqual(true);

         Controller1._prepareSizes = basePrepareSize;
         Controller1._prepareSizeWithoutDOM = basePrepareSizeWithoutDom;
         Controller1._getItemPosition = baseGetItemPosition;
         Controller1._update = baseUpdate;
      });

      it('stack compatible popup', () => {
         let innerItem = {
            position: {},
            popupOptions: {
               template: {},
               minWidth: 800,
               maxWidth: 900,
               isCompoundTemplate: true
            }
         };
         popupStrategy.StackController.getDefaultConfig(innerItem);
         expect(innerItem.position.top).toEqual(-10000);
         expect(innerItem.position.left).toEqual(-10000);

         let targetPos = {
            top: 0,
            right: 0
         };

         popupStrategy.StackController._getStackParentCoords = () => {
            return targetPos;
         };

         popupStrategy.StackController.elementCreated(innerItem);
         expect(innerItem.position.width).toEqual(undefined);
      });

      it('stack resizing', () => {
         let innerItem = {
            popupOptions: {
               template: {},
               mnWidth: 500,
               width: 700,
               minSavedWidth: 655,
               maxSavedWidth: 760,
               minWidth: 500,
               maxWidth: 900,
               templateOptions: {}
            },
            position: {
               width: 0
            }
         };
         let offset1 = { x: 200 },
            offset2 = { x: -300 },
            offset3 = { x: 190 },
            offset4 = { x: 30 };
         popupStrategy.StackController.popupMovingSize(innerItem, offset1);
         expect(innerItem.popupOptions.width).toEqual(900);
         expect(innerItem.maxSavedWidth).toEqual(900);
         popupStrategy.StackController.popupMovingSize(innerItem, offset2);
         expect(innerItem.popupOptions.width).toEqual(600);
         expect(innerItem.minSavedWidth).toEqual(600);

         // min = 690, max = 720 => min должен сброситься в минимальное положение
         popupStrategy.StackController.popupMovingSize(innerItem, offset3);
         popupStrategy.StackController.popupMovingSize(innerItem, offset4);
         expect(innerItem.minSavedWidth).toEqual(820);
      });
      it('stack resizing', () => {
         let stackContentInstance = new StackContent({});
         let innerItem = {
            currentMinWidth: 500,
            currentMaxWidth: 1200,
            currentWidth: 700
         };
         stackContentInstance._beforeMount(innerItem);
         expect(stackContentInstance._minOffset).toEqual(200);
         expect(stackContentInstance._maxOffset).toEqual(500);
         innerItem.currentWidth += 200;
         stackContentInstance._beforeUpdate(innerItem);
         expect(stackContentInstance._minOffset).toEqual(400);
         expect(stackContentInstance._maxOffset).toEqual(300);
      });
      it('prepare propStorageId', () => {
         const innerItem = {
            popupOptions: {
               template: {
                  getDefaultOptions: () => {
                     return {
                        propStorageId: 111
                     };
                  }
               }
            }
         };
         popupStrategy.StackController._preparePropStorageId(innerItem);
         expect(111).toEqual(innerItem.popupOptions.propStorageId);

         innerItem.popupOptions.propStorageId = 222;
         popupStrategy.StackController._preparePropStorageId(innerItem);
         expect(222).toEqual(innerItem.popupOptions.propStorageId);
      });

      it('updateSideBarVisibility', () => {
         const Controller1 = popupStrategy.StackController;
         Controller1._stack.clear();
         Controller1._stack.add({
            popupOptions: { width: 720 }
         });
         Controller1._updateSideBarVisibility();

         // не надо нотифаить скрытие аккордеона
         expect(Controller1._sideBarVisible).toEqual(true);

         Controller1._stack.add({
            popupOptions: { width: 2000 }
         });
         Controller1._updateSideBarVisibility();

         // для аккордеона нет места
         expect(Controller1._sideBarVisible).toEqual(false);
      });

      it('test stack getPanelWidth. When the width of the panel with the property "isCompoundTemplate: true" is greater than the width of the browser window', () => {
         const innerItem = {
            popupOptions: {
               isStack: true,
               minWidth: 950,
               maxWidth: 1150,
               width: 950,
               isCompoundTemplate: true
            }
         };
         StackStrategy.getMaxPanelWidth = ({ right }) => {
            return 924 - right;
         };
         StackStrategy.getParentPosition = () => {
            return undefined;
         };
         let tCoords = {
            right: 150,
            top: 0
         };

         // document.body.clientWidth = 1024, maxPanelWidth = 1024 - 100 = 924
         const panelWidth = StackStrategy._getPanelWidth(
            innerItem,
            tCoords,
            StackStrategy.getMaxPanelWidth(tCoords)
         );
         expect(panelWidth).toEqual(950);

         /* Так как окно спозиционируется с координатами right: 150 с шириной 950 - то панель не влезет в окно браузера.
            Если панель не уместилась по ширине, то позиционирование панели осуществляется от правого края экрана.
            Проверяем координаты right. */
         // UPD: Если окно не помещается на экран, то позиицонируем его так же, просто добавляется скролл
         expect(tCoords.right).toEqual(150);
      });

      it('workspaceResize', () => {
         const baseUpdate = popupStrategy.StackController._update;
         let isUpdateCalled = false;
         popupStrategy.StackController._update = () => {
            isUpdateCalled = true;
         };
         popupStrategy.StackController.workspaceResize();
         expect(isUpdateCalled).toEqual(true);

         popupStrategy.StackController._update = baseUpdate;
      });

      it('stack need redraw after created', () => {
         const innerItem = {
            position: { stackWidth: 720 },
            popupOptions: { className: '' }
         };
         let updateItemPosition = popupStrategy.StackController._updateItemPosition(innerItem);
         popupStrategy.StackController._updateItemPosition = () => {
            return false;
         };
         popupStrategy.StackController._stack.clear();
         popupStrategy.StackController._stack.add(innerItem);
         let result = popupStrategy.StackController.elementCreated(innerItem);
         expect(!!result).toEqual(false);

         popupStrategy.StackController._updateItemPosition = () => {
            return true;
         };
         result = popupStrategy.StackController.elementCreated(innerItem);
         expect(!!result).toEqual(true);

         popupStrategy.StackController._stack.add(innerItem);
         result = popupStrategy.StackController.elementCreated(innerItem);
         expect(!!result).toEqual(true);
         popupStrategy.StackController._updateItemPosition = updateItemPosition;
      });

      describe('strategy getHorizontalPosition', () => {
         [
            {
               isAboveMaximizePopup: false,
               position: 'right',
               result: 10
            },
            {
               isAboveMaximizePopup: true,
               position: 'right',
               result: 54
            },
            {
               isAboveMaximizePopup: false,
               position: 'left',
               result: 20
            },
            {
               isAboveMaximizePopup: true,
               position: 'left',
               result: 0
            }
         ].forEach((test, index) => {
            it('should return correct coords ' + index, () => {
               const Strategy = new StackStrategyClass();
               const tCoord = {
                  right: 10,
                  left: 20
               };
               let result = Strategy._getHorizontalPosition(
                  tCoord,
                  test.isAboveMaximizePopup,
                  test.position
               );
               expect(result).toEqual(test.result);
            });
         });
      });
   });
});
