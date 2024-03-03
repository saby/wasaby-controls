define([
   'Controls/error',
   'Browser/Transport',
   'Types/entity',
   'ErrorHandling/ErrorHandling',
   'UI/Utils'
], function (errLib, Transport, { PromiseCanceledError }, ErrorHandling, { Logger }) {
   describe('Controls/error:ErrorController', function () {
      const Controller = errLib.ErrorController;
      const originalHandlerGetter = ErrorHandling.getHandlers;
      let controller;
      let appHandlers = [];

      function createController() {
         ErrorHandling.getHandlers = () => {
            return appHandlers;
         };
         controller = new Controller();
      }

      afterEach(() => {
         ErrorHandling.getHandlers = originalHandlerGetter;
         appHandlers = [];
         jest.restoreAllMocks();
      });

      it('is defined', function () {
         expect(Controller).toBeDefined();
      });

      it('is constructor', function () {
         expect(typeof Controller).toBe('function');
         createController();
         expect(controller).toBeInstanceOf(Controller);
      });

      describe('addHandler()', function () {
         createController();

         it('adds to handlers', function () {
            const handler = () => {
               return undefined;
            };
            controller.addHandler(handler);
            expect(controller.handlers).toContain(handler);
         });

         it("doesn't add to handlers twice", function () {
            const handler = () => {
               return undefined;
            };
            controller.addHandler(handler);
            controller.addHandler(handler);
            expect(controller.handlers.indexOf(handler)).toEqual(
               controller.handlers.lastIndexOf(handler)
            );
         });
      });

      describe('removeHandler()', function () {
         createController();

         it('is function', function () {
            expect(typeof controller.removeHandler).toBe('function');
         });

         it('removes from handlers', function () {
            const handler = () => {
               return undefined;
            };
            controller.addHandler(handler);
            controller.removeHandler(handler);
            expect(controller.handlers).not.toContain(handler);
         });

         it("doesn't remove other handlers", function () {
            const handler1 = () => {
               return undefined;
            };
            const handler2 = () => {
               return undefined;
            };
            controller.addHandler(handler1);
            controller.addHandler(handler2);
            controller.removeHandler(handler1);
            expect(controller.handlers).toContain(handler2);
         });
      });

      describe('setOnProcess', () => {
         const onProcess = () => {
            return null;
         };

         it('onProcess function is set from options', () => {
            const ctrl = new Controller({ onProcess });
            expect(ctrl.onProcess).toBe(onProcess);
         });

         it('sets new onProcess function', () => {
            const ctrl = new Controller();
            ctrl.setOnProcess(onProcess);
            expect(ctrl.onProcess).toBe(onProcess);
         });
      });

      describe('process()', function () {
         let error;

         const addHandlerPromise = () => {
            return new Promise((resolve) => {
               return controller.addHandler(resolve);
            });
         };

         const addHandlerCheck = (expectResult) => {
            const handler = jest.fn();
            controller.addHandler(handler);
            return () => {
               if (expectResult) {
                  expect(handler).toHaveBeenCalled();
               } else {
                  expect(handler).not.toHaveBeenCalled();
               }
            };
         };

         beforeEach(function () {
            createController();
            error = new Error('test error');
            jest.spyOn(Logger, 'error').mockClear().mockImplementation();
         });

         afterEach(function () {
            controller = null;
            error = null;
         });

         it('calls registered handler (async)', function () {
            const handlerPromise = addHandlerPromise();
            return controller.process(error).then(() => {
               return handlerPromise;
            });
         });

         it('calls registered handler (sync)', function () {
            const checkHandler = addHandlerCheck(true);
            controller.processSync(error);
            checkHandler();
         });

         it("doesn't call handler with processed error (async)", function () {
            const checkHandler = addHandlerCheck(false);
            error.processed = true;
            return controller.process(error).then(checkHandler);
         });

         it("doesn't call handler with processed error (sync)", function () {
            const checkHandler = addHandlerCheck(false);
            error.processed = true;
            controller.processSync(error);
            checkHandler();
         });

         it("doesn't process error twice asynchronously", function () {
            controller.addHandler(jest.fn().mockReturnValue({}));
            return Promise.all([controller.process(error), controller.process(error)]).then(
               ([first, second]) => {
                  expect(first).toBeDefined();
                  expect(second).not.toBeDefined();
               }
            );
         });

         it("doesn't call handler with canceled error (async)", function () {
            const checkHandler = addHandlerCheck(false);
            error.canceled = true;
            return controller.process(error).then(checkHandler);
         });

         it("doesn't call handler with canceled error (sync)", function () {
            const checkHandler = addHandlerCheck(false);
            error.canceled = true;
            controller.processSync(error);
            checkHandler();
         });

         it("doesn't call handlers with Abort error (async)", function () {
            const checkHandler = addHandlerCheck(false);
            return controller
               .process(new Transport.fetch.Errors.Abort('test page'))
               .then(checkHandler);
         });

         it("doesn't call handlers with Abort error (sync)", function () {
            const checkHandler = addHandlerCheck(false);
            controller.process(new Transport.fetch.Errors.Abort('test page'));
            checkHandler();
         });

         it('calls handler with current args (async)', function () {
            const ARGS = {
               error: error,
               mode: errLib.ErrorViewMode.include
            };
            const handlerPromise = addHandlerPromise();
            return controller
               .process(ARGS)
               .then(() => {
                  return handlerPromise;
               })
               .then((args) => {
                  return expect(args).toEqual(ARGS);
               });
         });

         it('calls handler with current args (sync)', function () {
            const ARGS = {
               error: error,
               mode: errLib.ErrorViewMode.include
            };
            const handler = jest.fn();
            controller.addHandler(handler);
            controller.processSync(ARGS);
            expect(handler.mock.calls[0][0]).toEqual(ARGS);
         });

         describe('calls all registered handlers in correct order', function () {
            let result;

            beforeEach(() => {
               result = [];
               const pushResult = (data) => {
                  return () => {
                     result.push(data);
                  };
               };

               for (let i = 0; i < 3; i++) {
                  appHandlers.push(pushResult(`appHandler${i}`));
                  controller.addHandler(pushResult(`postHandler${i}`), true);
                  controller.addHandler(pushResult(`handler${i}`));
               }
            });

            it('async process', () => {
               return controller.process(error).then(() => {
                  return expect(result).toEqual([
                     'handler0',
                     'handler1',
                     'handler2',
                     'appHandler0',
                     'appHandler1',
                     'appHandler2',
                     'postHandler0',
                     'postHandler1',
                     'postHandler2'
                  ]);
               });
            });

            it('sync process', () => {
               controller.processSync(error);
               expect(result).toEqual([
                  'handler0',
                  'handler1',
                  'handler2',
                  'appHandler0',
                  'appHandler1',
                  'appHandler2',
                  'postHandler0',
                  'postHandler1',
                  'postHandler2'
               ]);
            });
         });

         it('stops calling handlers after receiving an answer', function () {
            for (let i = 0; i < 5; i++) {
               controller.addHandler(() => {
                  return undefined;
               });
            }
            controller.addHandler(() => {
               return {
                  template: 'test',
                  options: {}
               };
            });
            const checkHandler = addHandlerCheck(false);

            // sync process
            controller.processSync(error);
            checkHandler();

            // async process
            return controller.process(error).then(checkHandler);
         });

         describe('returns current handler result', function () {
            const RESULT = {
               template: 'test',
               options: {},
               mode: errLib.ErrorViewMode.include
            };

            afterEach(() => {
               error.processed = false;
            });

            it('sync process', () => {
               controller.addHandler(() => {
                  return RESULT;
               });
               const res = controller.processSync(error);
               expect(RESULT).toEqual({
                  mode: res.mode,
                  template: res.template,
                  options: res.options
               });
            });

            it('async process', () => {
               controller.addHandler(() => {
                  return RESULT;
               });
               return controller.process(error).then((result) => {
                  expect(RESULT).toEqual({
                     mode: result.mode,
                     template: result.template,
                     options: result.options
                  });
               });
            });
         });

         describe('returns default ViewConfig if gets no result from handlers', function () {
            for (let i = 0; i < 5; i++) {
               controller.addHandler(() => {
                  return undefined;
               });
            }

            it('async process', () => {
               return controller.process({ error }).then((viewConfig) => {
                  expect(error.processed).toBe(true);
                  expect(viewConfig).toEqual({
                     mode: 'dialog',
                     options: { message: 'test error' }
                  });
               });
            });

            it('sync process', () => {
               const viewConfig = controller.processSync({ error });
               expect(error.processed).toBe(true);
               expect(viewConfig).toEqual({
                  mode: 'dialog',
                  options: { message: 'test error' }
               });
            });
         });

         it('sets ViewConfig.mode the same as was passed in ProcessConfig', () => {
            const RESULT = {
               template: 'test',
               mode: errLib.ErrorViewMode.include
            };
            controller.addHandler(() => {
               return RESULT;
            });
            return controller
               .process({
                  error,
                  mode: errLib.ErrorViewMode.page
               })
               .then((result) => {
                  expect(result).toEqual({
                     template: RESULT.template,
                     mode: 'page'
                  });
               });
         });

         describe("calls onProcess function and replace ViewConfig by it's result", () => {
            beforeEach(() => {
               controller.setOnProcess((viewConfig) => {
                  viewConfig.mode = errLib.ErrorViewMode.page;
                  return viewConfig;
               });
            });

            afterEach(() => {
               // deleting onProcess function
               controller.setOnProcess();
            });

            it('async process', () => {
               return controller.process(error).then((result) => {
                  expect(result).toEqual({
                     mode: 'page',
                     options: { message: 'test error' }
                  });
               });
            });

            it('sync process', () => {
               const result = controller.processSync(error);
               expect(result).toEqual({
                  mode: 'page',
                  options: { message: 'test error' }
               });
            });
         });

         it('executes async handlers', () => {
            const viewConfig = {
               template: 'test',
               options: {},
               mode: errLib.ErrorViewMode.include
            };

            const handlerPromises = [
               // Обработчик #1 возвращает undefined.
               new Promise((resolve) => {
                  return controller.addHandler(() => {
                     resolve();
                     return Promise.resolve();
                  });
               }),

               // Обработчик #2 бросает исключение, оно должно игнорироваться.
               new Promise((resolve) => {
                  return controller.addHandler(() => {
                     resolve();
                     throw new Error('Throw test error');
                  });
               }),

               // Обработчик #3 возвращает промис с ошибкой, она должна игнорироваться.
               new Promise((resolve) => {
                  return controller.addHandler(() => {
                     resolve();
                     return Promise.reject(new Error('Test rejected promise'));
                  });
               })
            ];

            // Обработчик #4 возвращает конфиг, он должен стать результатом всей цепочки.
            controller.addHandler(() => {
               return Promise.resolve(viewConfig);
            });

            // Обработчик #5 не должен выполняться.
            const checkHandler = addHandlerCheck(false);

            return controller.process(error).then((result) => {
               checkHandler();

               expect({
                  mode: result.mode,
                  template: result.template,
                  options: result.options
               }).toEqual(viewConfig);

               expect(Logger.error).toHaveBeenCalledTimes(2);

               return Promise.all(handlerPromises);
            });
         });

         it('stops processing when handler throws PromiseCanceledError', () => {
            const handlerPromises = [
               // Обработчик #1 возвращает undefined.
               addHandlerPromise(),

               // Обработчик #2 бросает исключение отмены.
               new Promise((resolve) => {
                  return controller.addHandler(() => {
                     resolve();
                     throw new PromiseCanceledError();
                  });
               })
            ];

            // Обработчик #3 не должен выполняться.
            const checkHandler = addHandlerCheck(false);

            return controller.process(error).then((viewConfig) => {
               checkHandler();
               expect(viewConfig).not.toBeDefined();
               return Promise.all(handlerPromises);
            });
         });

         it('stops processing when handler rejects promise with PromiseCanceledError', () => {
            const handlerPromises = [
               // Обработчик #1 возвращает undefined.
               addHandlerPromise(),

               // Обработчик #2 возвращает промис с исключением отмены.
               new Promise((resolve) => {
                  return controller.addHandler(() => {
                     resolve();
                     return Promise.reject(new PromiseCanceledError());
                  });
               })
            ];

            // Обработчик #3 не должен выполняться.
            const checkHandler = addHandlerCheck(false);

            return controller.process(error).then((viewConfig) => {
               checkHandler();
               expect(viewConfig).not.toBeDefined();
               return Promise.all(handlerPromises);
            });
         });

         it('stops sync processing when handler throws PromiseCanceledError', () => {
            // Обработчик #1 возвращает undefined.
            const checkHandlerFirst = addHandlerCheck(true);

            // Обработчик #2 бросает PromiseCanceledError.
            const handler = jest.fn().mockImplementation(() => {
               throw new PromiseCanceledError();
            });
            controller.addHandler(handler);
            const checkHandlerSecond = () => {
               return expect(handler).toHaveBeenCalled();
            };

            // Обработчик #3 не должен выполняться.
            const checkHandlerThird = addHandlerCheck(false);

            const viewConfig = controller.processSync(error);
            expect(viewConfig).not.toBeDefined();
            checkHandlerFirst();
            checkHandlerSecond();
            checkHandlerThird();
         });

         describe('promise prop in viewConfig', () => {
            let result;
            let handler;
            let resolve;

            beforeEach(() => {
               resolve = {};
               result = {
                  promise: Promise.resolve(resolve)
               };
               handler = jest.fn().mockReturnValue(result);
               controller.addHandler(handler);
            });

            it('sync process returns viewConfig', () => {
               const viewConfig = controller.processSync(error);
               expect(viewConfig).toBe(result);
            });

            it('async process returns "promise" prop result', () => {
               return controller.process(error).then((viewConfig) => {
                  expect(viewConfig).toBe(resolve);
               });
            });
         });

         it('logs an error, when handler result is promise (sync process)', () => {
            const result = {};
            const handlerPromise = jest.fn().mockReturnValue(Promise.resolve({}));
            const handlerResult = jest.fn().mockReturnValue(result);
            controller.addHandler(handlerPromise);
            controller.addHandler(handlerResult);
            const viewConfig = controller.processSync(error);
            expect(Logger.error).toHaveBeenCalled();
            expect(viewConfig).toEqual(result);
         });
      });

      describe('isNeedHandle()', () => {
         it('returns false for Abort error', () => {
            const error = new Transport.fetch.Errors.Abort('test-url');
            expect(Controller.isNeedHandle(error)).toBe(false);
         });

         it('returns false for processed error', () => {
            const error = { processed: true };
            expect(Controller.isNeedHandle(error)).toBe(false);
         });

         it('returns false for canceled error', () => {
            const error = { canceled: true };
            expect(Controller.isNeedHandle(error)).toBe(false);
         });

         it('returns true for other types', () => {
            const error = new Error();
            expect(Controller.isNeedHandle(error)).toBe(true);
         });
      });

      describe('getHandlerConfig()', () => {
         beforeEach(() => {
            createController();
         });

         it('returns a config for an error', () => {
            const error = new Error();
            const result = Controller.getHandlerConfig(error);
            expect(result).toEqual({
               error,
               mode: 'dialog'
            });
         });

         it('returns a config with default mode', () => {
            const error = new Error();
            const config = { error };
            const result = Controller.getHandlerConfig(config);
            expect(result).not.toBe(config);
            expect(result).toEqual({
               error,
               mode: 'dialog'
            });
         });

         it('returns a config with the preset mode', () => {
            const error = new Error();
            const config = {
               error,
               mode: 'include'
            };
            controller = new Controller();
            const result = Controller.getHandlerConfig(config);
            expect(result).not.toBe(config);
            expect(result).toEqual({
               error,
               mode: 'include'
            });
         });
      });
   });
});
