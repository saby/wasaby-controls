define([
   'Controls/_calendar/MonthSlider/Slider',
   'Controls/dateUtils',
   'ControlsUnit/Calendar/Utils'
], function (Slider, DateUtil, calendarTestUtils) {
   // eslint-disable-next-line no-param-reassign
   Slider = Slider.default;

   describe('Controls/Calendar/MonthSlider/Slider', function () {
      let defaultOptions = {
         data: 0,
         animation: Slider.ANIMATIONS.slideLeft
      };

      it('should create correct model when component initialized', function () {
         let component = calendarTestUtils.createComponent(Slider, defaultOptions);
         expect(component._currentItem).toBe(0);
         expect(component._items.length).toBe(2);
         expect(component._items[0].data).toBe(defaultOptions.data);
      });

      describe('_beforeUpdate', function () {
         let component;
         beforeEach(() => {
            component = calendarTestUtils.createComponent(Slider, defaultOptions);

            // это сделано для того, чтобы ручные вызовы _forceUpdate не заваливали консоль ошибками
            jest.spyOn(component, '_forceUpdate').mockImplementation();
         });

         it('should update inAnimation and outAnimation when animation is set', function () {
            component._beforeUpdate({ animation: Slider.ANIMATIONS.slideLeft });
            expect(component._inAnimation).toBe(Slider.ANIMATIONS.slideLeft);
            expect(component._outAnimation).toBe(Slider.ANIMATIONS.slideLeft);
         });

         it('should update inAnimation and outAnimation when it is set', function () {
            component._beforeUpdate({
               inAnimation: Slider.ANIMATIONS.slideLeft,
               outAnimation: Slider.ANIMATIONS.slideRight
            });
            expect(component._inAnimation).toBe(Slider.ANIMATIONS.slideLeft);
            expect(component._outAnimation).toBe(Slider.ANIMATIONS.slideRight);
         });

         it('should switch items when data is changed', function () {
            let newData = 2;

            component._beforeUpdate({
               data: newData,
               animation: Slider.ANIMATIONS.slideLeft
            });
            expect(component._currentItem).toBe(1);
            expect(component._items[0].data).toBe(defaultOptions.data);
            expect(component._items[1].data).toBe(newData);
            expect(component._animationState).toBe(1);
         });

         it('should set prepared animation classes when data is changed, after that it should set animation classes when _afterUpdate is called', function () {
            let newData = 2;

            component._beforeUpdate({
               data: newData,
               inAnimation: Slider.ANIMATIONS.slideLeft,
               outAnimation: Slider.ANIMATIONS.slideRight
            });
            expect(component._items[0].transitionClasses).toBe(
               'controls-MonthSlider-Slider__slideLeftRight-center'
            );
            expect(component._items[1].transitionClasses).toBe(
               'controls-MonthSlider-Slider__slideLeftRight-right'
            );

            component._afterUpdate();
            expect(component._items[0].transitionClasses).toBe(
               'controls-MonthSlider-Slider__slideLeftRight-animate controls-MonthSlider-Slider__slideLeftRight-right'
            );
            expect(component._items[1].transitionClasses).toBe(
               'controls-MonthSlider-Slider__slideLeftRight-animate controls-MonthSlider-Slider__slideLeftRight-center'
            );
         });
      });
   });
});
