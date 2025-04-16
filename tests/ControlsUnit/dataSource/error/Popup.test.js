/**
 * @jest-environment node
 */
define([
   'Controls/dataSource',
   'Env/Env',
   'WasabyLoader/Library',
   'RequireJsLoader/conduct',
   'Browser/Transport'
], function (dataSource, { constants }, WasabyLib, conduct) {
   // eslint-disable-next-line no-undef
   const require = requirejs;
   describe('Controls/dataSource:error.Popup', () => {
      const Popup = dataSource.error.Popup;
      const eventHandlers = {};
      const fakeModules = [
         [
            'FakePopupModule1',
            () => {
               return {
                  name: 'FakePopupModule1',
                  Confirmation: {
                     openPopup: jest.fn().mockResolvedValue(0)
                  },
                  Dialog: {
                     openPopup: jest.fn((dialogOptions) => {
                        delete eventHandlers.onClose;
                        delete eventHandlers.onResult;

                        if (dialogOptions && dialogOptions.eventHandlers) {
                           eventHandlers.onClose = dialogOptions.eventHandlers.onClose;
                           eventHandlers.onResult = dialogOptions.eventHandlers.onResult;
                        }

                        return Promise.resolve(String(Date.now()));
                     }),
                     closePopup: jest.fn(() => {
                        if (typeof eventHandlers.onResult === 'function') {
                           eventHandlers.onResult();
                        }

                        if (typeof eventHandlers.onClose === 'function') {
                           eventHandlers.onClose();
                        }
                     })
                  }
               };
            }
         ],
         [
            'FakePopupModule2',
            () => {
               return { name: 'FakePopupModule2' };
            }
         ],
         [
            'FakePopupModule3',
            () => {
               return { name: 'FakePopupModule3' };
            }
         ],
         [
            'FakePopupModule4',
            () => {
               return { name: 'FakePopupModule4' };
            }
         ]
      ];
      const fakeModuleNames = fakeModules.map(([name]) => {
         return name;
      });
      const defineModule = ([name, definition]) => {
         return define(name, [], definition);
      };
      const undefModule = ([name]) => {
         return require.undef(name);
      };
      const importThemes = (modules) => {
         return new Promise((resolve, reject) => {
            require(modules, (...args) => {
               return resolve(args);
            }, reject);
         });
      };

      let originalModules;
      let originalImportThemes;
      let spyIsModule;

      beforeEach(() => {
         originalModules = Popup.POPUP_MODULES;
         originalImportThemes = Popup.importThemes;
         spyIsModule = jest.spyOn(conduct.ModulesManager, 'isModule').mockReturnValue(true);
         Popup.importThemes = importThemes;
         fakeModules.forEach(defineModule);
      });

      afterEach(() => {
         fakeModules.forEach(undefModule);
         spyIsModule.mockRestore();
         Popup.POPUP_MODULES = originalModules;
         Popup.importThemes = originalImportThemes;
      });

      describe('preloadPopup()', () => {
         it('loads default modules', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0], fakeModuleNames[1]];
            const p = new Popup([], [fakeModuleNames[2], fakeModuleNames[3]]);
            return p.preloadPopup().then((result) => {
               expect(result.name).toBe(fakeModuleNames[0]);
            });
         });

         it('loads additional modules', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            const p = new Popup([fakeModuleNames[2]], [fakeModuleNames[1], fakeModuleNames[3]]);
            return p.preloadPopup().then((result) => {
               expect(result.name).toBe(fakeModuleNames[0]);
            });
         });

         it('result fulfilled with undefined', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            const p = new Popup([], ['FakeFailModule1']);
            return p.preloadPopup().then((result) => {
               expect(result).not.toBeDefined();
            });
         });
      });

      describe('openConfirmation()', () => {
         it('calls openPopup()', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            const p = new Popup([], [fakeModuleNames[1]]);
            const options = {};
            return p.openConfirmation(options).then(() => {
               const popup = require(fakeModuleNames[0]);
               expect(popup.Confirmation.openPopup).toHaveBeenCalledTimes(1);
               expect(popup.Confirmation.openPopup.mock.calls[0][0]).toBe(options);
            });
         });

         it('calls showDefaultDialog()', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            const p = new Popup([], ['FakeFailModule1']);
            jest.spyOn(Popup, 'showDefaultDialog').mockClear().mockImplementation();
            const options = { message: 'test' };
            return p.openConfirmation(options).then(() => {
               const popup = require(fakeModuleNames[0]);
               expect(popup.Confirmation.openPopup).not.toHaveBeenCalled();
               expect(Popup.showDefaultDialog).toHaveBeenCalledTimes(1);
               expect(Popup.showDefaultDialog.mock.calls[0][0]).toBe(options.message);
            });
         });
      });

      describe('openDialog()', () => {
         let p;

         beforeEach(() => {
            jest.spyOn(Popup, 'showDefaultDialog').mockClear().mockImplementation();
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            p = new Popup([], [fakeModuleNames[1]]);
            jest
               .spyOn(p, 'openConfirmation')
               .mockClear()
               .mockImplementation()
               .mockResolvedValue(undefined);
         });

         it('calls openPopup()', () => {
            const viewConfig = {
               template: {},
               options: {}
            };
            const opener = {};
            const eventHandlers1 = {};
            return p
               .openDialog(viewConfig, {
                  opener,
                  eventHandlers: eventHandlers1
               })
               .then(() => {
                  const popup = require(fakeModuleNames[0]);
                  expect(popup.Dialog.openPopup).toHaveBeenCalledTimes(1);
                  const cfg = popup.Dialog.openPopup.mock.calls[0][0];
                  expect(cfg.template).toBe(viewConfig.template);
                  expect(cfg.options).toBe(viewConfig.templateOptions);
                  expect(cfg.opener).toBe(opener);
                  expect(cfg.eventHandlers).toBe(eventHandlers1);
                  expect(cfg.modal).toBe(true);
               });
         });

         it('calls openConfirmation with proper arguments if gets on template in config', () => {
            const config = {
               options: {
                  message: 'message',
                  details: 'details'
               }
            };
            return p.openDialog(config).then(() => {
               expect(p.openConfirmation).toHaveBeenCalledTimes(1);
               expect(p.openConfirmation.mock.calls[0][0]).toEqual({
                  type: 'ok',
                  style: 'danger',
                  message: config.options.message
               });
            });
         });

         it('calls showDefaultDialog()', () => {
            p.themes = ['FakeFailModule1'];
            const config = {
               template: 'template',
               options: {
                  message: 'message',
                  details: 'details'
               }
            };
            return p.openDialog(config).then(() => {
               const popup = require(fakeModuleNames[0]);
               expect(popup.Dialog.openPopup).not.toHaveBeenCalled();
               expect(Popup.showDefaultDialog).toHaveBeenCalledTimes(1);
               expect(Popup.showDefaultDialog.mock.calls[0]).toEqual([
                  config.options.message,
                  config.options.details
               ]);
            });
         });

         it('combines dialogTemplate options with templateOptions', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            const dialogTmplOptions = { dialogOption: 'dialogTemplateOption' };
            const dialogOptions = {
               templateOptions: dialogTmplOptions,
               handler: 42
            };
            const viewConfig = {
               template: () => {
                  return null;
               },
               options: { configOption: 'configTemplateOption' }
            };
            const popup = new Popup([], [fakeModuleNames[1]]);
            return popup.openDialog(viewConfig, dialogOptions).then(() => {
               const popup1 = require(fakeModuleNames[0]);
               const cfg = popup1.Dialog.openPopup.mock.calls[0][0];
               expect(cfg.templateOptions.dialogOption).toBe(dialogTmplOptions.dialogOption);
               expect(cfg.templateOptions.configOption).toBe(viewConfig.options.configOption);
               expect(cfg.handler).toBe(dialogOptions.handler);
            });
         });

         it('if config contains string template, it will load this and opens popup', () => {
            const viewConfig = { template: fakeModuleNames[2], options: {} };
            return p.openDialog(viewConfig, {}).then(() => {
               const popup = require(fakeModuleNames[0]);
               expect(popup.Dialog.openPopup).toHaveBeenCalledTimes(1);
               return WasabyLib.load(fakeModuleNames[2]).then((module) => {
                  expect(module).toBeDefined();
               });
            });
         });

         it('if config contains falsy string template, it will opens default popup', () => {
            const fakeModuleName = 'fakeModuleName';
            const viewConfig = { template: fakeModuleName, options: {} };
            return p.openDialog(viewConfig, {}).then(() => {
               const popup = require(fakeModuleNames[0]);
               expect(popup.Confirmation.openPopup).not.toHaveBeenCalled();
               expect(Popup.showDefaultDialog).toHaveBeenCalledTimes(1);
               return WasabyLib.load(fakeModuleName).then(
                  () => {
                     return expect(false).toBe(true);
                  },
                  (error) => {
                     return expect(error).toBeTruthy();
                  }
               );
            });
         });
      });

      describe('showDefaultDialog()', () => {
         const globalObject =
            typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {};
         const originalIsBrowser = constants.isBrowserPlatform;
         const originalAlert = globalObject.alert;

         beforeEach(() => {
            globalObject.alert = jest.fn();
         });

         afterEach(() => {
            constants.isBrowserPlatform = originalIsBrowser;
            globalObject.alert = originalAlert;
         });

         it('does nothing on server side', function () {
            Popup.showDefaultDialog();
            expect(globalObject.alert).not.toHaveBeenCalled();
         });

         it('calls alert with message', () => {
            constants.isBrowserPlatform = true;
            const message = 'message';
            Popup.showDefaultDialog(message);
            expect(globalObject.alert).toHaveBeenCalledTimes(1);
            expect(globalObject.alert).toHaveBeenCalledWith(message);
         });

         it('calls alert with message and details', () => {
            constants.isBrowserPlatform = true;
            const message = 'message';
            const details = 'details';
            Popup.showDefaultDialog(message, details);
            expect(globalObject.alert).toHaveBeenCalledTimes(1);
            expect(globalObject.alert).toHaveBeenCalledWith(`${message}\n${details}`);
         });
      });

      describe('closeDialog()', () => {
         it('does nothing if popupId is empty', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            const p = new Popup();
            return p.closeDialog(undefined).then(() => {
               const popup = require(fakeModuleNames[0]);
               expect(popup.Dialog.closePopup).not.toHaveBeenCalled();
            });
         });

         it('does nothing if popup modules was not loaded', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            const p = new Popup([], ['FakeFailModule1']);
            return p.closeDialog('testPopupId').then(() => {
               const popup = require(fakeModuleNames[0]);
               expect(popup.Dialog.closePopup).not.toHaveBeenCalled();
            });
         });

         it('calls closePopup()', () => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            const popupId = String(Date.now());
            const p = new Popup();
            return p.closeDialog(popupId).then(() => {
               const popup = require(fakeModuleNames[0]);
               expect(popup.Dialog.closePopup).toHaveBeenCalledTimes(1);
               expect(popup.Dialog.closePopup).toHaveBeenCalledWith(popupId);
            });
         });
      });

      describe('event handlers on close', () => {
         let p;
         let config;
         let onClose;
         let onResult;
         let dialogOptions;

         beforeEach(() => {
            Popup.POPUP_MODULES = [fakeModuleNames[0]];
            p = new Popup([fakeModuleNames[0]]);
            onClose = jest.fn();
            onResult = jest.fn();
            dialogOptions = { eventHandlers: { onClose, onResult } };
            config = {
               template: {},
               options: { message: 'message', details: 'details' }
            };
         });

         it('calls event handlers after dialog closing', () => {
            return p
               .openDialog(config, dialogOptions)
               .then((popupId) => {
                  return p.closeDialog(popupId);
               })
               .then(() => {
                  expect(onResult.mock.invocationCallOrder[0]).toBeLessThan(
                     onClose.mock.invocationCallOrder[0]
                  );
               });
         });

         it('calls event handlers after confirmation closing', () => {
            delete config.template;

            return p.openDialog(config, dialogOptions).then(() => {
               expect(onResult.mock.invocationCallOrder[0]).toBeLessThan(
                  onClose.mock.invocationCallOrder[0]
               );
            });
         });
      });
   });
});
