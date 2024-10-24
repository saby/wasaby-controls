/**
 * Created by as.krasilnikov on 11.09.2018.
 */
define(['Controls/Utils/RecordSynchronizer', 'Types/collection', 'Types/entity'], (
   RecordSynchronizer,
   collection,
   entity
) => {
   let items = new collection.RecordSet({
      keyProperty: 'id',
      format: [
         {
            name: 'id',
            type: 'integer'
         },
         {
            name: 'title',
            type: 'string'
         }
      ],
      rawData: [
         {
            id: 0,
            title: 'Rooney'
         },
         {
            id: 1,
            title: 'Ronaldo'
         },
         {
            id: 2,
            title: 'Vidic'
         }
      ]
   });

   let createRecord = (rawData) => {
      return new entity.Model({
         rawData: rawData,
         keyProperty: 'id'
      });
   };

   describe('RecordSynchronizer', () => {
      it('add record', () => {
         let editRecord = new entity.Model({
            rawData: {
               id: 4,
               title: 'Lukaku'
            },
            keyProperty: 'id'
         });
         let additionalData = {
            at: 1,
            isNewRecord: true,
            key: 4
         };
         RecordSynchronizer.addRecord(editRecord, additionalData, items);
         expect(items.at(additionalData.at).getId()).toEqual(editRecord.getId());
      });

      it('merge record', () => {
         let editRecord = new entity.Model({
            rawData: {
               id: 0,
               title: 'Rashford',
               club: 'mu'
            },
            keyProperty: 'id'
         });
         let linkedKey = 0;
         RecordSynchronizer.mergeRecord(editRecord, items, linkedKey);
         expect(items.at(0).get('title')).toEqual(editRecord.get('title'));
         expect(items.at(0).getId()).toEqual(editRecord.getId());
         expect(items.at(0).get('club')).toEqual(undefined);
      });

      it('is Changed by merge record', () => {
         let editRecord = new entity.Model({
            rawData: {
               id: 0,
               title: 'Rashford',
               club: 'mu'
            },
            keyProperty: 'id'
         });
         let linkedKey = 0;
         RecordSynchronizer.mergeRecord(editRecord, items, linkedKey);
         expect(editRecord.isChanged()).toEqual(false);

         editRecord._setChangedField('title', 'Rashford');
         RecordSynchronizer.mergeRecord(editRecord, items, linkedKey);
         expect(editRecord.isChanged()).toEqual(true);
      });

      it('delete record', () => {
         let linkedKey = 0;
         RecordSynchronizer.deleteRecord(items, linkedKey);
         var removeRecord = items.getRecordById(0);
         expect(removeRecord).toEqual(undefined);
      });

      it('isEqual', () => {
         let isEqual = RecordSynchronizer._private.isEqual;
         let arg1 = 123;
         let arg2 = '123';
         expect(isEqual(arg1, arg2)).toEqual(false);

         arg1 = jest.fn();
         arg2 = jest.fn();
         expect(isEqual(arg1, arg2)).toEqual(true);

         arg1 = {
            a: 1
         };
         arg2 = {
            a: 1
         };
         expect(isEqual(arg1, arg2)).toEqual(true);
         arg2 = {
            2: 1
         };
         expect(isEqual(arg1, arg2)).toEqual(false);

         arg1 = '123';
         arg2 = '123';
         expect(isEqual(arg1, arg2)).toEqual(true);

         arg1 = '1234';
         arg2 = '123';
         expect(isEqual(arg1, arg2)).toEqual(false);

         arg1 = new entity.Model({
            rawData: {
               a: 1
            }
         });
         arg2 = new entity.Model({
            rawData: {
               a: 1
            }
         });
         expect(isEqual(arg1, arg2)).toEqual(true);

         arg2 = new entity.Model({
            rawData: {
               a: 2
            }
         });
         expect(isEqual(arg1, arg2)).toEqual(false);
      });

      it('add records', () => {
         let editRecord = [];
         items.clear();
         editRecord.push(
            createRecord({
               id: 0,
               title: 'Lukaku1'
            })
         );
         editRecord.push(
            createRecord({
               id: 1,
               title: 'Lukaku2'
            })
         );
         editRecord.push(
            createRecord({
               id: 2,
               title: 'Lukaku3'
            })
         );
         RecordSynchronizer.addRecord(editRecord, null, items);
         expect(items.getCount()).toEqual(3);
      });

      it('merge records', () => {
         let editRecord = [];
         editRecord.push(
            createRecord({
               id: 0,
               title: 'Rooney1'
            })
         );
         editRecord.push(
            createRecord({
               id: 1,
               title: 'Rooney2'
            })
         );
         editRecord.push(
            createRecord({
               id: 2,
               title: 'Rooney3'
            })
         );
         RecordSynchronizer.mergeRecord(editRecord, items);
         expect(items.getCount()).toEqual(3);
         expect(items.at(0).get('title')).toEqual('Rooney1');
         expect(items.at(1).get('title')).toEqual('Rooney2');
         expect(items.at(2).get('title')).toEqual('Rooney3');
      });

      it('delete records', () => {
         var ids = [];
         items.each(function (model) {
            ids.push(model.getId());
         });
         RecordSynchronizer.deleteRecord(items, ids);
         expect(ids.length).toEqual(3);
         expect(items.getCount()).toEqual(0);
      });

      it('delete nonexistent record', () => {
         items.clear();
         RecordSynchronizer.deleteRecord(items, 1);
         expect(items.getCount()).toEqual(0);
      });
   });
});
