define(['Controls/_explorer/PathWrapper'], function (PathWrapper) {
   describe('Controls.Explorer._PathController', function () {
      describe('needCrumbs', function () {
         const needCrumbs = PathWrapper.default._isNeedCrumbs;

         it('View mode "tile", items.length === 1', function () {
            expect(
               needCrumbs({
                  breadCrumbsItems: ['first'],
                  rootVisible: false,
                  header: [{ title: 'back', isBreadCrumbs: true }],
                  viewMode: 'tile'
               })
            ).toBe(true);
         });

         it('BackButton is not in header, items.length === 1', function () {
            expect(
               needCrumbs({
                  breadCrumbsItems: ['first'],
                  rootVisible: false
               })
            ).toBe(true);
         });

         it('BackButton is in header, items.length === 2', function () {
            expect(
               needCrumbs({
                  header: [{ title: 'back' }],
                  breadCrumbsItems: ['first', 'second'],
                  rootVisible: false
               })
            ).toBe(true);
         });

         it('items === null', function () {
            expect(needCrumbs({ rootVisible: false })).toBe(false);
         });

         it('items === null, rootVisible (when dragging from folder)', function () {
            expect(needCrumbs({ rootVisible: true })).toBe(true);
         });

         it('Hide breadcrumbs by option breadcrumbsVisibility === "hidden"', function () {
            // BackButton is not in header, items.length === 1
            expect(
               needCrumbs({
                  items: ['first'],
                  rootVisible: false,
                  breadcrumbsVisibility: 'hidden'
               })
            ).toBe(false);

            // BackButton is in header, items.length === 2
            expect(
               needCrumbs({
                  header: [{ title: 'back' }],
                  items: ['first', 'second'],
                  rootVisible: false,
                  breadcrumbsVisibility: 'hidden'
               })
            ).toBe(false);

            // items === null, rootVisible (when dragging from folder)
            expect(
               needCrumbs({
                  rootVisible: true,
                  breadcrumbsVisibility: 'hidden'
               })
            ).toBe(false);
         });
      });
   });
});
