define(['Controls/source'], function (source) {
   'use strict';

   describe('Controls.source:SelectedKey', function () {
      it('_beforeMount', function () {
         let sKeyContainer = new source.SelectedKey();
         sKeyContainer._beforeMount({ selectedKey: 'testKey' });
         expect(sKeyContainer._selectedKeys).toEqual(['testKey']);
         sKeyContainer._beforeMount({ selectedKey: null });
         expect(sKeyContainer._selectedKeys).toEqual([]);
      });
      it('_beforeUpdate', function () {
         let sKeyContainer = new source.SelectedKey();
         sKeyContainer.saveOptions({ selectedKey: 'testKey' });
         sKeyContainer._beforeUpdate({ selectedKey: 'newTestKey' });
         expect(sKeyContainer._selectedKeys).toEqual(['newTestKey']);
      });
      it('_selectedKeysChanged', function () {
         let sKeyContainer = new source.SelectedKey(),
            key,
            isStopped,
            selectedKeyChangedResult;
         sKeyContainer.saveOptions({ selectedKey: '1' });
         sKeyContainer._notify = function (event, data) {
            if (event === 'selectedKeyChanged') {
               key = data[0];
               return selectedKeyChangedResult;
            }
         };
         let event = {
            stopPropagation: () => {
               isStopped = true;
            }
         };
         selectedKeyChangedResult = true;
         sKeyContainer._selectedKey = '1';
         let eventRes = sKeyContainer._selectedKeysChanged(event, ['4']);
         expect(key).toEqual('4');
         expect(sKeyContainer._selectedKey).toEqual('1');
         expect(eventRes).toBe(true);
         expect(isStopped).toBe(true);

         eventRes = false;
         sKeyContainer._selectedKeysChanged(event, []);
         expect(key).toEqual(null);
         expect(sKeyContainer._selectedKey).toEqual('1');
         expect(eventRes).toBe(false);
         expect(isStopped).toBe(true);
      });
      it('_private::getSelectedKeys', function () {
         let sKeyContainer = new source.SelectedKey();
         let resultKeys = sKeyContainer._getSelectedKeys(null);
         expect(resultKeys).toEqual([]);
         resultKeys = sKeyContainer._getSelectedKeys(undefined);
         expect(resultKeys).toEqual([]);
         resultKeys = sKeyContainer._getSelectedKeys('testKey');
         expect(resultKeys).toEqual(['testKey']);
      });
   });
});
