define(['Controls/_lookupPopup/List/Utils/memorySourceFilter', 'Types/entity'], function (
   memorySourceFilter,
   entity
) {
   describe('Controls/_lookupPopup/List/Utils/memorySourceFilter', function () {
      it('emptyFilter', function () {
         var model = new entity.Model({
            rawData: {
               testField: 'testValue'
            },
            keyProperty: 'testField'
         });
         expect(memorySourceFilter(model, {}, 'testField')).toBe(true);
      });

      it('filter with selected', function () {
         var model1 = new entity.Model({
            rawData: {
               testField: 'testValue'
            },
            keyProperty: 'testField'
         });
         var model2 = new entity.Model({
            rawData: {
               testField: 'testValue2'
            },
            keyProperty: 'testField'
         });
         var filter = {
            selection: new entity.Model({
               rawData: {
                  marked: ['testValue2']
               }
            })
         };
         expect(memorySourceFilter(model1, filter, 'testField')).toBe(false);
         expect(memorySourceFilter(model2, filter, 'testField')).toBe(true);
      });
   });
});
