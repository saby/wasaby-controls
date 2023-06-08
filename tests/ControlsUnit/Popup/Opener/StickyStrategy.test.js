define(['Controls/_popupTemplate/Sticky/StickyStrategy'], (StickyStrategy) => {
   'use strict';

   // eslint-disable-next-line no-param-reassign
   StickyStrategy = StickyStrategy.default;

   describe('visualViewPort', () => {
      it('checkOverflow', () => {
         let getWindowSizes = StickyStrategy._getWindowSizes;
         let getVisualViewPort = StickyStrategy._getVisualViewport;
         StickyStrategy._getVisualViewport = () => {
            return {
               width: 1000,
               offsetLeft: 0,
               pageLeft: 80,
               offsetTop: 0,
               pageTop: 699
            };
         };
         StickyStrategy._getWindowSizes = () => {
            return {
               width: 1024,
               height: 1040
            };
         };
         let targetCoords = {
            left: 989,
            leftScroll: 0
         };
         let popupCfg = {
            targetPoint: {
               horizontal: 'left',
               vertical: 'top'
            },
            direction: {
               horizontal: 'right',
               vertical: 'bottom'
            },
            fittingMode: {
               horizontal: 'adaptive',
               vertical: 'adaptive'
            },
            sizes: {
               width: 120,
               height: 120
            }
         };
         let position = {
            left: 989,
            top: 1400
         };

         // окно открывается вправо, но не умещается из-за своих размеров
         let overflow = StickyStrategy._checkOverflow(
            popupCfg,
            targetCoords,
            position,
            'horizontal'
         );
         expect(overflow).toBe(85);

         overflow = StickyStrategy._checkOverflow(
            popupCfg,
            targetCoords,
            position,
            'vertical'
         );
         expect(overflow).toBe(-219);

         // страница зазумлена, но это влиять на ширину не должно
         StickyStrategy._getVisualViewport = () => {
            return {
               width: 1000,
               offsetLeft: 200,
               pageLeft: 200
            };
         };

         overflow = StickyStrategy._checkOverflow(
            popupCfg,
            targetCoords,
            position,
            'horizontal'
         );
         expect(overflow).toBe(85);

         StickyStrategy._getVisualViewport = getVisualViewPort;
         StickyStrategy._getWindowSizes = getWindowSizes;
      });
   });
});
