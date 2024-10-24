/**
 * Created by dv.zuev on 27.12.2017.
 */
define(['Env/Env', 'Controls/Application/withBodyClasses', 'react'], function (
   Env,
   withBodyClasses,
   React
) {
   describe('Controls.Application2', function () {
      describe('popup logic', function () {
         it('not mobile', function () {
            const Control = withBodyClasses.default(React.Component);
            let ctrl = new Control({});

            ctrl._popupCreatedHandler();
            expect(ctrl._bodyClasses.scrollingClass).toEqual('');

            ctrl._popupDestroyedHandler(null, null, {
               getCount: () => {
                  return 0;
               }
            });
            expect(ctrl._bodyClasses.scrollingClass).toEqual('');

            ctrl._suggestStateChangedHandler(null, true);
            expect(ctrl._bodyClasses.scrollingClass).toEqual('');
            ctrl._suggestStateChangedHandler(null, false);
            expect(ctrl._bodyClasses.scrollingClass).toEqual('');
         });

         it('ios', function () {
            const Control = withBodyClasses.default(React.Component);
            let ctrl = new Control({}),
               oldIsMobileIOS = Env.detection.isMobileIOS;

            Env.detection.isMobileIOS = true;
            ctrl._popupCreatedHandler();
            expect(ctrl._bodyClasses.scrollingClass).toEqual(
               'controls-Scroll_webkitOverflowScrollingAuto'
            );

            ctrl._popupDestroyedHandler(null, null, {
               getCount: () => {
                  return 0;
               }
            });
            expect(ctrl._bodyClasses.scrollingClass).toEqual(
               'controls-Scroll_webkitOverflowScrollingTouch'
            );

            ctrl._suggestStateChangedHandler(null, true);
            expect(ctrl._bodyClasses.scrollingClass).toEqual(
               'controls-Scroll_webkitOverflowScrollingAuto'
            );
            ctrl._suggestStateChangedHandler(null, false);
            expect(ctrl._bodyClasses.scrollingClass).toEqual(
               'controls-Scroll_webkitOverflowScrollingTouch'
            );

            if (typeof window === 'undefined') {
               Env.detection.isMobileIOS = undefined;
            } else {
               Env.detection.isMobileIOS = oldIsMobileIOS;
            }
         });
      });
   });
});
