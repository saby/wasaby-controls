define([
   'Controls/_filter/Prefetch',
   'Types/collection',
   'Types/entity'
], function (Prefetch, collection, entity) {
   function getPrefetchParams() {
      return {
         PrefetchSessionId: 'test',
         PrefetchDataValidUntil: new Date(),
         PrefetchDataCreated: new Date('December 17, 1995 03:24:00')
      };
   }

   function getRecordSetWithoutPrefetch() {
      return new collection.RecordSet();
   }

   function getRecordSetWithPrefetch() {
      var recordSet = getRecordSetWithoutPrefetch();
      var results = new entity.Model({
         rawData: getPrefetchParams()
      });

      recordSet.setMetaData({ results: results });
      return recordSet;
   }

   function getHistoryWithPrefetch() {
      return {
         items: [],
         prefetchParams: getPrefetchParams()
      };
   }

   describe('Controls.filter.Prefetch', function () {
      it('applyPrefetchFromItems', function () {
         var filter = {};
         expect(
            Prefetch.default.applyPrefetchFromItems(
               filter,
               getRecordSetWithPrefetch()
            )
         ).toEqual({ PrefetchSessionId: 'test' });

         filter = {};
         expect(
            Prefetch.default.applyPrefetchFromItems(
               filter,
               getRecordSetWithoutPrefetch()
            )
         ).toEqual({});
      });

      it('applyPrefetchFromHistory', function () {
         var filter = {};
         expect(
            Prefetch.default.applyPrefetchFromHistory(
               filter,
               getHistoryWithPrefetch()
            )
         ).toEqual({ PrefetchSessionId: 'test' });
      });

      it('getPrefetchParamsForSave', function () {
         var params = Prefetch.default.getPrefetchParamsForSave(
            getRecordSetWithPrefetch()
         );
         expect(params.PrefetchSessionId).toEqual('test');

         params = Prefetch.default.getPrefetchParamsForSave(
            getRecordSetWithoutPrefetch()
         );
         expect(params).toEqual(undefined);
      });

      it('addPrefetchToHistory', function () {
         var history = {
            items: []
         };

         Prefetch.default.addPrefetchToHistory(history);
         expect(!history.prefetchParams).toBe(true);

         Prefetch.default.addPrefetchToHistory(history, getPrefetchParams());
         expect(history.prefetchParams.PrefetchSessionId).toEqual('test');
      });

      it('needInvalidatePrefetch', function () {
         var history = getHistoryWithPrefetch();
         history.prefetchParams.PrefetchDataValidUntil = new Date(
            'December 17, 1995 03:24:00'
         );
         expect(Prefetch.default.needInvalidatePrefetch(history)).toBe(true);
      });

      it('prepareFilter', function () {
         var prefetchOptions = {
            PrefetchMethod: 'testMethodName'
         };
         expect(Prefetch.default.prepareFilter({}, prefetchOptions)).toEqual({
            PrefetchMethod: 'testMethodName'
         });
         expect(
            Prefetch.default.prepareFilter(
               {},
               prefetchOptions,
               'testPrefetchSessionId'
            )
         ).toEqual({
            PrefetchMethod: 'testMethodName',
            PrefetchSessionId: 'testPrefetchSessionId'
         });
         expect(Prefetch.default.prepareFilter({}, prefetchOptions)).toEqual({
            PrefetchMethod: 'testMethodName'
         });
      });

      it('clearPrefetchSession', function () {
         var filterWithSession = {
            PrefetchSessionId: 'test',
            anyField: 'anyValue'
         };

         expect(
            Prefetch.default.clearPrefetchSession(filterWithSession)
         ).toEqual({ anyField: 'anyValue' });
      });

      it('getPrefetchDataCreatedFromItems', function () {
         let dataCreated = new Date('December 17, 1995 03:24:00');
         expect(
            Prefetch.default
               .getPrefetchDataCreatedFromItems(getRecordSetWithPrefetch())
               .getTime() === dataCreated.getTime()
         ).toBe(true);
      });
   });
});
