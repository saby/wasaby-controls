define([
   'Controls/_search/Misspell/getSwitcherStrFromData',
   'Types/collection',
   'Types/entity'
], function (getSwitchedStrFromData, collection, entity) {
   describe('Controls/_search/Misspell/getSwitcherStrFromData', function () {
      it('getSwitchedStrFromData', function () {
         var rs = new collection.RecordSet({
            rawData: [],
            keyProperty: 'id'
         });
         rs.setMetaData({
            results: new entity.Model({
               rawData: {
                  switchedStr: 'testStr'
               }
            })
         });
         expect(getSwitchedStrFromData(rs)).toEqual('testStr');

         rs.setMetaData({
            switchedStr: 'testStr2'
         });
         expect(getSwitchedStrFromData(rs)).toEqual('testStr2');
      });
   });
});
