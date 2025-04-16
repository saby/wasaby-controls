define(['Core/core-clone', 'Core/core-merge', 'Controls/dateRange'], function (
   cClone,
   cMerge,
   dateRange
) {
   'use strict';

   // const options = {
   //    rangeModel: new dateRange.DateRangeModel(),
   //    mask: 'DD.MM.YYYY',
   //    value: new Date(2018, 0, 1),
   //    replacer: ' ',
   //    theme: 'default'
   // };

   describe('Controls/_dateRange/Selector', function () {
      describe('initialization', function () {
         it('should set endValue if selectionType is equal "single"', function () {
            const date = new Date(2019, 0),
               component = new dateRange.Selector({
                  startValue: date,
                  selectionType: 'single'
               });

            expect(component._rangeModel.startValue).toEqual(date);
            expect(component._rangeModel.endValue).toEqual(date);
         });
      });

      // describe('_beforeUpdate', function() {
      //    it('should set endValue if selectionType is equal "single"', function() {
      //       const
      //          date = new Date(2019, 0),
      //           component = new dateRange.Selector({});
      //
      //       component.shouldComponentUpdate(
      //          calendarTestUtils.prepareOptions(dateRange.Selector, { startValue: date, selectionType: 'single' })
      //       );
      //
      //       expect(component._rangeModel.startValue).toEqual(date);
      //       expect(component._rangeModel.endValue).toEqual(date);
      //    });
      // });

      // describe('openPopup', function() {
      //    it('should open opener with default options', function() {
      //       const
      //          opts = cMerge({
      //             startValue: new Date(2019, 0, 1),
      //             theme: 'default',
      //             endValue: new Date(2019, 0, 1)
      //          }, options),
      //          component = new dateRange.Selector(opts),
      //          TARGET = 'value';
      //       component._ref.current = {
      //          getPopupTarget: jest.fn().mockReturnValue(TARGET)
      //       };
      //       component._stickyOpener = {
      //          open: jest.fn()
      //       };
      //       component.openPopup();
      //       expect(component._stickyOpener.open).toHaveBeenCalled();
      //       expect(component._ref.current.getPopupTarget).toHaveBeenCalled();
      //       expect(component._stickyOpener.open).toHaveBeenCalledWith(expect.objectContaining({
      //          className: 'controls_datePicker_theme-default controls-DatePopup__selector-marginTop_fontSize-m controls-DatePopup__selector-marginLeft controls_popupTemplate_theme-default',
      //          target: TARGET,
      //          templateOptions: expect.objectContaining({
      //             startValue: opts.startValue,
      //             endValue: opts.endValue
      //          })
      //       }));
      //    });
      //    it('should open dialog with passed dialog options', function() {
      //       const
      //          extOptions = {
      //             theme: 'default',
      //             ranges: { days: [1] },
      //             minRange: 'month',
      //             emptyCaption: 'caption',
      //             captionFormatter: jest.fn(),
      //             readOnly: true
      //          },
      //          component = new dateRange.Selector(cMerge(cClone(extOptions), options));
      //       component._ref.current = {
      //          getPopupTarget: jest.fn()
      //       };
      //       component._stickyOpener = {
      //          open: jest.fn()
      //       };
      //       component.openPopup();
      //       expect(component._stickyOpener.open).toHaveBeenCalledWith(expect.objectContaining({
      //          className: 'controls_datePicker_theme-default controls-DatePopup__selector-marginTop_fontSize-m controls-DatePopup__selector-marginLeft controls_popupTemplate_theme-default',
      //          templateOptions: expect.objectContaining({
      //             ranges: extOptions.ranges,
      //             minRange: extOptions.minRange,
      //             captionFormatter: extOptions.captionFormatter,
      //             emptyCaption: extOptions.emptyCaption,
      //             readOnly: extOptions.readOnly
      //          })
      //       }));
      //    });
      //    describe('open dialog with .controls-DatePopup__selector-marginLeft css class', function() {
      //       [{
      //          selectionType: 'single'
      //       }, {
      //          selectionType: 'range'
      //       }, {
      //          minRange: 'day'
      //       }, {
      //          ranges: { days: [1] }
      //       }, {
      //          ranges: { weeks: [1] }
      //       }, {
      //          ranges: { days: [1], months: [1] }
      //       }, {
      //          ranges: { weeks: [1], quarters: [1] }
      //       }, {
      //          ranges: { days: [1], quarters: [1] }
      //       }, {
      //          ranges: { days: [1], halfyears: [1] }
      //       }, {
      //          ranges: { days: [1], years: [1] }
      //       }].forEach(function(test) {
      //          it(`${JSON.stringify(test)}`, function() {
      //             const
      //                component = new dateRange.Selector(cMerge(cClone(test), options));
      //             component._ref.current = {
      //                getPopupTarget: jest.fn()
      //             };
      //             component._stickyOpener = {
      //                open: jest.fn()
      //             };
      //             component.openPopup();
      //             expect(component._stickyOpener.open).toHaveBeenCalledWith(expect.objectContaining({
      //                className: 'controls_datePicker_theme-default controls-DatePopup__selector-marginTop_fontSize-m controls-DatePopup__selector-marginLeft controls_popupTemplate_theme-default'
      //             }));
      //          });
      //       });
      //    });
      // });

      // describe('_getPopupOptions', () => {
      //    it('should set undefined instead of null if selectionType="single"', () => {
      //       const component = new dateRange.Selector(
      //          {
      //             ...options,
      //             selectionType: 'single'
      //          }
      //       );
      //
      //       component._startValue = null;
      //       component._ref.current = {
      //          getPopupTarget: jest.fn()
      //       };
      //       component._stickyOpener = {
      //          open: jest.fn()
      //       };
      //       const popupOptions = component._getPopupOptions();
      //       expect(popupOptions.startValue).not.toBeDefined();
      //       expect(popupOptions.endValue).not.toBeDefined();
      //    });
      // });
   });
});
