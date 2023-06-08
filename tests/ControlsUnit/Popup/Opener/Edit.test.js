/**
 * Created by as.krasilnikov on 11.09.2018.
 */
define([
   'Controls/popup',
   'Types/collection',
   'Core/Deferred',
   'Types/entity'
], (popup, collection, Deferred) => {
   let dataRS = new collection.RecordSet({
      keyProperty: 'id',
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
   let editOpener = new popup.Edit();
   editOpener._beforeMount({});
   editOpener._options.items = dataRS;

   describe('Controls/_popup/Opener/Edit', () => {
      it('mode', () => {
         editOpener._beforeMount({});
         expect(editOpener._openerTemplate).toEqual(popup.Stack);

         editOpener._beforeMount({ mode: 'dialog' });
         expect(editOpener._openerTemplate).toEqual(popup.Dialog);

         editOpener._beforeMount({ mode: 'sticky' });
         expect(editOpener._openerTemplate).toEqual(popup.Sticky);

         editOpener._beforeMount({ mode: 'stack' });
         expect(editOpener._openerTemplate).toEqual(popup.Stack);
      });

      it('get config', () => {
         let record = dataRS.at(0).clone();
         let meta = {
            record: record,
            key: '123'
         };
         record.set('title', 'Rashford');
         var config = editOpener._getConfig(meta);
         expect(editOpener._linkedKey).toEqual(record.getId());
         expect(config.templateOptions.record).not.toEqual(record); // by link
         expect(config.templateOptions.key).toEqual('123');
         expect(config.templateOptions.record.getId()).toEqual(record.getId());
         expect(config.templateOptions.record.isChanged()).toEqual(false);
      });

      it('onResult', () => {
         let isProcessingResult = false;
         let data = {
            formControllerEvent: 'update',
            record: dataRS.at(0),
            additionalData: {}
         };
         let baseSynchronize = popup.Edit.prototype._synchronize;

         editOpener._loadSynchronizer = () => {
            return new Deferred().callback();
         };

         editOpener._synchronize = () => {
            isProcessingResult = true;
         };

         editOpener._notify = () => {
            return popup.Edit.CANCEL;
         };
         editOpener._onResult(data);
         expect(isProcessingResult).toEqual(false);

         editOpener._notify = () => {
            return true;
         };
         editOpener._onResult(data);
         expect(isProcessingResult).toEqual(true);
         editOpener._synchronize = baseSynchronize;
      });

      it('update linked key', () => {
         let data = {
            formControllerEvent: 'update',
            record: dataRS.at(1),
            additionalData: {
               isNewRecord: true
            }
         };
         let baseSynchronize = popup.Edit.prototype._synchronize;

         editOpener._loadSynchronizer = () => {
            return new Deferred().callback();
         };
         editOpener._synchronize = jest.fn();

         editOpener._linkedKey = null;
         editOpener._onResult(data);
         expect(editOpener._linkedKey).toEqual(1);
         editOpener._synchronize = baseSynchronize;
      });

      it('processing result', () => {
         let action = '';
         let synchronizer = {
            addRecord: function (record, additionalData, items) {
               expect(record.get('title')).toEqual('Rooney');
               expect(additionalData.isNewRecord).toEqual(true);
               expect(items).toEqual(editOpener._options.items);
               action = 'create';
            },
            mergeRecord: function (record, items, editKey) {
               expect(record.get('title')).toEqual('Rooney');
               expect(items).toEqual(editOpener._options.items);
               expect(editKey).toEqual(editOpener._linkedKey);
               action = 'merge';
            },
            deleteRecord: function (items, editKey) {
               expect(items).toEqual(editOpener._options.items);
               expect(editKey).toEqual(editOpener._linkedKey);
               action = 'delete';
            }
         };

         let data = {
            formControllerEvent: 'update',
            record: dataRS.at(0),
            additionalData: {}
         };

         editOpener._processingResult(
            synchronizer,
            data,
            editOpener._options.items,
            editOpener._linkedKey
         );
         expect(action).toEqual('merge');

         data.additionalData.isNewRecord = true;
         editOpener._processingResult(
            synchronizer,
            data,
            editOpener._options.items,
            editOpener._linkedKey
         );
         expect(action).toEqual('create');

         data.formControllerEvent = 'delete';
         editOpener._processingResult(
            synchronizer,
            data,
            editOpener._options.items,
            editOpener._linkedKey
         );
         expect(action).toEqual('delete');

         action = '';
         editOpener._processingResult(
            synchronizer,
            data,
            editOpener._options.items,
            null
         );
         expect(action).toEqual('');
      });

      it('synchronize', (done) => {
         let baseProcessingResult = popup.Edit.prototype._processingResult;
         let isProcessingResult = false;
         let synchronizer = 'synchronizer';
         let data = {
            formControllerEvent: 'update',
            record: dataRS.at(0),
            additionalData: {}
         };
         editOpener._processingResult = (
            _synchronizer,
            _data,
            _items,
            _editKey
         ) => {
            expect(synchronizer).toEqual(_synchronizer);
            expect(data).toEqual(_data);
            expect(_items).toEqual(editOpener._options.items);
            expect(_editKey).toEqual(editOpener._linkedKey);
            isProcessingResult = true;
         };
         editOpener._synchronize('', data, synchronizer);
         expect(isProcessingResult).toEqual(true);

         isProcessingResult = false;
         let def = new Deferred();
         editOpener._synchronize(def, data, synchronizer);
         expect(isProcessingResult).toEqual(false);
         def.callback();
         expect(isProcessingResult).toEqual(true);

         isProcessingResult = false;
         editOpener._processingResult = baseProcessingResult;
         data.formControllerEvent = 'deletestarted';
         data.additionalData.removePromise = Promise.resolve();
         let isDeleteCalled = false;
         editOpener._deleteRecord = () => {
            isDeleteCalled = true;
         };
         editOpener._synchronize(data.formControllerEvent, data, synchronizer);
         data.additionalData.removePromise.then(() => {
            expect(isDeleteCalled).toEqual(true);
            done();
         });
      });
   });
});
