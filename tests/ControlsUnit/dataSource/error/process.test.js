define([
   'Controls/dataSource',
   'Controls/error',
   'Application/Env',
   'Env/Env',
   'ErrorHandling/ErrorHandling'
], function (
   { error: { process } },
   { process: errorProcess },
   { logger },
   { constants },
   ErrorHandling
) {
   describe('Controls/dataSource:error.process', () => {
      const popupId = '42';
      let _popupHelper;
      let isServerSide = constants.isServerSide;
      const originalHandlerGetter = ErrorHandling.getHandlers;

      beforeEach(() => {
         _popupHelper = {
            preloadPopup: jest.fn(),
            openConfirmation: jest.fn().mockResolvedValue(undefined),
            openDialog: jest.fn().mockResolvedValue(popupId)
         };
         jest.spyOn(logger, 'error').mockClear().mockImplementation();
         constants.isServerSide = false;
         ErrorHandling.getHandlers = () => {
            return [];
         };
      });

      afterEach(() => {
         constants.isServerSide = isServerSide;
         ErrorHandling.getHandlers = originalHandlerGetter;
      });

      it('is function', () => {
         expect(typeof process).toBe('function');
      });

      it('dataSource and error export the same function', () => {
         expect(process).toBe(errorProcess);
      });

      it('returns popupId', () => {
         const opener = {};
         const dialogEventHandlers = {};
         const error = new Error();
         error.status = 0;

         return process({
            error,
            opener,
            dialogEventHandlers,
            _popupHelper
         }).then((result) => {
            expect(_popupHelper.openDialog).toHaveBeenCalledTimes(1);
            const args = _popupHelper.openDialog.mock.calls[0];
            expect(args[1].opener).toBe(opener);
            expect(args[1].eventHandlers).toBe(dialogEventHandlers);
            expect(result).toBe(popupId);
         });
      });

      it('calls custom handlers', () => {
         const error = new Error();
         const viewConfig = {
            template: {},
            options: {}
         };

         return process({
            error,
            handlers: [
               () => {
                  return viewConfig;
               }
            ],
            _popupHelper
         }).then((result) => {
            expect(_popupHelper.openDialog).toHaveBeenCalledTimes(1);

            const args = _popupHelper.openDialog.mock.calls[0][0];
            expect(args).toEqual(viewConfig);
            expect(result).toBe(popupId);
         });
      });

      it('calls custom post-handlers', () => {
         const error = new Error();
         const viewConfig = {
            template: {},
            options: {}
         };

         return process({
            error,
            postHandlers: [
               () => {
                  return viewConfig;
               }
            ],
            _popupHelper
         }).then((result) => {
            expect(_popupHelper.openDialog).toHaveBeenCalledTimes(1);

            const args = _popupHelper.openDialog.mock.calls[0][0];
            expect(args).toEqual(viewConfig);
            expect(result).toBe(popupId);
         });
      });

      it('calls onProcess', () => {
         const error = new Error();
         const viewConfig = {
            template: {},
            options: {}
         };
         const onProcess = jest.fn();

         return process({
            error,
            handlers: [
               () => {
                  return viewConfig;
               }
            ],
            onProcess,
            _popupHelper
         }).then(() => {
            expect(onProcess).toHaveBeenCalledTimes(1);

            const result = onProcess.mock.calls[0][0];
            expect(result.template).toEqual(viewConfig.template);
            expect(result.options).toEqual(viewConfig.options);
            expect(onProcess.mock.invocationCallOrder[0]).toBeLessThan(
               _popupHelper.openDialog.mock.invocationCallOrder[0]
            );
         });
      });

      it('logs error on server side', () => {
         constants.isServerSide = true;

         const error = new Error();
         const viewConfig = {
            status: 123,
            template: {},
            options: {
               message: 'test message',
               details: 'test details'
            }
         };

         return process({
            error,
            handlers: [
               () => {
                  return viewConfig;
               }
            ],
            _popupHelper
         }).then(() => {
            expect(logger.error).toHaveBeenCalledTimes(1);

            const msg = logger.error.mock.calls[0][0];
            expect(typeof msg).toBe('string');
            expect(
               msg.startsWith(
                  'Error: Controls/error:process is being called during server-side rendering!\n' +
                     'Use Controls/dataSource:error.Container to render an error.\n' +
                     'Error config:\n' +
                     '{\n' +
                     '    "status": 123,\n' +
                     '    "options": {\n' +
                     '        "message": "test message",\n' +
                     '        "details": "test details"\n' +
                     '    }\n' +
                     '}'
               )
            ).toBeTruthy();

            expect(_popupHelper.openDialog).not.toHaveBeenCalled();
         });
      });
   });
});
