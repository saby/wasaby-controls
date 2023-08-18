define(['Controls/_breadcrumbs/HeadingPath/Back'], function (PathBack) {
   describe('Controls/_breadcrumbs/HeadingPath/Back', function () {
      it('_onBackButtonClick', function () {
         var instance = new PathBack.default(),
            notifyCalled = false;
         instance._notify = function (eventName, eventArgs, eventOpts) {
            expect('backButtonClick').toEqual(eventName);
            expect([]).toEqual(eventArgs);
            expect({
               bubbling: true
            }).toEqual(eventOpts);
            notifyCalled = true;
         };
         instance._onBackButtonClick();
         expect(notifyCalled).toBe(true);
      });
      it('_onArrowClick', function () {
         var instance = new PathBack.default(),
            notifyCalled = false;
         instance._notify = function (eventName, eventArgs) {
            expect('arrowClick').toEqual(eventName);
            expect([]).toEqual(eventArgs);
            notifyCalled = true;
         };
         instance._onArrowClick();
         expect(notifyCalled).toBe(true);
      });
   });
});
