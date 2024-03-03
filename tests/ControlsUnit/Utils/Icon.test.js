define(['Controls/Utils/Icon'], function (Util) {
   describe('Controls/Util/Icon', () => {
      describe('getIcon', () => {
         it('returns url with external use svg syntax', () => {
            expect(Util.getIcon('Controls/iconModule:icon-done')).toEqual(
               '/resources/Controls/iconModule.svg#icon-done'
            );
         });

         it('returns original icon with incorrect syntax', () => {
            expect(Util.getIcon('icon-done')).toEqual('icon-done');
         });
      });
   });
});
