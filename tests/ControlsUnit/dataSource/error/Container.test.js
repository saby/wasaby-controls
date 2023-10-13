define(['Controls/dataSource'], function (dataSource) {
   describe('Controls/dataSource:error.Container', function () {
      const Container = dataSource.error.Container;
      let instance;

      function mockPopupHelper(popupId) {
         instance._popupHelper = {
            openDialog(config, { eventHandlers }) {
               this._onClose = eventHandlers && eventHandlers.onClose;
               return Promise.resolve(popupId);
            },
            closeDialog(id) {
               if (id === popupId && typeof this._onClose === 'function') {
                  this._onClose();
               }
            }
         };
      }

      function createInstance() {
         instance = new Container();
         jest.spyOn(instance, '_notify').mockClear().mockImplementation();
         mockPopupHelper();
      }

      function getViewConfig(mode, options = {}) {
         return {
            mode,
            options,
            template: 'template',
            status: undefined,
            getVersion: () => {
               return Date.now();
            }
         };
      }

      it('is defined', function () {
         expect(Container).toBeDefined();
      });

      it('is constructor', function () {
         expect(typeof Container).toBe('function');
         createInstance();
         expect(instance).toBeInstanceOf(Container);
      });

      // describe('_openDialog()', function() {
      //    beforeEach(() => {
      //       createInstance();
      //    });
      //
      //    it('notifies "dialogClosed" on closing opened dialog', function() {
      //       const popupId = String(Date.now());
      //       const config = {};
      //       mockPopupHelper(popupId);
      //       return instance._openDialog(config).then(() => {
      //          assert.strictEqual(instance._popupId, popupId, 'saves popupId');
      //
      //          // Диалог открылся. Теперь эмулируем закрытие диалога.
      //          instance._popupHelper.closeDialog(popupId);
      //          assert.isNotOk(instance._popupId, 'clears popupId');
      //          assert.isTrue(instance._notify.calledOnceWith('dialogClosed', []), 'notifies "dialogClosed"');
      //       });
      //    });
      // });

      describe('_beforeUpdate()', () => {
         let viewConfig;

         beforeEach(() => {
            createInstance();
            viewConfig = getViewConfig('include');
         });

         it('sets new viewConfig when it comes', () => {
            instance._viewConfig = null;
            instance._options.viewConfig = null;

            instance._beforeUpdate({ viewConfig });

            expect(instance._viewConfig).not.toBeNull();
         });

         it('sets new viewConfig when it comes (deep comparison)', () => {
            instance._viewConfig = null;
            instance._options.viewConfig = viewConfig;

            const newConfig = getViewConfig('include', { image: '42' });
            instance._beforeUpdate({ viewConfig: newConfig });

            expect(instance._viewConfig).not.toBeNull();
            expect(instance._viewConfig.options.image).toBe('42');
         });

         it('resets viewConfig', () => {
            instance._viewConfig = viewConfig;
            instance._options.viewConfig = viewConfig;

            instance._beforeUpdate({ viewConfig: undefined });

            expect(instance._viewConfig).toBeNull();
         });

         it('does not set new viewConfig when options.viewConfig are equal', () => {
            instance._viewConfig = null;
            instance._options.viewConfig = viewConfig;
            instance._beforeUpdate({ viewConfig });

            expect(instance._viewConfig).toBeNull();
         });

         // it('resets new viewConfig when options.viewConfig mode is dialog', () => {
         //    instance.__viewConfig = {};
         //    viewConfig.mode = 'include';
         //    instance._options.viewConfig = viewConfig;
         //    instance._beforeUpdate({ viewConfig });
         //
         //    assert.isNotNull(instance.__viewConfig);
         //
         //    viewConfig.mode = 'dialog';
         //    instance._beforeUpdate({ viewConfig });
         //
         //    assert.isNull(instance.__viewConfig);
         // });

         it('updates list options in inlist mode', () => {
            const options = { viewConfig };
            viewConfig.mode = 'inlist';
            instance._beforeUpdate(options);
            expect(instance._viewConfig.options.listOptions).toBe(options);
         });

         it('inlist mode: sets new list options when options viewConfig are equal', () => {
            const options = {
               viewConfig: getViewConfig('inlist', {}),
               someListsOptions: 42
            };

            instance._viewConfig = viewConfig;
            instance._options.viewConfig = viewConfig;

            instance._beforeUpdate(options);

            expect(instance._viewConfig.options.listOptions).toBe(options);
         });
      });

      describe('_updateInlistOptions()', () => {
         let viewConfig;
         let options;

         beforeEach(() => {
            createInstance();
            viewConfig = getViewConfig('inlist', {});
            options = {};
            instance._viewConfig = viewConfig;
         });

         it('updates viewConfig options object', () => {
            const oldViewConfigOptions = instance._viewConfig.options;
            instance._updateInlistOptions(options);
            expect(instance._viewConfig.options).not.toBe(oldViewConfigOptions);
         });

         it('sets viewConfig options as passed options', () => {
            instance._updateInlistOptions(options);
            expect(instance._viewConfig.options.listOptions).toBe(options);
         });
      });

      describe('_updateConfig()', () => {
         let viewConfig;
         let options;

         beforeEach(() => {
            createInstance();
            viewConfig = getViewConfig('include', {});
            options = { viewConfig };
            instance._viewConfig = null;
         });

         it('sets new viewConfig from passed options', () => {
            instance._updateConfig(options.viewConfig);
            expect(instance._viewConfig).toBeDefined();
         });

         it('sets correct showed flag for viewConfig', () => {
            [
               [true, 'include', true],
               [true, 'dialog', true],
               [false, 'include', true],
               [false, 'dialog', false]
            ].forEach(([isShown, mode, result]) => {
               viewConfig.isShown = isShown;
               viewConfig.mode = mode;
               instance._updateConfig(viewConfig);
               expect(instance._viewConfig.isShown).toBe(result);
            });
         });

         it('does not update list options in non-inlist mode', () => {
            instance._updateConfig(options.viewConfig);
            expect(instance._viewConfig.options.listOptions).not.toBeDefined();
         });
      });
   });
});
