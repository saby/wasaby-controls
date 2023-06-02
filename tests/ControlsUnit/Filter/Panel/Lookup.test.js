define(['Controls/_filterPopup/Panel/Lookup', 'UI/Utils'], function (
   PanelLookup,
   UIUtils
) {
   describe('Controls/_filterPopup/Panel/Lookup', function () {
      it('_afterUpdate', function () {
         var isActivate = false,
            callResize = false,
            panelLookup = new PanelLookup.default();

         panelLookup._options.selectedKeys = [];
         panelLookup._options.lookupTemplateName = 'string';
         panelLookup._children.controlResize = {
            start: function () {
               callResize = true;
            }
         };
         panelLookup._children.lookup = {
            activate: function () {
               isActivate = true;
            }
         };

         panelLookup._afterUpdate({ selectedKeys: [] });
         expect(callResize).toBe(false);
         expect(isActivate).toBe(false);

         panelLookup._afterUpdate({ selectedKeys: [2] });
         expect(callResize).toBe(false);
         expect(isActivate).toBe(false);

         panelLookup._options.selectedKeys = [1];
         panelLookup._afterUpdate({ selectedKeys: [2] });
         expect(callResize).toBe(false);
         expect(isActivate).toBe(false);

         panelLookup._afterUpdate({ selectedKeys: [] });
         expect(callResize).toBe(true);
         expect(isActivate).toBe(true);
      });

      it('showSelector', function () {
         var isShowSelector = false,
            pLookup = new PanelLookup.default();

         pLookup._children.lookup = {
            showSelector: function () {
               isShowSelector = true;
            }
         };

         pLookup._options.content = {};
         const stub = jest.spyOn(UIUtils.Logger, 'error').mockImplementation();
         pLookup.showSelector();
         expect(isShowSelector).toBe(false);
         expect(stub).toHaveBeenCalledWith(
            'Option "Controls/_filterPopup/Panel/Lookup:lookupTemplateName" only supports string type',
            pLookup
         );

         pLookup._options.lookupTemplateName = 'string';
         pLookup.showSelector();
         expect(isShowSelector).toBe(true);
      });

      it('getCaption', function () {
         const pLookup = new PanelLookup.default();
         var options = {
            caption: 'caption',
            emptyText: 'emptyText',
            selectedKeys: []
         };

         expect(pLookup._getCaption(options)).toEqual('emptyText');
         pLookup._passed = true;
         expect(pLookup._getCaption(options)).toEqual('caption');

         options.selectedKeys = [1];
         expect(pLookup._getCaption(options)).toEqual('caption');
      });

      it('init _passed state with keys', () => {
         const pLookup = new PanelLookup.default();
         pLookup._beforeMount({
            selectedKeys: [1]
         });
         expect(pLookup._passed).toBe(true);
      });

      it('reset _passed when source or caption changed', () => {
         const source = {};
         const pLookup = new PanelLookup.default();
         pLookup._beforeMount({
            selectedKeys: [1],
            source,
            caption: 'testCaption'
         });
         expect(pLookup._passed).toBe(true);

         pLookup._beforeUpdate({
            selectedKeys: [1],
            source,
            caption: 'newCaption'
         });

         expect(pLookup._passed).toBe(false);

         pLookup._passed = true;

         pLookup._beforeUpdate({
            selectedKeys: [1],
            source: {},
            caption: 'newCaption'
         });
         expect(pLookup._passed).toBe(false);
      });
   });
});
