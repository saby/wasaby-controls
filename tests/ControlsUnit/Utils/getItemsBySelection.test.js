define([
   'Controls/list',
   'Types/collection',
   'Types/source',
   'Types/deferred'
], function (list, collection, source, defferedLib) {
   'use strict';
   describe('Controls.Utils.getItemsBySelection', function () {
      const getItemsBySelection = list.getItemsBySelection;
      var data = [
            { id: 1, title: 'item 1' },
            { id: 2, title: 'item 2' },
            { id: 3, title: 'item 3' },
            { id: 4, title: 'item 4' }
         ],
         recordSet = new collection.RecordSet({
            rawData: data,
            keyProperty: 'id'
         }),
         callSource = false,
         callQuery,
         dataSource = new source.Memory({
            keyProperty: 'id',
            data: data
         });

      dataSource.query = function (query) {
         callSource = true;
         callQuery = query;
         return defferedLib.Deferred.success({
            getAll: function () {
               var item,
                  result = [],
                  filter = query.getWhere();
               if (filter.loadData !== false) {
                  filter.selection.get('marked').forEach(function (key) {
                     item = recordSet.getRecordById(key);
                     if (item) {
                        result.push(item);
                     }
                  });
               }
               return result;
            }
         });
      };

      beforeEach(function () {
         callSource = false;
      });

      it('all items in RecordSet', function (done) {
         getItemsBySelection(
            {
               selected: [1, 2],
               excluded: []
            },
            dataSource,
            recordSet,
            {}
         ).addCallback(function (items) {
            expect(callSource).toBe(false);
            expect(items.length).toEqual(2);
            done();
         });
      });

      it('not all items in RecordSet', function (done) {
         getItemsBySelection(
            {
               selected: [1, 5],
               excluded: []
            },
            dataSource,
            recordSet,
            {}
         ).addCallback(function (items) {
            expect(callSource).toBe(true);
            expect(items.length).toEqual(1);
            expect(items[0]).toEqual(1);
            done();
         });
      });

      it('with filter', function (done) {
         getItemsBySelection(
            {
               selected: [1, 5],
               excluded: []
            },
            dataSource,
            recordSet,
            {
               loadData: false
            }
         ).addCallback(function (items) {
            expect(callSource).toBe(true);
            expect(items.length).toEqual(0);
            done();
         });
      });

      it('recursive', function () {
         getItemsBySelection(
            {
               selected: [1, 5],
               excluded: [],
               recursive: true
            },
            dataSource,
            recordSet,
            {}
         );
         expect(callQuery._where.selection.get('recursive')).toBe(true);

         getItemsBySelection(
            {
               selected: [1, 5],
               excluded: [],
               recursive: false
            },
            dataSource,
            recordSet,
            {}
         );
         expect(callQuery._where.selection.get('recursive')).toBe(false);

         getItemsBySelection(
            {
               selected: [1, 5],
               excluded: []
            },
            dataSource,
            recordSet,
            {}
         );
         expect(callQuery._where.selection.get('recursive')).toBe(true);
      });
   });
});
