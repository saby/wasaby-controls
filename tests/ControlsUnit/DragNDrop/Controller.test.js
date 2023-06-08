define(['Controls/dragnDrop', 'Vdom/Vdom'], function (dragnDrop, Vdom) {
   'use strict';

   dragnDrop.Container._getSelection = function () {
      return {};
   };

   function createNativeEvent(type, pageX, pageY) {
      // mock dom event
      var result = {
         preventDefault: function () {
            // Check don't call preventDefault (preventDefault "mousedown" event stops closing popup windows).
            if (type === 'mousedown') {
               throw new Error('preventDefault called');
            }
         },
         type: type,
         buttons: 1,
         target: {
            closest: () => {
               return false;
            },
            classList: {
               add: () => {
                  return true;
               },
               remove: () => {
                  return true;
               }
            }
         }
      };
      if (type === 'touchstart' || type === 'touchmove') {
         result.touches = [
            {
               pageX: pageX,
               pageY: pageY
            }
         ];
      } else if (type === 'touchend') {
         result.changedTouches = [
            {
               pageX: pageX,
               pageY: pageY
            }
         ];
      } else {
         result.pageX = pageX;
         result.pageY = pageY;
      }

      return result;
   }

   function createSyntheticEvent(type, pageX, pageY) {
      return new Vdom.SyntheticEvent(createNativeEvent(type, pageX, pageY));
   }

   var startEvent = createNativeEvent('mousedown', 20, 10);

   describe('Controls.DragNDrop.Controller', function () {
      var events = [];

      it('isDragStarted', function () {
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 25, 10)
            )
         ).toBe(true);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 20, 15)
            )
         ).toBe(true);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 20, 5)
            )
         ).toBe(true);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 15, 10)
            )
         ).toBe(true);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 24, 10)
            )
         ).toBe(false);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 20, 14)
            )
         ).toBe(false);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 16, 10)
            )
         ).toBe(false);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 20, 6)
            )
         ).toBe(false);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 24, 10),
               true
            )
         ).toBe(true);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 20, 14),
               true
            )
         ).toBe(true);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 16, 10),
               true
            )
         ).toBe(true);
         expect(
            dragnDrop.Container._isDragStarted(
               startEvent,
               createNativeEvent('mousemove', 20, 6),
               true
            )
         ).toBe(true);
      });
      it('class controls-DragNDrop__notDraggable does`t start drag', function () {
         var controller = new dragnDrop.Container();
         var event = createSyntheticEvent('mousedown', 20, 10);
         jest
            .spyOn(controller, '_registerMouseMove')
            .mockClear()
            .mockImplementation();
         event.target.closest = (value) => {
            return value === '.controls-DragNDrop__notDraggable';
         };
         controller.startDragNDrop({}, event);

         expect(controller._registerMouseMove).not.toHaveBeenCalled();
      });
      it('_beforeUnmount', function () {
         var controller = new dragnDrop.Container();
         jest.spyOn(controller, '_onMouseUp').mockClear().mockImplementation();

         controller._afterMount();
         controller.startDragNDrop(
            {},
            createSyntheticEvent('mousedown', 20, 10)
         );
         controller._beforeUnmount();

         expect(controller._onMouseUp).toHaveBeenCalled();
      });
      it('getDragOffset', function () {
         expect(
            dragnDrop.Container._getDragOffset(
               startEvent,
               createNativeEvent('mousemove', 40, 20)
            )
         ).toEqual({ x: -20, y: -10 });
         expect(
            dragnDrop.Container._getDragOffset(
               startEvent,
               createNativeEvent('mousemove', 0, 0)
            )
         ).toEqual({ x: 20, y: 10 });
         expect(
            dragnDrop.Container._getDragOffset(
               startEvent,
               createNativeEvent('mousemove', -10, -10)
            )
         ).toEqual({ x: 30, y: 20 });
      });
      describe('getPageXY', function () {
         it('touchstart and touchmove', function () {
            var touchmove = createNativeEvent('touchmove', 40, 10),
               touchstart = createNativeEvent('touchstart', 30, 20),
               touchmoveXY = dragnDrop.Container._getPageXY(touchmove),
               touchstartXY = dragnDrop.Container._getPageXY(touchstart);

            expect(touchmoveXY).toEqual({ x: 40, y: 10 });
            expect(touchstartXY).toEqual({ x: 30, y: 20 });
         });
         it('touchend', function () {
            var touchend = createNativeEvent('touchend', 50, 60),
               touchendXY = dragnDrop.Container._getPageXY(touchend);

            expect(touchendXY).toEqual({ x: 50, y: 60 });
         });
         it('mouse events', function () {
            var mouseup = createNativeEvent('mouseup', 15, 25),
               mouseupXY = dragnDrop.Container._getPageXY(mouseup);

            expect(mouseupXY).toEqual({ x: 15, y: 25 });
         });
      });
      it('dragStart because of mouse leave', function () {
         var controller = new dragnDrop.Container();

         controller._afterMount();
         controller.startDragNDrop(
            {},
            createSyntheticEvent('mousedown', 20, 10)
         );

         controller._mouseLeave(createSyntheticEvent('mouseleave', 20, 10));

         expect(controller._insideDragging).toBe(true);
      });
      describe('Controls.DragNDrop.Controller phase', function () {
         var dragObject,
            entity = {},
            controller = new dragnDrop.Container(),
            startEvent1 = createSyntheticEvent('mousedown', 20, 10);

         controller._afterMount();

         controller.saveOptions({
            draggingTemplate: 'template'
         });

         controller._notify = function (eventName, args) {
            if (eventName === 'register' || eventName === 'unregister') {
               // eslint-disable-next-line no-param-reassign
               eventName = eventName + args[0];
            }
            events.push(eventName);
            if (eventName === '_documentDragStart') {
               this._documentDragStart();
            }
            if (eventName === '_documentDragEnd') {
               this._documentDragEnd();
            }
            if (eventName === 'dragMove') {
               dragObject = args[0];
            }
         };

         afterEach(function () {
            events = [];
            dragObject = null;
         });

         describe('mouse', function () {
            it('customdragStart', function () {
               events = [];
               controller.startDragNDrop(entity, startEvent1);
               expect(startEvent1.nativeEvent).toEqual(controller._startEvent);
               expect(events.join(', ')).toEqual(
                  'registermousemove, registertouchmove, registermouseup, registertouchend'
               );
            });
            it('mouseMove without start dragMove', function () {
               controller._onMouseMove(
                  createSyntheticEvent('mousemove', 20, 10)
               );
               expect(events.join(', ')).toEqual('');
               expect(controller._documentDragging).toBe(false);
               expect(controller._insideDragging).toBe(false);
            });
            it('start dragMove', function () {
               controller._onMouseMove(
                  createSyntheticEvent('mousemove', 25, 10)
               );
               expect(events.join(', ')).toEqual(
                  '_documentDragStart, customdragStart, documentDragStart, dragMove, _updateDraggingTemplate'
               );
               expect(controller._documentDragging).toBe(true);
               expect(controller._insideDragging).toBe(true);
            });
            it('dragMove', function () {
               controller._onMouseMove(
                  createSyntheticEvent('mousemove', 30, 15)
               );
               expect(events.join(', ')).toEqual(
                  'dragMove, _updateDraggingTemplate'
               );
               expect(dragObject.offset).toEqual({ x: 10, y: 5 });
               expect(dragObject.position).toEqual({ x: 30, y: 15 });
            });
            it('dragLeave', function () {
               controller._mouseLeave(createSyntheticEvent());
               expect(events.join(', ')).toEqual('customdragLeave');
               expect(controller._insideDragging).toBe(false);
            });
            it('customdragEnter', function () {
               controller._mouseEnter(createSyntheticEvent());
               expect(events.join(', ')).toEqual('customdragEnter');
               expect(controller._insideDragging).toBe(true);
            });
            it('customdragEnd', function () {
               controller._onMouseUp(createSyntheticEvent('mouseup', 50, 45));
               expect(events.join(', ')).toEqual(
                  '_documentDragEnd, customdragEnd, documentDragEnd, unregistermousemove, unregistertouchmove, unregistermouseup, unregistertouchend'
               );
               expect(controller._documentDragging).toBe(false);
               expect(controller._insideDragging).toBe(false);
               expect(!!controller._startEvent).toBe(false);
               expect(!!controller._dragEntity).toBe(false);
            });
         });
         describe('mouse with pageleave', function () {
            it('customdragStart', function () {
               events = [];
               controller.startDragNDrop(entity, startEvent1);
               expect(startEvent1.nativeEvent).toEqual(controller._startEvent);
               expect(events.join(', ')).toEqual(
                  'registermousemove, registertouchmove, registermouseup, registertouchend'
               );
            });
            it('start dragMove', function () {
               controller._onMouseMove(
                  createSyntheticEvent('mousemove', 25, 10)
               );
               expect(events.join(', ')).toEqual(
                  '_documentDragStart, customdragStart, documentDragStart, dragMove, _updateDraggingTemplate'
               );
               expect(controller._documentDragging).toBe(true);
               expect(controller._insideDragging).toBe(true);
            });
            it('dragMove', function () {
               controller._onMouseMove(
                  createSyntheticEvent('mousemove', 30, 15)
               );
               expect(events.join(', ')).toEqual(
                  'dragMove, _updateDraggingTemplate'
               );
               expect(dragObject.offset).toEqual({ x: 10, y: 5 });
               expect(dragObject.position).toEqual({ x: 30, y: 15 });
            });
            it('pageleave', function () {
               controller._onMouseMove(
                  createSyntheticEvent('mouseleave', 50, 45)
               );
               expect(controller._documentDragging).toBe(true);
            });
         });
         describe('touch', function () {
            it('customdragStart', function () {
               controller._documentDragging = false;
               controller.startDragNDrop(entity, startEvent1);
               expect(startEvent1.nativeEvent).toEqual(controller._startEvent);
               expect(events.join(', ')).toEqual(
                  'registermousemove, registertouchmove, registermouseup, registertouchend'
               );
            });
            it('touchmove without start dragMove', function () {
               controller._documentDragging = false;
               controller._insideDragging = false;
               controller._onTouchMove(
                  createSyntheticEvent('touchmove', 20, 10)
               );
               expect(events.join(', ')).toEqual('');
               expect(controller._documentDragging).toBe(false);
               expect(controller._insideDragging).toBe(false);
            });
            it('start dragMove', function () {
               controller._onTouchMove(
                  createSyntheticEvent('touchmove', 25, 10)
               );
               expect(events.join(', ')).toEqual(
                  '_documentDragStart, customdragStart, documentDragStart, dragMove, _updateDraggingTemplate'
               );
               expect(controller._documentDragging).toBe(true);
               expect(controller._insideDragging).toBe(true);
            });
            it('dragMove', function () {
               controller._onTouchMove(
                  createSyntheticEvent('touchmove', 30, 15)
               );
               expect(events.join(', ')).toEqual(
                  'dragMove, _updateDraggingTemplate'
               );
               expect(dragObject.offset).toEqual({ x: 10, y: 5 });
               expect(dragObject.position).toEqual({ x: 30, y: 15 });
            });
            it('dragLeave', function () {
               controller._mouseLeave(createSyntheticEvent());
               expect(events.join(', ')).toEqual('customdragLeave');
               expect(controller._insideDragging).toBe(false);
            });
            it('customdragEnter', function () {
               controller._mouseEnter(createSyntheticEvent());
               expect(events.join(', ')).toEqual('customdragEnter');
               expect(controller._insideDragging).toBe(true);
            });
            it('customdragEnd', function () {
               controller._onMouseUp(createSyntheticEvent('mouseup', 50, 45));
               expect(events.join(', ')).toEqual(
                  '_documentDragEnd, customdragEnd, documentDragEnd, unregistermousemove, unregistertouchmove, unregistermouseup, unregistertouchend'
               );
               expect(controller._documentDragging).toBe(false);
               expect(controller._insideDragging).toBe(false);
               expect(!!controller._startEvent).toBe(false);
               expect(!!controller._dragEntity).toBe(false);
            });
         });
      });
   });
});
