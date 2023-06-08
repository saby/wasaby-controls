define(['Controls/error'], function ({ DialogOpener }) {
   describe('Controls/dataSource:error.DialogOpener', () => {
      let _popupHelper;
      let instance;
      const popupId = '42';

      beforeEach(() => {
         _popupHelper = {
            openDialog: jest.fn().mockResolvedValue(popupId),
            closeDialog: jest.fn().mockResolvedValue(undefined)
         };
         instance = new DialogOpener({ _popupHelper });
      });

      afterEach(() => {
         instance._popupId = null;
      });

      describe('getDialogOptions', () => {
         it('will not set popupId, if instance has no its own', () => {
            let options = instance.getDialogOptions({ id: 1 });
            expect(options.id).toBe(1);
         });

         it('will set popupId, if instance has no its own', () => {
            instance._popupId = 2;
            let options = instance.getDialogOptions({ id: 1 });
            expect(options.id).toBe(2);
         });

         it('resets _popupId on calling custom "onClose" event handler', () => {
            const onClose = jest.fn();
            const options = instance.getDialogOptions({
               eventHandlers: { onClose }
            });
            instance._popupId = '42';
            options.eventHandlers.onClose();
            expect(onClose).toHaveBeenCalledTimes(1);
            expect(instance._popupId).toBeNull();
         });
      });

      describe('open', () => {
         it("returns empty resolved Promise, when config wasn't passed", () => {
            return instance.open().then(
               (result) => {
                  return expect(result).not.toBeDefined();
               },
               () => {
                  return expect(false).toBe(true);
               }
            );
         });

         it('openDialog was called with proper args, sets popupId', () => {
            instance.getDialogOptions = jest
               .fn()
               .mockImplementation((...args) => {
                  return args[0];
               });
            const config = {};
            return instance.open(config, 'dialogOptions').then(() => {
               const args = _popupHelper.openDialog.mock.calls[0];
               expect(args[0]).toBe(config);
               expect(args[1]).toBe('dialogOptions');
               expect(instance._popupId).toBe(popupId);
            });
         });
      });

      describe('close', () => {
         it('calls closeDialog with proper args, when instance has _popupId', () => {
            instance._popupId = '1';
            return instance.close().then(() => {
               const args = _popupHelper.closeDialog.mock.calls[0];
               expect(args[0]).toBe('1');
            });
         });

         it('returns empty resolved Promise, when instance has no _popupId', () => {
            return instance.close().then(
               (result) => {
                  return expect(result).not.toBeDefined();
               },
               () => {
                  return expect(false).toBe(true);
               }
            );
         });
      });

      describe('destroy', () => {
         it('closes dialog and resets _popupId', () => {
            instance._popupId = '1';
            jest.spyOn(instance, 'close').mockClear();
            instance.destroy();
            expect(instance.close).toHaveBeenCalledTimes(1);
            expect(instance._popupId).toBeNull();
         });
      });
   });
});
