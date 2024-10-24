define(['Controls/Utils/Icon'], function (Util) {
   describe('Controls/Util/Icon', () => {
      describe('getIcon', () => {
         it('returns url with external use svg syntax', () => {
            const path = Util.getIcon('Controls/iconModule:icon-done');
            const result = typeof path === 'string' ? path.replace(/\?x_module=.*#/, '#') : '';
            expect(result).toEqual('/resources/Controls/iconModule.svg#icon-done');
         });

         it('returns original icon with incorrect syntax', () => {
            expect(Util.getIcon('icon-done')).toEqual('icon-done');
         });
      });
   });
});
