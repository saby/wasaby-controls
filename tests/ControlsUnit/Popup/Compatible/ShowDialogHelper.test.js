define(['Controls/compatiblePopup'], function (compatiblePopup) {
   'use strict';

   describe('Controls/compatiblePopup:ShowDialogHelper', function () {
      it('_prepareDeps', function () {
         var config = {
               isStack: true,
               target: 'testTarget'
            },
            deps;
         deps = compatiblePopup.ShowDialogHelper._private.prepareDeps(config);
         expect(deps.indexOf('Controls/popup') !== -1).toBe(true);
         expect(deps.indexOf('Controls/popupTemplateStrategy') !== -1).toBe(true);
         // eslint-disable-next-line
         expect(config._path === 'StackController').toBe(true);
         // eslint-disable-next-line
         expect(config._type === 'stack').toBe(true);
         delete config.isStack;
         deps = compatiblePopup.ShowDialogHelper._private.prepareDeps(config);
         expect(deps.indexOf('Controls/popupTemplateStrategy') !== -1).toBe(true);
         // eslint-disable-next-line
         expect(config._path === 'StickyController').toBe(true);
         // eslint-disable-next-line
         expect(config._type === 'sticky').toBe(true);
         delete config.target;
         deps = compatiblePopup.ShowDialogHelper._private.prepareDeps(config);
         expect(deps.indexOf('Controls/popupTemplateStrategy') !== -1).toBe(true);
         // eslint-disable-next-line
         expect(config._path === 'DialogController').toBe(true);
         // eslint-disable-next-line
         expect(config._popupComponent).toEqual('floatArea');
         // eslint-disable-next-line
         expect(config._type === 'dialog').toBe(true);
      });
   });
});
