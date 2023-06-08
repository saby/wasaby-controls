define(['Controls/_operations/__MultiSelector', 'Types/entity'], function (
   MultiSelector,
   entity
) {
   'use strict';

   const testSelectedItemsCount = 5;
   const selectionCountConfig = {
      rpc: {
         call: () => {
            return Promise.resolve({
               getRow: () => {
                  return {
                     get: () => {
                        return testSelectedItemsCount;
                     }
                  };
               }
            });
         },
         getAdapter: () => {
            return new entity.adapter.Json();
         }
      }
   };

   describe('Controls.OperationsPanel.__MultiSelector', function () {
      var eventQueue;
      function mockNotify(returnValue) {
         return function (event, eventArgs, eventOptions) {
            eventQueue.push({
               event: event,
               eventArgs: eventArgs,
               eventOptions: eventOptions
            });
            return returnValue;
         };
      }

      beforeEach(function () {
         eventQueue = [];
      });
      let instance;

      beforeEach(() => {
         instance = new MultiSelector.default();
         instance._children = {
            countIndicator: {
               show: jest.fn(),
               hide: jest.fn()
            }
         };
      });

      describe('_updateSelection', function () {
         var selectedKeys, excludedKeys, selectedKeysCount;

         it('selectedKeys is [null]]', () => {
            selectedKeys = [null];
            excludedKeys = [];
            selectedKeysCount = 0;
            instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: true
            });
            expect(instance._menuCaption).toEqual('Отмечено все');
         });

         it('selectedKeys is []', () => {
            selectedKeys = [];
            excludedKeys = [];
            selectedKeysCount = 0;
            instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: false
            });
            expect(instance._menuCaption).toEqual('Отметить');

            instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: true
            });
            expect(instance._menuCaption).toEqual('Отметить');
         });

         it('selectedKeys is [null]]', () => {
            selectedKeys = [null];
            excludedKeys = [];
            selectedKeysCount = 0;
            instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: true
            });
            expect(instance._menuCaption).toEqual('Отмечено все');
         });

         it('selectedKeys is [1, 2], selectedKeysCount is 2', async () => {
            excludedKeys = [];
            selectedKeys = [1, 2];
            selectedKeysCount = 2;
            await instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: false
            });
            expect(instance._menuCaption).toEqual('Отмечено 2');
         });

         it('selectedKeys is [1, 2], selectedKeysCount is undefined', async () => {
            excludedKeys = [];
            selectedKeys = [1, 2];
            selectedKeysCount = undefined;
            await instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: false
            });
            expect(instance._menuCaption).toEqual('Отмечено 2');
         });

         it('selectedKeys is [null], excludedeKeys is [1,2,3] selectedKeysCount is 1', async () => {
            selectedKeys = [null];
            excludedKeys = [1, 2, 3];
            selectedKeysCount = 1;
            await instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: false
            });
            expect(instance._menuCaption).toEqual('Отмечено 1');
         });

         it('selectedKeys is [null], excludedeKeys is [1,2,3] selectedKeysCount is 1', () => {
            selectedKeys = [null];
            excludedKeys = [1, 2, 3, 4];
            selectedKeysCount = 0;
            instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: false
            });
            expect(instance._menuCaption).toEqual('Отметить');
         });

         it('selectedKeys is [null], excludedeKeys is [1,2,3] selectedKeysCount is 1', () => {
            excludedKeys = [];
            selectedKeys = [];
            selectedKeysCount = 1;
            instance._updateMenuCaptionByOptions({
               selectedKeys: selectedKeys,
               excludedKeys: excludedKeys,
               selectedKeysCount: selectedKeysCount,
               isAllSelected: false
            });
            expect(instance._menuCaption).toEqual('Отметить');
         });
      });
      it('_onMenuItemActivate', function () {
         let idItemMenu = 'selectAll';
         let recordMenu = {
            get: function () {
               return idItemMenu;
            }
         };

         instance._options = MultiSelector.default.getDefaultOptions();
         instance._notify = function (eventName, argumentsArray) {
            expect(argumentsArray[0]).toEqual(idItemMenu);
            expect(eventName).toEqual('selectedTypeChanged');
         };
         instance._onMenuItemActivate({}, recordMenu);

         idItemMenu = 'showSelected';
         instance._onMenuItemActivate({}, recordMenu);
      });

      it('_beforeUpdate with new selectionCountConfig, selectedKeysCount = 0', () => {
         let newOptions = {
            selectedKeys: ['anyKey'],
            excludedKeys: [],
            selectedKeysCount: 0,
            isAllSelected: false
         };
         instance._beforeMount(newOptions);
         instance.saveOptions(newOptions);

         newOptions = { ...newOptions };
         newOptions.selectionCountConfig = {
            rpc: {
               call: jest.fn(),
               getAdapter: jest.fn()
            }
         };
         instance._beforeUpdate(newOptions);
         expect(instance._menuCaption).toEqual('Отметить');
      });

      it('_beforeUpdate with old selectionCountConfig', () => {
         let menuCaptionUpdated = false;

         instance._updateMenuCaptionByOptions = () => {
            menuCaptionUpdated = true;
         };
         instance._options = {
            selectionCountConfig: {
               command: 'ListCounter'
            }
         };
         const newOptions = {
            selectionCountConfig: {
               command: 'ListCounter'
            }
         };
         instance._beforeUpdate(newOptions);
         expect(menuCaptionUpdated).toBe(false);
      });

      it('_afterRender', function () {
         instance._notify = mockNotify();
         instance._afterRender();
         expect(eventQueue.length).toEqual(0);
         instance._sizeChanged = true;
         instance._afterRender();
         expect(eventQueue.length).toEqual(1);
         expect(eventQueue[0].event).toEqual('controlResize');
         expect(eventQueue[0].eventArgs.length).toEqual(0);
         expect(eventQueue[0].eventOptions.bubbling).toBe(true);
      });

      describe('_getCount', () => {
         const selection = {
            selected: ['test'],
            excluded: []
         };

         beforeEach(() => {
            instance._options.selectedCountConfig = selectionCountConfig;
         });

         it('_getCount returns promise<count>', () => {
            return new Promise((resolve) => {
               instance
                  ._getCount(selection, null, {
                     selectedCountConfig: selectionCountConfig
                  })
                  .then((count) => {
                     expect(count).toEqual(testSelectedItemsCount);
                     resolve();
                  });
            });
         });

         it('promise is canceled on second getCount call', () => {
            let isCountPromiseCanceled = false;
            instance._getCount(selection, null, {
               selectedCountConfig: selectionCountConfig
            });
            instance._countPromise.cancel = () => {
               isCountPromiseCanceled = true;
            };
            instance._getCount(selection, null, {
               selectedCountConfig: selectionCountConfig
            });
            expect(isCountPromiseCanceled).toBe(true);
         });

         it('promise is canceled and reset', () => {
            let isCountPromiseCanceled = false;
            instance._getCount(selection, null, {
               selectedCountConfig: selectionCountConfig
            });
            instance._countPromise.cancel = () => {
               isCountPromiseCanceled = true;
            };
            instance._getCount(selection, 6, {
               selectedCountConfig: selectionCountConfig
            });
            expect(isCountPromiseCanceled).toBe(true);
            expect(instance._countPromise).toBeNull();
         });

         it('promise is canceled on _beforeUnmount', () => {
            let isCountPromiseCanceled = false;
            instance._getCount(selection, null, {
               selectedCountConfig: selectionCountConfig
            });
            instance._countPromise.cancel = () => {
               isCountPromiseCanceled = true;
            };
            instance._beforeUnmount();
            expect(isCountPromiseCanceled).toBe(true);
            expect(instance._countPromise).toBeNull();
         });
      });
   });
});
