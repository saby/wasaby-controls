define(['Controls/popupTargets', 'Controls/popupTemplate', 'Controls/popupTemplateStrategy'], (
   popup,
   popupTemplate,
   popupStrategy
) => {
   'use strict';

   describe('Controls/Popup/InfoBoxController', () => {
      new popupStrategy.Controller().init();
      it('InfoBoxController: getDefaultConfig', () => {
         let item = {
            popupOptions: {
               position: 'tl'
            }
         };
         popupStrategy.InfoBoxController.getDefaultConfig(item);
         expect(item.position.top).toEqual(-10000);
         expect(item.position.left).toEqual(-10000);
         expect(item.position.right).toBeUndefined();
         expect(item.position.bottom).toBeUndefined();
      });
      it('InfoBoxController: elementCreated', () => {
         let container = {
            style: {
               maxWidth: 100
            }
         };
         let item = {
            position: {
               maxWidth: 20
            },
            popupOptions: {
               maxWidth: 50,
               target: {
                  getBoundingClientRect: () => {
                     return {
                        top: 0,
                        bottom: 0,
                        width: 100,
                        height: 100
                     };
                  },
                  closest: () => {
                     return false;
                  }
               }
            }
         };
         popupStrategy.InfoBoxController._isTargetVisible = () => {
            return true;
         };
         let prepareConfig = popupStrategy.InfoBoxController._prepareConfig;
         popupStrategy.InfoBoxController.prepareConfig = (i, cont) => {
            expect(i).toEqual(item);
            expect(cont).toEqual(container);
            return true;
         };
         let prepareConfigPublic = popupStrategy.InfoBoxController.prepareConfig;
         popupStrategy.InfoBoxController.elementCreated(item, container);
         popupStrategy.InfoBoxController._prepareConfig = prepareConfig;
         popupStrategy.InfoBoxController.prepareConfig = prepareConfigPublic;
         expect(container.style.maxWidth).toEqual(100);
         expect(item.position.maxWidth).not.toBeDefined();
         popupStrategy.InfoBoxController.elementDestroyed(item);
      });
   });

   describe('Controls/_popup/InfoBox', () => {
      it('PopupInfoBox: getConfig', () => {
         let config = {
            floatCloseButton: true,
            borderStyle: 'error',
            position: 'tl',
            template: popup.PreviewerTemplate,
            showDelay: 300
         };
         let Infobox = new popup.InfoboxTarget(config);
         let newConfig = Infobox._getConfig();

         expect(newConfig.floatCloseButton).toEqual(true);
         expect(newConfig.borderStyle).toEqual('error');
         expect(newConfig.position).toEqual('tl');
         expect(newConfig.template).toEqual(popup.PreviewerTemplate);
      });

      describe('InfoBoxController: check position', () => {
         let arrowOffset = 12;
         let arrowWidth = 16;

         let tests = [
            {
               cfg: {
                  targetWidth: 10,
                  alignSide: 'l'
               },
               value: -15
            },
            {
               cfg: {
                  targetWidth: 10,
                  alignSide: 'c'
               },
               value: 0
            },
            {
               cfg: {
                  targetWidth: 10,
                  alignSide: 'r'
               },
               value: 15
            },
            {
               cfg: {
                  targetWidth: 100,
                  alignSide: 'r'
               },
               value: 0
            }
         ];

         tests.forEach((test) => {
            it('align: ' + JSON.stringify(test.cfg), () => {
               let offset = popupStrategy.InfoBoxController._getOffset(
                  test.cfg.targetWidth,
                  test.cfg.alignSide,
                  arrowOffset,
                  arrowWidth
               );
               expect(offset).toEqual(test.value);
            });
         });
      });

      it('InfoBoxController: calculate offset target size', () => {
         let offsetHeight;
         popupStrategy.InfoBoxController._getOffset = (height) => {
            offsetHeight = height;
         };
         let target = {
            offsetHeight: 100,
            offsetWidth: 100
         };
         popupStrategy.InfoBoxController._getVerticalOffset(target, false);
         expect(offsetHeight).toEqual(100);
         offsetHeight = null;
         popupStrategy.InfoBoxController._getHorizontalOffset(target, true);
         expect(offsetHeight).toEqual(100);

         target = {
            clientHeight: 200,
            clientWidth: 200
         };

         popupStrategy.InfoBoxController._getVerticalOffset(target, false);
         expect(offsetHeight).toEqual(200);
         offsetHeight = null;
         popupStrategy.InfoBoxController._getHorizontalOffset(target, true);
         expect(offsetHeight).toEqual(200);
      });
   });

   describe('Controls/Popup/Template/InfoBox', () => {
      let getStickyPosition = (hAlign, vAlign, hCorner, vCorner) => {
         return {
            direction: {
               horizontal: hAlign,
               vertical: vAlign
            },
            targetPoint: {
               vertical: vCorner,
               horizontal: hCorner
            }
         };
      };
      it('InfoBoxTemplate: beforeUpdate', () => {
         let stickyPosition = getStickyPosition('left', 'top', 'left');
         popupTemplate.InfoBox.prototype._beforeUpdate({ stickyPosition });
         expect(popupTemplate.InfoBox.prototype._arrowSide).toEqual('right');
         expect(popupTemplate.InfoBox.prototype._arrowPosition).toEqual('end');

         stickyPosition = getStickyPosition('right', 'bottom', 'right');
         popupTemplate.InfoBox.prototype._beforeUpdate({ stickyPosition });
         expect(popupTemplate.InfoBox.prototype._arrowSide).toEqual('left');
         expect(popupTemplate.InfoBox.prototype._arrowPosition).toEqual('start');

         stickyPosition = getStickyPosition('right', 'top', 'left', 'top');
         popupTemplate.InfoBox.prototype._beforeUpdate({ stickyPosition });
         expect(popupTemplate.InfoBox.prototype._arrowSide).toEqual('bottom');
         expect(popupTemplate.InfoBox.prototype._arrowPosition).toEqual('start');

         stickyPosition = getStickyPosition('left', 'bottom', 'right', 'bottom');
         popupTemplate.InfoBox.prototype._beforeUpdate({ stickyPosition });
         expect(popupTemplate.InfoBox.prototype._arrowSide).toEqual('top');
         expect(popupTemplate.InfoBox.prototype._arrowPosition).toEqual('end');
      });
   });
});
