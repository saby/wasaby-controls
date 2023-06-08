define([
   'Controls/_operations/MultiSelector/getCount',
   'Types/entity',
   'Types/collection'
], function (getCountImport, entity) {
   'use strict';

   const TEST_DATA_COUNT = 10;
   const TEST_CALL_METHOD_NAME = 'testMethodName';
   const TEST_SELECTED_KEYS = ['test'];

   const getSelectedKeysFromSelection = function (selection) {
      return selection.get('marked');
   };

   const getRpc = function (callCallback) {
      return {
         call: (command, data) => {
            callCallback(command, data);
            return Promise.resolve({
               getRow: () => {
                  return {
                     get: () => {
                        return TEST_DATA_COUNT;
                     }
                  };
               }
            });
         },
         getAdapter: () => {
            return new entity.adapter.Json();
         }
      };
   };

   describe('getCount', function () {
      it('getCount call', () => {
         const getCount = getCountImport.default.getCount;
         let callCommand, callData;
         const rpcParams = {
            rpc: getRpc((command, data) => {
               callCommand = command;
               callData = data;
            }),
            data: {},
            command: TEST_CALL_METHOD_NAME
         };
         const selection = {
            selected: ['test'],
            excluded: []
         };

         return new Promise((resolve) => {
            getCount(selection, rpcParams).then((countResult) => {
               expect(callCommand).toEqual(TEST_CALL_METHOD_NAME);
               expect(callData.filter instanceof entity.Record).toBe(true);
               expect(
                  getSelectedKeysFromSelection(callData.filter.get('selection'))
               ).toEqual(TEST_SELECTED_KEYS);
               expect(countResult).toEqual(TEST_DATA_COUNT);
               resolve();
            });
         });
      });
   });
});
