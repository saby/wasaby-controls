define(['Controls/popup', 'Controls/popupTemplate', 'Types/collection'], (
   popup,
   popupTemplate,
   collection
) => {
   'use strict';

   describe('Controls/Popup/InfoBoxController', () => {
      it('InfoBoxController: getDefaultConfig', () => {
         let item = {
            popupOptions: {
               position: 'tl'
            }
         };
         popupTemplate.InfoBoxController.getDefaultConfig(item);
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
                  closest: () => {
                     return false;
                  }
               }
            }
         };
         popupTemplate.InfoBoxController._isTargetVisible = () => {
            return true;
         };
         let prepareConfig = popupTemplate.InfoBoxController._prepareConfig;
         popupTemplate.InfoBoxController.prepareConfig = (i, cont) => {
            expect(i).toEqual(item);
            expect(cont).toEqual(container);
            return true;
         };
         let prepareConfigPublic =
            popupTemplate.InfoBoxController.prepareConfig;
         popupTemplate.InfoBoxController.elementCreated(item, container);
         popupTemplate.InfoBoxController._prepareConfig = prepareConfig;
         popupTemplate.InfoBoxController.prepareConfig = prepareConfigPublic;
         expect(container.style.maxWidth).toEqual(100);
         expect(item.position.maxWidth).not.toBeDefined();
         popupTemplate.InfoBoxController.elementDestroyed(item);
      });

      it('getCustomZIndex', () => {
         let popupList = new collection.List();
         let infoBoxItem = {
            id: 2,
            parentZIndex: 10
         };
         popupList.add({
            id: 1,
            currentZIndex: 10
         });
         popupList.add(infoBoxItem);
         const zIndexCallback = popup.Infobox._getInfoBoxConfig(
            {}
         ).zIndexCallback;
         let zIndex = zIndexCallback(infoBoxItem, popupList);
         expect(zIndex).toEqual(11);
         infoBoxItem.parentZIndex = null;
         zIndex = zIndexCallback(infoBoxItem, popupList);
         expect(zIndex).toBeUndefined();
         popupList.destroy();
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
         Infobox.saveOptions(config);
         let newConfig = Infobox._getConfig();

         expect(newConfig.floatCloseButton).toEqual(true);
         expect(newConfig.borderStyle).toEqual('error');
         expect(newConfig.position).toEqual('tl');
         expect(newConfig.template).toEqual(popup.PreviewerTemplate);
      });

      it('PopupInfoBox: getDefaultOptions', () => {
         let config = {
            showIndicator: false,
            closePopupBeforeUnmount: true,
            actionOnScroll: 'close'
         };
         let newConfig = popup.Infobox.getDefaultOptions();

         expect(newConfig).toEqual(config);
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
               let offset = popupTemplate.InfoBoxController._getOffset(
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
         popupTemplate.InfoBoxController._getOffset = (height) => {
            offsetHeight = height;
         };
         let target = {
            offsetHeight: 100,
            offsetWidth: 100
         };
         popupTemplate.InfoBoxController._getVerticalOffset(target, false);
         expect(offsetHeight).toEqual(100);
         offsetHeight = null;
         popupTemplate.InfoBoxController._getHorizontalOffset(target, true);
         expect(offsetHeight).toEqual(100);

         target = {
            clientHeight: 200,
            clientWidth: 200
         };

         popupTemplate.InfoBoxController._getVerticalOffset(target, false);
         expect(offsetHeight).toEqual(200);
         offsetHeight = null;
         popupTemplate.InfoBoxController._getHorizontalOffset(target, true);
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
         expect(popupTemplate.InfoBox.prototype._arrowPosition).toEqual(
            'start'
         );

         stickyPosition = getStickyPosition('right', 'top', 'left', 'top');
         popupTemplate.InfoBox.prototype._beforeUpdate({ stickyPosition });
         expect(popupTemplate.InfoBox.prototype._arrowSide).toEqual('bottom');
         expect(popupTemplate.InfoBox.prototype._arrowPosition).toEqual(
            'start'
         );

         stickyPosition = getStickyPosition(
            'left',
            'bottom',
            'right',
            'bottom'
         );
         popupTemplate.InfoBox.prototype._beforeUpdate({ stickyPosition });
         expect(popupTemplate.InfoBox.prototype._arrowSide).toEqual('top');
         expect(popupTemplate.InfoBox.prototype._arrowPosition).toEqual('end');
      });
   });
});
