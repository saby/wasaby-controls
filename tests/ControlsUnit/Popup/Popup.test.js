define(['Controls/_popupTemplateStrategy/PopupController/Popup/Popup'], function (PopupClass) {
   'use strict';

   describe('Controls/_popup/Popup/Popup', () => {
      it('isResized', () => {
         const Popup = new PopupClass.default();
         let oldOptions = { position: {} };
         let newOptions = { position: {} };
         expect(false).toEqual(Popup._isResized(oldOptions, newOptions));

         newOptions.position.width = 10;
         expect(true).toEqual(Popup._isResized(oldOptions, newOptions));

         oldOptions.position.width = 10;
         expect(false).toEqual(Popup._isResized(oldOptions, newOptions));

         oldOptions = { position: { height: 10 } };
         newOptions = { position: {} };
         expect(true).toEqual(Popup._isResized(oldOptions, newOptions));

         newOptions.position.height = 10;
         expect(false).toEqual(Popup._isResized(oldOptions, newOptions));

         oldOptions = { position: { hidden: true } };
         newOptions = { position: { hidden: false } };

         expect(true).toEqual(Popup._isResized(oldOptions, newOptions));
      });
      it('_showIndicatorHandler', () => {
         const Popup = new PopupClass.default();
         let config = '';
         let promise = '';
         let stopPropagation = jest.fn();
         Popup._notify = (eventName, eventArgs) => {
            config = eventArgs[0];
            promise = eventArgs[1];
         };
         Popup._showIndicatorHandler({ event: 'event', stopPropagation }, 'config', 'promise');
         expect(config).toEqual('config');
         expect(promise).toEqual('promise');
         Popup.destroy();
      });
   });
});
