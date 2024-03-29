define([
   'Controls/popupTemplate',
   'Controls/_popupTemplate/Notification/Template/NotificationContent',
   'Controls/popup',
   'Controls/_popupTemplate/Notification/NotificationController',
   'Types/collection',
   'Controls/sizeUtils'
], (
   popupTemplate,
   NotificationContent,
   popup,
   NotificationController,
   collection,
   sizeUtils
) => {
   'use strict';

   // eslint-disable-next-line no-param-reassign
   NotificationContent = NotificationContent.default;

   describe('Controls/_popup/Opener/Notification', () => {
      const containers = [
         {
            offsetHeight: 10,
            offsetWidth: 10
         },
         {
            offsetHeight: 20,
            offsetWidth: 20
         },
         {
            offsetHeight: 30,
            offsetWidth: 30
         }
      ];

      beforeEach(() => {
         popupTemplate.NotificationController._historyCoords = {
            bottom: 0,
            right: 0
         };
         jest
            .spyOn(popupTemplate.NotificationController, '_validatePosition')
            .mockClear()
            .mockImplementation();
         jest
            .spyOn(popupTemplate.NotificationController, '_calculateDirection')
            .mockClear()
            .mockImplementation();
      });

      afterEach(function () {
         popupTemplate.NotificationController._stack.clear();
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
            popupTemplate.NotificationController._historyCoords = {
               bottom: 100,
               right: 100
            };
            let right;
            let bottom;
            popupTemplate.NotificationController.elementCreated(
               item1,
               containers[1]
            );
            popupTemplate.NotificationController.elementCreated(
               item2,
               containers[2]
            );
            popupTemplate.NotificationController._updatePositions();
            right =
               popupTemplate.NotificationController._stack.at(0).position.right;
            bottom =
               popupTemplate.NotificationController._stack.at(0).position
                  .bottom;
            expect(right).toEqual(
               popupTemplate.NotificationController._historyCoords.right
            );
            expect(bottom).toEqual(
               popupTemplate.NotificationController._historyCoords.bottom
            );

            right =
               popupTemplate.NotificationController._stack.at(1).position.right;
            bottom =
               popupTemplate.NotificationController._stack.at(1).position
                  .bottom;
            const firstItemHeight =
               popupTemplate.NotificationController._stack.at(0).height;
            expect(right).toEqual(
               popupTemplate.NotificationController._historyCoords.right
            );
            expect(bottom).toEqual(
               popupTemplate.NotificationController._historyCoords.bottom +
                  firstItemHeight
            );
         });
      });

      describe('popupDragStart', () => {
         it('should calculate correct position after dragNDrop', () => {
            jest
               .spyOn(popupTemplate.NotificationController, '_updatePositions')
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
            popupTemplate.NotificationController.elementCreated(
               item1,
               containers[1]
            );
            const popupItem = popupTemplate.NotificationController._stack.at(0);
            const offset = {
               x: 10,
               y: 10
            };
            popupTemplate.NotificationController._startPosition = {
               bottom: 210,
               right: 115
            };
            popupTemplate.NotificationController.popupDragStart(
               popupItem,
               null,
               offset
            );
            expect(
               popupTemplate.NotificationController._historyCoords.right
            ).toEqual(105);
            expect(
               popupTemplate.NotificationController._historyCoords.bottom
            ).toEqual(200);
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
                  .spyOn(
                     popupTemplate.NotificationController,
                     '_updatePositions'
                  )
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
               popupTemplate.NotificationController.elementCreated(
                  item1,
                  containers[1]
               );
               const popupItem =
                  popupTemplate.NotificationController._stack.at(0);
               const offset = {
                  x: 10,
                  y: 10
               };
               popupTemplate.NotificationController._startPosition =
                  test.startPosition;
               popupTemplate.NotificationController.popupDragStart(
                  popupItem,
                  null,
                  offset
               );
               expect(
                  popupTemplate.NotificationController._historyCoords.right
               ).toEqual(test.result.right);
               expect(
                  popupTemplate.NotificationController._historyCoords.bottom
               ).toEqual(test.result.bottom);
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

         popupTemplate.NotificationController.elementCreated(
            item1,
            containers[1]
         );
         expect(popupTemplate.NotificationController._stack.getCount()).toEqual(
            1
         );
         expect(popupTemplate.NotificationController._stack.at(0)).toEqual(
            item1
         );
         expect(item1.height).toEqual(containers[1].offsetHeight);
         expect(item1.position).toEqual({
            right: 0,
            bottom: 0
         });

         popupTemplate.NotificationController.elementCreated(
            item2,
            containers[2]
         );
         expect(popupTemplate.NotificationController._stack.getCount()).toEqual(
            2
         );
         expect(popupTemplate.NotificationController._stack.at(0)).toEqual(
            item2
         );
         expect(popupTemplate.NotificationController._stack.at(1)).toEqual(
            item1
         );
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

         popupTemplate.NotificationController.elementCreated(
            item,
            containers[1]
         );
         popupTemplate.NotificationController.elementUpdated(
            item,
            containers[2]
         );
         expect(popupTemplate.NotificationController._stack.getCount()).toEqual(
            1
         );
         expect(popupTemplate.NotificationController._stack.at(0)).toEqual(
            item
         );
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

         popupTemplate.NotificationController.elementCreated(
            item,
            containers[1]
         );
         popupTemplate.NotificationController.elementDestroyed(item);
         expect(popupTemplate.NotificationController._stack.getCount()).toEqual(
            0
         );
      });

      it('getDefaultConfig', function () {
         const item = {
            popupOptions: {}
         };

         popupTemplate.NotificationController.getDefaultConfig(item);
         expect(item.popupOptions.content).toEqual(NotificationContent);
      });

      it('getCustomZIndex', () => {
         let list = new collection.List();
         list.add({
            id: 1,
            popupOptions: {}
         });
         let zIndex = popup.Notification.zIndexCallback({}, list);
         expect(zIndex).toEqual(100);

         list.add({
            id: 2,
            popupOptions: {
               maximize: true
            }
         });

         zIndex = popup.Notification.zIndexCallback({}, list);
         expect(zIndex).toEqual(19);

         list.at(1).popupOptions.maximize = false;
         list.at(1).popupOptions.modal = true;

         zIndex = popup.Notification.zIndexCallback({}, list);
         expect(zIndex).toEqual(19);

         let item = {
            id: 3,
            parentId: 2,
            popupOptions: {}
         };
         list.add(item);
         zIndex = popup.Notification.zIndexCallback(item, list);
         expect(zIndex).toEqual(100);
      });

      it('getCompatibleConfig', () => {
         const cfg = {
            autoClose: true
         };

         popup.Notification.prototype._getCompatibleConfig(
            {
               prepareNotificationConfig: function (config) {
                  return config;
               }
            },
            cfg
         );
         expect(cfg.notHide).toEqual(false);
         cfg.autoClose = false;
         popup.Notification.prototype._getCompatibleConfig(
            {
               prepareNotificationConfig: function (config) {
                  return config;
               }
            },
            cfg
         );
         expect(cfg.notHide).toEqual(true);
      });

      it('Notification opener open/close', (done) => {
         let closeId = null;
         popup.Notification.openPopup = () => {
            return Promise.resolve('123');
         };

         popup.Notification.closePopup = (id) => {
            closeId = id;
         };

         const opener = new popup.Notification({});
         opener.open().then((id1) => {
            expect(id1).toEqual('123');
            opener.open().then((id2) => {
               expect(id2).toEqual('123');
               opener.close();
               expect(closeId).toEqual('123');
               done();
            });
         });
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
               popupTemplate.NotificationController._historyCoords =
                  test.historyCoords;
               jest
                  .spyOn(sizeUtils.DimensionsMeasurer, 'getWindowDimensions')
                  .mockClear()
                  .mockReturnValue({
                     innerWidth: test.innerWidth || 1000,
                     innerHeight: test.innerHeight || 1000
                  });
               popupTemplate.NotificationController.elementCreated(
                  item1,
                  containers[1]
               );

               popupTemplate.NotificationController._validatePosition();

               expect(test.result.bottom).toEqual(
                  popupTemplate.NotificationController._historyCoords.bottom
               );
               expect(test.result.right).toEqual(
                  popupTemplate.NotificationController._historyCoords.right
               );
            });
         });
      });
   });
});
