define(['Controls/_suggestPopup/Layer/__PopupLayer'], function (PopupLayer) {
   describe('Controls._suggestPopup.Layer.__PopupLayer', function () {
      it('_onResult', function () {
         const layer = new PopupLayer.default();
         const resultPopupOptions = {
            direction: {
               vertical: 'test',
               horizontal: 'test'
            },
            offset: {
               vertical: 10,
               horizontal: 20
            },
            targetPoint: { side: 'test' },
            fittingMode: 'fixed'
         };
         const resultOpenConfig = Object.assign(
            {
               opener: layer,
               actionOnScroll: 'close',
               target: undefined
            },
            resultPopupOptions
         );
         let openedWithConfig;

         layer._popupOptions = {};
         layer._children = {
            suggestPopup: {
               open: (cfg) => {
                  openedWithConfig = cfg;
               }
            }
         };

         layer._onResult(
            {},
            {
               direction: {
                  vertical: 'test',
                  horizontal: 'test'
               },
               offset: {
                  vertical: 10,
                  horizontal: 20
               },
               targetPoint: { side: 'test' }
            }
         );

         expect(resultPopupOptions).toEqual(layer._popupOptions);

         delete openedWithConfig.zIndex;
         expect(resultOpenConfig).toEqual(openedWithConfig);
      });

      it('_resizeCallback', function () {
         var layer = new PopupLayer.default();
         var resizeCalled = false;

         layer._children = {
            popupContent: {
               resize: () => {
                  resizeCalled = true;
               }
            }
         };

         layer._resizeCallback();
         expect(resizeCalled).toBe(true);

         resizeCalled = false;
         layer._children = {};
         layer._resizeCallback();
         expect(resizeCalled).toBe(false);
      });
   });
});
