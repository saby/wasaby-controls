define(['Controls/filterPopup'], function (filterPopup) {
   describe('Controls/_filterPopup/Panel/Text', function () {
      describe('life hooks', function () {
         it('_beforeMount', function () {
            var textControl = new filterPopup.Text();
            var textValue;
            var controlValue;

            textControl.saveOptions({ caption: 'test', value: true });
            textControl._notify = function (eventName, value) {
               if (eventName === 'valueChanged') {
                  controlValue = value[0];
               } else {
                  textValue = value[0];
               }
            };

            textControl._afterMount();

            expect(controlValue).toEqual(true);
            expect(textValue).toEqual('test');
         });
      });
   });
});
