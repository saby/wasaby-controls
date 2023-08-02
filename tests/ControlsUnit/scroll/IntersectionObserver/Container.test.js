define(['Core/core-merge', 'Controls/scroll', 'ControlsUnit/Calendar/Utils'], function (
   cMerge,
   scroll,
   calendarTestUtils
) {
   'use strict';

   const options = {
      data: 'some data',
      observerName: 'observerName'
   };

   describe('Controls/scroll:IntersectionObserverContainer', function () {
      describe('_afterMount', function () {
         it('should notify intersectionObserverRegister event', function () {
            const component = calendarTestUtils.createComponent(
               scroll.IntersectionObserverContainer,
               options
            );

            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._afterMount();
            expect(component._notify).toHaveBeenCalledWith(
               'intersectionObserverRegister',
               [
                  expect.objectContaining({
                     instId: component.getInstanceId(),
                     observerName: options.observerName,
                     element: component._container,
                     data: options.data
                  })
               ],
               { bubbling: true }
            );
            jest.restoreAllMocks();
         });
      });
      describe('_beforeUnmount', function () {
         it('should notify intersectionObserverUnregister event', function () {
            const component = calendarTestUtils.createComponent(
               scroll.IntersectionObserverContainer,
               options
            );

            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._beforeUnmount();
            expect(component._notify).toHaveBeenCalledWith(
               'intersectionObserverUnregister',
               [component.getInstanceId(), options.observerName],
               { bubbling: true }
            );
            jest.restoreAllMocks();
         });
      });
   });
});
