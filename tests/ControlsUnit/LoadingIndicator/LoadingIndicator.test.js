define(['Controls/LoadingIndicator'], (LoadingIndicator) => {
   'use strict';

   describe('LoadingIndicator-tests', () => {
      let Loading = new LoadingIndicator.default();
      Loading._beforeMount({});

      it('LoadingIndicator - delay', () => {
         let LoadingDelay = new LoadingIndicator.default();
         LoadingDelay._beforeMount({
            delay: 1
         });
         expect(LoadingDelay._getDelay({})).toEqual(1);
         expect(LoadingDelay._getDelay({ delay: 5 })).toEqual(5);
         LoadingDelay._beforeMount({});
         expect(LoadingDelay._getDelay({})).toEqual(2000);
         expect(LoadingDelay._getDelay({ delay: 3 })).toEqual(3);
         LoadingDelay.destroy();
      });

      it('LoadingIndicator - open config', () => {
         let LoadingInd = new LoadingIndicator.default();
         LoadingInd._beforeMount({});
         const waitPromise = Promise.resolve();
         const config = {};

         LoadingInd.show(config, waitPromise);
         expect(config.waitPromise).toEqual(undefined);

         LoadingInd.destroy();
      });

      it('LoadingIndicator - remove indicator from stack', () => {
         let LoadingInd = new LoadingIndicator.default();
         LoadingInd._beforeMount({});

         let config1 = {
            message: 'message 1'
         };
         let config2 = {
            message: 'message 2'
         };
         let config3 = {
            message: 'message 3'
         };
         LoadingInd.show(config1);
         LoadingInd.show(config2);
         LoadingInd.show(config3);

         let id = LoadingInd._stack.at(0).id;
         LoadingInd._hide(id);
         expect(LoadingInd._stack.getCount()).toEqual(2);

         id = LoadingInd._stack.at(1).id;
         LoadingInd._hide(id);
         expect(LoadingInd._stack.getCount()).toEqual(1);

         id = LoadingInd._stack.at(0).id;
         LoadingInd._hide(id);
         expect(LoadingInd._stack.getCount()).toEqual(0);

         let isItemRemove = false;
         LoadingInd._removeItem = () => {
            isItemRemove = true;
         };

         LoadingInd._hide('id');
         expect(isItemRemove).toEqual(false);
         LoadingInd.destroy();
      });

      it('LoadingIndicator - getOverlay', () => {
         let LoadingInd = new LoadingIndicator.default();
         let overlay = 'dark';
         LoadingInd._isOverlayVisible = true;
         LoadingInd._isMessageVisible = false;
         expect(LoadingInd._getOverlay(overlay)).toEqual('default');
         LoadingInd._isMessageVisible = true;
         expect(LoadingInd._getOverlay(overlay)).toEqual(overlay);
         LoadingInd.destroy();
      });

      it('LoadingIndicator - hide', () => {
         let config = {
            message: 'message 1',
            delay: 1
         };
         Loading._show(config);
         const delayTimerId = Loading.delayTimeout;
         Loading._show(config);
         Loading._show(config);
         expect(delayTimerId).toEqual(Loading.delayTimeout);
         expect(false).toEqual(Loading._isMessageVisible);
         Loading.hide();
         expect(Loading._stack.getCount()).toEqual(0);
      });

      it('LoadingIndicator with empty config', () => {
         let LoadingInd = new LoadingIndicator.default();
         LoadingInd._beforeMount({});

         const cfg = LoadingInd._prepareConfig({ message: 'Loading' });
         LoadingInd._updateProperties(cfg);
         LoadingInd._beforeUpdate({});
         expect(LoadingInd.message).toEqual('Loading');

         const cfgEmpty = LoadingInd._prepareConfig({});
         LoadingInd._updateProperties(cfgEmpty);
         LoadingInd._beforeUpdate({});
         expect(LoadingInd.message).toEqual('');
         LoadingInd.destroy();
      });

      it('LoadingIndicator - toggleIndicator', (done) => {
         let LoadingInd = new LoadingIndicator.default();
         let isMessageVisible = true;
         LoadingInd._beforeMount({});
         let baseToggleIndicatorVisible = LoadingInd._toggleIndicatorVisible;
         let baseToggleOverlayAsync = LoadingInd._toggleOverlayAsync;
         LoadingInd._toggleOverlayAsync = LoadingInd._toggleOverlay;
         let config = {
            delay: 1
         };
         LoadingInd._stack.add({ delay: undefined });
         LoadingInd._toggleIndicator(true, config, true);
         expect(LoadingInd._isOverlayVisible).toEqual(true);
         expect(LoadingInd._isMessageVisible).toEqual(true);

         LoadingInd._toggleIndicator(false);
         expect(LoadingInd._isOverlayVisible).toEqual(true);
         expect(LoadingInd._isMessageVisible).toEqual(true);

         LoadingInd._stack.clear();
         LoadingInd._toggleIndicator(false);
         expect(LoadingInd._isOverlayVisible).toEqual(false);
         expect(LoadingInd._isMessageVisible).toEqual(false);

         LoadingInd._stack.add({ delay: undefined });
         LoadingInd._toggleIndicator(true, config);
         expect(LoadingInd._isOverlayVisible).toEqual(false);
         expect(LoadingInd._isMessageVisible).toEqual(false);

         LoadingInd._stack.clear();
         LoadingInd._toggleIndicator(true, config);
         expect(LoadingInd._isOverlayVisible).toEqual(false);
         expect(LoadingInd._isMessageVisible).toEqual(false);

         LoadingInd._toggleIndicatorVisible = function () {
            baseToggleIndicatorVisible.apply(LoadingInd, arguments);
            expect(LoadingInd._isMessageVisible).toEqual(isMessageVisible);
            if (isMessageVisible) {
               done();
            }
         };

         LoadingInd._toggleOverlayAsync = baseToggleOverlayAsync;
         LoadingInd._stack.clear();
         LoadingInd._stack.add({ delay: 2000 });
         LoadingInd._stack.add({ delay: 2000 });
         LoadingInd._isOverlayVisible = false;
         isMessageVisible = false;
         LoadingInd._toggleIndicator(true, config);

         isMessageVisible = true;

         LoadingInd.destroy();
      });
      after(() => {
         Loading.destroy();
      });
   });
});
