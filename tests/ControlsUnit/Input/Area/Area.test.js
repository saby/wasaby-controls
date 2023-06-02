define([
   'Env/Env',
   'Controls/input',
   'ControlsUnit/resources/ProxyCall',
   'ControlsUnit/resources/TemplateUtil',
   'Vdom/Vdom',
   'UI/Utils',

   'wml!ControlsUnit/Input/Area/LinkInReadMode'
], function (Env, input, ProxyCall, TemplateUtil, Vdom, UIUtils) {
   'use strict';

   var SyntheticEvent = Vdom.SyntheticEvent;

   describe('Controls.Input.Area', function () {
      var ctrl, calls;

      beforeEach(function () {
         calls = [];
         ctrl = new input.Area();
      });

      describe('keyDownHandler propagation', function () {
         it("shouldn't stopPropagation keyDown event if caret in the end of the line (press ArrowDown).", function () {
            let event = new SyntheticEvent({
               ctrlKey: false,
               altKey: false,
               shiftKey: false,
               key: 'ArrowDown'
            });
            const stubPropagation = jest
               .spyOn(event, 'stopPropagation')
               .mockClear()
               .mockImplementation();
            ctrl._viewModel = {
               selection: {
                  end: 0
               },
               displayValue: ''
            };
            jest
               .spyOn(ctrl, '_isTextSelected')
               .mockClear()
               .mockReturnValue(false);

            ctrl._keyDownHandler(event);
            expect(stubPropagation).not.toHaveBeenCalled();
         });

         it('should not stopPropagation keyDown event if caret in the start of the line (press ArrowUp).', function () {
            let event = new SyntheticEvent({
               ctrlKey: false,
               altKey: false,
               shiftKey: false,
               key: 'ArrowUp'
            });
            const stubPropagation = jest
               .spyOn(event, 'stopPropagation')
               .mockClear()
               .mockImplementation();
            ctrl._viewModel = {
               selection: {
                  start: 0
               },
               displayValue: ''
            };
            jest
               .spyOn(ctrl, '_isTextSelected')
               .mockClear()
               .mockReturnValue(false);

            ctrl._keyDownHandler(event);
            expect(stubPropagation).not.toHaveBeenCalled();
         });

         it('should stopPropagation keyDown event if caret in the center of the line (press ArrowDown).', function () {
            let event = new SyntheticEvent({
               ctrlKey: false,
               altKey: false,
               shiftKey: false,
               key: 'ArrowDown'
            });
            const stubPropagation = jest
               .spyOn(event, 'stopPropagation')
               .mockClear()
               .mockImplementation();
            ctrl._options.newLineKey = 'Arrow';
            ctrl._viewModel = {
               selection: {
                  start: 2,
                  end: 2
               },
               displayValue: ''
            };
            jest
               .spyOn(ctrl, '_isTextSelected')
               .mockClear()
               .mockReturnValue(false);

            ctrl._keyDownHandler(event);
            expect(stubPropagation).toHaveBeenCalledTimes(1);
         });

         it('should stopPropagation keyDown event if text selection (press ArrowDown).', function () {
            let event = new SyntheticEvent({
               ctrlKey: false,
               altKey: false,
               shiftKey: false,
               key: 'ArrowDown'
            });
            const stubPropagation = jest
               .spyOn(event, 'stopPropagation')
               .mockClear()
               .mockImplementation();
            ctrl._options.newLineKey = 'Arrow';
            ctrl._viewModel = {
               selection: {
                  start: 1,
                  end: 2
               },
               displayValue: ''
            };
            jest
               .spyOn(ctrl, '_isTextSelected')
               .mockClear()
               .mockReturnValue(false);

            ctrl._keyDownHandler(event);
            expect(stubPropagation).toHaveBeenCalledTimes(1);
         });
      });

      describe('Move to new line', function () {
         var event;
         var preventDefault = jest.fn();
         var stopPropagation = jest.fn();

         beforeEach(function () {
            ctrl.paste = ProxyCall.apply(ctrl.paste, 'paste', calls, true);
            ctrl._viewModel = {
               selection: {
                  end: 1,
                  start: 0
               },
               displayValue: 'test'
            };
            jest
               .spyOn(ctrl, '_isTextSelected')
               .mockClear()
               .mockReturnValue(true);
            preventDefault = ProxyCall.apply(
               preventDefault,
               'preventDefault',
               calls,
               true
            );
            stopPropagation = ProxyCall.apply(
               stopPropagation,
               'stopPropagation',
               calls,
               true
            );
         });

         it('The option newLineKey is equal to enter. Press enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               ctrlKey: false,
               altKey: false,
               shiftKey: false,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([]);
         });
         it('The option newLineKey is equal to enter. Press ctrl + enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: false,
               ctrlKey: true,
               shiftKey: false,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'preventDefault',
                  arguments: []
               }
            ]);
         });
         it('The option newLineKey is equal to enter. Press shift + enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: false,
               ctrlKey: false,
               shiftKey: true,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'preventDefault',
                  arguments: []
               }
            ]);
         });
         it('The option newLineKey is equal to enter. Press alt + enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: true,
               ctrlKey: false,
               shiftKey: false,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'preventDefault',
                  arguments: []
               }
            ]);
         });
         it('The option newLineKey is equal to enter. Press ctrl + shift + enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: false,
               ctrlKey: true,
               shiftKey: true,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'preventDefault',
                  arguments: []
               }
            ]);
         });
         it('The option newLineKey is equal to enter. Press ctrl + alt + enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: true,
               ctrlKey: true,
               shiftKey: false,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'preventDefault',
                  arguments: []
               }
            ]);
         });
         it('The option newLineKey is equal to enter. Press shift + alt + enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: true,
               ctrlKey: false,
               shiftKey: true,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'preventDefault',
                  arguments: []
               }
            ]);
         });
         it('The option newLineKey is equal to enter. Press ctrl + shift + alt + enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: true,
               ctrlKey: true,
               shiftKey: true,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'preventDefault',
                  arguments: []
               }
            ]);
         });
         it('The option newLineKey is equal to enter. Press b.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.b,
               altKey: false,
               ctrlKey: false,
               shiftKey: false,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'enter';

            ctrl._keyDownHandler(event);

            expect(calls.length).toEqual(0);
         });
         it('The option newLineKey is equal to ctrlEnter. Press enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: false,
               ctrlKey: false,
               shiftKey: false,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'ctrlEnter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'preventDefault',
                  arguments: []
               }
            ]);
         });
         it('The option newLineKey is equal to ctrlEnter. Press ctrl + enter.', function () {
            event = new SyntheticEvent({
               keyCode: Env.constants.key.enter,
               altKey: false,
               ctrlKey: true,
               shiftKey: false,
               preventDefault: preventDefault,
               stopPropagation: stopPropagation
            });
            ctrl._options.newLineKey = 'ctrlEnter';

            ctrl._keyDownHandler(event);

            expect(calls).toEqual([
               {
                  name: 'paste',
                  arguments: ['\n']
               }
            ]);
         });
      });

      describe('Validate lines', function () {
         var stubLogger;
         beforeEach(function () {
            stubLogger = jest
               .spyOn(UIUtils.Logger, 'error')
               .mockClear()
               .mockImplementation(() => {
                  return undefined;
               });
         });
         afterEach(function () {
            stubLogger.mockRestore();
         });
         it('min > max in beforeMount', function () {
            ctrl._beforeMount({
               minLines: 10,
               maxLines: 1
            });

            expect(ctrl._minLines).toEqual(1);
            expect(ctrl._maxLines).toEqual(10);
         });

         it('min > max in beforeUpdate', function () {
            ctrl._beforeMount({});
            ctrl._beforeUpdate({
               minLines: 10,
               maxLines: 1
            });

            expect(ctrl._minLines).toEqual(1);
            expect(ctrl._maxLines).toEqual(10);
         });

         it('min < 1 and max < 1 in beforeMount', function () {
            ctrl._beforeMount({
               minLines: -5,
               maxLines: -5
            });

            expect(ctrl._minLines).toEqual(1);
            expect(ctrl._maxLines).toEqual(1);
         });

         it('min < 1 and max < 1 in beforeUpdate', function () {
            ctrl._beforeMount({});
            ctrl._beforeUpdate({
               minLines: -5,
               maxLines: -5
            });

            expect(ctrl._minLines).toEqual(1);
            expect(ctrl._maxLines).toEqual(1);
         });

         it('min > 10 and max > 10 in beforeMount', function () {
            ctrl._beforeMount({
               minLines: 15,
               maxLines: 15
            });

            expect(ctrl._minLines).toEqual(10);
            expect(ctrl._maxLines).toEqual(10);
         });

         it('min > 10 and max > 10 in beforeUpdate', function () {
            ctrl._beforeMount({});
            ctrl._beforeUpdate({
               minLines: 15,
               maxLines: 15
            });

            expect(ctrl._minLines).toEqual(10);
            expect(ctrl._maxLines).toEqual(10);
         });
      });
   });
});
