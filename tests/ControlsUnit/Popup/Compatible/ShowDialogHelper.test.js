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
         expect(deps.indexOf('Controls/popupTemplate') !== -1).toBe(true);
         expect(config._path === 'StackController').toBe(true);
         expect(config._type === 'stack').toBe(true);
         delete config.isStack;
         deps = compatiblePopup.ShowDialogHelper._private.prepareDeps(config);
         expect(deps.indexOf('Controls/popupTemplate') !== -1).toBe(true);
         expect(config._path === 'StickyController').toBe(true);
         expect(config._type === 'sticky').toBe(true);
         delete config.target;
         deps = compatiblePopup.ShowDialogHelper._private.prepareDeps(config);
         expect(deps.indexOf('Controls/popupTemplate') !== -1).toBe(true);
         expect(config._path === 'DialogController').toBe(true);
         expect(config._popupComponent).toEqual('floatArea');
         expect(config._type === 'dialog').toBe(true);
      });
   });
});
