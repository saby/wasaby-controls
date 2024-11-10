define([
   'Controls/suggestPopup',
   'Controls/_suggestPopup/List',
   'Env/Env',
   'Types/entity',
   'Types/collection',
   'Controls/dataSource',
   'Types/source'
], function (
   suggestPopup,
   SuggestPopupListContainer,
   Env,
   entity,
   collection,
   dataSource,
   sourceLib
) {
   'use strict';

   function getSuggestItems() {
      return new collection.RecordSet({
         data: [
            {
               id: 0,
               title: 'Sasha'
            },
            {
               id: 1,
               title: 'Aleksey'
            },
            {
               id: 2,
               title: 'Dmitry'
            }
         ]
      });
   }

   describe('Controls.Container.Suggest.List', function () {
      describe('_beforeUpdate', function () {
         var suggestList = new SuggestPopupListContainer();
         var optionsObject = {
            _dataOptionsValue: {
               test: {}
            },
            _suggestListOptions: {
               tabsSelectedKey: null
            }
         };
         var optionsObjectWithNewKey = {
            _dataOptionsValue: {
               test: {}
            },
            _suggestListOptions: {
               tabsSelectedKey: 'test'
            }
         };

         var eventFired = false;
         var tab = null;

         suggestList._suggestListOptions = {
            tabsSelectedKey: null
         };

         suggestList._notify = function (event, id) {
            eventFired = true;
            tab = id[0];
         };

         it('default', function () {
            suggestList._beforeUpdate(optionsObject);

            expect(eventFired).toBe(false);
            expect(tab).toEqual(null);
         });

         it('with new tab key', function () {
            suggestList._beforeUpdate(optionsObjectWithNewKey);

            expect(eventFired).toBe(true);
            expect(tab).toEqual('test');
         });
      });

      describe('_beforeMount', () => {
         it('items from sourceController is saved on beforeMount', () => {
            const suggestList = new SuggestPopupListContainer();
            const sourceController = new dataSource.NewSourceController({
               source: new sourceLib.Memory()
            });
            sourceController.setItems(getSuggestItems());

            const optionsObject = {
               _dataOptionsValue: {
                  test: {
                     sourceController
                  }
               },
               _suggestListOptions: {}
            };

            suggestList._beforeMount(optionsObject);
            expect(suggestList._items.getRawData()).toEqual(getSuggestItems().getRawData());
         });
      });

      it('_tabsSelectedKeyChanged', function () {
         var suggestList = new SuggestPopupListContainer();
         var tab = null;
         suggestList._suggestListOptions = {
            tabsSelectedKeyChangedCallback: function (newtab) {
               tab = newtab;
            }
         };

         suggestList._tabsSelectedKeyChanged(null, 'test');
         expect(tab).toEqual('test');
      });

      it('tabsSelectedKeyChanged with promise from event', async function () {
         const sourceController = new dataSource.NewSourceController({
            source: new sourceLib.Memory()
         });
         const optionsObject = {
            _dataOptionsValue: {
               test: {
                  id: 0,
                  sourceController
               }
            },
            _suggestListOptions: {
               tabsSelectedKey: null
            }
         };
         const optionsObjectWithNewKey = {
            _dataOptionsValue: {
               test: {
                  id: 0,
                  sourceController
               }
            },
            _suggestListOptions: {
               tabsSelectedKey: 'test'
            }
         };
         const suggestList = new SuggestPopupListContainer();
         suggestList._beforeMount(optionsObject);
         suggestList.saveOptions(optionsObject);
         const promise = Promise.resolve();
         jest
            .spyOn(suggestList, '_notify')
            .mockClear()
            .mockImplementation(() => {
               return promise;
            });

         suggestList._beforeUpdate(optionsObjectWithNewKey);
         expect(suggestList._tabsChangedPromise === promise).toBeTruthy();

         await promise;
         expect(suggestList._tabsChangedPromise === null).toBeTruthy();
      });

      it('isTabChanged', function () {
         expect(SuggestPopupListContainer._private.isTabChanged({ tabsSelectedKey: 1 }, 2)).toBe(
            true
         );
         expect(SuggestPopupListContainer._private.isTabChanged({ tabsSelectedKey: 1 }, 1)).toBe(
            false
         );
      });

      it('dispatchEvent', function () {
         var eventDispatched = false;
         var container = {
            dispatchEvent: function (event) {
               expect(event.keyCode).toEqual('testKeyCode');
               eventDispatched = true;
            }
         };

         SuggestPopupListContainer._private.dispatchEvent(
            container,
            { keyCode: 'testKeyCode' },
            {}
         );
         expect(eventDispatched).toBe(true);
      });

      it('getTabKeyFromContext', function () {
         var emptyContext = {};
         var contextWithValue = {
            _suggestListOptions: {
               tabsSelectedKey: 1
            }
         };

         expect(SuggestPopupListContainer._private.getTabKeyFromContext(emptyContext)).toEqual(
            null
         );
         expect(SuggestPopupListContainer._private.getTabKeyFromContext(contextWithValue)).toEqual(
            1
         );
      });

      describe('_inputKeydown, markedKey is null', function () {
         var suggestList = new SuggestPopupListContainer(),
            domEvent = {
               nativeEvent: {
                  keyCode: Env.constants.key.up
               }
            };

         suggestList._options = {
            keyProperty: 'id'
         };
         suggestList._items = new collection.List({
            items: [
               new entity.Model({
                  rawData: { id: 'first' },
                  keyProperty: 'id'
               }),
               new entity.Model({
                  rawData: { id: 'last' },
                  keyProperty: 'id'
               })
            ]
         });

         it('list is not reverse', function () {
            suggestList._inputKeydown(null, domEvent);
            expect(suggestList._markedKey).toEqual('last');
         });

         it('list is reverse', function () {
            suggestList._reverseList = true;
            suggestList._markedKey = null;
            suggestList._inputKeydown(null, domEvent);
            expect(suggestList._markedKey).toEqual('last');
         });
      });

      it('_private:checkContext', function () {
         let suggestList = new SuggestPopupListContainer();
         let optionsObject = {
            _suggestListOptions: {
               dialogMode: true
            }
         };

         SuggestPopupListContainer._private.checkContext(suggestList, optionsObject);
         expect(suggestList._navigation === undefined).toBe(true);

         optionsObject._suggestListOptions.navigation = {
            source: 'page',
            view: 'page',
            sourceConfig: {
               pageSize: 2,
               page: 0
            }
         };
         let expectedNavigation = {
            source: 'page',
            view: 'infinity',
            viewConfig: {
               pagingMode: true
            },
            sourceConfig: {
               pageSize: 25,
               page: 0
            }
         };
         SuggestPopupListContainer._private.checkContext(suggestList, optionsObject);
         expect(suggestList._navigation).toEqual(expectedNavigation);
      });

      describe('collectionChange', () => {
         it('maxCount navigation', () => {
            const suggestList = new SuggestPopupListContainer();
            const suggestOptions = {
               _dataOptionsValue: {
                  test: {}
               },
               _suggestListOptions: {
                  navigation: {
                     view: 'maxCount'
                  }
               }
            };
            const suggestItems = getSuggestItems();
            const notifyStub = jest.spyOn(suggestList, '_notify').mockClear().mockImplementation();
            suggestList._beforeMount(suggestOptions);
            suggestList._itemsReadyCallback(suggestItems);
            expect(suggestList._isSuggestListEmpty).toBe(false);

            suggestItems.clear();
            suggestItems.setMetaData({
               results: new entity.Model({
                  rawData: { tabsSelectedKey: 'test' }
               })
            });
            suggestList._collectionChange();
            expect(suggestList._isSuggestListEmpty).toBe(true);
            expect(suggestList._suggestListOptions.tabsSelectedKey === 'test').toBe(true);
            expect(notifyStub).toHaveBeenCalledWith('tabsSelectedKeyChanged', ['test']);
            jest.restoreAllMocks();
         });
      });
   });
});
