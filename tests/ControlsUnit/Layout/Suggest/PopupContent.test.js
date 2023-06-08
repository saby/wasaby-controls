define(['Controls/_suggestPopup/Layer/__PopupContent'], function (
   PopupContent
) {
   describe('Controls._suggestPopup.Layer.__PopupContent', function () {
      it('_beforeUpdate', function () {
         let layer = new PopupContent.default(),
            optionsReverseList = {
               stickyPosition: {
                  direction: {
                     vertical: 'top'
                  }
               },
               showContent: true
            };

         layer.saveOptions({
            showContent: false
         });

         layer._beforeUpdate({ showContent: true });
         expect(layer._shouldScrollToBottom).toBe(false);
         expect(layer._pendingShowContent).toBe(true);

         layer._showContent = false;
         layer._beforeUpdate(optionsReverseList);
         expect(layer._shouldScrollToBottom).toBe(true);
         expect(layer._showContent).toBe(false);
         expect(layer._pendingShowContent).toBe(true);

         layer._showContent = true;
         layer._shouldScrollToBottom = false;
         layer._beforeUpdate(optionsReverseList);
         expect(layer._shouldScrollToBottom).toBe(false);
      });

      it('afterUpdate', function () {
         var options = {
            showContent: true
         };

         var oldOptions = {
            showContent: false
         };

         var layer = new PopupContent.default();
         var resized = false;
         var resultSended = false;

         layer.saveOptions(options);
         layer._notify = function (eventName) {
            if (eventName === 'controlResize') {
               resized = true;
            }

            if (eventName === 'sendResult') {
               resultSended = true;
            }
         };

         layer._showContent = false;
         layer._afterUpdate(oldOptions);

         expect(resized).toBe(true);
         expect(resultSended).toBe(false);
         expect(layer._showContent).toBe(false);

         layer._showContent = true;
         layer._afterUpdate(oldOptions);

         expect(resultSended).toBe(true);

         resultSended = false;
         layer._positionFixed = true;
         layer._pendingShowContent = true;
         layer._afterUpdate(oldOptions);
         expect(resultSended).toBe(false);
         expect(layer._showContent).toBe(true);
         expect(layer._pendingShowContent).toBeNull();

         layer.saveOptions(oldOptions);
         layer._showContent = true;
         layer._positionFixed = false;
         layer._afterUpdate(oldOptions);
         expect(resultSended).toBe(true);
         expect(layer._positionFixed).toBe(true);
      });

      it('resize', function () {
         let isScrollToBottom = false,
            layer = new PopupContent.default();

         layer._children = {
            scrollContainer: {
               scrollToBottom: () => {
                  isScrollToBottom = true;
               }
            }
         };

         layer.resize();
         expect(isScrollToBottom).toBe(false);

         layer._reverseList = true;
         layer.resize();
         expect(isScrollToBottom).toBe(true);
      });

      it('_private.getSuggestWidth', function () {
         var originGetBorderWidth =
            PopupContent.default._private.getBorderWidth;
         PopupContent.default._private.getBorderWidth = function () {
            return 2;
         };
         PopupContent.default._private.getPopupOffsets = function () {
            return 24;
         };

         var target = {
            offsetWidth: 50
         };
         var container = {};

         expect(
            PopupContent.default._private.getSuggestWidth(target, container)
         ).toEqual(72);

         container = null;
         expect(
            PopupContent.default._private.getSuggestWidth(target, container)
         ).toEqual(72);
         PopupContent.default._private.getBorderWidth = originGetBorderWidth;
      });

      it('_afterRender', function () {
         const layer = new PopupContent.default();
         let isScrollToBottom = false;

         layer._children = {
            scrollContainer: {
               scrollToBottom: () => {
                  isScrollToBottom = true;
               }
            }
         };

         layer._afterRender();
         expect(isScrollToBottom).toBe(false);

         layer._shouldScrollToBottom = true;
         layer._afterRender();
         expect(isScrollToBottom).toBe(true);
      });
   });
});
