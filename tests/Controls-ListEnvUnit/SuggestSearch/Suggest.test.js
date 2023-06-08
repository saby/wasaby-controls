define(['Controls-ListEnv/SuggestSearch', 'Types/entity', 'Env/Env'], function (
   suggestSearch,
   entity,
   Env
) {
   'use strict';

   describe('Controls-ListEnv/SuggestSearch', function () {
      it('_close', function () {
         var searchSuggest = new suggestSearch.default();
         var valueChangedFired = false;

         searchSuggest._notify = function (eventName) {
            if (eventName === 'valueChanged') {
               valueChangedFired = true;
            }
         };

         // case 1, value is empty
         searchSuggest.saveOptions({ value: '' });
         searchSuggest._close();
         expect(valueChangedFired).toBe(false);

         // case 2, value is not empty
         searchSuggest.saveOptions({ value: 'test' });
         searchSuggest._close();
         expect(valueChangedFired).toBe(true);
      });

      it('_suggestMarkedKeyChanged', function () {
         var searchSuggest = new suggestSearch.default();
         searchSuggest._suggestMarkedKeyChanged(null, null);
         expect(searchSuggest._markedKeyChanged).toBe(false);

         searchSuggest._suggestMarkedKeyChanged(null, 'test');
         expect(searchSuggest._markedKeyChanged).toBe(true);
      });

      it('searchClick', function () {
         var searchSuggest = new suggestSearch.default();
         searchSuggest._suggestState = true;

         var searchClickNotifyed = false;
         var suggestStateChangedNotifyed = false;
         var searchClickResult = true;
         var isSuggestClosed = false;

         searchSuggest._notify = function (eventName) {
            if (eventName === 'searchClick') {
               searchClickNotifyed = true;
            }
            if (eventName === 'suggestStateChanged') {
               suggestStateChangedNotifyed = true;
            }
            return searchClickResult;
         };
         searchSuggest._children = {
            suggestController: {
               closeSuggest: () => {
                  isSuggestClosed = true;
               }
            }
         };

         searchSuggest._suggestMarkedKeyChanged(null, 'test');
         searchSuggest.searchClick(null, {
            which: Env.constants.key.enter
         });
         expect(searchClickNotifyed).toBe(false);
         expect(searchSuggest._suggestState).toBe(true);

         searchSuggest._suggestMarkedKeyChanged(null, null);
         searchSuggest.saveOptions({
            value: 'testValue'
         });
         searchSuggest.searchClick(null, {
            which: 'any'
         });
         expect(searchClickNotifyed).toBe(true);
         expect(searchSuggest._suggestState).toBe(false);
         expect(suggestStateChangedNotifyed).toBe(true);
         expect(isSuggestClosed).toBe(true);

         searchSuggest._suggestState = true;
         searchClickResult = false;
         searchSuggest.searchClick();
         expect(searchSuggest._suggestState).toBe(true);
      });

      it('_choose', () => {
         const searchSuggest = new suggestSearch.default();
         let isActivated = false;
         searchSuggest.activate = () => {
            isActivated = true;
         };
         const model = new entity.Model({
            rawData: {
               id: 0,
               title: 'test'
            }
         });
         const stubNotify = jest.spyOn(searchSuggest, '_notify').mockClear().mockImplementation();

         searchSuggest.saveOptions({
            displayProperty: 'title'
         });

         searchSuggest._choose(null, model);

         expect(stubNotify).toHaveBeenCalledWith('valueChanged', ['test']);
         expect(isActivated).toBe(true);
      });

      describe('_resetClick', () => {
         let searchSuggest;
         let stubNotify;
         beforeEach(() => {
            searchSuggest = new suggestSearch.default();
            searchSuggest._suggestState = true;
            stubNotify = jest.spyOn(searchSuggest, '_notify').mockClear().mockImplementation();
         });

         it('autoDropDown = true', () => {
            searchSuggest._options = { autoDropDown: true };

            searchSuggest._resetClick();

            expect(stubNotify).toHaveBeenCalledWith('resetClick');
            expect(searchSuggest._suggestState).toBe(true);
         });

         it('autoDropDown = false', () => {
            searchSuggest._options = { autoDropDown: false };

            searchSuggest._resetClick();

            expect(searchSuggest._suggestState).toBe(false);
            expect(stubNotify).toHaveBeenCalledWith('resetClick');
         });
      });
   });
});
