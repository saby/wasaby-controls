define(['Controls/operations', 'Types/collection'], function (
   operations,
   collection
) {
   'use strict';
   describe('Controls/_operations/Panel/Container', function () {
      it('_getSelectedKeys', function () {
         let containerInstance = new operations.PanelContainer();

         expect(
            containerInstance._getSelectedKeys({
               listMarkedKey: null,
               selectedKeys: []
            })
         ).toEqual([]);

         expect(
            containerInstance._getSelectedKeys({
               listMarkedKey: 1,
               selectedKeys: []
            })
         ).toEqual([1]);

         expect(
            containerInstance._getSelectedKeys({
               listMarkedKey: 1,
               selectedKeys: [2]
            })
         ).toEqual([2]);
      });

      describe('_beforeUpdate', function () {
         let containerInstance;

         beforeEach(() => {
            containerInstance = new operations.PanelContainer();
            containerInstance.saveOptions({
               listMarkedKey: null,
               selectedKeys: [],
               selectedKeysCount: 0
            });
         });

         describe('marked key', () => {
            it('selectedKeys are empty and list has marked key', () => {
               containerInstance._beforeUpdate({
                  listMarkedKey: 1,
                  selectedKeys: []
               });
               expect(containerInstance._selectedKeys).toEqual([1]);
               expect(containerInstance._selectedKeysCount).toEqual(0);
            });

            it('has selectedKeys and list has marked key', () => {
               containerInstance._beforeUpdate({
                  listMarkedKey: 1,
                  selectedKeys: [2]
               });
               expect(containerInstance._selectedKeys).toEqual([2]);
               expect(containerInstance._selectedKeysCount).not.toBeDefined();
            });
         });

         describe('selectedKeysCount', () => {
            it('selectedKeysCount is changed', () => {
               containerInstance._beforeUpdate({
                  selectedKeysCount: 100,
                  selectedKeys: [2]
               });
               expect(containerInstance._selectedKeysCount).toEqual(100);
            });
         });

         describe('items', () => {
            it('empty items', () => {
               containerInstance._beforeUpdate({
                  listMarkedKey: 1,
                  selectedKeys: [],
                  items: new collection.RecordSet()
               });
               expect(containerInstance._selectedKeys).toEqual([]);
            });
            it('without items', () => {
               containerInstance._beforeUpdate({
                  listMarkedKey: 1,
                  selectedKeys: []
               });
               expect(containerInstance._selectedKeys).toEqual([1]);
            });
            it('with items', () => {
               let options = {
                  listMarkedKey: 1,
                  selectedKeys: [],
                  items: new collection.RecordSet({
                     keyProperty: 'id',
                     rawData: [
                        {
                           id: 0
                        }
                     ]
                  })
               };
               containerInstance._beforeUpdate(options);
               expect(containerInstance._selectedKeys).toEqual([1]);

               options = { ...options };
               options.listMarkedKey = null;
               containerInstance._beforeUpdate(options);
               expect(containerInstance._selectedKeys).toEqual([]);
            });
         });
      });
   });
});
