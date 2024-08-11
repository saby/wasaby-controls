define([
   'Env/Env',
   'Env/Event',
   'ControlsUnit/resources/ProxyCall',
   'Controls/_input/resources/MobileFocusController'
], function (Env, EnvEvent, ProxyCall, MobileFocusController) {
   describe('Controls.input:MobileFocusController', function () {
      var controller, calls, originalIsMobileIOS;
      var event1 = {
         currentTarget: {}
      };
      var event2 = {
         currentTarget: {}
      };
      var originalMethod = EnvEvent.Bus.globalChannel().notify;

      beforeEach(function () {
         calls = [];
         controller = MobileFocusController.default;

         controller.blurHandler(event1);
         controller.blurHandler(event2);
         originalIsMobileIOS = Env.detection.isMobileIOS;
         EnvEvent.Bus.globalChannel().notify = ProxyCall.apply(
            originalMethod,
            'notify',
            calls,
            true
         );
      });
      afterEach(function () {
         EnvEvent.Bus.globalChannel().notify = originalMethod;
         Env.detection.isMobileIOS = originalIsMobileIOS;
      });
      describe('isMobileIOS = true', function () {
         beforeEach(function () {
            Env.detection.isMobileIOS = true;
         });
         it('focus -> touchStart -> blur', function () {
            controller.focusHandler(event1);
            expect(calls.length).toEqual(0);

            controller.touchStartHandler(event1);
            expect(calls.length).toEqual(1);
            expect(calls[0]).toEqual({
               name: 'notify',
               arguments: ['MobileInputFocus']
            });

            controller.blurHandler(event1);
            expect(calls.length).toEqual(2);
            expect(calls[1]).toEqual({
               name: 'notify',
               arguments: ['MobileInputFocusOut']
            });
         });
         it('touchStart -> focus -> blur', function () {
            controller.touchStartHandler(event1);
            expect(calls.length).toEqual(0);

            controller.focusHandler(event1);
            expect(calls.length).toEqual(1);
            expect(calls[0]).toEqual({
               name: 'notify',
               arguments: ['MobileInputFocus']
            });

            controller.blurHandler(event1);
            expect(calls.length).toEqual(2);
            expect(calls[1]).toEqual({
               name: 'notify',
               arguments: ['MobileInputFocusOut']
            });
         });
         it('touchStart -> focus -> blur', function () {
            controller.touchStartHandler(event1);
            expect(calls.length).toEqual(0);

            controller.focusHandler(event1);
            expect(calls.length).toEqual(1);
            expect(calls[0]).toEqual({
               name: 'notify',
               arguments: ['MobileInputFocus']
            });

            controller.blurHandler(event1);
            expect(calls.length).toEqual(2);
            expect(calls[1]).toEqual({
               name: 'notify',
               arguments: ['MobileInputFocusOut']
            });
         });
         it('blur', function () {
            controller.blurHandler(event1);
            expect(calls.length).toEqual(0);
         });
         it('User tap from field to field', function () {
            controller.touchStartHandler(event1);
            controller.focusHandler(event1);
            controller.touchStartHandler(event2);
            controller.blurHandler(event1);
            controller.focusHandler(event2);

            expect(calls).toEqual([
               {
                  name: 'notify',
                  arguments: ['MobileInputFocus']
               },
               {
                  name: 'notify',
                  arguments: ['MobileInputFocusOut']
               },
               {
                  name: 'notify',
                  arguments: ['MobileInputFocus']
               }
            ]);
         });
      });
      describe('isMobileIOS = false', function () {
         beforeEach(function () {
            Env.detection.isMobileIOS = false;
         });
         it('touchStart -> blur', function () {
            controller.touchStartHandler(event1);
            expect(calls.length).toEqual(0);

            controller.blurHandler(event1);
            expect(calls.length).toEqual(0);
         });
         it('focus -> blur', function () {
            controller.focusHandler(event1);
            expect(calls.length).toEqual(0);

            controller.blurHandler(event1);
            expect(calls.length).toEqual(0);
         });
         it('touchStart -> focus -> blur', function () {
            controller.touchStartHandler(event1);
            expect(calls.length).toEqual(0);

            controller.focusHandler(event1);
            expect(calls.length).toEqual(0);

            controller.blurHandler(event1);
            expect(calls.length).toEqual(0);
         });
         it('blur', function () {
            controller.blurHandler(event1);
            expect(calls.length).toEqual(0);
         });
      });
   });
});
