define('Controls-demo/Search/SearchMemory', [
   'Types/deferred',
   'Controls/Utils/keyboardLayoutRevert',
   'Types/source',
   'Types/entity',
   'Core/core-clone'
], function (defferedLib, KeyboardLayoutRevert, source, entity, clone) {
   'use strict';

   var BrowserMemory = source.Memory.extend({
      constructor: function (options) {
         BrowserMemory.superclass.constructor.apply(this, arguments);
         this.searchParam = options.searchParam || options.keyProperty;
      },

      query: function (queryInst) {
         var resultDeferred = new defferedLib.Deferred();
         var superQuery = BrowserMemory.superclass.query.apply(this, arguments);
         var self = this;

         superQuery.addCallback(function (dataSet) {
            if (queryInst._where[self.searchParam]) {
               var switchedStr = KeyboardLayoutRevert.default.process(
                  queryInst._where[self.searchParam]
               );
               queryInst._where = clone(queryInst._where);
               queryInst._where[self.searchParam] = switchedStr;

               BrowserMemory.superclass.query
                  .call(self, queryInst)
                  .addCallback(function (revertedDataSet) {
                     var revertedRecordSet = revertedDataSet.getAll();
                     var recordSet = dataSet.getAll();
                     var rawData;

                     var revertedRecordSetCount = revertedRecordSet.getCount();

                     revertedRecordSet.forEach(function (it) {
                        if (!recordSet.getRecordById(it.getKey())) {
                           recordSet.append([it]);
                        }
                     });
                     rawData = recordSet.getRawData();

                     var ds = new source.DataSet({
                        rawData: rawData,
                        keyProperty: recordSet.getKeyProperty(),
                        adapter: recordSet.getAdapter()
                     });

                     var getAll = ds.getAll.bind(ds);
                     var originAll = getAll();
                     var originAllMeta = originAll.getMetaData();
                     var results = new entity.Model({
                        rawData: {
                           tabsSelectedKey: queryInst.getWhere().currentTab
                              ? queryInst.getWhere().currentTab
                              : 1,
                           switchedStr: revertedRecordSetCount ? switchedStr : '',
                           tabs: [
                              { id: 1, title: 'Вкладка' },
                              { id: 2, title: 'Вкладка2' }
                           ]
                        }
                     });
                     originAllMeta.results = results;
                     originAllMeta.more = recordSet.getMetaData().more;
                     originAllMeta.returnSwitched = true;
                     ds.getAll = function () {
                        var resultAll = getAll();
                        resultAll.setMetaData(originAllMeta);
                        return resultAll;
                     };

                     resultDeferred.callback(ds);
                     return revertedDataSet;
                  });
            } else {
               var getAll = dataSet.getAll.bind(dataSet);
               var originAll = getAll();
               var originAllMeta = originAll.getMetaData();
               var results = new entity.Model({
                  rawData: {
                     tabsSelectedKey: queryInst.getWhere().currentTab
                        ? queryInst.getWhere().currentTab
                        : 1,
                     tabs: [
                        { id: 1, title: 'Вкладка' },
                        { id: 2, title: 'Вкладка2' }
                     ]
                  }
               });
               originAllMeta.results = results;
               originAllMeta.more = originAll.getMetaData().more;
               dataSet.getAll = function () {
                  var resultAll = getAll();
                  resultAll.setMetaData(originAllMeta);
                  return resultAll;
               };
               resultDeferred.callback(dataSet);
            }
            return dataSet;
         });

         return resultDeferred;
      }
   });

   return BrowserMemory;
});
