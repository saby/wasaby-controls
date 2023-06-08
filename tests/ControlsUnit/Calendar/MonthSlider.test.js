define([
   'Controls/_calendar/MonthSlider',
   'Controls/_calendar/MonthSlider/Slider',
   'ControlsUnit/Calendar/Utils',
   'Types/entity'
], function (MonthSlider, Slider, calendarTestUtils, formatter) {
   // eslint-disable-next-line no-param-reassign
   MonthSlider = MonthSlider.default;
   // eslint-disable-next-line no-param-reassign
   Slider = Slider.default;

   describe('Controls/Calendar/MonthSlider', function () {
      let defaultOptions = {
         month: new Date(2018, 0, 1)
      };

      it('should create correct model when component initialized', function () {
         let component = calendarTestUtils.createComponent(
            MonthSlider,
            defaultOptions
         );
         expect(component._month).toBe(defaultOptions.month);
      });

      describe('_setMonth', function () {
         it('should update model when new month is set', function () {
            let component = calendarTestUtils.createComponent(
                  MonthSlider,
                  defaultOptions
               ),
               newMonth = new Date(defaultOptions.month);
            component._setMonth(newMonth, true, formatter.Date);
            expect(component._month).toBe(defaultOptions.month);
         });

         it('should not update model if new date is equal the old one', function () {
            let component = calendarTestUtils.createComponent(
                  MonthSlider,
                  defaultOptions
               ),
               newMonth = new Date();
            component._setMonth(newMonth, true, formatter.Date);
            expect(component._month).toBe(newMonth);
         });

         it('should set "slideLeft" animation if month has increased', function () {
            let component = calendarTestUtils.createComponent(
               MonthSlider,
               defaultOptions
            );
            component._setMonth(
               new Date(
                  defaultOptions.month.getFullYear(),
                  defaultOptions.month.getMonth() + 1
               ),
               true,
               formatter.Date
            );
            expect(component._animation).toBe(Slider.ANIMATIONS.slideLeft);
         });

         it('should set "slideRight" animation if month has decreased', function () {
            let component = calendarTestUtils.createComponent(
               MonthSlider,
               defaultOptions
            );
            component._setMonth(
               new Date(
                  defaultOptions.month.getFullYear(),
                  defaultOptions.month.getMonth() - 1
               ),
               true,
               formatter.Date
            );
            expect(component._animation).toBe(Slider.ANIMATIONS.slideRight);
         });
         it("shouldn't throw error in _setCurrentMonth", function () {
            let component = calendarTestUtils.createComponent(
                  MonthSlider,
                  defaultOptions
               ),
               options = {
                  dateConstructor: formatter.Date,
                  month: new Date()
               };
            component._beforeMount(options);
            component._setCurrentMonth();
            expect(component._month.getMonth()).toEqual(
               options.month.getMonth()
            );
         });
         it("shouldn't throw error in _slideMonth", function () {
            const MAX_MONTH_NUMBER = 11;
            let component = calendarTestUtils.createComponent(
                  MonthSlider,
                  defaultOptions
               ),
               event = 'event',
               options = {
                  dateConstructor: formatter.Date,
                  month: new Date()
               };
            component._beforeMount(options);
            component._slideMonth(event, -1);
            expect(component._month.getMonth()).toEqual(
               options.month.getMonth() > 0
                  ? options.month.getMonth() - 1
                  : MAX_MONTH_NUMBER
            );
         });
         it("shouldn't throw error in _beforeMount", function () {
            let component = calendarTestUtils.createComponent(
                  MonthSlider,
                  defaultOptions
               ),
               options = {
                  dateConstructor: formatter.Date,
                  month: new Date()
               };
            component._beforeMount(options);
            expect(component._month).toBe(options.month);
         });
         it("shouldn't throw error in _beforeUpdate", function () {
            let component = calendarTestUtils.createComponent(
                  MonthSlider,
                  defaultOptions
               ),
               options = {
                  dateConstructor: formatter.Date,
                  month: new Date()
               };
            component._beforeUpdate(options);
            expect(component._month).toBe(options.month);
         });
      });
      describe('_updateArrowButtonVisible', () => {
         [
            {
               displayedRanges: [[new Date(2018, 0), new Date(2020, 3)]],
               date: new Date(2020, 1),
               shouldShowPrevArrow: true,
               shouldShowNextArrow: true
            },
            {
               displayedRanges: [[new Date(2018, 0), new Date(2020, 3)]],
               date: new Date(2018, 1),
               shouldShowPrevArrow: true,
               shouldShowNextArrow: true
            },
            {
               displayedRanges: [[new Date(2018, 0), new Date(2020, 3)]],
               date: new Date(2018, 0, 15),
               shouldShowPrevArrow: false,
               shouldShowNextArrow: true
            },
            {
               displayedRanges: [[new Date(2018, 0), new Date(2020, 3)]],
               date: new Date(2020, 3, 11),
               shouldShowPrevArrow: true,
               shouldShowNextArrow: false
            },
            {
               displayedRanges: [[new Date(2020, 1), new Date(2020, 1)]],
               date: new Date(2020, 1),
               shouldShowPrevArrow: false,
               shouldShowNextArrow: false
            },
            {
               displayedRanges: [[new Date(2020, 1), null]],
               date: new Date(2021, 1),
               shouldShowPrevArrow: true,
               shouldShowNextArrow: true
            }
         ].forEach((test) => {
            it('should set correctArrowButtonVisible', () => {
               const component = calendarTestUtils.createComponent(MonthSlider);
               component._updateArrowButtonVisible(
                  test.displayedRanges,
                  test.date
               );
               expect(test.shouldShowPrevArrow).toBe(
                  component._prevArrowButtonVisible
               );
               expect(test.shouldShowNextArrow).toBe(
                  component._nextArrowButtonVisible
               );
            });
         });
      });

      describe('_getHomeVisible', () => {
         [
            {
               displayedRanges: [[new Date(2018, 0), new Date(2020, 3)]],
               shouldShowHomeButton: false,
               testName: 'should not show home if current date is out of range'
            },
            {
               displayedRanges: [[new Date(2018, 0), new Date(2022, 3)]],
               shouldShowHomeButton: true,
               testName: 'should show home if current date is in range'
            }
         ].forEach((test) => {
            it(test.testName, () => {
               const date = new Date(2021, 0, 1);
               jest.useFakeTimers().setSystemTime(date.getTime());
               const component = calendarTestUtils.createComponent(MonthSlider);
               const result = component._getHomeVisible(
                  test.date,
                  Date,
                  test.displayedRanges
               );
               expect(test.shouldShowHomeButton).toBe(result);
               jest.useRealTimers();
            });
         });
         it('should show home button', () => {
            const component = calendarTestUtils.createComponent(MonthSlider);
            const date = new Date(2018, 2);
            const result = component._getHomeVisible(date, Date);
            expect(result).toBe(true);
         });
         it('should not show home button', () => {
            const component = calendarTestUtils.createComponent(MonthSlider);
            const date = new Date();
            const result = component._getHomeVisible(date, Date);
            expect(result).toBe(false);
         });
      });
   });
});
