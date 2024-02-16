define(['Controls/compatiblePopup', 'Types/deferred', 'Controls/popupTemplateStrategy'], function (
   compatiblePopup,
   defferedLib,
   popupStrategy
) {
   describe('Controls/popup:Global', () => {
      new popupStrategy.Controller().init();
      it('Opening and closing of the infobox.', () => {
         let ctrl = new compatiblePopup.Global({});
         ctrl._globalController = new popupStrategy.GlobalController();
         ctrl._globalController._getPopupConfig = (config) => {
            return new defferedLib.Deferred().callback(config);
         };
         let event1 = {
            target: 1
         };
         let event2 = {
            target: 2
         };
         let event3 = {
            target: 3
         };
         let result = [];

         ctrl._globalController.openInfoBox = () => {
            result.push('open');
         };

         ctrl._globalController.closeInfoBox = () => {
            result.push('close');
         };

         ctrl._openInfoBoxHandler(event1);
         ctrl._openInfoBoxHandler(event2);
         ctrl._openInfoBoxHandler(event3);

         expect(result).toEqual(['open', 'open', 'open']);

         result = [];

         ctrl._openInfoBoxHandler(event1);
         ctrl._closeInfoBoxHandler(event1);
         ctrl._openInfoBoxHandler(event2);
         ctrl._closeInfoBoxHandler(event2);
         ctrl._openInfoBoxHandler(event3);
         ctrl._closeInfoBoxHandler(event3);

         expect(result).toEqual(['open', 'close', 'open', 'close', 'open', 'close']);

         result = [];

         ctrl._openInfoBoxHandler(event1);
         ctrl._closeInfoBoxHandler(event2);
         ctrl._closeInfoBoxHandler(event3);
         ctrl._closeInfoBoxHandler(event1);

         expect(result).toEqual(['open', 'close']);
      });
   });
});
