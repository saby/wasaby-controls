define(['Controls/_explorer/PathController'], function (PathController) {
   describe('Controls.Explorer._PathController', function () {
      describe('StickyHeader needShadow', function () {
         const needShadow = PathController.default._isNeedShadow;

         it('there is no header, we need shadow', function () {
            expect(needShadow(undefined, 'table')).toBe(true);
         });

         it('there is header, we do not need shadow', function () {
            expect(needShadow([{ caption: 'title' }], 'table')).toBe(false);
         });

         it('there is header, we do not need shadow', function () {
            expect(needShadow([{ caption: '' }], 'table')).toBe(false);
         });

         it('there is header and tile view mode, we need shadow', function () {
            expect(needShadow([{ caption: '' }], 'tile')).toBe(true);
         });

         it('there is no header and list view mode, we need shadow', function () {
            expect(needShadow(null, 'list')).toBe(true);
         });
      });
      it('_onArrowClick', function () {
         var instance = new PathController.default(),
            onarrowActivatedFired = false;
         instance._notifyHandler = function (e) {
            if (e === 'arrowClick') {
               onarrowActivatedFired = true;
            }
         };
         instance._notifyHandler('arrowClick');
         expect(onarrowActivatedFired).toBe(true);
      });
   });
});
