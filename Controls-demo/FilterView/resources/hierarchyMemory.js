define('Controls-demo/FilterView/resources/hierarchyMemory', [
   'Core/Deferred',
   'Types/source',
   'Types/collection'
], function (Deferred, source, collection) {
   'use strict';

   var FilterViewMemory = source.Memory.extend({
      constructor: function () {
         FilterViewMemory.superclass.constructor.apply(this, arguments);
      },

      query: function () {
         var resultDeferred = new Deferred();
         var superQuery = FilterViewMemory.superclass.query.apply(
            this,
            arguments
         );

         superQuery.addCallback(function (dataSet) {
            var getAll = dataSet.getAll.bind(dataSet);
            var originAll = getAll();

            // не удалял, потому что могут быть побочные эффекты
            originAll.getMetaData();
            var moreResult = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [
                  {
                     id: 'Приход',
                     nav_result: true
                  },
                  {
                     id: 'Расход',
                     nav_result: false
                  }
               ]
            });

            dataSet.getAll = function () {
               var resultAll = getAll();
               resultAll.setMetaData({ more: moreResult });
               return resultAll;
            };
            resultDeferred.callback(dataSet);
            return dataSet;
         });

         return resultDeferred;
      }
   });

   return FilterViewMemory;
});
