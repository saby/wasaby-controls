define(['Controls/lookup'], function (lookup) {
   describe('Controls/lookup:Link', function () {
      it('_keyUpHandler', function () {
         var isNotifyClick = false,
            link = new lookup.Link(),
            event = {
               nativeEvent: {
                  keyCode: 13
               }
            };

         link._notify = function (eventName) {
            if (eventName === 'linkClick') {
               isNotifyClick = true;
            }
         };

         link._keyUpHandler(event);
         expect(isNotifyClick).toBe(true);

         isNotifyClick = false;
         link._options.readOnly = true;
         link._keyUpHandler(event);
         expect(isNotifyClick).toBe(false);
      });
   });
});
