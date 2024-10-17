define(['Controls/moverDialog'], function (moverDialog) {
   describe('Controls.moverDialog', function () {
      it('getDefaultOptions', function () {
         expect(moverDialog.Template.getDefaultOptions()).toEqual({
            displayProperty: 'title',
            filter: {},
            root: null
         });
      });
   });
});
