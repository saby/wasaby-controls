define([
   'Core/core-merge',
   'Controls/scroll',
   'ControlsUnit/Calendar/Utils'
], function (cMerge, scroll, calendarTestUtils) {
   'use strict';

   const options = {
      observerName: 'observerName'
   };

   describe('Controls/scroll:IntersectionObserverController', function () {
      const event = {
         stopImmediatePropagation: jest.fn()
      };
      describe('_registerHandler', function () {
         it('should create _observer, and observe container', function () {
            const component = calendarTestUtils.createComponent(
                  scroll.IntersectionObserverController,
                  options
               ),
               instId = 'id',
               element = 'element',
               data = {};

            component._initObserver();

            jest
               .spyOn(component._observer, '_createObserver')
               .mockClear()
               .mockReturnValue({
                  observe: jest.fn()
               });
            component._registerHandler(event, {
               instId: instId,
               observerName: options.observerName,
               element: element,
               data: data
            });
            expect(Object.keys(component._observer._items.id)).toEqual(
               expect.arrayContaining(['instId', 'element', 'data'])
            );
            expect(component._observer._createObserver).toHaveBeenCalled();
         });
      });
      describe('_unregisterHandler', function () {
         it('should unobserve and delete element', function () {
            const component = calendarTestUtils.createComponent(
                  scroll.IntersectionObserverController,
                  options
               ),
               instId = 'instId',
               element = 'element',
               observer = {
                  unobserve: jest.fn()
               };
            component._initObserver();
            component._observer._observers = {
               t1_rm0px_0px_0px_0px: {
                  count: 1,
                  observer
               }
            };
            component._observer._items = {
               instId: {
                  instId: instId,
                  element: element,
                  threshold: [1],
                  rootMargin: '0px 0px 0px 0px'
               }
            };
            component._unregisterHandler(event, instId, options.observerName);
            expect(component._observer._items[instId]).not.toBeDefined();
            expect(observer.unobserve).toHaveBeenCalledWith(element);
         });
      });

      describe('_intersectionObserverHandler', function () {
         it('should generate "intersect" event', function () {
            const component = calendarTestUtils.createComponent(
                  scroll.IntersectionObserverController,
                  options
               ),
               instId = 'id',
               element = 'element',
               data = { someField: 'fieldValue' },
               entry = { target: element, entryData: 'data' },
               handler = jest.fn();

            component._initObserver();
            jest
               .spyOn(component._observer, '_createObserver')
               .mockClear()
               .mockReturnValue({
                  observe: jest.fn()
               });
            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._registerHandler(event, {
               instId: instId,
               observerName: options.observerName,
               element: element,
               data: data,
               handler: handler
            });
            component._observer._intersectionObserverHandler([entry]);
            expect(component._notify).toHaveBeenCalledWith(
               'intersect',
               expect.anything()
            );
            expect(handler).toHaveBeenCalled();
         });

         it('should not generate "intersect" event on handle unregistered container', function () {
            const component = calendarTestUtils.createComponent(
                  scroll.IntersectionObserverController,
                  options
               ),
               element = 'element',
               entry = { target: element, entryData: 'data' };

            component._initObserver();
            jest
               .spyOn(component._observer, '_createObserver')
               .mockClear()
               .mockReturnValue({
                  observe: jest.fn()
               });
            jest.spyOn(component, '_notify').mockClear().mockImplementation();
            component._observer._intersectionObserverHandler([entry]);
            expect(component._notify).not.toHaveBeenCalled();
         });
      });
   });
});
