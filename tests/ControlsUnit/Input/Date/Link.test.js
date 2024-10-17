define(['Core/core-merge', 'Controls/date'], function (cMerge, date) {
   'use strict';

   const options = {
      mask: 'DD.MM.YYYY',
      value: new Date(2018, 0, 1),
      replacer: ' '
   };

   describe('Controls/date/DateSelector', function () {
      // describe('openPopup', function() {
      //    it('should open opener', function() {
      //       const component = new date.Selector(options);
      //       component._stickyOpener = {
      //          open: jest.fn()
      //       };
      //       component._ref.current = {
      //          getPopupTarget: jest.fn()
      //       };
      //       component.openPopup();
      //       expect(component._stickyOpener.open).toHaveBeenCalled();
      //    });
      // });

      describe('_onResult', function () {
         it('should generate valueChangedEvent and close opener', function () {
            const component = new date.Selector(options),
               value = new Date(2018, 11, 10);

            component._stickyOpener = {
               close: jest.fn()
            };

            component._onResult(null, value);
            expect(component._stickyOpener.close).toHaveBeenCalled();
         });
      });

      // describe('_getPopupOptions', () => {
      //    it('should set undefined instead of null', () => {
      //       const component = new date.Selector(options);
      //       component._ref.current = {
      //          getPopupTarget: jest.fn()
      //       };
      //
      //       component._startValue = null;
      //       const popupOptions = component._getPopupOptions();
      //       expect(popupOptions.startValue).not.toBeDefined();
      //       expect(popupOptions.endValue).not.toBeDefined();
      //    });
      // });
   });
});
