define([
   'Controls/_popupTemplateStrategy/Sticky/StickyStrategy',
   'Controls/_popupTemplateStrategy/Sticky/StickyController',
   'Controls/_popupTemplateStrategy/Util/PopupConfigUtil',
   'Controls/popupTemplateStrategy',
   'Controls/popup',
   'UI/Base',
   'Core/core-clone',
   'UI/Utils'
], (
   StickyStrategy,
   StickyController,
   PopupUtilConfig,
   popupStrategy,
   popupLib,
   UIBase,
   cClone,
   UIUtils
) => {
   'use strict';

   const StickyControllerClass = StickyController.StickyController;
   const StickyStrategyClass = StickyStrategy.StickyStrategy;
   // eslint-disable-next-line no-param-reassign
   StickyController = StickyController.default;
   // eslint-disable-next-line no-param-reassign
   StickyStrategy = StickyStrategy.default;

   describe('Sticky Utils', () => {
      it('preparePercentSizes', () => {
         PopupUtilConfig._getWindowWidth = () => {
            return 2000;
         };
         PopupUtilConfig._getWindowHeight = () => {
            return 1000;
         };

         const item = {
            popupOptions: {
               width: '40%',
               height: '10%'
            }
         };

         const stickyConfig = PopupUtilConfig.getStickyConfig(item);
         expect(stickyConfig.config.width).toEqual(800);
         expect(stickyConfig.config.height).toEqual(100);
      });
   });

   describe('Controls/_popup/Opener/Sticky', () => {
      new popupStrategy.Controller().init();

      var targetCoords = {
         top: 200,
         left: 200,
         bottom: 400,
         right: 400,
         width: 200,
         height: 200,
         leftScroll: 0,
         topScroll: 0
      };

      StickyStrategy._getWindowSizes = () => {
         return {
            width: 1920,
            height: 1040
         };
      };

      const BODY_HEIGHT = 999;
      const BASE_VIEWPORT = {
         width: 1000,
         height: 1000,
         offsetLeft: 0,
         offsetTop: 0,
         pageLeft: 0,
         pageTop: 0
      };

      StickyStrategy._getBody = () => {
         return {
            width: 1000,
            height: 1000
         };
      };
      StickyStrategy._getViewportHeight = () => {
         return BODY_HEIGHT;
      };
      StickyStrategy._getVisualViewport = () => {
         return BASE_VIEWPORT;
      };

      function getPositionConfig() {
         return {
            targetPoint: {
               vertical: 'top',
               horizontal: 'left'
            },
            direction: {
               horizontal: 'right',
               vertical: 'top'
            },
            offset: {
               horizontal: 0,
               vertical: 0
            },
            config: {},
            sizes: {
               width: 200,
               height: 200,
               margins: {
                  top: 0,
                  left: 0
               }
            },
            fittingMode: {
               vertical: 'adaptive',
               horizontal: 'adaptive'
            }
         };
      }

      StickyStrategy._isPortrait = () => {
         return false;
      };

      it('Sticky initializing state', () => {
         let itemConfig = {
            popupState: StickyController.POPUP_STATE_INITIALIZING
         };
         let destroyDef = StickyController.elementDestroyedWrapper(itemConfig);
         expect(destroyDef.isReady()).toEqual(true);
      });

      it('Sticky gets target node', () => {
         // Тестируем: передаем в опцию target платформенный Control
         let cfg = {};
         cfg.popupOptions = {};
         cfg.popupOptions.target = new UIBase.Control({});
         cfg.popupOptions.target._container = '123';
         expect(cfg.popupOptions.target._container).toEqual(StickyController._getTargetNode(cfg));
         cfg.popupOptions.target.destroy();

         // Тестируем: передаем в опцию target domNode
         cfg.popupOptions.target = '222';
         expect(cfg.popupOptions.target).toEqual(StickyController._getTargetNode(cfg));

         // Тестируем: передаем не контрол и не domNode
         cfg.popupOptions.target = null;
         expect(StickyController._getTargetNode(cfg)).toBe(false);
      });

      it('Sticky updated classes', () => {
         StickyController._isTargetVisible = () => {
            return true;
         };
         let item = {
            position: {},
            popupOptions: {
               target: {
                  getBoundingClientRect: () => {
                     return {
                        top: 0,
                        bottom: 0,
                        width: 100,
                        height: 100
                     };
                  }
               }
            },
            sizes: {}
         };
         let container = {
            getBoundingClientRect: () => {
               return {
                  width: 100,
                  height: 100
               };
            }
         };
         StickyController.elementCreated(item, container);
         expect(typeof item.positionConfig).toEqual('object'); // Конфиг сохранился
         expect(item.sizes.width).toEqual(100); // Конфиг сохранился
         let classes =
            item.popupOptions.className +
            ' controls-StickyTemplate-animation controls-StickyTemplate-visibility';

         StickyController.elementUpdated(item, container);
         expect(item.popupOptions.className).toEqual(classes); // Классы не поменялись
      });

      it('Sticky visibility classes', () => {
         const Sticky = new StickyControllerClass();
         Sticky._isVisibleTarget = () => {
            return false;
         };
         Sticky._isTargetVisible = () => {
            return true;
         };
         let item = {
            position: {},
            popupOptions: {
               actionOnScroll: 'track'
            },
            sizes: {}
         };
         let container = {
            getBoundingClientRect: () => {
               return {
                  width: 100,
                  height: 100
               };
            }
         };
         let classes =
            ' controls-Popup-corner-vertical-top controls-Popup-corner-horizontal-left controls-Popup-align-horizontal-right controls-Popup-align-vertical-bottom';
         Sticky.elementCreated(item, container);
         expect(item.popupOptions.className.trim()).toEqual(
            (classes + ' controls-StickyTemplate-visibility-hidden').trim()
         );

         Sticky._isVisibleTarget = () => {
            return true;
         };
         classes += ' controls-StickyTemplate-animation controls-StickyTemplate-visibility';
         Sticky.elementUpdated(item, container);
         expect(item.popupOptions.className.trim()).toEqual(classes.trim());

         Sticky._isVisibleTarget = () => {
            return false;
         };
         classes = classes + ' controls-StickyTemplate-visibility-hidden';
         Sticky.elementUpdated(item, container);
         expect(item.popupOptions.className.trim()).toEqual(classes.trim());
      });

      it('Sticky check visible target on elementCreated', () => {
         jest.spyOn(UIUtils.Logger, 'warn').mockImplementation();
         StickyController._isTargetVisible = () => {
            return false;
         };
         let isRemoveCalled = false;
         let ManagerControllerRemove = popupLib.Controller.getController;
         popupLib.Controller.getController = () => {
            return {
               remove: () => {
                  isRemoveCalled = true;
               }
            };
         };
         StickyController.elementCreated({});
         expect(isRemoveCalled).toEqual(true);

         popupLib.Controller.getController = ManagerControllerRemove;
         StickyController._isTargetVisible = () => {
            return true;
         };
         expect(UIUtils.Logger.warn).toHaveBeenCalledTimes(1);
         expect(UIUtils.Logger.warn).toHaveBeenCalledWith(
            'Controls/popup:Sticky: Пропал target из DOM. Позиция окна может быть не верная'
         );
      });

      it('fixBottomPositionForIos', () => {
         let tCoords = {
            boundingClientRect: {
               top: 800
            },
            topScroll: 10
         };
         let windowData = {
            innerHeight: 850,
            scrollY: 350,
            innerWidth: 1000
         };

         let baseWindowData = {
            innerHeight: 0,
            scrollY: 0,
            innerWidth: 0
         };
         let position = {
            bottom: 200
         };
         StickyStrategy._getWindow = () => {
            return windowData;
         };
         StickyStrategy._getKeyboardHeight = () => {
            return 50;
         };
         StickyStrategy._isIOS12 = () => {
            return true;
         };
         StickyStrategy._fixBottomPositionForIos(position, tCoords);
         expect(position.bottom).toEqual(50);
         position.bottom = 200;
         StickyStrategy._getKeyboardHeight = () => {
            return 0;
         };
         StickyStrategy._getWindow = () => {
            return baseWindowData;
         };
         StickyStrategy._considerTopScroll = () => {
            return true;
         };
         StickyStrategy._fixBottomPositionForIos(position, tCoords);
         StickyStrategy._considerTopScroll = () => {
            return false;
         };
         StickyStrategy._isIOS12 = () => {
            return false;
         };
         expect(position.bottom).toEqual(200);
      });

      it('Sticky with option fittingMode=overflow', () => {
         let left = 1700;
         let right = 1900;
         let top = 800;
         let bottom = 1000;
         let targetC = {
            ...targetCoords,
            left,
            right,
            top,
            bottom
         };

         var position = StickyStrategy.getPosition(
            {
               fittingMode: {
                  vertical: 'overflow',
                  horizontal: 'overflow'
               },
               targetPoint: {
                  vertical: 'bottom',
                  horizontal: 'left'
               },
               direction: {
                  horizontal: 'right',
                  vertical: 'bottom'
               },
               offset: {
                  horizontal: 0,
                  vertical: 0
               },
               config: {},
               sizes: {
                  width: 400,
                  height: 400,
                  margins: {
                     top: 0,
                     left: 10
                  }
               }
            },
            targetC
         );

         expect(position.top).toEqual(640);
         expect(position.left).toEqual(1520);
      });

      it('Sticky position', () => {
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1000,
               height: 1000
            };
         };
         let cfg = getPositionConfig();

         // 1 position
         let position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.left).toEqual(200);
         expect(position.bottom).toEqual(800);
         expect(Object.keys(position).length).toEqual(6);

         // 2 position
         cfg = getPositionConfig();
         cfg.targetPoint.horizontal = 'right';
         cfg.direction.vertical = 'bottom';

         position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.left).toEqual(400);
         expect(position.top).toEqual(200);
         expect(Object.keys(position).length).toEqual(6);

         // 3 position
         cfg = getPositionConfig();
         cfg.targetPoint.horizontal = 'right';
         cfg.targetPoint.vertical = 'bottom';
         cfg.direction.vertical = 'bottom';
         cfg.direction.horizontal = 'left';

         position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.right).toEqual(600);
         expect(position.top).toEqual(400);
         expect(Object.keys(position).length).toEqual(6);

         // 4 position
         cfg = getPositionConfig();
         cfg.targetPoint.horizontal = 'left';
         cfg.targetPoint.vertical = 'bottom';
         cfg.direction.vertical = 'top';
         cfg.direction.horizontal = 'left';

         position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.right).toEqual(800);
         expect(position.bottom).toEqual(600);
         expect(Object.keys(position).length).toEqual(6);
      });

      it('Sticky with body scroll', () => {
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1000,
               height: 1000
            };
         };
         var targetC = {
            top: 400,
            left: 400,
            bottom: 410,
            right: 410,
            width: 10,
            height: 10,
            leftScroll: 50,
            topScroll: 50
         };

         // 3 position
         let cfg = getPositionConfig();
         cfg.targetPoint.horizontal = 'right';
         cfg.targetPoint.vertical = 'bottom';
         cfg.direction.vertical = 'bottom';
         cfg.direction.horizontal = 'left';
         let position = StickyStrategy.getPosition(cfg, targetC);
         expect(position.top).toEqual(410);
         expect(position.right).toEqual(590);
         expect(Object.keys(position).length).toEqual(6);
      });

      it('Sticky default Config', () => {
         let item = {
            popupOptions: {
               maxWidth: 100,
               maxHeight: 110,
               width: 50,
               height: 60
            }
         };
         StickyController.getDefaultConfig(item);
         expect(item.position.width).toEqual(item.popupOptions.width);
         expect(item.position.height).toEqual(item.popupOptions.height);
         expect(item.position.maxWidth).toEqual(item.popupOptions.maxWidth);
         expect(item.position.maxHeight).toEqual(item.popupOptions.maxHeight);
         expect(item.position.left).toEqual(-10000);
         expect(item.position.top).toEqual(-10000);
         expect(item.position.position).toEqual('fixed');
      });

      it('Sticky with margins', () => {
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1000,
               height: 1000
            };
         };
         let cfg = getPositionConfig();
         cfg.targetPoint.horizontal = 'right';
         cfg.direction.vertical = 'bottom';
         cfg.sizes.margins.top = 10;
         cfg.sizes.margins.left = 10;

         let position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.left).toEqual(410);
         expect(position.top).toEqual(210);
         expect(Object.keys(position).length).toEqual(6);

         cfg = getPositionConfig();
         cfg.targetPoint.horizontal = 'left';
         cfg.targetPoint.vertical = 'bottom';
         cfg.direction.vertical = 'top';
         cfg.direction.horizontal = 'left';
         cfg.sizes.margins.top = 10;
         cfg.sizes.margins.left = 10;
         cfg.sizes.width = 100;
         cfg.sizes.height = 100;

         position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.right).toEqual(790);
         expect(position.bottom).toEqual(590);
         expect(Object.keys(position).length).toEqual(6);
      });

      it('Sticky revert position', () => {
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1000,
               height: 1000
            };
         };
         let cfg = getPositionConfig();
         cfg.sizes.height = 400;
         let position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.left).toEqual(200);
         expect(position.top).toEqual(400);
         expect(Object.keys(position).length).toEqual(6);

         cfg = getPositionConfig();
         cfg.sizes.width = 400;
         cfg.targetPoint.horizontal = 'left';
         cfg.targetPoint.vertical = 'bottom';
         cfg.direction.vertical = 'top';
         cfg.direction.horizontal = 'left';
         targetCoords.topScroll = 10;
         targetCoords.leftScroll = 10;

         StickyStrategy._getTopScroll = () => {
            return targetCoords.topScroll;
         };

         position = StickyStrategy.getPosition(cfg, targetCoords);
         targetCoords.topScroll = 0;
         targetCoords.leftScroll = 0;
         expect(position.left).toEqual(400);
         expect(position.bottom).toEqual(600);
         expect(Object.keys(position).length).toEqual(6);

         const newTargetCoords = {
            top: 450,
            left: 450,
            bottom: 550,
            right: 550,
            width: 100,
            height: 100,
            leftScroll: 0,
            topScroll: 0
         };
         cfg = getPositionConfig();
         cfg.sizes.width = 1000;
         cfg.sizes.height = 1000;

         position = StickyStrategy.getPosition(cfg, newTargetCoords);
         expect(position.left).toEqual(450);
         expect(position.bottom).toEqual(550);
      });

      it('Sticky fittingMode fixed', () => {
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1000,
               height: 1000
            };
         };
         let cfg = getPositionConfig();
         cfg.fittingMode = {
            vertical: 'fixed',
            horizontal: 'fixed'
         };
         cfg.sizes.height = 400;
         let position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.left).toEqual(200);
         expect(position.bottom).toEqual(800);
         expect(position.height).toEqual(200);
         expect(Object.keys(position).length).toEqual(7);

         cfg = getPositionConfig();
         cfg.fittingMode = {
            vertical: 'fixed',
            horizontal: 'fixed'
         };
         cfg.sizes.width = 400;
         cfg.targetPoint.horizontal = 'left';
         cfg.targetPoint.vertical = 'bottom';
         cfg.direction.vertical = 'top';
         cfg.direction.horizontal = 'left';

         position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.right).toEqual(800);
         expect(position.bottom).toEqual(600);
         expect(position.width).toEqual(200);
         expect(Object.keys(position).length).toEqual(7);
      });

      it('Sticky fittingMode: vertical = fixed, horizontal = adaptive ', () => {
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1000,
               height: 1000
            };
         };
         let cfg = getPositionConfig();
         cfg.fittingMode = {
            vertical: 'fixed',
            horizontal: 'adaptive'
         };
         cfg.sizes.height = 400;
         let position = StickyStrategy.getPosition(cfg, targetCoords);
         expect(position.left).toEqual(200);
         expect(position.bottom).toEqual(800);
         expect(position.height).toEqual(200);
         expect(Object.keys(position).length).toEqual(7);
      });

      it('Sticky check overflow', () => {
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1920,
               height: 1040
            };
         };
         let popupCfg = { ...getPositionConfig() };
         let tCoords = { ...targetCoords };
         let position = { right: 0 };
         let overflow = StickyStrategy._checkOverflow(popupCfg, tCoords, position, 'horizontal');
         expect(overflow).toEqual(0);

         position = {
            left: 1800
         };
         popupCfg.sizes.width = 178;
         tCoords.leftScroll = 0;
         overflow = StickyStrategy._checkOverflow(popupCfg, targetCoords, position, 'horizontal');
         expect(overflow).toEqual(58);
      });

      it('Sticky invert position', () => {
         let popupCfg = { ...getPositionConfig() };
         let direction = 'vertical';
         popupCfg.offset.vertical = 10;
         popupCfg.sizes.margins.top = 15;
         StickyStrategy._invertPosition(popupCfg, direction);
         expect(popupCfg.targetPoint.vertical).toEqual('bottom');
         expect(popupCfg.direction.vertical).toEqual('bottom');
         expect(popupCfg.offset.vertical).toEqual(-10);
         expect(popupCfg.sizes.margins.top).toEqual(-15);
      });

      it('Sticky fix position', () => {
         let cfg = getPositionConfig();
         cfg.targetPoint.horizontal = 'right';
         cfg.direction.vertical = 'bottom';
         let baseFixPosition = StickyStrategy._fixPosition;
         let baseCheckOverflow = StickyStrategy._checkOverflow;
         let i = 0;
         StickyStrategy._checkOverflow = () => {
            return i++ === 0 ? 100 : -100;
         };

         StickyStrategy._fixPosition = (position) => {
            if (position.bottom) {
               // метод вызвался, проставилась координата bottom
               position.bottom = -10;
            }
         };

         let position = StickyStrategy._calculatePosition(cfg, targetCoords, 'vertical');
         expect(position.bottom).toEqual(-10);

         StickyStrategy._checkOverflow = baseCheckOverflow;
         StickyStrategy._fixPosition = baseFixPosition;
      });

      it('Sticky protect from wrong config', () => {
         let popupCfg = { ...getPositionConfig() };
         popupCfg.fittingMode.horizontal = 'fixed';
         popupCfg.offset.horizontal = -50;
         let targetC = {
            top: 200,
            left: 0,
            bottom: 400,
            right: 200,
            width: 200,
            height: 200,
            leftScroll: 0,
            topScroll: 0
         };
         let position = StickyStrategy.getPosition(popupCfg, targetC);
         expect(position.left).toEqual(0);
      });

      it('Centered sticky', () => {
         const height = 1040;
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1920,
               height: height
            };
         };
         StickyStrategy._getVisualViewport = () => {
            return { ...BASE_VIEWPORT, ...{ height } };
         };
         StickyStrategy._getBody = () => {
            return {
               width: 1000,
               height
            };
         };
         let popupCfg = { ...getPositionConfig() };
         popupCfg.direction.horizontal = 'center';

         popupCfg.sizes.width = 100;
         popupCfg.sizes.height = 100;

         var position = StickyStrategy.getPosition(popupCfg, targetCoords);
         expect(position.bottom).toEqual(840);
         expect(position.left).toEqual(250);
      });

      it('StickyStrategy setMaxSizes', () => {
         let popupCfg = {
            config: {
               maxWidth: 100,
               width: 50,
               minWidth: 10,
               maxHeight: 200,
               height: 150,
               minHeight: 110
            },
            fittingMode: {}
         };
         let position = {};
         const PAGE_TOP = 40;
         const GET_BODY = 1200;
         const getViewPort = StickyStrategy._getVisualViewport;
         const getBody = StickyStrategy._getBody;
         StickyStrategy._getBody = () => {
            return {
               height: GET_BODY
            };
         };
         StickyStrategy._getVisualViewport = () => {
            return {
               width: 1000,
               height: 1000,
               pageTop: PAGE_TOP
            };
         };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxWidth).toEqual(popupCfg.config.maxWidth);
         expect(position.width).toEqual(popupCfg.config.width);
         expect(position.minWidth).toEqual(popupCfg.config.minWidth);
         expect(position.maxHeight).toEqual(popupCfg.config.maxHeight);
         expect(position.height).toEqual(popupCfg.config.height);
         expect(position.minHeight).toEqual(popupCfg.config.minHeight);

         popupCfg.config.maxHeight = undefined;
         popupCfg.fittingMode.vertical = 'adaptive';
         position = {};

         // vpHeight - padding + (bodyHeight - vpHeight + pageTop) = bodyHeight - padding- pageTop;
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxHeight).toEqual(GET_BODY - PAGE_TOP);

         position = { top: 20 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxHeight).toEqual(BODY_HEIGHT - 20 + PAGE_TOP);

         position = { bottom: 50 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxHeight).toEqual(GET_BODY - 50 - PAGE_TOP);

         popupCfg.config.maxWidth = undefined;
         popupCfg.fittingMode.horizontal = 'adaptive';
         position = {};
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxWidth).toEqual(1920);
         position = { left: 20 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxWidth).toEqual(1900);

         position = { right: 200 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxWidth).toEqual(1720);

         popupCfg.config.maxHeight = undefined;
         popupCfg.fittingMode.vertical = 'fixed';
         position = { height: 4096 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxHeight).toEqual(GET_BODY - PAGE_TOP);

         position = { top: 20 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxHeight).toEqual(BODY_HEIGHT - 20 + PAGE_TOP);

         position = { bottom: 50 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxHeight).toEqual(GET_BODY - 50 - PAGE_TOP);

         popupCfg.config.maxWidth = undefined;
         popupCfg.fittingMode.horizontal = 'fixed';
         position = {};
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxWidth).toEqual(1920);
         position = { left: 20 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxWidth).toEqual(1900);

         position = { right: 200 };
         StickyStrategy._setMaxSizes(popupCfg, position);
         expect(position.maxWidth).toEqual(1720);
         StickyStrategy._getVisualViewport = getViewPort;
         StickyStrategy._getBody = getBody;
      });

      it('Centered targetPoint sticky', () => {
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1920,
               height: 1040
            };
         };
         let popupCfg = { ...getPositionConfig() };
         popupCfg.targetPoint.horizontal = 'center';

         popupCfg.sizes.width = 100;
         popupCfg.sizes.height = 100;

         let position = StickyStrategy.getPosition(popupCfg, targetCoords);
         expect(position.left).toEqual(300);

         popupCfg.targetPoint.horizontal = 'left';
         popupCfg.targetPoint.vertical = 'center';

         position = StickyStrategy.getPosition(popupCfg, targetCoords);
         expect(position.bottom).toEqual(740);
      });

      it('elementAfterUpdated', () => {
         let item = {
            popupOptions: {},
            position: {
               height: 100
            }
         };
         let container = {
            querySelector: () => {
               return null;
            },
            style: {
               width: '100px',
               height: '300px'
            }
         };
         let newContainer = {};
         let prepareConfig = StickyController.prepareConfig;
         let isTargetVisible = StickyController._isTargetVisible;
         StickyController.prepareConfig = (itemConfig, containerConfig) => {
            newContainer = cClone(containerConfig);
         };
         StickyController._isTargetVisible = () => {
            return true;
         };
         item.childs = [];
         StickyController.elementAfterUpdated(item, container);

         // сбрасываем размеры с контейнера
         expect(newContainer.style.width).toBe('auto');
         expect(newContainer.style.height).toBe('auto');
         expect(newContainer.style.maxHeight).toBe('100vh');

         // возвращаем их обратно
         expect(container.style.width).toBe('100px');
         expect(container.style.height).toBe('100px');
         expect(container.style.maxHeight).toBe('');

         item.popupOptions.maxHeight = 300;
         container.style.maxHeight = '200px';
         StickyController.elementAfterUpdated(item, container);
         expect(newContainer.style.maxHeight).toBe('300px');
         expect(container.style.maxHeight).toBe('');
         StickyController.prepareConfig = prepareConfig;
         StickyController._isTargetVisible = isTargetVisible;
      });

      it('moveContainer', () => {
         let position = {
            right: -10
         };
         let flagRestrict = false;
         let restrictContainer = StickyStrategy._restrictContainer;
         StickyStrategy._restrictContainer = () => {
            flagRestrict = !flagRestrict;
         };

         // если начальная позиция отрицательная
         StickyStrategy._moveContainer({}, position, '', 80);
         expect(flagRestrict).toBe(false);

         // если начальная позиция положительная, но есть перекрытие
         position.right = 60;
         StickyStrategy._moveContainer({}, position, '', 80);
         expect(flagRestrict).toBe(true);

         StickyStrategy._restrictContainer = restrictContainer;
      });
      it('checkOverflow', () => {
         const StrategyInstance = new StickyStrategyClass();
         StrategyInstance._getBody = () => {
            return { ...BASE_VIEWPORT, scrollWidth: 1000, scrollHeight: 1000 };
         };
         let position = {
            right: -10,
            bottom: -20
         };
         let result;

         // правый и нижний край не влезли
         result = StrategyInstance._checkOverflow({ direction: {} }, {}, position, 'horizontal');
         expect(result).toBe(10);
         result = StrategyInstance._checkOverflow({ direction: {} }, {}, position, 'vertical');
         expect(result).toBe(20);

         position = {
            left: -10,
            top: -20
         };

         // левый и верхний край не влезли
         result = StickyStrategy._checkOverflow({ direction: {} }, {}, position, 'horizontal');
         expect(result).toBe(10);
         result = StickyStrategy._checkOverflow({ direction: {} }, {}, position, 'vertical');
         expect(result).toBe(20);

         // Скролл на body
         StrategyInstance._getBody = () => {
            return { ...BASE_VIEWPORT, scrollWidth: 1200, scrollHeight: 1200 };
         };
         const popupCfg = {
            direction: {},
            targetPoint: {
               vertical: 'top',
               horizontal: 'left'
            },
            offset: {
               horizontal: 10
            },
            sizes: {
               width: 15,
               height: 25
            }
         };
         const targetCoords1 = {
            left: 100,
            top: 200,
            leftScroll: 0,
            topScroll: 0
         };
         position = {
            right: -10,
            bottom: -20
         };
         result = StrategyInstance._checkOverflow(popupCfg, targetCoords1, position, 'horizontal');
         expect(result).toBe(-95); // Влезло
         result = StrategyInstance._checkOverflow(popupCfg, targetCoords1, position, 'vertical');
         expect(result).toBe(-175); // влезло

         position = {
            right: -210,
            bottom: -220
         };
         result = StrategyInstance._checkOverflow(popupCfg, targetCoords1, position, 'horizontal');
         expect(result).toBe(10); // Не влезло
         result = StrategyInstance._checkOverflow(popupCfg, targetCoords1, position, 'vertical');
         expect(result).toBe(20); // Не влезло
      });

      it('revertPosition outsideOfWindow', () => {
         let popupCfg = {
            direction: {
               horizontal: 'right'
            },
            sizes: {
               width: 100
            },
            fittingMode: {
               horizontal: 'adaptive'
            }
         };

         // TODO: will be fixed by https://online.sbis.ru/opendoc.html?guid=41b3a01c-72e1-418b-937f-ca795dacf508
         let isMobileIOS = StickyStrategy.__isMobileIOS;
         StickyStrategy.__isMobileIOS = () => {
            return true;
         };

         let getMargins = StickyStrategy._getMargins;
         StickyStrategy._getMargins = () => {
            return 0;
         };

         // правый край таргета за пределами области видимости экрана
         let getTargetCoords = StickyStrategy._getTargetCoords;
         StickyStrategy._getTargetCoords = (a, b, coord) => {
            return coord === 'right' ? 1930 : 1850;
         };

         let invertPosition = StickyStrategy._invertPosition;
         StickyStrategy._invertPosition = () => {
            popupCfg.direction.horizontal = 'left';
         };

         const width = 1920;
         StickyStrategy._getVisualViewport = () => {
            return { ...BASE_VIEWPORT, ...{ width } };
         };
         StickyStrategy._getBody = () => {
            return {
               width,
               height: 1000
            };
         };

         let result = StickyStrategy._calculatePosition(popupCfg, { leftScroll: 0 }, 'horizontal');

         // проверяем, что окно позиционируется с правого края и его ширина не обрезается
         expect(result).toEqual({ right: 0 });

         StickyStrategy.__isMobileIOS = isMobileIOS;
         StickyStrategy._getMargins = getMargins;
         StickyStrategy._getTargetCoords = getTargetCoords;
         StickyStrategy._invertPosition = invertPosition;
      });

      it('initial position is outsideOfWindow', () => {
         let popupCfg = {
            direction: {
               vertical: 'bottom'
            },
            sizes: {
               height: 200
            },
            fittingMode: {
               vertical: 'adaptive'
            }
         };

         // TODO: will be fixed by https://online.sbis.ru/opendoc.html?guid=41b3a01c-72e1-418b-937f-ca795dacf508
         let isMobileIOS = StickyStrategy.__isMobileIOS;
         StickyStrategy.__isMobileIOS = () => {
            return true;
         };

         let getMargins = StickyStrategy._getMargins;
         StickyStrategy._getMargins = () => {
            return -20;
         };

         // Таргет находится в верхней части экрана, но имеется отрицательный отступ
         let getTargetCoords = StickyStrategy._getTargetCoords;
         StickyStrategy._getTargetCoords = (a, b, coord) => {
            return coord === 'top' ? 0 : 20;
         };

         let invertPosition = StickyStrategy._invertPosition;
         StickyStrategy._invertPosition = () => {
            popupCfg.direction.vertical = 'top';
         };

         const width = 1920;
         StickyStrategy._getVisualViewport = () => {
            return { ...BASE_VIEWPORT, ...{ width } };
         };
         StickyStrategy._getBody = () => {
            return {
               width,
               height: 665
            };
         };

         let result = StickyStrategy._calculatePosition(popupCfg, { topScroll: 0 }, 'vertical');

         // проверяем, что окно позиционируется от верхнего края экрана и его высота не обрезается
         expect(result).toEqual({ top: 0 });
         expect(popupCfg.sizes.height).toEqual(200);

         StickyStrategy.__isMobileIOS = isMobileIOS;
         StickyStrategy._getMargins = getMargins;
         StickyStrategy._getTargetCoords = getTargetCoords;
         StickyStrategy._invertPosition = invertPosition;
      });

      it('fittingMode vertical overflow', () => {
         let popupCfg = {
            direction: {
               vertical: 'bottom'
            },
            sizes: {
               width: 1500,
               height: 1000
            },
            fittingMode: {
               vertical: 'overflow',
               horizontal: 'overflow'
            }
         };

         let getMargins = StickyStrategy._getMargins;
         StickyStrategy._getMargins = () => {
            return -20;
         };

         // Таргет находится в верхней части экрана, но имеется отрицательный отступ
         let getTargetCoords = StickyStrategy._getTargetCoords;
         StickyStrategy._getTargetCoords = () => {
            return 20;
         };

         let invertPosition = StickyStrategy._invertPosition;
         StickyStrategy._invertPosition = () => {
            popupCfg.direction.vertical = 'top';
         };

         const getWindowSizes = StickyStrategy._getWindowSizes;
         const width = 1000;
         const height = 665;
         StickyStrategy._getWindowSizes = () => {
            return { width, height };
         };
         StickyStrategy._getVisualViewport = () => {
            return { ...BASE_VIEWPORT, ...{ width, height } };
         };
         StickyStrategy._getBody = () => {
            return {
               width,
               height
            };
         };

         const verticalPosition = StickyStrategy._calculatePosition(
            popupCfg,
            { topScroll: 0 },
            'vertical'
         );
         expect(verticalPosition.height).toEqual(height);

         const horizontalPosition = StickyStrategy._calculatePosition(
            popupCfg,
            { topScroll: 0 },
            'horizontal'
         );
         expect(horizontalPosition.width).toEqual(width);

         StickyStrategy._getWindowSizes = getWindowSizes;
         StickyStrategy._getMargins = getMargins;
         StickyStrategy._getTargetCoords = getTargetCoords;
         StickyStrategy._invertPosition = invertPosition;
      });

      it('calculatePosition with float position(overflow < 1px)', () => {
         let popupCfg = {
            direction: {
               vertical: 'top'
            },
            sizes: {
               width: 200,
               height: 200
            },
            fittingMode: {
               vertical: 'adaptive',
               horizontal: 'adaptive'
            }
         };

         const overflowPosition = BASE_VIEWPORT.height + 0.4;
         const targetCoordinates = {
            top: overflowPosition,
            bottom: overflowPosition,
            topScroll: 0
         };
         let positionInverted = false;

         let getMargins = StickyStrategy._getMargins;
         StickyStrategy._getMargins = () => {
            return 0;
         };

         let getTargetCoords = StickyStrategy._getTargetCoords;
         StickyStrategy._getTargetCoords = () => {
            return targetCoordinates.bottom;
         };

         let invertPosition = StickyStrategy._invertPosition;
         StickyStrategy._invertPosition = () => {
            positionInverted = true;
         };

         const getWindowSizes = StickyStrategy._getWindowSizes;
         StickyStrategy._getWindowSizes = () => {
            return { ...BASE_VIEWPORT };
         };
         StickyStrategy._getVisualViewport = () => {
            return { ...BASE_VIEWPORT };
         };
         StickyStrategy._getBody = () => {
            return { ...BASE_VIEWPORT };
         };

         StickyStrategy._calculatePosition(popupCfg, targetCoordinates, 'vertical');

         expect(positionInverted).toEqual(false);

         StickyStrategy._getWindowSizes = getWindowSizes;
         StickyStrategy._getMargins = getMargins;
         StickyStrategy._getTargetCoords = getTargetCoords;
         StickyStrategy._invertPosition = invertPosition;
      });

      it('update sizes from options', () => {
         let popupCfg = {
            config: {
               width: 100,
               maxWidth: 300,
               minWidth: 100
            }
         };
         let popupOptions = {
            height: 200,
            minHeight: 200,
            maxHeight: 500,
            minWidth: 200
         };
         let resultConfig = {
            height: 200,
            minHeight: 200,
            maxHeight: 500,
            minWidth: 200,
            width: 100,
            maxWidth: 300
         };
         StickyController._updateSizes(popupCfg, popupOptions);
         expect(popupCfg.config).toEqual(resultConfig);
      });

      it('restrictive container', () => {
         let getBody = StickyStrategy._getBody;

         StickyStrategy._getBody = () => {
            return {
               height: 100,
               width: 100
            };
         };

         let popupCfg = {
            restrictiveContainerCoords: {
               top: 45,
               left: 55,
               bottom: 50,
               right: 60
            },
            config: {
               maxWidth: 300,
               minWidth: 100
            },
            sizes: {
               width: 5,
               height: 5
            }
         };

         let position = {
            top: 60,
            left: 60
         };

         StickyStrategy._calculateRestrictionContainerCoords(popupCfg, position);
         expect(position.top).toEqual(45);
         expect(position.left).toEqual(55);

         popupCfg.restrictiveContainerCoords.top = 20;
         popupCfg.restrictiveContainerCoords.left = 30;

         position = {
            bottom: 80,
            right: 80
         };

         StickyStrategy._calculateRestrictionContainerCoords(popupCfg, position);
         expect(position.bottom).toEqual(75);
         expect(position.right).toEqual(65);

         position = {
            top: 0,
            left: 10
         };

         StickyStrategy._calculateRestrictionContainerCoords(popupCfg, position);
         expect(position.top).toEqual(20);
         expect(position.left).toEqual(30);

         popupCfg.restrictiveContainerCoords.top = 5;
         popupCfg.restrictiveContainerCoords.bottom = 10;
         popupCfg.restrictiveContainerCoords.left = 10;
         popupCfg.restrictiveContainerCoords.right = 20;
         StickyStrategy._calculateRestrictionContainerCoords(popupCfg, position);
         expect(position.top).toEqual(5);
         expect(position.left).toEqual(15);

         StickyStrategy._getBody = getBody;
      });
      it('restrictive container overflow', () => {
         let getBody = StickyStrategy._getBody;

         StickyStrategy._getBody = () => {
            return {
               height: 600,
               width: 600
            };
         };
         let popupCfg = {
            restrictiveContainerCoords: {
               top: 100,
               bottom: 400,
               right: 400,
               left: 100
            },
            config: {
               maxWidth: 300,
               minWidth: 100
            },
            sizes: {
               width: 200,
               height: 500,
               margins: {
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0
               }
            },
            offset: {
               horizontal: 0,
               vertical: 0
            },
            targetPoint: {
               horizontal: 'left',
               vertical: 'top'
            },
            direction: {
               horizontal: 'right',
               vertical: 'bottom'
            },
            fittingMode: {
               horizontal: 'adaptive',
               vertical: 'adaptive'
            }
         };
         const targetCoords1 = {
            top: 200,
            left: 200,
            bottom: 300,
            right: 300,
            width: 100,
            height: 100,
            leftScroll: 0,
            topScroll: 0
         };

         popupCfg.sizes.width = 200;
         popupCfg.sizes.height = 500;

         // bottom vertical overflow
         var position = StickyStrategy.getPosition(popupCfg, targetCoords1);
         expect(position.top).toEqual(200);
         expect(position.left).toEqual(200);
         expect(position.height).toEqual(200);

         targetCoords1.top = 250;
         targetCoords1.bottom = 350;

         // top vertical overflow
         position = StickyStrategy.getPosition(popupCfg, targetCoords1);
         expect(position.bottom).toEqual(250);
         expect(position.left).toEqual(200);
         expect(position.height).toEqual(250);

         popupCfg.restrictiveContainerCoords = {
            top: 100,
            bottom: 400,
            right: 300,
            left: 100
         };

         targetCoords1.top = 200;
         targetCoords1.bottom = 300;
         targetCoords1.left = 150;
         targetCoords1.right = 250;

         // right horizontal overflow
         position = StickyStrategy.getPosition(popupCfg, targetCoords1);
         expect(position.left).toEqual(150);
         expect(position.width).toEqual(150);

         targetCoords1.top = 200;
         targetCoords1.bottom = 300;
         targetCoords1.left = 150;
         targetCoords1.right = 250;
         popupCfg.targetPoint.horizontal = 'right';
         popupCfg.direction.horizontal = 'left';

         // left horizontal overflow
         position = StickyStrategy.getPosition(popupCfg, targetCoords1);
         expect(position.right).toEqual(350);
         expect(position.width).toEqual(150);

         StickyStrategy._getBody = getBody;
      });
   });
});
