define(['Controls/filterPopup'], function (filterPopup) {
   describe('filterPopup:Dropdown', function () {
      var dropDown;

      beforeEach(() => {
         dropDown = new filterPopup.Dropdown();
      });

      afterEach(() => {
         dropDown = null;
      });

      it('_selectedKeysChangedHandler', function () {
         let selectedKeysEventFired = false;
         let eventResult;

         dropDown._notify = function () {
            selectedKeysEventFired = true;
            return 'testResult';
         };

         eventResult = dropDown._selectedKeysChangedHandler();

         expect(eventResult).toEqual('testResult');
         expect(selectedKeysEventFired).toBe(true);
      });

      it('_selectorCallbackHandler', function () {
         const notifyStub = jest.spyOn(dropDown, '_notify').mockClear().mockImplementation();
         dropDown._selectorCallbackHandler({}, 'items1', 'items2');
         expect(notifyStub).toHaveBeenCalledWith('selectorCallback', ['items1', 'items2']);
      });

      it('_dropDownOpen', function () {
         const notifyStub = jest.spyOn(dropDown, '_notify').mockClear().mockImplementation();
         dropDown._dropDownOpen({});
         expect(notifyStub).toHaveBeenCalledWith('dropDownOpen');
      });

      it('_dropDownClose', function () {
         const notifyStub = jest.spyOn(dropDown, '_notify').mockClear().mockImplementation();
         dropDown._dropDownClose({});
         expect(notifyStub).toHaveBeenCalledWith('dropDownClose');
      });
   });
});
