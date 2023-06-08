define([
   'Controls/popup',
   'Controls/_popupTemplate/BaseController',
   'Controls/_popup/Manager/ManagerController',
   'Core/Deferred'
], function (popupMod, BaseController, ManagerController, Deferred) {
   'use strict';
   // eslint-disable-next-line no-param-reassign
   BaseController = BaseController.default;
   // eslint-disable-next-line no-param-reassign
   ManagerController = ManagerController.default;

   let Manager;
   let Container;
   beforeEach(() => {
      jest
         .spyOn(BaseController.prototype, '_checkContainer')
         .mockClear()
         .mockReturnValue(true);

      Manager = new popupMod.ManagerClass();

      // вроде ни один тест не рассчитывает на то, что этот метод вернёт что-то, так что отключаю спам ошибками
      jest.spyOn(Manager, '_getItemContainer').mockClear().mockImplementation();
      Container = new popupMod.Container();
      Manager.init({});
      Container._afterMount();
   });

   afterEach(() => {
      Manager.destroy();
      jest.restoreAllMocks();
   });

   describe('Controls/_popup/Manager/ManagerController', () => {
      it('initialize', function () {
         // Manager and container doesn't initialized
         popupMod.Controller._manager = undefined;
         expect(popupMod.Controller.find()).toEqual(false);
      });

      it('callMethod', () => {
         let arg0 = '1';
         let arg1 = '2';
         let methodName;

         let baseMethod = popupMod.Controller._callManager;

         popupMod.Controller._callManager = (method, args) => {
            expect(methodName).toEqual(method);
            expect(args[0]).toEqual(arg0);
            expect(args[1]).toEqual(arg1);
         };

         for (methodName of ['find', 'remove', 'update', 'show']) {
            popupMod.Controller[methodName](arg0, arg1);
         }

         popupMod.Controller._callManager = baseMethod;
      });
   });

   describe('Controls/_popup/Manager', function () {
      let id, element;

      it('initialize', function () {
         expect(Manager._popupItems.getCount()).toEqual(0);
      });

      it('append popup', function () {
         id = Manager.show(
            {
               testOption: 'created'
            },
            new BaseController()
         );
         expect(Manager._popupItems.getCount()).toEqual(1);
         element = Manager.find(id);
         expect(element.popupOptions.testOption).toEqual('created');
      });

      it('find popup', () => {
         id = Manager.show(
            {
               testOption: 'created'
            },
            new BaseController()
         );
         element = Manager.find(id);
         expect(element.popupOptions.testOption).toEqual('created');
         element.popupState = 'destroyed';
         element = Manager.find(id);
         expect(element).toEqual(null);
      });

      it('update popup', function () {
         id = Manager.show(
            {
               testOption: 'created'
            },
            new BaseController()
         );
         element = Manager.find(id);
         element.popupState = 'created';
         Manager._redrawItems = () => {
            return {
               then: (callback) => {
                  callback();
               }
            };
         };
         id = Manager.update(id, {
            testOption: 'updated1'
         });
         expect(element.popupOptions.testOption).toEqual('updated1');
         id = Manager.show(
            {
               id: id,
               testOption: 'updated2'
            },
            new BaseController()
         );
         expect(element.popupOptions.testOption).toEqual('updated2');
      });

      it('fireEventHandler', function () {
         let eventOnCloseFired = false;
         id = Manager.show(
            {
               testOption: 'created'
            },
            new BaseController()
         );
         var eventCloseFired = false;
         element = Manager.find(id);
         element.popupState = 'created';
         Manager.update(id, {
            eventHandlers: {
               onClose: function () {
                  eventCloseFired = true;
               }
            },
            _events: {
               onClose: () => {
                  eventOnCloseFired = true;
               },
               onResult: (event, args) => {
                  expect(args[0]).toEqual('1');
                  expect(args[1]).toEqual('2');
               }
            }
         });

         // eslint-disable-next-line no-useless-call
         Manager._fireEventHandler.call(Manager, element, 'onClose');

         expect(eventCloseFired).toBe(true);
         expect(eventOnCloseFired).toBe(true);

         // eslint-disable-next-line no-useless-call
         Manager._fireEventHandler.call(Manager, id, 'onResult', '1', '2');
      });

      it('remove popup', async function () {
         id = Manager.show(
            {
               testOption: 'created'
            },
            new BaseController()
         );
         const prom = Manager.remove(id);
         const item = Manager.find(id);
         expect(item.popupState).toEqual('startDestroying');

         await prom;

         expect(Manager._popupItems.getCount()).toEqual(0);
      });

      it('remove popup with pendings', function (done) {
         let id1 = Manager.show(
            {
               testOption: 'created'
            },
            new BaseController()
         );
         let id2 = Manager.show(
            {
               testOption: 'created'
            },
            new BaseController()
         );
         let id3 = Manager.show(
            {
               testOption: 'created'
            },
            new BaseController()
         );

         let hasPending = true;
         let pendingDeferred = new Deferred();

         let Pending = {
            hasRegisteredPendings: () => {
               return hasPending;
            },
            finishPendingOperations: () => {
               return pendingDeferred;
            }
         };

         Manager._getPopupContainer = () => {
            return {
               getPending: () => {
                  return Pending;
               }
            };
         };

         Manager.remove(id1);

         // wait promise timeout
         setTimeout(() => {
            expect(Manager._popupItems.getCount()).toEqual(3);

            Pending = false;
            Manager.remove(id2).then(() => {
               expect(Manager._popupItems.getCount()).toEqual(2);
               Pending = {
                  hasRegisteredPendings: () => {
                     return hasPending;
                  },
                  finishPendingOperations: () => {
                     return pendingDeferred;
                  }
               };

               Manager.remove(id3);

               // wait promise timeout
               setTimeout(() => {
                  expect(Manager._popupItems.getCount()).toEqual(2);
                  pendingDeferred.callback();
                  expect(Manager._popupItems.getCount()).toEqual(0);
                  done();
               }, 10);
            });
         }, 10);
      });

      it('remove popup and check event', async function () {
         let eventCloseFired = false;
         let eventOnCloseFired = false;
         id = Manager.show(
            {
               eventHandlers: {
                  onClose: function () {
                     eventCloseFired = true;
                  }
               },
               _events: {
                  onClose: () => {
                     eventOnCloseFired = true;
                  }
               }
            },
            new BaseController()
         );
         await Manager.remove(id);

         expect(eventCloseFired).toEqual(false);
         expect(eventOnCloseFired).toEqual(false);
      });

      it('add modal popup', async function () {
         let id1 = Manager.show(
            {
               modal: false,
               testOption: 'created'
            },
            new BaseController()
         );

         Manager.show(
            {
               modal: true,
               testOption: 'created'
            },
            new BaseController()
         );

         let indices = Manager._popupItems.getIndicesByValue('modal', true);
         expect(indices.length).toEqual(1);
         expect(indices[0]).toEqual(1);

         await Manager.remove(id1);

         indices = Manager._popupItems.getIndicesByValue('modal', true);
         expect(indices.length).toEqual(1);
         expect(indices[0]).toEqual(0);
      });
      it('managerPopupMaximized notified', function () {
         let popupOptions = {
            modal: false,
            maximize: false,
            testOption: 'created'
         };
         var isMaximizeNotified;
         const stub = jest
            .spyOn(popupMod.ManagerClass, '_notifyEvent')
            .mockClear()
            .mockImplementation(function (event, args) {
               isMaximizeNotified = event === 'managerPopupMaximized';
               expect(popupOptions === args[0].popupOptions).toBe(true);
            });
         let id0 = Manager.show(popupOptions, new BaseController());
         Manager._popupMaximized(id0);
         expect(isMaximizeNotified).toBe(true);
         stub.mockRestore();
      });
      it('managerPopupUpdated notified', function () {
         let popupOptions = {
            modal: false,
            maximize: false,
            testOption: 'created'
         };
         var isUpdateNotified;
         const stub = jest
            .spyOn(popupMod.ManagerClass, '_notifyEvent')
            .mockClear()
            .mockImplementation(function (event, args) {
               isUpdateNotified = event === 'managerPopupUpdated';
               expect(popupOptions === args[0].popupOptions).toBe(true);
            });
         let id0 = Manager.show(popupOptions, new BaseController());
         Manager._popupUpdated(id0);
         expect(isUpdateNotified).toBe(true);
         isUpdateNotified = null;
         Manager._popupMovingSize(id0, {});
         expect(isUpdateNotified).toBe(true);
         stub.mockRestore();
      });
      it('managerPopupDestroyed notified', async function () {
         let popupOptions = {
            testOption: 'created'
         };
         var isDestroyNotified;
         jest
            .spyOn(popupMod.ManagerClass, '_notifyEvent')
            .mockClear()
            .mockImplementation(function (event, args) {
               isDestroyNotified = event === 'managerPopupDestroyed';
               if (event === 'managerPopupDestroyed') {
                  expect(args[1].getCount()).toEqual(0);
               }
               expect(popupOptions).toEqual(args[0].popupOptions);
            });
         id = Manager.show(popupOptions, new BaseController());
         await Manager.remove(id);

         expect(isDestroyNotified).toBe(true);
      });
      it('isIgnoreActivationArea', function () {
         let focusedContainer = {
            classList: {
               contains: function (str) {
                  if (str === 'controls-Popup__isolatedFocusingContext') {
                     return true;
                  }
                  return false;
               }
            }
         };
         let focusedArea = {};
         var firstResult = Manager._isIgnoreActivationArea(focusedContainer);
         expect(firstResult).toEqual(true);
         var secondResult = Manager._isIgnoreActivationArea(focusedArea);
         expect(secondResult).toEqual(false);
      });
      describe('mousedownHandler', function () {
         it('closeOnOutsideClick', () => {
            let removedCount = 0;
            Manager.remove = () => {
               return removedCount++;
            };
            Manager._isIgnoreActivationArea = () => {
               return false;
            };
            Manager._isNewEnvironment = () => {
               return true;
            };
            Manager._needClosePopupByOutsideClick = (item) => {
               return item.popupOptions.closeOnOutsideClick;
            };
            Manager.show(
               {
                  testOption: 'created',
                  autofocus: false,
                  closeOnOutsideClick: true
               },
               new BaseController()
            );
            Manager.show(
               {
                  testOption: 'created'
               },
               new BaseController()
            );
            Manager.show(
               {
                  testOption: 'created',
                  autofocus: false,
                  closeOnOutsideClick: true
               },
               new BaseController()
            );
            let event = {
               target: {
                  classList: {
                     contains: () => {
                        return false;
                     }
                  }
               }
            };
            global.document = {
               documentElement: {
                  contains: () => {
                     return true;
                  }
               }
            };
            Manager.mouseDownHandler(event);
            expect(removedCount).toEqual(2);
            Manager.destroy();
            global.document = undefined;
         });
         it('closeOnOverlayClick', () => {
            let popupRemoved = false;
            Manager.remove = () => {
               popupRemoved = true;
            };
            Manager._isIgnoreActivationArea = () => {
               return false;
            };
            Manager._isNewEnvironment = () => {
               return true;
            };
            const popupId = Manager.show(
               {
                  testOption: 'created',
                  closeOnOverlayClick: true
               },
               new BaseController()
            );
            const item = Manager.find(popupId);
            item.popupState = item.controller.POPUP_STATE_CREATED;
            let event = {
               target: {
                  classList: {
                     contains: () => {
                        return true;
                     }
                  }
               }
            };
            const popupContainer = ManagerController.getContainer();
            popupContainer.getOverlayIndex = () => {
               return 0;
            };
            Manager.mouseDownHandler(event);
            expect(popupRemoved).toEqual(true);
            Manager.destroy();
         });
      });
      it('Linked Popups', function (done) {
         let id1 = Manager.show({}, new BaseController());

         let id2 = Manager.show({}, new BaseController());

         Manager._popupItems.at(0).childs = [Manager._popupItems.at(1)];
         Manager._popupItems.at(1).parentId = id1;

         let removeDeferred2 = new Deferred();
         let baseRemove = Manager._removeElement;
         Manager._removeElement = (elem, container) => {
            if (elem.id === id2) {
               elem.controller.elementDestroyed = () => {
                  return removeDeferred2;
               };
            }
            Manager._notify = jest.fn();
            return baseRemove.call(Manager, elem, container);
         };
         Manager.remove(id1);

         // wait promise timeout
         setTimeout(() => {
            expect(Manager._popupItems.getCount()).toEqual(2);
            removeDeferred2.callback();

            // wait promise timeout
            setTimeout(() => {
               expect(Manager._popupItems.getCount()).toEqual(0);
               Manager.destroy();
               done();
            }, 10);
         }, 10);
      });

      it('removeFromParentConfig', function () {
         let id1 = Manager.show({}, new BaseController());

         Manager.show({}, new BaseController());

         Manager._popupItems.at(0).childs = [Manager._popupItems.at(1)];
         Manager._popupItems.at(1).parentId = id1;
         Manager._removeFromParentConfig(Manager._popupItems.at(1));
         expect(Manager._popupItems.at(0).childs.length).toEqual(0);

         Manager.destroy();
      });
      it('managerPopupCreated notified', function () {
         let isPopupOpenedEventTriggered = false;
         let popupOptions = {
            modal: false,
            maximize: false,
            testOption: 'created',
            _events: {
               onOpen: () => {
                  isPopupOpenedEventTriggered = true;
               }
            }
         };
         var isCreateNotified;
         const stub = jest
            .spyOn(popupMod.ManagerClass, '_notifyEvent')
            .mockClear()
            .mockImplementation(function (event, args) {
               isCreateNotified = event === 'managerPopupCreated';
               expect(popupOptions === args[0].popupOptions).toBe(true);
            });
         let id0 = Manager.show(popupOptions, new BaseController());
         // eslint-disable-next-line no-useless-call
         Manager._popupCreated.call(Manager, id0);
         // eslint-disable-next-line no-useless-call
         Manager._popupBeforePaintOnMount.call(Manager, id0);
         expect(isCreateNotified).toBe(true);
         expect(isPopupOpenedEventTriggered).toBe(true);
         stub.mockRestore();
      });
      it('managerPopupResingLine', function () {
         let popupOptions = {
            width: 500,
            maxWidth: 800,
            minWidth: 300
         };
         let offset = 100;
         let id0 = Manager.show(popupOptions, new BaseController());
         expect(Manager._popupMovingSize(id0, offset)).toBe(true);
      });
      it('managerPopupAnimated', () => {
         let id0 = Manager.show({}, new BaseController());
         let hasError = false;
         try {
            Manager._popupAnimated(id0);
         } catch (err) {
            hasError = true;
         }
         expect(false).toEqual(hasError);
      });

      it('calculateZIndex', () => {
         const controller = {
            getDefaultConfig: jest.fn()
         };
         const item1 = {
            id: 1
         };
         Manager.show(item1, controller);
         expect(Manager._popupItems.at(0).currentZIndex).toEqual(10);

         const item2 = {
            id: 2,
            topPopup: true
         };
         Manager.show(item2, controller);
         expect(Manager._popupItems.at(1).currentZIndex).toEqual(4000);

         const item3 = {
            id: 3
         };
         Manager.show(item3, controller);
         Manager._popupItems.at(2).parentId = 2;
         Manager._updateZIndex();
         expect(Manager._popupItems.at(2).currentZIndex).toEqual(4010);

         const item4 = {
            id: 2,
            zIndexCallback: () => {
               return 5000;
            }
         };
         Manager.show(item4, controller);
         expect(Manager._popupItems.at(3).currentZIndex).toEqual(5000);
         Manager.destroy();
      });

      it('update popup poisition by scroll and resize', () => {
         let isResetRootContainerCalled = false;
         let isControllerCalled = false;
         const BaseController1 = {
            resetRootContainerCoords: () => {
               isResetRootContainerCalled = true;
            }
         };
         const controllerCallback = () => {
            isControllerCalled = true;
         };
         const item = {
            controller: {
               resizeOuter: controllerCallback,
               pageScrolled: controllerCallback,
               workspaceResize: controllerCallback
            }
         };
         Manager._popupItems.add(item);
         Manager._getBaseController = () => {
            return BaseController1;
         };
         Manager._pageScrolledBase();
         expect(isResetRootContainerCalled).toEqual(true);
         expect(isControllerCalled).toEqual(true);

         const methods = [
            '_popupResizeOuterBase',
            '_workspaceResize',
            '_pageScrolledBase'
         ];
         for (const method of methods) {
            Manager[method]();
            expect(isResetRootContainerCalled).toEqual(true);
            expect(isControllerCalled).toEqual(true);
            isResetRootContainerCalled = false;
            isControllerCalled = false;
         }
         Manager.destroy();
      });

      it('moveToTop', () => {
         const item1 = {
            id: 1
         };
         const item2 = {
            id: 2
         };
         const item3 = {
            id: 3
         };
         const controller = {
            getDefaultConfig: jest.fn(),
            elementUpdateOptions: jest.fn()
         };
         Manager.show(item1, controller);
         Manager.show(item2, controller);
         Manager.show(item3, controller);
         Manager._popupItems.at(0).popupState = 'created';

         Manager.show(item1, controller);

         // assert.equal(Manager._popupItems.at(2).id, item1.id);
         Manager.destroy();
      });

      it('finishPendings', () => {
         let popupId = Manager.show(
            {
               closeOnOutsideClick: true
            },
            new BaseController()
         );

         let hasPending = true;
         let pendingDeferred = new Deferred();

         let Pending = {
            hasRegisteredPendings: () => {
               return hasPending;
            },
            finishPendingOperations: () => {
               return pendingDeferred;
            }
         };

         Manager._getPopupContainer = () => {
            return {
               getPending: () => {
                  return Pending;
               }
            };
         };

         Manager._finishPendings(popupId, null, null, null);
         let item = Manager._popupItems.at(0);
         let error = new Error('error');
         error.canceled = true;
         item.removePending.errback(error);
         expect(item.popupState).toBe('created');
         expect(item.removePending).toBe(null);
         Manager.destroy();
      });

      it('isDestroying', () => {
         let popupId = Manager.show(
            {
               closeOnOutsideClick: true
            },
            new BaseController()
         );
         const item = Manager.find(popupId);
         item.popupState = item.controller.POPUP_STATE_DESTROYING;
         expect(Manager.isDestroying(popupId)).toBe(true);
      });
   });
});
