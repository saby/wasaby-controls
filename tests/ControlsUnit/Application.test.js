/**
 * Created by dv.zuev on 27.12.2017.
 */
define(['Controls/Application/withBodyClasses', 'react'], function (withBodyClasses, React) {
   describe('Controls.Application', function () {
      describe('Classes touch, drag and hover.', function () {
         var application;
         var getTrueTouch = function () {
            return true;
         };
         var getFalseTouch = function () {
            return false;
         };

         beforeEach(function () {
            const Control = withBodyClasses.default(React.Component);
            application = new Control({});
            application._touchController = {};
         });

         it('ws-is-no-touch ws-is-no-drag ws-is-hover', function () {
            application._bodyClassesState.drag = false;
            application._touchController.isTouch = getFalseTouch;

            application._updateTouchClassesState();

            expect(application._bodyClassesState.touch).toEqual(false);
            expect(application._bodyClassesState.drag).toEqual(false);
            expect(application._bodyClassesState.hover).toEqual(true);
         });
         it('ws-is-touch ws-is-no-drag ws-is-no-hover', function () {
            application._bodyClassesState.drag = false;
            application._touchController.isTouch = getTrueTouch;

            application._updateTouchClassesState();

            expect(application._bodyClassesState.touch).toEqual(true);
            expect(application._bodyClassesState.drag).toEqual(false);
            expect(application._bodyClassesState.hover).toEqual(false);
         });
         it('ws-is-no-touch ws-is-drag ws-is-no-hover', function () {
            application._bodyClassesState.drag = true;
            application._touchController.isTouch = getFalseTouch;

            application._updateTouchClassesState();

            expect(application._bodyClassesState.touch).toEqual(false);
            expect(application._bodyClassesState.drag).toEqual(true);
            expect(application._bodyClassesState.hover).toEqual(false);
         });
         it('ws-is-touch ws-is-drag ws-is-no-hover', function () {
            application._bodyClassesState.drag = true;
            application._touchController.isTouch = getTrueTouch;

            application._updateTouchClassesState();

            expect(application._bodyClassesState.touch).toEqual(true);
            expect(application._bodyClassesState.drag).toEqual(true);
            expect(application._bodyClassesState.hover).toEqual(false);
         });
      });
   });
});
