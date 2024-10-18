define(['Controls/SuggestInput'], function (SuggestInput) {
   describe('Controls/SuggestInput', function () {
      let getSuggest = function (config) {
         let suggestInput = new SuggestInput.default();
         suggestInput.saveOptions(config);
         return suggestInput;
      };

      it('_clearClick', function () {
         let activated, value;
         let input = getSuggest({ autoDropDown: true });
         input._suggestState = true;
         input.activate = function () {
            activated = true;
         };
         input._notify = function (event, data) {
            if (event === 'valueChanged') {
               value = data[0];
            }
         };

         input._clearClick();
         expect(input._suggestState).toBe(true);
         expect(activated).toBe(true);
         expect(value).toBe('');

         input._options.autoDropDown = false;
         activated = false;
         value = null;
         input._clearClick();
         expect(input._suggestState).toBe(false);
         expect(activated).toBe(true);
         expect(value).toBe('');
      });

      it('_choose', function () {
         let input = getSuggest({});

         input.activate = jest.fn();
         input._notify = (event, value) => {
            expect(event).toEqual('valueChanged');
            expect(value[0]).toEqual('test');
         };

         input._choose(null, {
            get: () => {
               return 'test';
            }
         });
      });
   });
});
