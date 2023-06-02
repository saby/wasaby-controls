define(['Controls/compatiblePopup'], function (compatiblePopup) {
   'use strict';

   describe('Controls/compatiblePopup:NotificationBase', function () {
      it('_beforeMount', function () {
         var ctrl = new compatiblePopup.NotificationBase({});
         var options = {};
         ctrl._beforeMount({
            contentTemplateOptions: options
         });

         expect(options === ctrl._contentTemplateOptions).toBe(true);
         expect('onAfterShow' in ctrl._contentTemplateOptions.handlers).toBe(
            true
         );
      });
   });
});
