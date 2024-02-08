define([
   'Controls/popupSliding',
   'Controls/_popupSliding/Strategy',
   'Controls/popupTemplateStrategy'
], (popupSliding, Strategy, popupStrategy) => {
   'use strict';
   var StrategyConstructor = Strategy.Strategy;
   var StrategySingleton = Strategy.default;
   var Controller = popupSliding.Controller;
   // var PopupController = popupLib.Controller;
   var getPopupItem = () => {
      return {
         id: 'randomId',
         position: {
            bottom: 0,
            left: 0,
            right: 0
         },
         previousSizes: {
            height: 400
         },
         sizes: {
            height: 500
         },
         popupOptions: {
            desktopMode: 'stack',
            slidingPanelOptions: {
               heightList: [400, 600, 800],
               position: 'bottom'
            }
         },
         controller: {}
      };
   };
   const DEFAULT_BODY_HEIGHT = 900;
   var DEFAULT_BODY_COORDS = {
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      height: DEFAULT_BODY_HEIGHT,
      width: 1000
   };

   new popupStrategy.Controller().init();

   describe('Controls/popupSliding', () => {
      describe('Strategy getPosition', () => {
         it('default case', () => {
            const item = getPopupItem();
            const SlidingPanelStrategy = new StrategyConstructor();
            SlidingPanelStrategy._getWindowHeight = () => {
               return DEFAULT_BODY_HEIGHT;
            };
            const position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

            expect(position.height).toEqual(400);
            expect(position.maxHeight).toEqual(800);
         });
         it('with initial position', () => {
            const SlidingPanelStrategy = new StrategyConstructor();
            const item = getPopupItem();
            item.position = {
               bottom: 0,
               height: 500
            };
            SlidingPanelStrategy._getWindowHeight = () => {
               return DEFAULT_BODY_HEIGHT;
            };
            const position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

            expect(position.height).toEqual(item.position.height);
            expect(position.bottom).toEqual(0);
         });
         it('Height can be zero', () => {
            const SlidingPanelStrategy = new StrategyConstructor();
            const item = getPopupItem();
            item.position = {
               bottom: 0,
               height: 0
            };
            SlidingPanelStrategy._getWindowHeight = () => {
               return DEFAULT_BODY_HEIGHT;
            };
            const position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

            expect(position.height).toEqual(0);
            expect(position.bottom).toEqual(0);
         });
         describe('check overflow', () => {
            it('window height < minHeight', () => {
               const SlidingPanelStrategy = new StrategyConstructor();
               const item = getPopupItem();
               const heightForOverflow = 300;
               SlidingPanelStrategy._getWindowHeight = () => {
                  return heightForOverflow;
               };
               const bodyCoords = {
                  ...DEFAULT_BODY_COORDS,
                  height: heightForOverflow
               };
               const position = SlidingPanelStrategy.getPosition(item, bodyCoords);

               expect(position.height).toEqual(heightForOverflow);
               expect(position.maxHeight).toEqual(heightForOverflow);
            });
            it('minHeight < window height < maxHeight', () => {
               const SlidingPanelStrategy = new StrategyConstructor();
               const item = getPopupItem();
               const heightForOverflow = 500;
               SlidingPanelStrategy._getWindowHeight = () => {
                  return heightForOverflow;
               };
               const bodyCoords = {
                  ...DEFAULT_BODY_COORDS,
                  height: heightForOverflow
               };
               const position = SlidingPanelStrategy.getPosition(item, bodyCoords);

               expect(position.height).toEqual(400);
               expect(position.maxHeight).toEqual(heightForOverflow);
            });
         });
         describe('position', () => {
            it('bottom', () => {
               const SlidingPanelStrategy = new StrategyConstructor();
               const item = getPopupItem();
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };
               item.popupOptions.slidingPanelOptions.position = 'bottom';
               const position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

               expect(position.bottom).toEqual(0);
            });
            it('bottom', () => {
               const SlidingPanelStrategy = new StrategyConstructor();
               const item = getPopupItem();
               item.popupOptions.slidingPanelOptions.position = 'top';
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };
               const position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

               expect(position.top).toEqual(0);
            });
         });

         describe('autoHeight', () => {
            it('initialisedHeight should be saved', () => {
               const SlidingPanelStrategy = new StrategyConstructor();
               const item = getPopupItem();
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };
               item.position.height = 800;
               item.popupOptions.slidingPanelOptions.autoHeight = true;
               const position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

               expect(position.height).toEqual(800);
            });
            it('after recalc position height should be undefined, if drag is not started', () => {
               const SlidingPanelStrategy = new StrategyConstructor();
               const item = getPopupItem();
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };
               item.popupOptions.slidingPanelOptions.autoHeight = true;
               const position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

               expect(position.height).toEqual(undefined);
            });
         });

         it('restrictiveContainer', () => {
            const SlidingPanelStrategy = new StrategyConstructor();
            const item = getPopupItem();
            item.popupOptions.slidingPanelOptions.position = 'bottom';
            SlidingPanelStrategy._getWindowHeight = () => {
               return DEFAULT_BODY_HEIGHT;
            };
            SlidingPanelStrategy._getWindowWidth = () => {
               return DEFAULT_BODY_COORDS.width;
            };
            const restrictiveContainerCoords = {
               top: 0,
               bottom: 0,
               left: 200,
               right: 500
            };
            const position = SlidingPanelStrategy.getPosition(item, restrictiveContainerCoords);
            expect(position.left).toEqual(restrictiveContainerCoords.left);
            expect(position.right).toEqual(
               DEFAULT_BODY_COORDS.width - restrictiveContainerCoords.right
            );
         });
      });
      describe('Controller', () => {
         describe('elementCreated', () => {
            it('position bottom', () => {
               const SlidingPanelStrategy = new StrategyConstructor();
               const item = getPopupItem();
               item.popupOptions.slidingPanelOptions.position = 'bottom';
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };
               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(Controller, '_getPopupSizes')
                  .mockClear()
                  .mockImplementation(() => {
                     return {
                        height: item.position.height
                     };
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });

               item.sizes = {};
               Controller.getDefaultConfig(item);
               expect(item.position.top).toEqual(DEFAULT_BODY_HEIGHT + 40);

               const result = Controller.elementCreated(item, {});
               expect(item.position.top).toEqual(500);

               expect(result).toEqual(true);
            });
            it('position top', () => {
               const SlidingPanelStrategy = new StrategyConstructor();
               const item = getPopupItem();
               item.popupOptions.slidingPanelOptions.position = 'top';
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };
               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(Controller, '_getPopupSizes')
                  .mockClear()
                  .mockImplementation(() => {
                     return {
                        height: item.position.height
                     };
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });

               item.sizes = {};
               Controller.getDefaultConfig(item);
               expect(item.position.bottom).toEqual(DEFAULT_BODY_HEIGHT + 40);
               const result = Controller.elementCreated(item, {});

               expect(item.position.bottom).toEqual(500);
               expect(result).toEqual(true);
            });
         });
         it('elementUpdated called only for top element', () => {
            const item1 = getPopupItem();
            const item2 = getPopupItem();
            item1.position = {
               height: 500,
               bottom: 0
            };
            item2.position = {
               height: 500,
               bottom: 0
            };

            jest
               .spyOn(StrategySingleton, 'getPosition')
               .mockClear()
               .mockImplementation(() => {
                  return {
                     height: 500,
                     bottom: 0
                  };
               });
            jest
               .spyOn(StrategySingleton, '_getWindowHeight')
               .mockClear()
               .mockImplementation(() => {
                  return DEFAULT_BODY_HEIGHT;
               });
            jest
               .spyOn(Controller, '_getPopupSizes')
               .mockClear()
               .mockImplementation(() => {
                  return {
                     height: item2.position.height
                  };
               });
            jest
               .spyOn(Controller, '_getRestrictiveContainerCoords')
               .mockClear()
               .mockImplementation(() => {
                  return DEFAULT_BODY_COORDS;
               });
            Controller.elementCreated(item1, {});
            Controller.elementCreated(item2, {});
            const result1 = Controller.elementUpdated(item1, {});
            const result2 = Controller.elementUpdated(item2, {});

            Controller.elementDestroyed(item1, {});
            Controller.elementDestroyed(item2, {});

            expect(result1).toEqual(false);
            expect(result2).toEqual(true);
         });
         it('elementDestroyed + elementAnimated', (resolve) => {
            const item = getPopupItem();
            const SlidingPanelStrategy = new StrategyConstructor();
            SlidingPanelStrategy._getWindowHeight = () => {
               return DEFAULT_BODY_HEIGHT;
            };
            jest
               .spyOn(StrategySingleton, '_getWindowHeight')
               .mockClear()
               .mockImplementation(() => {
                  return DEFAULT_BODY_HEIGHT;
               });
            jest
               .spyOn(Controller, '_getPopupSizes')
               .mockClear()
               .mockImplementation(() => {
                  return {
                     height: item.position.height
                  };
               });
            jest
               .spyOn(Controller, '_getRestrictiveContainerCoords')
               .mockClear()
               .mockImplementation(() => {
                  return DEFAULT_BODY_COORDS;
               });

            item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);
            let destroyedPromiseResolved = false;

            const result = Controller.elementDestroyed(item);

            expect(result instanceof Promise).toEqual(true);

            Controller.elementAnimated(item);

            const timeoutId = setTimeout(() => {
               expect(destroyedPromiseResolved).toEqual(true);
               resolve();
            }, 200);

            result.then(() => {
               destroyedPromiseResolved = true;
               expect(destroyedPromiseResolved).toEqual(true);
               clearTimeout(timeoutId);
               resolve();
            });
         });

         it('elementDestroyed before elementCreated', (resolve) => {
            const item = getPopupItem();
            const SlidingPanelStrategy = new StrategyConstructor();
            SlidingPanelStrategy._getWindowHeight = () => {
               return DEFAULT_BODY_HEIGHT;
            };
            jest
               .spyOn(StrategySingleton, '_getWindowHeight')
               .mockClear()
               .mockImplementation(() => {
                  return DEFAULT_BODY_HEIGHT;
               });
            jest
               .spyOn(Controller, '_getPopupSizes')
               .mockClear()
               .mockImplementation(() => {
                  return {
                     height: item.position.height
                  };
               });
            jest
               .spyOn(Controller, '_getRestrictiveContainerCoords')
               .mockClear()
               .mockImplementation(() => {
                  return DEFAULT_BODY_COORDS;
               });

            item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

            item.animationState = 'initializing';

            const result = Controller.elementDestroyed(item);

            expect(result instanceof Promise).toBe(true);
            result.then(resolve);
         });

         describe('getDefaultConfig', () => {
            it('postion bottom', () => {
               const item = getPopupItem();
               item.popupOptions.slidingPanelOptions.position = 'bottom';
               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(Controller, '_getPopupSizes')
                  .mockClear()
                  .mockImplementation(() => {
                     return {
                        height: item.position.height
                     };
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });

               Controller.getDefaultConfig(item);

               expect(
                  item.popupOptions.className.includes('controls-SlidingPanel__animation')
               ).toEqual(true);
               expect(item.popupOptions.slidingPanelData).toEqual({
                  minHeight: item.popupOptions.slidingPanelOptions.heightList[0],
                  maxHeight: item.position.maxHeight,
                  height: item.position.height,
                  isMobileMode: true,
                  position: item.popupOptions.slidingPanelOptions.position,
                  desktopMode: 'stack'
               });
               expect(item.popupOptions.hasOwnProperty('content')).toEqual(true);
            });

            it('position top', () => {
               const item = getPopupItem();
               item.popupOptions.slidingPanelOptions.position = 'top';
               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });
               Controller.getDefaultConfig(item);

               expect(
                  item.popupOptions.className.includes('controls-SlidingPanel__animation')
               ).toEqual(true);
               expect(item.popupOptions.slidingPanelData).toEqual({
                  minHeight: item.popupOptions.slidingPanelOptions.heightList[0],
                  maxHeight: item.position.maxHeight,
                  height: item.position.height,
                  isMobileMode: true,
                  position: item.popupOptions.slidingPanelOptions.position,
                  desktopMode: 'stack'
               });
               expect(item.popupOptions.hasOwnProperty('content')).toEqual(true);
            });
         });
         describe('popupDragStart', () => {
            it('position bottom', () => {
               const item = getPopupItem();
               const SlidingPanelStrategy = new StrategyConstructor();
               let height = 0;

               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(StrategySingleton, 'getPosition')
                  .mockClear()
                  .mockImplementation((innerItem) => {
                     height = innerItem.position.height;
                     return innerItem.position;
                  });
               jest
                  .spyOn(Controller, '_getPopupSizes')
                  .mockClear()
                  .mockImplementation(() => {
                     return {
                        height: item.position.height
                     };
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };

               item.popupOptions.slidingPanelOptions.position = 'bottom';
               item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);
               item.position.height = item.position.height + 100;
               const startHeight = item.position.height;

               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 0,
                     y: 10
                  }
               );
               expect(height).toEqual(startHeight - 10);
               Controller.popupDragEnd(item);
               expect(height).toEqual(item.popupOptions.slidingPanelOptions.heightList[0]);
            });

            it('position top', () => {
               const item = getPopupItem();
               const SlidingPanelStrategy = new StrategyConstructor();
               let height = 0;

               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(StrategySingleton, 'getPosition')
                  .mockClear()
                  .mockImplementation((innerItem) => {
                     height = innerItem.position.height;
                     return innerItem.position;
                  });
               jest
                  .spyOn(Controller, '_getPopupSizes')
                  .mockClear()
                  .mockImplementation(() => {
                     return {
                        height: item.position.height
                     };
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };

               item.popupOptions.slidingPanelOptions.position = 'top';
               item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);
               item.position.height = item.position.height + 100;
               const startHeight = item.position.height;

               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 0,
                     y: 10
                  }
               );
               expect(height).toEqual(startHeight + 10);
               Controller.popupDragEnd(item);
               expect(height).toEqual(item.popupOptions.slidingPanelOptions.heightList[1]);
            });
            it('double drag', () => {
               const item = getPopupItem();
               const SlidingPanelStrategy = new StrategyConstructor();
               let height = 0;

               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(StrategySingleton, 'getPosition')
                  .mockClear()
                  .mockImplementation((innerItem) => {
                     height = innerItem.position.height;
                     return innerItem.position;
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };

               item.popupOptions.slidingPanelOptions.position = 'bottom';
               item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);
               item.position.height = item.position.height + 100;
               const startHeight = item.position.height;

               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 0,
                     y: 10
                  }
               );
               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 0,
                     y: -20
                  }
               );
               expect(height).toEqual(startHeight + 20);
               Controller.popupDragEnd(item);
               expect(height).toEqual(item.popupOptions.slidingPanelOptions.heightList[1]);
            });
            it('overflow max', () => {
               const item = getPopupItem();
               const SlidingPanelStrategy = new StrategyConstructor();
               let height = 0;

               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(StrategySingleton, 'getPosition')
                  .mockClear()
                  .mockImplementation((innerItem) => {
                     height = innerItem.position.height;
                     return innerItem.position;
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };

               item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);
               item.position.height = item.position.height + 100;
               const startHeight = item.position.height;

               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 0,
                     y: -10000
                  }
               );
               Controller.popupDragEnd(item);

               expect(height).toEqual(startHeight + 10000);
               expect(StrategySingleton.getPosition).toHaveBeenCalled();
            });
            it('overflow min', () => {
               let height = 0;
               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(StrategySingleton, 'getPosition')
                  .mockClear()
                  .mockImplementation((item) => {
                     height = item.position.height;
                     return item.position;
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });

               const item = getPopupItem();
               const SlidingPanelStrategy = new StrategyConstructor();
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };

               item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);
               item.position.height = item.position.height + 100;
               const startHeight = item.position.height;

               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 0,
                     y: 10000
                  }
               );
               Controller.popupDragEnd(item);
               expect(height).toEqual(startHeight - 10000);
               expect(StrategySingleton.getPosition).toHaveBeenCalled();
            });
            // it('close by drag', () => {
            //    global.HTMLElement = class Test {};
            //    const item = getPopupItem();
            //    const SlidingPanelStrategy = new StrategyConstructor();
            //    SlidingPanelStrategy._getWindowHeight = () => {
            //       return DEFAULT_BODY_HEIGHT;
            //    };
            //    jest
            //       .spyOn(StrategySingleton, '_getWindowHeight')
            //       .mockClear()
            //       .mockImplementation(() => {
            //          return DEFAULT_BODY_HEIGHT;
            //       });
            //    jest
            //       .spyOn(Controller, '_getRestrictiveContainerCoords')
            //       .mockClear()
            //       .mockImplementation(() => {
            //          return DEFAULT_BODY_COORDS;
            //       });
            //
            //    item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);
            //
            //    Controller.popupDragStart(
            //       item,
            //       {},
            //       {
            //          x: 0,
            //          y: 10
            //       }
            //    );
            //    Controller.popupDragEnd(item);
            //    expect(PopupController.remove).toHaveBeenCalled();
            // });
            // it('minHeight > windowHeight. try to drag top. window should not close', () => {
            //    const item = getPopupItem();
            //    const SlidingPanelStrategy = new StrategyConstructor();
            //    SlidingPanelStrategy._getWindowHeight = () => {
            //       return 300;
            //    };
            //    jest
            //       .spyOn(StrategySingleton, '_getWindowHeight')
            //       .mockClear()
            //       .mockImplementation(() => {
            //          return 300;
            //       });
            //    jest
            //       .spyOn(Controller, '_getRestrictiveContainerCoords')
            //       .mockClear()
            //       .mockImplementation(() => {
            //          return DEFAULT_BODY_COORDS;
            //       });
            //
            //    const bodyCoords = { ...DEFAULT_BODY_COORDS, height: 300 };
            //    item.position = SlidingPanelStrategy.getPosition(item, bodyCoords);
            //
            //    Controller.popupDragStart(
            //       item,
            //       {},
            //       {
            //          x: 0,
            //          y: -10
            //       }
            //    );
            //    Controller.popupDragEnd(item);
            //    expect(PopupController.remove).not.toHaveBeenCalled();
            // });
            it('heightList when drag ended height should moved to closer height step', () => {
               const item = getPopupItem();
               const SlidingPanelStrategy = new StrategyConstructor();

               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });

               item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);

               const heightList = item.popupOptions.slidingPanelOptions.heightList;

               // closer to first step
               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 0,
                     y: 50
                  }
               );
               Controller.popupDragEnd(item);
               expect(item.position.height).toEqual(heightList[0]);

               // closer to second step
               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 0,
                     y: -100
                  }
               );
               Controller.popupDragEnd(item);
               expect(item.position.height).toEqual(heightList[1]);
            });

            it('horizontal drag should not change popup height', () => {
               const item = getPopupItem();
               const SlidingPanelStrategy = new StrategyConstructor();
               let height = 0;

               jest
                  .spyOn(StrategySingleton, '_getWindowHeight')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_HEIGHT;
                  });
               jest
                  .spyOn(StrategySingleton, 'getPosition')
                  .mockClear()
                  .mockImplementation((innerItem) => {
                     height = innerItem.position.height;
                     return innerItem.position;
                  });
               jest
                  .spyOn(Controller, '_getRestrictiveContainerCoords')
                  .mockClear()
                  .mockImplementation(() => {
                     return DEFAULT_BODY_COORDS;
                  });
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };

               item.popupOptions.slidingPanelOptions.position = 'bottom';
               item.position = SlidingPanelStrategy.getPosition(item, DEFAULT_BODY_COORDS);
               const startHeight = item.position.height;

               Controller.popupDragStart(
                  item,
                  {},
                  {
                     x: 20,
                     y: -10
                  }
               );
               Controller.popupDragEnd(item);
               expect(height).toEqual(startHeight);
            });
         });
         describe('compatibility min/max height and heightList', () => {
            it('minHeight', () => {
               const item = getPopupItem();
               const heightList = item.popupOptions.slidingPanelOptions.heightList;
               const minHeight = heightList[0];
               const SlidingPanelStrategy = new StrategyConstructor();
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };

               expect(SlidingPanelStrategy.getMinHeight(item)).toEqual(minHeight);

               item.popupOptions.slidingPanelOptions.heightList = null;
               item.popupOptions.slidingPanelOptions.minHeight = minHeight;

               expect(SlidingPanelStrategy.getMinHeight(item)).toEqual(minHeight);
            });

            it('maxHeight', () => {
               const item = getPopupItem();
               const heightList = item.popupOptions.slidingPanelOptions.heightList;
               const maxHeight = heightList[heightList.length - 1];
               const SlidingPanelStrategy = new StrategyConstructor();
               SlidingPanelStrategy._getWindowHeight = () => {
                  return DEFAULT_BODY_HEIGHT;
               };

               expect(SlidingPanelStrategy.getMaxHeight(item)).toEqual(maxHeight);

               item.popupOptions.slidingPanelOptions.heightList = null;
               item.popupOptions.slidingPanelOptions.maxHeight = maxHeight;

               expect(SlidingPanelStrategy.getMaxHeight(item)).toEqual(maxHeight);
            });
         });
      });
   });
});
