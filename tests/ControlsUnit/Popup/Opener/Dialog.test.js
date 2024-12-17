define([
   'Controls/popupTemplateStrategy',
   'Controls/popup',
   'Controls/Application/SettingsController',
   'Controls/_popupTemplateStrategy/Dialog/DialogStrategy',
   'Controls/_popupTemplateStrategy/Util/DirectionUtil'
], (popupTemplate, popupLib, SettingsController, DialogStrategy, DirectionUtil) => {
   'use strict';
   const { BaseController, DialogController } = popupTemplate;
   // eslint-disable-next-line no-param-reassign
   DialogStrategy = DialogStrategy.default;
   const mockedSettingsController = {
      storage: {
         testDialogPosition: {
            top: 200,
            left: 500
         }
      },
      getSettings: function (propStorageIds) {
         var result = {};
         return new Promise((resolve) => {
            propStorageIds.forEach((id) => {
               result[id] = this.storage[id];
            });
            resolve(result);
         });
      },
      setSettings: function (config) {
         for (let id in config) {
            if (config.hasOwnProperty(id)) {
               for (let prop in config[id]) {
                  if (config.hasOwnProperty(id)) {
                     this.storage[id][prop] = config[id][prop];
                  }
               }
            }
         }
      }
   };

   describe('Controls/_popup/Opener/Dialog', () => {
      let sizes = {
         width: 200,
         height: 300
      };

      let windowSize = {
         width: 1920,
         height: 960
      };

      let getRestrictiveContainer = DialogController._getRestrictiveContainerSize;

      DialogController._getRestrictiveContainerSize = () => {
         return windowSize;
      };

      it('dialog positioning base', () => {
         let windowData = {
            width: 1920,
            height: 1080,
            topScroll: 0
         };
         let position = DialogStrategy.getPosition(windowData, sizes, {
            popupOptions: {}
         });
         expect(position.top).toEqual(390);
         expect(position.left).toEqual(860);

         windowData.topScroll = 70;
         windowData.leftScroll = 5;
         windowData.left = 15;
         position = DialogStrategy.getPosition(windowData, sizes, {
            popupOptions: {}
         });
         expect(position.top).toEqual(460);
         expect(position.left).toEqual(875);

         let sizesCopy = { ...sizes };
         sizesCopy.height = 2000;
         DialogStrategy.getPosition(windowData, sizesCopy, {
            popupOptions: {}
         });
         position = DialogStrategy.getPosition(windowData, sizesCopy, {
            popupOptions: {}
         });
         expect(position.maxHeight).toEqual(windowData.height);
      });

      it('dialog positioning left/right', () => {
         let windowData = {
            width: 1920,
            height: 1080,
            topScroll: 0,
            left: 0
         };
         const popupOptions = {
            left: 100,
            top: 100,
            width: 200
         };
         let position = DialogStrategy.getPosition(windowData, sizes, {
            popupOptions
         });
         expect(position.left).toEqual(100);

         popupOptions.left = 1900;
         position = DialogStrategy.getPosition(windowData, sizes, {
            popupOptions
         });
         expect(position.left).toEqual(1720);

         popupOptions.left = undefined;
         popupOptions.right = 120;
         position = DialogStrategy.getPosition(windowData, sizes, {
            popupOptions
         });
         expect(position.right).toEqual(120);

         popupOptions.right = 1900;
         position = DialogStrategy.getPosition(windowData, sizes, {
            popupOptions
         });
         expect(position.right).toEqual(1720);
      });

      it('dialog positioning overflow container', () => {
         let windowData = {
            width: 300,
            height: 300,
            topScroll: 0
         };
         let position = DialogStrategy.getPosition(windowData, sizes, {
            popupOptions: {}
         });
         expect(position.top).toEqual(0);
         expect(position.left).toEqual(50);
         expect(position.width).toEqual(undefined);
         expect(position.maxHeight).toEqual(300);
      });
      it('dialog positioning before mounting with minHeight', () => {
         let windowData = {
            width: 700,
            height: 700,
            topScroll: 0
         };
         let popupOptions = {
            minHeight: 200
         };
         let containerSizes = {
            width: 0,
            height: 0
         };
         let position = DialogStrategy.getPosition(windowData, containerSizes, {
            popupOptions: popupOptions
         });
         expect(position.height).toEqual(undefined);
      });

      it('dialog positioning overflow popup config', () => {
         let popupOptions = {
            minWidth: 300,
            maxWidth: 600
         };
         let windowData = {
            width: 500,
            height: 500,
            topScroll: 0
         };

         let sizesTest = { ...sizes };
         sizesTest.width = 600;

         let position = DialogStrategy.getPosition(windowData, sizesTest, {
            popupOptions
         });
         expect(position.left).toEqual(0);
         expect(position.maxWidth).toEqual(500);
      });

      it('dialog positioning overflow minWidth', () => {
         let popupOptions = {
            minWidth: 600,
            maxWidth: 700
         };
         let windowData = {
            width: 500,
            height: 500,
            topScroll: 0
         };
         let sizesTest = { ...sizes };
         sizesTest.width = 700;
         let position = DialogStrategy.getPosition(windowData, sizesTest, {
            popupOptions
         });
         expect(position.left).toEqual(0);
         expect(position.maxWidth).toEqual(500);
      });

      it('resetMargins', () => {
         let windowData = {
            width: 500,
            height: 500,
            topScroll: 0
         };
         let item = {
            popupOptions: {},
            targetCoords: {}
         };
         let position = DialogStrategy.getPosition(windowData, sizes, item);
         expect(position.margin).toEqual(0);
      });

      it('dialog popup options sizes config', () => {
         let popupOptions = {
            maxWidth: 800,
            maxHeight: 800,
            minWidth: 400,
            minHeight: 400
         };
         let windowData = {
            width: 500,
            height: 500,
            topScroll: 0
         };

         let width = 800;
         let height = 800;

         let sizesTest = { ...sizes, width, height };
         let position = DialogStrategy.getPosition(windowData, sizesTest, {
            popupOptions
         });
         expect(position.left).toEqual(0);
         expect(position.top).toEqual(0);
         expect(position.maxWidth).toEqual(500);
         expect(position.minWidth).toEqual(400);
         expect(position.maxHeight).toEqual(500);
         expect(position.minHeight).toEqual(400);

         popupOptions.width = 550;
         position = DialogStrategy.getPosition(windowData, sizesTest, {
            popupOptions
         });
         expect(position.width).toEqual(500);
         expect(position.maxHeight).toEqual(500);
         popupOptions.height = 500;
         popupOptions.maxHeight = 400;
         position = DialogStrategy.getPosition(windowData, sizesTest, {
            popupOptions
         });
         expect(position.width).toEqual(500);
         expect(position.height).toEqual(400);

         popupOptions.maximize = true;
         windowData.topScroll = 10;
         position = DialogStrategy.getPosition(windowData, sizesTest, {
            popupOptions
         });
         expect(position.left).toEqual(0);
         expect(position.top).toEqual(0);
      });

      it('dialog container sizes after update', () => {
         let container = {
            style: {
               width: 10,
               height: 10
            },
            querySelector: () => {
               return {};
            },
            getBoundingClientRect: () => {
               return {
                  width: 10,
                  height: 10
               };
            }
         };
         DialogController.prepareConfig = (cfg) => {
            if (!cfg.popupOptions.width) {
               expect(container.style.width).toEqual('auto');
            } else {
               expect(container.style.width).toEqual(10);
            }
            if (!cfg.popupOptions.height) {
               expect(container.style.height).toEqual('auto');
            } else {
               expect(container.style.height).toEqual(10);
            }
            expect(container.style.maxWidth).toEqual('20px');
            expect(container.style.maxHeight).toEqual('30px');
         };
         DialogController.elementUpdated(
            {
               position: {},
               popupOptions: {
                  width: 15,
                  height: 15,
                  maxWidth: 20,
                  maxHeight: 30
               }
            },
            container
         );
         DialogController.elementUpdated(
            {
               position: {},
               popupOptions: {
                  maxWidth: 20,
                  maxHeight: 30
               }
            },
            container
         );
         expect(container.style.width).toEqual(10);
         expect(container.style.height).toEqual(10);
         expect(container.style.maxWidth).toEqual('20px');
         expect(container.style.maxHeight).toEqual('30px');
      });

      it('dialog default position', () => {
         let item = {
            popupOptions: {
               maxWidth: 100,
               maxHeight: 100,
               minWidth: 10,
               minHeight: 10
            }
         };
         DialogController.getDefaultConfig(item);
         expect(item.position.maxWidth).toEqual(100);
         expect(item.position.minWidth).toEqual(10);
         expect(item.position.minHeight).toEqual(10);
         expect(item.position.maxHeight).toEqual(100);

         DialogController._getRestrictiveContainerSize = () => {
            return windowSize;
         };

         item.popupOptions = {};
         DialogController.getDefaultConfig(item);
         expect(item.position.maxWidth).toEqual(1920);
      });

      it('dialog positioned on prop storage coordinates', () => {
         const directions = [
            { horizontal: 'right', vertical: 'bottom' },
            { horizontal: 'right', vertical: 'top' },
            { horizontal: 'right', vertical: 'bottom' },
            { horizontal: 'right', vertical: 'bottom' }
         ];
         const getItem = (direction) => {
            return {
               popupOptions: {
                  resizeDirection: direction,
                  maxWidth: 100,
                  maxHeight: 100,
                  minWidth: 10,
                  minHeight: 10,
                  [direction.vertical === 'bottom' ? 'top' : 'bottom']: 100,
                  [direction.horizontal === 'right' ? 'left' : 'right']: 100
               }
            };
         };
         directions.forEach((direction) => {
            const item = getItem(direction);
            DialogController.getDefaultConfig(item);
            expect(item.position[direction.vertical === 'bottom' ? 'top' : 'bottom']).toEqual(100);
            expect(item.position[direction.horizontal === 'right' ? 'left' : 'right']).toEqual(100);
         });
      });

      it('dialog positioned out of window at start without popupOptions position', () => {
         let item = {
            popupOptions: {
               maxWidth: 100,
               maxHeight: 100,
               minWidth: 10,
               minHeight: 10
            }
         };
         DialogController.getDefaultConfig(item);
         expect(item.position.top).toEqual(-10000);
         expect(item.position.left).toEqual(-10000);
      });

      it('dialog positioned for coordinate', () => {
         let item = {
            popupOptions: {
               maxWidth: 100,
               maxHeight: 100,
               minWidth: 10,
               minHeight: 10,
               top: 10,
               left: 10
            }
         };
         DialogController.getDefaultConfig(item);
         expect(item.position.top).toEqual(10);
         expect(item.position.left).toEqual(10);
      });

      it('dialog positioned for coordinate and margin', () => {
         let item = {
            popupOptions: {
               maxWidth: 100,
               maxHeight: 100,
               minWidth: 10,
               minHeight: 10,
               top: 10,
               left: 10,
               offset: {
                  horizontal: 10,
                  vertical: 10
               }
            }
         };
         DialogController.getDefaultConfig(item);
         expect(item.position.top).toEqual(20);
         expect(item.position.left).toEqual(20);
      });

      it('dialog drag start', function () {
         let item = {
            position: {
               left: 100,
               top: 50
            },
            sizes: {
               width: 50,
               height: 50
            },
            popupOptions: {}
         };
         let offset = {
            x: 10,
            y: 20
         };
         let basePrepareConfig = DialogController._prepareConfig;
         DialogController._prepareConfig = (innerItem, innerSizes) => {
            expect(innerItem.sizes).toEqual(innerSizes);
         };
         DialogController.popupDragStart(item, null, offset);
         expect(item.startPosition.left).toEqual(100);
         expect(item.startPosition.top).toEqual(50);
         expect(item.position.left).toEqual(110);
         expect(item.position.top).toEqual(70);
         DialogController._prepareConfig = basePrepareConfig;
      });

      it('dialog draggable position', () => {
         let itemPosition = { left: 100, top: 100 };
         let windowData = {
            width: 800,
            height: 600,
            left: 0,
            top: 0,
            topScroll: 0
         };
         let position = DialogStrategy.getPosition(windowData, sizes, {
            position: itemPosition,
            fixPosition: true,
            popupOptions: {
               maxWidth: 100,
               maxHeight: 100,
               minWidth: 10,
               minHeight: 10
            }
         });
         expect(position.left).toEqual(itemPosition.left);
         expect(position.top).toEqual(itemPosition.top);
         expect(position.maxWidth).toEqual(100);
         expect(position.minWidth).toEqual(10);
         expect(position.minHeight).toEqual(10);
         expect(position.maxHeight).toEqual(100);

         itemPosition = {
            left: 700,
            top: 500,
            width: sizes.width,
            height: sizes.height
         };
         windowData = {
            width: 800,
            height: 620,
            topScroll: 0,
            left: 10,
            top: 20
         };
         position = DialogStrategy.getPosition(windowData, sizes, {
            position: itemPosition,
            fixPosition: true,
            popupOptions: {
               maxWidth: 100,
               maxHeight: 100,
               minWidth: 10,
               minHeight: 10
            }
         });
         expect(position.left).toEqual(700);
         expect(position.top).toEqual(340);
         expect(position.width).toEqual(100);
         expect(position.height).toEqual(100);
         expect(position.maxWidth).toEqual(100);
         expect(position.minWidth).toEqual(10);
         expect(position.minHeight).toEqual(10);
         expect(position.maxHeight).toEqual(100);
      });

      it('propStorageId initialized', (done) => {
         SettingsController.setController(mockedSettingsController);

         let item = {
            popupOptions: {
               propStorageId: 'testDialogPosition'
            }
         };

         // get position from storage by propstorageid
         DialogController.getDefaultConfig(item).then(() => {
            try {
               expect(item.position.top).toBe(200);
               expect(item.position.left).toBe(500);
               expect(item.popupOptions.top).toBe(200);
               expect(item.popupOptions.left).toBe(500);
               expect(item.fixPosition).toBe(true);
               done();
            } catch (e) {
               done(e);
            }
         });
      });

      it('propStorageId after dragndrop', (done) => {
         SettingsController.setController(mockedSettingsController);

         let item = {
            popupOptions: {
               propStorageId: 'testDialogPosition'
            },
            position: {
               top: 244,
               left: 111
            }
         };

         // check position after dragndrop
         DialogController.popupDragEnd(item);
         DialogController.getDefaultConfig(item).then(() => {
            try {
               expect(item.popupOptions.top).toEqual(244);
               expect(item.popupOptions.left).toEqual(111);
               done();
            } catch (e) {
               done(e);
            }
         });
      });

      it('position setted in popupOptions', () => {
         const dialogSizes = {
            width: 200,
            height: 100
         };
         const item = {
            popupOptions: {
               left: 100,
               top: 100
            },
            sizes: {
               width: 50,
               height: 50
            },
            position: {},
            fixPosition: false
         };
         const windowData = {
            width: 1920,
            height: 960,
            left: 0,
            top: 0,
            leftScroll: 0
         };
         let position = DialogStrategy.getPosition(windowData, dialogSizes, item);
         expect(position.left).toEqual(100);
         expect(position.top).toEqual(100);

         item.popupOptions.offset = {
            vertical: 10,
            horizontal: 5
         };
         position = DialogStrategy.getPosition(windowData, dialogSizes, item);
         expect(position.left).toEqual(105);
         expect(position.top).toEqual(110);

         delete item.popupOptions.offset;
         item.popupOptions.left = 1900;
         item.popupOptions.width = 50;
         position = DialogStrategy.getPosition(windowData, dialogSizes, item);
         expect(position.left).toEqual(1870);
      });

      it('restrictive container, maximize = true', () => {
         let item = {
            popupOptions: {
               maximize: true
            },
            position: {
               top: 100,
               left: 200
            }
         };
         let bodySelector;
         let getCoordsByContainer = BaseController.getCoordsByContainer;
         DialogController._getRestrictiveContainerSize = getRestrictiveContainer;
         BaseController.getCoordsByContainer = (selector) => {
            bodySelector = selector;
         };
         DialogController._getRestrictiveContainerSize(item);
         expect(bodySelector).toEqual('body');
         BaseController.getRootContainerCoords = getCoordsByContainer;
      });
      describe('position with resizeDirection', () => {
         const dialogSizes = {
            width: 200,
            height: 100
         };
         const item = {
            popupOptions: {},
            sizes: {
               width: 50,
               height: 50
            },
            position: {},
            fixPosition: false
         };
         const windowData = {
            width: 1920,
            height: 960,
            left: 0,
            top: 0,
            leftScroll: 0
         };
         const HORIZONTAL_DIRECTION = DirectionUtil.HORIZONTAL_DIRECTION;
         const VERTICAL_DIRECTION = DirectionUtil.VERTICAL_DIRECTION;
         it('widthout direction', () => {
            let position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.left).toEqual(860);
            expect(position.top).toEqual(430);
         });
         it('direction left top', () => {
            item.popupOptions.resizeDirection = {
               horizontal: HORIZONTAL_DIRECTION.LEFT,
               vertical: VERTICAL_DIRECTION.TOP
            };
            let position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.right).toEqual(860);
            expect(position.bottom).toEqual(430);
         });
         it('direction left bottom', () => {
            item.popupOptions.resizeDirection = {
               horizontal: HORIZONTAL_DIRECTION.LEFT,
               vertical: VERTICAL_DIRECTION.BOTTOM
            };
            let position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.right).toEqual(860);
            expect(position.top).toEqual(430);
         });
         it('direction right top', () => {
            item.popupOptions.resizeDirection = {
               horizontal: HORIZONTAL_DIRECTION.RIGHT,
               vertical: VERTICAL_DIRECTION.TOP
            };
            let position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.left).toEqual(860);
            expect(position.bottom).toEqual(430);
         });
         it('direction right bottom', () => {
            item.popupOptions.resizeDirection = {
               horizontal: HORIZONTAL_DIRECTION.RIGHT,
               vertical: VERTICAL_DIRECTION.BOTTOM
            };
            let position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.left).toEqual(860);
            expect(position.top).toEqual(430);
         });
         it('inner resize with direction should update sizes', () => {
            item.popupOptions.resizeDirection = {
               horizontal: HORIZONTAL_DIRECTION.RIGHT,
               vertical: VERTICAL_DIRECTION.BOTTOM
            };
            item.popupState = 'created';
            const originGetPopupSizes = DialogController._getPopupSizes;
            const newPopupSizes = {
               height: 123,
               width: 123
            };
            DialogController._getPopupSizes = () => {
               return newPopupSizes;
            };
            DialogController._getRestrictiveContainerSize = () => {
               return windowData;
            };
            DialogController.resizeInner(item, {
               style: {},
               querySelectorAll: () => {
                  return [];
               }
            });
            DialogController._getPopupSizes = originGetPopupSizes;
            expect(item.sizes.height).toEqual(newPopupSizes.height);
            expect(item.sizes.width).toEqual(newPopupSizes.width);
            item.popupOptions.height = undefined;
            item.popupOptions.width = undefined;
         });
         it('dragging', () => {
            item.popupOptions.resizeDirection = {
               horizontal: HORIZONTAL_DIRECTION.LEFT,
               vertical: VERTICAL_DIRECTION.TOP
            };
            item.fixPosition = false;
            DialogController._getRestrictiveContainerSize = () => {
               return windowData;
            };
            let position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.right).toEqual(860);
            expect(position.bottom).toEqual(430);
            item.position = {
               ...position,
               ...dialogSizes
            };
            DialogController.popupDragStart(item, null, {
               x: 20,
               y: 20
            });
            position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.right).toEqual(840);
            expect(position.bottom).toEqual(410);
            DialogController._getRestrictiveContainerSize = getRestrictiveContainer;
            item.position = {};
            item.fixPosition = false;
            item.startPosition = null;
         });

         it('dragging overflow', () => {
            item.popupOptions.resizeDirection = {
               horizontal: HORIZONTAL_DIRECTION.LEFT,
               vertical: VERTICAL_DIRECTION.TOP
            };
            DialogController._getRestrictiveContainerSize = () => {
               return windowData;
            };
            let position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.bottom).toEqual(430);
            item.position = {
               ...position,
               ...dialogSizes
            };
            DialogController.popupDragStart(item, null, {
               x: 2000,
               y: 2000
            });
            position = DialogStrategy.getPosition(windowData, dialogSizes, item);
            expect(position.right).toEqual(0);
            expect(position.bottom).toEqual(0);
            DialogController._getRestrictiveContainerSize = getRestrictiveContainer;
            item.position = {};
            item.fixPosition = false;
            item.startPosition = null;
         });

         it('inner resize should update position for popup with resizeDirection', () => {
            item.popupOptions.resizeDirection = {
               horizontal: HORIZONTAL_DIRECTION.RIGHT,
               vertical: VERTICAL_DIRECTION.BOTTOM
            };
            const originGetPopupSizes = DialogController._getPopupSizes;
            const newPopupSizes = {
               height: 111,
               width: 111
            };
            jest
               .spyOn(DialogController, '_getRestrictiveContainerSize')
               .mockClear()
               .mockReturnValue(window);
            jest
               .spyOn(DialogController, '_getPopupSizes')
               .mockClear()
               .mockReturnValue(newPopupSizes);
            jest.spyOn(DialogStrategy, 'getPosition').mockClear().mockImplementation();
            const result = DialogController.resizeInner(item, {
               style: {},
               querySelectorAll: () => {
                  return [];
               }
            });
            DialogController._getPopupSizes = originGetPopupSizes;
            expect(result).toBe(true);
            expect(DialogStrategy.getPosition).toHaveBeenCalledTimes(1);
            jest.restoreAllMocks();
         });
      });
   });
});
