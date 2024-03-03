define(['Core/core-merge', 'Controls/dateRange'], function (cMerge, dateRange) {
   'use strict';

   const options = {
      rangeModel: new dateRange.DateRangeModel(),
      mask: 'DD.MM.YYYY',
      startValue: new Date(2018, 0, 1),
      endValue: new Date(2018, 0, 1),
      replacer: ' '
   };

   describe('Controls/dateRange/Selector', function () {
      describe('_beforeUpdate', function () {
         it('should not generate exceptions if value option is set', function () {
            const component = new dateRange.Selector(options);
            component.shouldComponentUpdate({
               startValue: options.startValue,
               endValue: options.endValue,
               value: []
            });
         });
      });

      describe('EventHandlers', function () {
         [
            {
               startValue: new Date(),
               result: true
            },
            {
               startValue: null,
               result: true
            },
            {
               startValue: 'string',
               result: false
            }
         ].forEach(function (test) {
            it('should close popup', function () {
               const component = new dateRange.Selector(options);

               jest.spyOn(component._rangeModel, 'setRange').mockClear().mockImplementation();
               const stubClosePopup = jest
                  .spyOn(component, 'closePopup')
                  .mockClear()
                  .mockImplementation();
               component._onResult(test.startValue);

               if (test.result) {
                  expect(stubClosePopup).toHaveBeenCalled();
               } else {
                  expect(stubClosePopup).not.toHaveBeenCalled();
               }
            });
         });
      });

      // describe('PopupOptions', function() {
      //    [{
      //       fittingMode: 'overflow',
      //       result: {
      //          vertical: 'overflow',
      //          horizontal: 'overflow'
      //       }
      //    }, {
      //       fittingMode: 'fixed',
      //       result: {
      //          vertical: 'fixed',
      //          horizontal: 'overflow'
      //       }
      //    }].forEach(function(test) {
      //       it('should return correct fittingMode in popup options', function() {
      //          const component = new dateRange.Selector({ ...options, datePopupType: 'shortDatePicker' });
      //
      //          component._ref.current = {
      //             getPopupTarget: jest.fn()
      //          };
      //          component._fittingMode = test.fittingMode;
      //          const popupOptions = component._getPopupOptions();
      //          expect(popupOptions.fittingMode).toEqual(test.result);
      //       });
      //    });
      // });

      describe('_getFontSizeClass', function () {
         [
            {
               fontSize: '2xl',
               result: 'm'
            },
            {
               fontSize: '3xl',
               result: 'l'
            },
            {
               fontSize: 'm',
               result: 's'
            }
         ].forEach(function (test) {
            it(`should return ${test.result} if fontSize: ${test.fontSize}`, function () {
               const opt = {
                  rangeModel: new dateRange.DateRangeModel(),
                  mask: 'DD.MM.YYYY',
                  startValue: new Date(2018, 0, 1),
                  endValue: new Date(2018, 0, 1),
                  replacer: ' ',
                  fontSize: test.fontSize
               };
               const component = new dateRange.Selector(opt);
               const fontSizeResult = component._getFontSizeClass();
               expect(fontSizeResult).toEqual(test.result);
            });
         });
      });
   });
});
