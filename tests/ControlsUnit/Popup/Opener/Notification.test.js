define([
   'Controls/popupTemplate',
   'Controls/_popupTemplateStrategy/Notification/Template/NotificationContent',
   'Controls/popup',
   'Controls/_popupTemplateStrategy/Notification/NotificationController',
   'Types/collection',
   'Controls/sizeUtils'
], (popupTemplate, NotificationContent, popup, NotificationController, collection, sizeUtils) => {
   'use strict';

   // eslint-disable-next-line no-param-reassign
   NotificationContent = NotificationContent.default;

   describe('Controls/_popup/Opener/Notification', () => {
      const containers = [
         {
            offsetHeight: 10,
            offsetWidth: 10,
            getBoundingClientRect: () => {
               return {
                  width: 10,
                  height: 10
               };
            }
         },
         {
            offsetHeight: 20,
            offsetWidth: 20,
            getBoundingClientRect: () => {
               return {
                  width: 20,
                  height: 20
               };
            }
         },
         {
            offsetHeight: 30,
            offsetWidth: 30,
            getBoundingClientRect: () => {
               return {
                  width: 30,
                  height: 30
               };
            }
         }
      ];

      beforeEach(() => {
         global.HTMLElement = class Test {};
         NotificationController.default._historyCoords = {
            bottom: 0,
            right: 0
         };
         jest
            .spyOn(NotificationController.default, '_validatePosition')
            .mockClear()
            .mockImplementation();
         jest
            .spyOn(NotificationController.default, '_calculateDirection')
            .mockClear()
            .mockImplementation();
      });

      afterEach(function () {
         global.HTMLElement = undefined;
         NotificationController.default._stack.clear();
         jest.restoreAllMocks();
      });

      describe('_updatePositions', () => {
         it('should calculate correct coords for popups', () => {
            const item1 = {
               popupOptions: {}
            };
            const item2 = {
               popupOptions: {}
            };
            NotificationController.default._historyCoords = {
               bottom: 100,
               right: 100
            };
            let right;
            let bottom;
            NotificationController.default.elementCreated(item1, containers[1]);
            NotificationController.default.elementCreated(item2, containers[2]);
            NotificationController.default._updatePositions();
            right = NotificationController.default._stack.at(0).position.right;
            bottom = NotificationController.default._stack.at(0).position.bottom;
            expect(right).toEqual(NotificationController.default._historyCoords.right);
            expect(bottom).toEqual(NotificationController.default._historyCoords.bottom);

            right = NotificationController.default._stack.at(1).position.right;
            bottom = NotificationController.default._stack.at(1).position.bottom;
            const firstItemHeight = NotificationController.default._stack.at(0).height;
            expect(right).toEqual(NotificationController.default._historyCoords.right);
            expect(bottom).toEqual(
               NotificationController.default._historyCoords.bottom + firstItemHeight
            );
         });
      });

      describe('popupDragStart', () => {
         it('should calculate correct position after dragNDrop', () => {
            jest
               .spyOn(NotificationController.default, '_updatePositions')
               .mockClear()
               .mockImplementation();
            const item1 = {
               popupOptions: {}
            };
            jest
               .spyOn(sizeUtils.DimensionsMeasurer, 'getWindowDimensions')
               .mockClear()
               .mockReturnValue({
                  innerWidth: 1000,
                  innerHeight: 1000
               });
            NotificationController.default.elementCreated(item1, containers[1]);
            const popupItem = NotificationController.default._stack.at(0);
            const offset = {
               x: 10,
               y: 10
            };
            NotificationController.default._startPosition = {
               bottom: 210,
               right: 115
            };
            NotificationController.default.popupDragStart(popupItem, null, offset);
            expect(NotificationController.default._historyCoords.right).toEqual(105);
            expect(NotificationController.default._historyCoords.bottom).toEqual(200);
         });

         [
            {
               startPosition: {
                  bottom: 5,
                  right: 5
               },
               result: {
                  bottom: -5,
                  right: -5
               }
            },
            {
               startPosition: {
                  bottom: 999,
                  right: 100
               },
               result: {
                  bottom: 989,
                  right: 90
               }
            },
            {
               startPosition: {
                  bottom: 100,
                  right: 999
               },
               result: {
                  bottom: 90,
                  right: 989
               }
            }
         ].forEach((test, index) => {
            it('should not let popup go out of window ' + index, () => {
               jest
                  .spyOn(NotificationController.default, '_updatePositions')
                  .mockClear()
                  .mockImplementation();
               const item1 = {
                  popupOptions: {}
               };
               jest
                  .spyOn(sizeUtils.DimensionsMeasurer, 'getWindowDimensions')
                  .mockClear()
                  .mockReturnValue({
                     innerWidth: 1000,
                     innerHeight: 1000
                  });
               NotificationController.default.elementCreated(item1, containers[1]);
               const popupItem = NotificationController.default._stack.at(0);
               const offset = {
                  x: 10,
                  y: 10
               };
               NotificationController.default._startPosition = test.startPosition;
               NotificationController.default.popupDragStart(popupItem, null, offset);
               expect(NotificationController.default._historyCoords.right).toEqual(
                  test.result.right
               );
               expect(NotificationController.default._historyCoords.bottom).toEqual(
                  test.result.bottom
               );
            });
         });
      });

      it('elementCreated', function () {
         const item1 = {
            popupOptions: {}
         };
         const item2 = {
            popupOptions: {}
         };

         NotificationController.default.elementCreated(item1, containers[1]);
         expect(NotificationController.default._stack.getCount()).toEqual(1);
         expect(NotificationController.default._stack.at(0)).toEqual(item1);
         expect(item1.height).toEqual(containers[1].offsetHeight);
         expect(item1.position).toEqual({
            right: 0,
            bottom: 0
         });

         NotificationController.default.elementCreated(item2, containers[2]);
         expect(NotificationController.default._stack.getCount()).toEqual(2);
         expect(NotificationController.default._stack.at(0)).toEqual(item2);
         expect(NotificationController.default._stack.at(1)).toEqual(item1);
         expect(item2.height).toEqual(containers[2].offsetHeight);
         expect(item2.position).toEqual({
            right: 0,
            bottom: 0
         });
         expect(item1.position).toEqual({
            right: 0,
            bottom: containers[2].offsetHeight
         });
      });

      it('elementUpdated', function () {
         const item = {
            popupOptions: {}
         };

         NotificationController.default.elementCreated(item, containers[1]);
         NotificationController.default.elementUpdated(item, containers[2]);
         expect(NotificationController.default._stack.getCount()).toEqual(1);
         expect(NotificationController.default._stack.at(0)).toEqual(item);
         expect(item.height).toEqual(containers[2].offsetHeight);
         expect(item.position).toEqual({
            right: 0,
            bottom: 0
         });
      });

      it('elementDestroyed', function () {
         const item = {
            popupOptions: {}
         };

         NotificationController.default.elementCreated(item, containers[1]);
         NotificationController.default.elementDestroyed(item);
         expect(NotificationController.default._stack.getCount()).toEqual(0);
      });

      it('getDefaultConfig', function () {
         const item = {
            popupOptions: {}
         };

         NotificationController.default.getDefaultConfig(item);
         expect(item.popupOptions.content).toEqual(NotificationContent);
      });
      describe('_validatePosition', () => {
         [
            {
               historyCoords: {
                  bottom: 0,
                  right: 0
               },
               result: {
                  bottom: 0,
                  right: 0
               }
            },
            {
               historyCoords: {
                  bottom: 10000,
                  right: 10000
               },
               result: {
                  bottom: 980,
                  right: 980
               }
            },
            {
               historyCoords: {
                  bottom: 10000,
                  right: 500
               },
               result: {
                  bottom: 980,
                  right: 500
               }
            },
            {
               historyCoords: {
                  bottom: 500,
                  right: 10000
               },
               result: {
                  bottom: 500,
                  right: 980
               }
            },
            {
               historyCoords: {
                  bottom: -100,
                  right: -200
               },
               result: {
                  bottom: 0,
                  right: 0
               }
            },
            {
               innerHeight: 15,
               innerWidth: 15,
               historyCoords: {
                  bottom: 0,
                  right: 0
               },
               result: {
                  bottom: 0,
                  right: 0
               }
            }
         ].forEach((test) => {
            it('should set edges of window if popup does not fit it right', () => {
               jest.restoreAllMocks();
               const item1 = {
                  popupOptions: {}
               };
               NotificationController.default._historyCoords = test.historyCoords;
               jest
                  .spyOn(sizeUtils.DimensionsMeasurer, 'getWindowDimensions')
                  .mockClear()
                  .mockReturnValue({
                     innerWidth: test.innerWidth || 1000,
                     innerHeight: test.innerHeight || 1000
                  });
               NotificationController.default.elementCreated(item1, containers[1]);

               NotificationController.default._validatePosition();

               expect(test.result.bottom).toEqual(
                  NotificationController.default._historyCoords.bottom
               );
               expect(test.result.right).toEqual(
                  NotificationController.default._historyCoords.right
               );
            });
         });
      });
   });
});
