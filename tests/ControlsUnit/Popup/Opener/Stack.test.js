define(
   [
      'Controls/_popupTemplate/Stack/StackStrategy',
      'Controls/popup',
      'Controls/popupTemplate',
      'Controls-demo/Popup/TestMaximizedStack',
      'Controls/_popupTemplate/BaseController',
      'Controls/_popupTemplate/Stack/Template/StackContent',
      'sinon'
   ],
   (StackStrategyMod, popupMod, popupTemplate, TestMaximizedStack, BaseController, StackContent, sinon) => {
      'use strict';
      var StackStrategyClass = StackStrategyMod.StackStrategy;
      var StackStrategy = popupTemplate.StackStrategy;
      BaseController = new BaseController.default();
      StackContent = StackContent.default;
      StackStrategy._goUpByControlTree = () => [];

      describe('Controls/_popupTemplate/Stack/Opener/StackContent', () => {
         it('canResize', () => {
            let stackC = new StackContent();
            assert.equal(false, stackC._canResize(1, 2, 3, null));
            assert.equal(false, stackC._canResize(1, 2, null, 4));
            assert.equal(false, stackC._canResize(1, null, 3, 4));
            assert.equal(false, stackC._canResize(null, 2, 3, 4));
            assert.equal(false, stackC._canResize(1, 2, 3, 3));
            assert.equal(true, stackC._canResize(1, 2, 3, 4));
            stackC.destroy();
         });
      });

      describe('Controls/_popup/Opener/Stack', () => {
         StackStrategy.getMaxPanelWidth = () => 1000;
         popupTemplate.StackController._getWindowSize = () => ({
            width: 1000,
            height: 1000
         });
         popupTemplate.StackController._getContainerWidth = function(items) {
            return items ? items.templateWidth : 0;
         };

         popupTemplate.StackController._getSideBarWidth = function() {
            return 200;
         };

         let item = {
            popupOptions: {
               minWidth: 600,
               maxWidth: 800
            }
         };

         it('Opener: getConfig', () => {
            const baseConfig = {options: false};
            let config = popupMod.Stack.prototype._getStackConfig(baseConfig);
            assert.equal(config.isDefaultOpener, true);
            assert.equal(config.options, false);
            assert.isTrue(baseConfig !== config);

            config = popupMod.Stack.prototype._getStackConfig({ isDefaultOpener: false });
            assert.equal(config.isDefaultOpener, false);
         });

         it('stack with config sizes', () => {
            var position = StackStrategy.getPosition({
               top: 0,
               right: 0,
               height: 20
            }, item);
            assert.isTrue(position.maxWidth === item.popupOptions.maxWidth);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.position === 'fixed');
         });

         it('stack shadow', () => {
            let baseGetItemPosition = popupTemplate.StackController._getItemPosition;
            popupTemplate.StackController._updateItemPosition = (popupItem) => {
               if (!popupItem.position) {
                  popupItem.position = {};
               }
            };
            popupTemplate.StackController._updatePopupWidth = () => {};
            popupTemplate.StackController._stack.add({
               position: { width: 720 },
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 600,
               popupOptions: { stackClassName: '' },
            });
            popupTemplate.StackController._stack.add({
               position: { width: 600 },
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               position: { width: 50, right: 950},
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               position: { width: 840 },
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 600,
               popupOptions: { stackClassName: '' },
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 720,
               popupOptions: { stackClassName: '' },
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 200,
               popupState: 'destroying',
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 200,
               popupOptions: { stackClassName: '' },
            });

            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(1).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(2).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(3).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(4).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(5).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(6).position.hidden);
            // 7 ???????????? ???? ??????????????????, ???????????? ?????? popupState: 'destroying'. ??????????????????, ?????? ???? ?????????????? ???? 8 ????????????
            //assert.isTrue(popupTemplate.StackController._stack.at(7).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(8).position.hidden);

            assert.isTrue(popupTemplate.StackController._stack.at(0).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(1).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(2).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(3).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(4).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(5).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(6).position.hidden);
            // 7 ???????????? ???? ??????????????????, ???????????? ?????? popupState: 'destroying'. ??????????????????, ?????? ???? ?????????????? ???? 8 ????????????
            //assert.isTrue(popupTemplate.StackController._stack.at(7).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(8).position.hidden);


            popupTemplate.StackController._stack.add({
               containerWidth: 1100,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 850,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 950,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 1100,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 850,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               containerWidth: 950,
               popupOptions: { stackClassName: '' }
            });
            popupTemplate.StackController._stack.add({
               position: {},
               containerWidth: 711,
               popupOptions: { stackClassName: '' }
            });

            popupTemplate.StackController._update();
            popupTemplate.StackController._update();
            popupTemplate.StackController._getItemPosition = baseGetItemPosition;

            assert.isTrue(popupTemplate.StackController._stack.at(0).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(1).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(2).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(3).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(4).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(5).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(6).position.hidden);
            // 7 ???????????? ???? ??????????????????, ???????????? ?????? popupState: 'destroying'. ??????????????????, ?????? ???? ?????????????? ???? 8 ????????????
            //assert.isTrue(popupTemplate.StackController._stack.at(7).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(8).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(9).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(10).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(11).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(12).position.hidden);
            assert.isTrue(popupTemplate.StackController._stack.at(13).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(14).position.hidden);
            assert.isFalse(popupTemplate.StackController._stack.at(15).position.hidden);
         });

         it('validate Configuration', () => {
            let item = {
               popupOptions: {
                  width: 1000,
                  minWidth: 700,
                  maxWidth: 600
               }
            };
            popupTemplate.StackController._validateConfiguration(item, 'width');
            assert.equal(700, item.popupOptions.width);
            assert.equal(700, item.popupOptions.minWidth);
            assert.equal(700, item.popupOptions.maxWidth);

            item = {
               popupOptions: {
                  width: 1000,
                  minWidth: 700
               }
            };
            assert.equal(1000, item.popupOptions.width);
            assert.equal(700, item.popupOptions.minWidth);
         });

         it('prepareSize', () => {
            let storages = [{ width: 1 }, { width: 2 }, { width: 3 }];
            let result = popupTemplate.StackController._prepareSize(storages, 'width');
            assert.equal(1, result);

            storages = [{ width: NaN }, { width: 2 }, { width: 3 }];
            result = popupTemplate.StackController._prepareSize(storages, 'width');
            assert.equal(2, result);

            storages = [{ width: NaN }, { width: '100%' }, { width: 3 }];
            result = popupTemplate.StackController._prepareSize(storages, 'width');
            assert.equal(3, result);

            storages = [{ width: NaN }, { width: '100%' }, { width: '3px' }];
            result = popupTemplate.StackController._prepareSize(storages, 'width');
            assert.equal(3, result);
         });
         it('stack default position', () => {
            let upd = popupTemplate.StackController._update;
            let notUpdate = true;
            popupTemplate.StackController._update = () => {
               notUpdate = !notUpdate;
            };
            popupTemplate.StackController._getWindowSize = () => ({
               width: 1920,
               height: 950
            }); // ???????? ?????????? ?????????? ?????????????????? ???????????????? ????????, ?????? ???????? ???????????? ???? ??????????
            popupTemplate.StackController._getStackParentCoords = () => ({
               top: 0,
               right: 0
            }); // ???????? ?????????? ?????????? ?????????????????? ???????????????? ????????, ?????? ???????? ???????????? ???? ??????????
            let itemConfig = {
               id: '555444333',
               popupOptions: item.popupOptions
            };
            itemConfig.popupOptions.template = TestMaximizedStack;
            itemConfig.popupOptions.minimizedWidth = undefined;
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            popupTemplate.StackController.getDefaultConfig(itemConfig);

            assert.equal(itemConfig.position.top, 0);
            assert.equal(itemConfig.position.right, 0);
            assert.equal(itemConfig.position.width, 800);
            assert.equal(itemConfig.popupOptions.content, StackContent);
            assert.equal(itemConfig.position.hidden, undefined);

            let itemCount = 0;
            let items = popupTemplate.StackController._stack;
            for (let i = 0; i < items.getCount(); i++) {
               if (items.at(i).id === itemConfig.id) {
                  itemCount++;
               }
            }
            assert.equal(itemCount, 1);
            assert.equal(notUpdate, true);
            popupTemplate.StackController._update = upd;
         });

         it('stack maximized default options', () => {
            let itemConfig = {
               popupOptions: {
                  templateOptions: {},
                  template: TestMaximizedStack
               }
            };
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            assert.equal(itemConfig.popupOptions.stackMinWidth, 500);
            assert.equal(itemConfig.popupOptions.stackMaxWidth, 1000);
            assert.equal(itemConfig.popupOptions.stackWidth, 800);

            itemConfig = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 900,
                  templateOptions: {},
                  template: TestMaximizedStack
               }
            };
            popupTemplate.StackController.getDefaultConfig(itemConfig);
            assert.equal(itemConfig.popupOptions.stackMinWidth, 600);
            assert.equal(itemConfig.popupOptions.stackMaxWidth, 900);
            assert.equal(itemConfig.popupOptions.stackWidth, 800);
         });
         it('last stack className', () => {
            let baseGetItemPosition = popupTemplate.StackController._getItemPosition;
            popupTemplate.StackController._getItemPosition = items => (items.position);
            popupTemplate.StackController._stack.clear();
            popupTemplate.StackController._getDefaultConfig({
               position: { stackWidth: 720 },
               popupOptions: { className: '' }
            });
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.className.indexOf('controls-Stack__last-item') >= 0);
            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.className.indexOf('controls-Stack__last-item') >= 0);
            popupTemplate.StackController._stack.add({
               containerWidth: 1100,
               popupOptions: { className: '' }
            });
            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.className.indexOf('controls-Stack__last-item') < 0);
            assert.isTrue(popupTemplate.StackController._stack.at(1).popupOptions.className.indexOf('controls-Stack__last-item') >= 0);
            popupTemplate.StackController._stack.add({
               containerWidth: 720,
               popupOptions: { className: '' }
            });
            popupTemplate.StackController._update();
            assert.isTrue(popupTemplate.StackController._stack.at(0).popupOptions.className.indexOf('controls-Stack__last-item') < 0);
            assert.isTrue(popupTemplate.StackController._stack.at(1).popupOptions.className.indexOf('controls-Stack__last-item') < 0);
            assert.isTrue(popupTemplate.StackController._stack.at(2).popupOptions.className.indexOf('controls-Stack__last-item') >= 0);
            popupTemplate.StackController._getItemPosition = baseGetItemPosition;
         });
         it('stack panel maximized', () => {
            popupTemplate.StackController._update = () => {
            }; // ???????? ?????????? ?????????? ?????????????????? ???????????????? ????????, ?????? ???????? ???????????? ???? ??????????
            popupTemplate.StackController._prepareSizes = () => {
            }; // ???????? ?????????? ?????????? ?????????????????? ???????????????? ????????, ?????? ???????? ???????????? ???? ??????????
            popupTemplate.StackController._getWindowSize = () => ({
               width: 1920,
               height: 950
            }); // ???????? ?????????? ?????????? ?????????????????? ???????????????? ????????, ?????? ???????? ???????????? ???? ??????????

            let popupOptions = {
               minimizedWidth: 600,
               minWidth: 900,
               maxWidth: 1200,
               templateOptions: {}
            };
            let itemConfig = {
               popupOptions: popupOptions
            };

            StackStrategy.getMaxPanelWidth = () => 1600;

            assert.equal(StackStrategy.isMaximizedPanel(itemConfig), true);

            itemConfig.popupOptions.template = TestMaximizedStack;
            popupTemplate.StackController.getDefaultConfig(itemConfig)
            assert.equal(itemConfig.popupOptions.maximized, false); // default value
            assert.equal(itemConfig.popupOptions.templateOptions.hasOwnProperty('showMaximizedButton'), true);

            popupTemplate.StackController.elementMaximized(itemConfig, {}, false);
            assert.equal(itemConfig.popupOptions.maximized, false);
            assert.equal(itemConfig.popupOptions.templateOptions.maximized, false);
            let position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, itemConfig);
            assert.equal(position.width, popupOptions.minimizedWidth);

            popupTemplate.StackController.elementMaximized(itemConfig, {}, true);
            assert.equal(itemConfig.popupOptions.maximized, true);
            assert.equal(itemConfig.popupOptions.templateOptions.maximized, true);
            position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, itemConfig);
            assert.equal(position.maxWidth, popupOptions.maxWidth);

            popupTemplate.StackController._prepareMaximizedState(1600, itemConfig);
            assert.equal(itemConfig.popupOptions.templateOptions.showMaximizedButton, true);

            popupTemplate.StackController._prepareMaximizedState(800, itemConfig);
            assert.equal(itemConfig.popupOptions.templateOptions.showMaximizedButton, false);
            delete itemConfig.popupOptions.width;
         });

         it('stack right position with side parent position', () => {
            const baseParentPosition = StackStrategy._getParentPosition;
            const parentPosition = {
               right: 0
            };
            StackStrategy._getParentPosition = () => parentPosition;

            const popupOptions = {
               minWidth: 900,
               maxWidth: 1200,
               templateOptions: {}
            };
            const itemConfig = {
               popupOptions: popupOptions
            };

            const position = StackStrategy.getPosition({
               top: 0,
               right: 100
            }, itemConfig);

            // ?????? ??????????????, ???????? ???????????????????? ????????????????????????
            assert.equal(position.right, 100);

            StackStrategy._getParentPosition = baseParentPosition;
         });

         it('stack state', () => {
            let itemConfig = {
               id: '22',
               childs: [],
               popupOptions: item.popupOptions
            };
            popupTemplate.StackController._update = () => {
            }; // ???????? ?????????? ?????????? ?????????????????? ???????????????? ????????, ?????? ???????? ???????????? ???? ??????????
            popupTemplate.StackController._prepareSizes = () => {
            }; // ???????? ?????????? ?????????? ?????????????????? ???????????????? ????????, ?????? ???????? ???????????? ???? ??????????
            popupTemplate.StackController._getWindowSize = () => ({
               width: 1920,
               height: 950
            }); // ???????? ?????????? ?????????? ?????????????????? ???????????????? ????????, ?????? ???????? ???????????? ???? ??????????

            popupTemplate.StackController.elementCreatedWrapper(itemConfig, {});

            // ?????????????? ???? ???????? ?????? ?????????????????? ??????????, ?????? ?????????? ?????? ?? ????????????????
            assert.isTrue(itemConfig.popupState === BaseController.POPUP_STATE_CREATED || itemConfig.popupState === BaseController.POPUP_STATE_CREATING);

            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_CREATED);

            itemConfig.popupOptions.className = '';
            popupTemplate.StackController.elementUpdatedWrapper(itemConfig, {});
            popupTemplate.StackController.elementUpdatedWrapper(itemConfig, {});
            popupTemplate.StackController.elementUpdatedWrapper(itemConfig, {});

            // ?????????? ??????????????????, ???????????? ?????? ?????????????????? ???????? opened. ?????????? ????????. update ?????????? ???? ????????????????????????????
            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_UPDATING);
            assert.equal(itemConfig.popupOptions.className, '');

            popupTemplate.StackController.elementAfterUpdatedWrapper(itemConfig, {});
            assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_UPDATED);

            itemConfig.popupState = 'notOpened';
            itemConfig.popupOptions.className = '';
            popupTemplate.StackController.elementUpdatedWrapper(itemConfig, {});

            // ?????????? ???? ??????????????????, ???????????? ?????? ?????????????????? ???? opened
            assert.equal(itemConfig.popupOptions.className, '');

            popupTemplate.StackController.elementDestroyedWrapper(itemConfig, {});

            // ?????????????? ???? ???????? ?????? ?????????????????? ??????????, ?????? ?????????? ?????? ?? ????????????????
            assert.isTrue(itemConfig.popupState === BaseController.POPUP_STATE_DESTROYING || itemConfig.popupState === BaseController.POPUP_STATE_DESTROYED);

            itemConfig._destroyDeferred.addCallback(function() {
               assert.equal(itemConfig.popupState, BaseController.POPUP_STATE_DESTROYED);
            });
         });

         it('stack update childs position', () => {
            let defaultPosition = {
                  width: 0
               },
               itemConfig = {
                  controller: popupTemplate.StackController,
                  position: defaultPosition,
                  childs: [
                     {
                        controller: popupTemplate.StackController,
                        position: defaultPosition
                     },
                     {
                        controller: popupTemplate.StickyController,
                        position: defaultPosition
                     }
                  ],
                  popupOptions: item.popupOptions
               };
            popupTemplate.StackController.elementUpdatedWrapper(itemConfig, {});
            const updateItemPositionSpy = sinon.spy(popupTemplate.StackController, '_update');

            popupTemplate.StackController.elementAfterUpdated(itemConfig, {});
            sinon.assert.called(updateItemPositionSpy);
         });

         it('stack from target container', () => {
            var position = StackStrategy.getPosition({
               top: 100,
               right: 100,
               height: 20
            }, item);
            assert.equal(position.maxWidth, item.popupOptions.maxWidth);
            assert.isTrue(position.top === 100);
            assert.isTrue(position.right === 100);
            assert.isTrue(position.bottom === 0);
            assert.isTrue(position.height === undefined);
         });
         it('stack without config sizes', () => {
            StackStrategy.getMaxPanelWidth = () => 1000;
            let item = {
               popupOptions: {},
               containerWidth: 800
            };
            var position = StackStrategy.getPosition({
               top: 0,
               right: 0,
               height: 20
            }, item);
            assert.equal(position.width, undefined);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
            assert.isTrue(position.bottom === 0);
            assert.isTrue(position.height === undefined);

            item.containerWidth = 1200;
            position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, item);
            assert.equal(position.width, undefined);
         });

         it('stack with wrong options type', () => {
            let item = {
               popupOptions: {
                  minWidth: '600',
                  maxWidth: '800'
               }
            };
            var position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, item);
            assert.equal(position.maxWidth, parseInt(item.popupOptions.maxWidth, 10));
         });

         it('stack reduced width', () => {
            StackStrategy.getMaxPanelWidth = () => 1000;
            let item = {
               popupOptions: {
                  minWidth: 600,
                  maxWidth: 1800
               }
            };
            var position = StackStrategy.getPosition({
               top: 0,
               right: 0
            }, item);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 0);
         });

         it('stack reset offset', () => {
            let item = {
               popupOptions: {
                  minWidth: 800,
                  maxWidth: 1800
               }
            };
            var position = StackStrategy.getPosition({
               top: 0,
               right: 400
            }, item);
            assert.equal(position.width, item.popupOptions.minWidth);
            assert.isTrue(position.top === 0);
            assert.isTrue(position.right === 54);
         });

         it('stack width', () => {
            let item = {
               popupOptions: {
                  minWidth: 800,
                  width: 900,
                  maxWidth: 1200
               }
            };
            let position = StackStrategy.getPosition({
               top: 0,
               right: 400
            }, item);
            assert.equal(position.width, 900);

            item.popupOptions.width = 1200;
            position = StackStrategy.getPosition({
               top: 0,
               right: 400
            }, item);
            assert.equal(position.maxWidth, 946); //?? ?????????? getMaxPanelWidth === 1000 - 52 rightPanel
            assert.equal(position.width, 1000);
            assert.equal(position.right, 54);
         });

         it('stack max width', () => {
            StackStrategy.getMaxPanelWidth = () => 1000;
            let tCoords = {
               right: 100
            };
            let popupOptions = {};
            let maxWidth = StackStrategy._calculateMaxWidth(popupOptions, tCoords);
            assert.equal(maxWidth, 900);

            popupOptions.maxWidth = 400;
            maxWidth = StackStrategy._calculateMaxWidth(popupOptions, tCoords);
            assert.equal(maxWidth, 400);

            popupOptions.maxWidth = 2000;
            maxWidth = StackStrategy._calculateMaxWidth(popupOptions, tCoords);
            assert.equal(maxWidth, 900);

            popupOptions.minWidth = 1000;
            maxWidth = StackStrategy._calculateMaxWidth(popupOptions, tCoords);
            assert.equal(maxWidth, 1000);
         });

         it('stack optimize open', () => {
            const Controller = popupTemplate.StackController;
            Controller._stack.clear();
            const basePrepareSize = Controller._prepareSizes;
            const basePrepareSizeWithoutDom = Controller._prepareSizeWithoutDOM;
            const baseUpdate = Controller._update;
            const baseGetItemPosition = Controller._getItemPosition;
            let isPrepareSizeCalled = false;
            let isPrepareSizeWithoutDomCalled = false;
            let isUpdateCalled = false;
            let isCalcPoistionCalled = false;

            Controller._prepareSizes = () => {
               isPrepareSizeCalled = true;
            };
            Controller._prepareSizeWithoutDOM = () => {
               isPrepareSizeWithoutDomCalled = true;
            };
            Controller._update = () => {
               isUpdateCalled = true;
            };
            Controller._getItemPosition = () => {
               isCalcPoistionCalled = true;
               return {width: 720};
            };
            let item = {
               position: { width: 720 },
               popupOptions: { stackClassName: '' }
            };

            Controller.getDefaultConfig(item);
            assert.equal(isPrepareSizeCalled, false);
            assert.equal(isPrepareSizeWithoutDomCalled, true);
            assert.equal(isUpdateCalled, false);

            isPrepareSizeWithoutDomCalled = false;
            Controller.elementCreated(item);
            assert.equal(isPrepareSizeCalled, false);
            assert.equal(isPrepareSizeWithoutDomCalled, true);
            assert.equal(isUpdateCalled, false);
            assert.equal(isCalcPoistionCalled, true);

            isPrepareSizeWithoutDomCalled = false;
            Controller._stack.add({
               position: { width: 720 },
               popupOptions: { stackClassName: '' }
            });
            Controller.elementCreated(item);
            assert.equal(isPrepareSizeCalled, true);
            assert.equal(isPrepareSizeWithoutDomCalled, false);
            assert.equal(isUpdateCalled, true);

            Controller._prepareSizes = basePrepareSize;
            Controller._prepareSizeWithoutDOM = basePrepareSizeWithoutDom;
            Controller._getItemPosition = baseGetItemPosition;
            Controller._update = baseUpdate;
         });

         it('stack compatible popup', () => {
            let item = {
               position: {},
               popupOptions: {
                  template: {},
                  minWidth: 800,
                  maxWidth: 900,
                  isCompoundTemplate: true
               }
            };
            popupTemplate.StackController.getDefaultConfig(item);
            assert.equal(item.position.top, -10000);
            assert.equal(item.position.left, -10000);

            let targetPos = {
               top: 0,
               right: 0
            };

            popupTemplate.StackController._getStackParentCoords = () => targetPos;

            popupTemplate.StackController.elementCreated(item);
            assert.equal(item.position.width, undefined);
         });

         it('stack resizing', () => {
            let item = {
               popupOptions: {
                  template: {},
                  stackMinWidth: 500,
                  stackMaxWidth: 1200,
                  stackWidth: 700
               },
               position: {
                  width: 0
               }
            };
            let offset1 = 100, offset2 = -300;
            popupTemplate.StackController.popupResizingLine(item, offset1);
            assert.equal(item.popupOptions.stackWidth, 800);
            popupTemplate.StackController.popupResizingLine(item, offset2);
            assert.equal(item.popupOptions.stackWidth, 500);
         });
         it('stack resizing', () => {
            let stackContentInstance = new StackContent({});
            let item = {
               stackMinWidth: 500,
               stackMaxWidth: 1200,
               stackWidth: 700
            };
            stackContentInstance._beforeMount(item);
            assert.equal(stackContentInstance._minOffset, 200);
            assert.equal(stackContentInstance._maxOffset, 500);
            item.stackWidth += 200;
            stackContentInstance._beforeUpdate(item);
            assert.equal(stackContentInstance._minOffset, 400);
            assert.equal(stackContentInstance._maxOffset, 300);
         });
         it('prepare propStorageId', () => {
            const item = {
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
            popupTemplate.StackController._preparePropStorageId(item);
            assert.equal(111, item.popupOptions.propStorageId);

            item.popupOptions.propStorageId = 222;
            popupTemplate.StackController._preparePropStorageId(item);
            assert.equal(222, item.popupOptions.propStorageId);
         });

         it('updateSideBarVisibility', () => {
            const Controller = popupTemplate.StackController;
            Controller._stack.clear();
            Controller._stack.add({
               popupOptions: { width: 720 }
            });
            Controller._updateSideBarVisibility();
            // ???? ???????? ?????????????????? ?????????????? ????????????????????
            assert.equal(Controller._sideBarVisible, true);

            Controller._stack.add({
               popupOptions: { width: 2000 }
            });
            Controller._updateSideBarVisibility();
            // ?????? ???????????????????? ?????? ??????????
            assert.equal(Controller._sideBarVisible, false);
         });

         it('test stack getPanelWidth. When the width of the panel with the property "isCompoundTemplate: true" is greater than the width of the browser window', () => {
            const item = {
               popupOptions: {
                  isStack: true,
                  minWidth: 950,
                  maxWidth: 1150,
                  width: 950,
                  isCompoundTemplate: true
               }
            };
            StackStrategy.getParentPosition = () => {
               return undefined;
            };
            let tCoords = {
               right: 150,
               top: 0
            };
            // document.body.clientWidth = 1024, maxPanelWidth = 1024 - 100 = 924
            const panelWidth = StackStrategy._getPanelWidth(item, tCoords, 924);
            assert.equal(panelWidth, 950);
            /* ?????? ?????? ???????? ???????????????????????????????? ?? ???????????????????????? right: 150 ?? ?????????????? 950 - ???? ???????????? ???? ???????????? ?? ???????? ????????????????.
            ???????? ???????????? ???? ???????????????????? ???? ????????????, ???? ???????????????????????????????? ???????????? ???????????????????????????? ???? ?????????????? ???????? ????????????.
            ?????????????????? ???????????????????? right. */
            assert.equal(tCoords.right, 54);
         });

         it('workspaceResize', () => {
            const baseUpdate = popupTemplate.StackController._update;
            let isUpdateCalled = false;
            popupTemplate.StackController._update = () => {
               isUpdateCalled = true;
            };
            popupTemplate.StackController.workspaceResize();
            assert.equal(isUpdateCalled, true);

            popupTemplate.StackController._update = baseUpdate;
         });

         it('stack need redraw after created', () => {
            const item = {
               position: { stackWidth: 720 },
               popupOptions: { className: '' }
            };
            let updateItemPosition = popupTemplate.StackController._updateItemPosition(item);
            popupTemplate.StackController._updateItemPosition = () => false;
            popupTemplate.StackController._stack.clear();
            popupTemplate.StackController._stack.add(item);
            let result = popupTemplate.StackController.elementCreated(item);
            assert.equal(result, false);

            popupTemplate.StackController._updateItemPosition = () => true;
            result = popupTemplate.StackController.elementCreated(item);
            assert.equal(result, true);

            popupTemplate.StackController._stack.add(item);
            result = popupTemplate.StackController.elementCreated(item);
            assert.equal(result, true);
            popupTemplate.StackController._updateItemPosition = updateItemPosition;
         });

         it('strategy getRightPosition', () => {
            const Strategy = new StackStrategyClass();
            const tCoord = {
               right: 10
            };
            let result = Strategy._getRightPosition(tCoord, false);
            assert.equal(result, 10);

            result = Strategy._getRightPosition(tCoord, true);
            assert.equal(result, 54);

            Strategy._getRightTemplate = () => 'rightTemplate.wml';
            result = Strategy._getRightPosition(tCoord, true);
            assert.equal(result, 54);
         })
      });
   });
