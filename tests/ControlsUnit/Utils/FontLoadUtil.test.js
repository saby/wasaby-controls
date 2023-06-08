define(['Controls/_breadcrumbs/resources/FontLoadUtil'], function (
   FontLoadUtil
) {
   describe('Controls/_breadcrumbs/resources/FontLoadUtil', function () {
      it('waitForFontLoad should load font once', function () {
         return new Promise(function (resolve) {
            FontLoadUtil.waitForFontLoad('test', () => {
               return true;
            }).addCallback(function () {
               expect(FontLoadUtil.LOADED_FONTS.test).toBe(true);
               resolve();
            });
         });
      });
   });
});
