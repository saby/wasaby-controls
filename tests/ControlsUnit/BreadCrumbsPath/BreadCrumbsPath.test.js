define([
   'Controls/_breadcrumbs/MultilinePath',
   'Controls/_breadcrumbs/HeadingPath',
   'Controls/_breadcrumbs/Path',
   'Controls/_breadcrumbs/Utils',
   'Controls/_breadcrumbs/resources/FontLoadUtil',
   'Core/Deferred',
   'Types/entity'
], function (
   MultilinePath,
   HeadingPath,
   Path,
   BreadCrumbsUtil,
   FontLoadUtil,
   Deferred,
   entity
) {
   describe('Controls.BreadCrumbs.HeadingPath', function () {
      // eslint-disable-next-line no-param-reassign
      HeadingPath = HeadingPath.default;
      // eslint-disable-next-line no-param-reassign
      BreadCrumbsUtil = BreadCrumbsUtil.default;

      var path, data;

      let stubFontLoadUtil;
      beforeEach(function () {
         stubFontLoadUtil = jest
            .spyOn(FontLoadUtil, 'waitForFontLoad')
            .mockClear()
            .mockImplementation(() => {
               return Deferred.success();
            });
         data = [
            {
               id: 1,
               title: 'Настолько длинное название папки что оно не влезет в максимальный размер 1',
               parent: null
            },
            {
               id: 2,
               title: 'Notebooks 2',
               parent: 1
            },
            {
               id: 3,
               title: 'Smartphones 3',
               parent: 2
            },
            {
               id: 4,
               title: 'Record1',
               parent: 3
            },
            {
               id: 5,
               title: 'Record2',
               parent: 4
            },
            {
               id: 6,
               title: 'Record3eqweqweqeqweqweedsadeqweqewqeqweqweqw',
               parent: 5
            }
         ];
         path = new HeadingPath();
         path.saveOptions({
            items: data.map(function (item) {
               return new entity.Model({
                  rawData: item
               });
            }),
            keyProperty: 'id',
            parentProperty: 'parent',
            root: null
         });
      });
      afterEach(function () {
         path = null;
         stubFontLoadUtil.mockRestore();
      });

      it('_onBackButtonClick', function () {
         path._notify = function (e, args) {
            if (e === 'itemClick') {
               expect(
                  path._options.items[path._options.items.length - 2].get(
                     'parent'
                  )
               ).toEqual(args[0].get('parent'));
            }
         };
         path._onBackButtonClick({
            stopPropagation: jest.fn()
         });
      });

      it('_onHomeClick', function () {
         path._notify = function (e, args) {
            if (e === 'itemClick') {
               expect(data[0].parent).toEqual(args[0].get('id'));
            }
         };
         path._onHomeClick();
      });

      it('_onPathChanged', function () {
         path._notify = function (e, args) {
            if (e === 'itemClick') {
               expect(data[0].parent).toEqual(args[0].get('id'));
            }
         };
         expect(() => {
            path._onPathChanged({}, []);
         }).not.toThrow();
      });

      it('_onArrowClick', function () {
         var eventFired = false;
         path._notifyHandler = function (e) {
            if (e === 'arrowClick') {
               eventFired = true;
            }
         };
         path._notifyHandler('arrowClick');
         expect(eventFired).toBe(true);
      });
   });

   describe('Controls.BreadCrumbs.Path', function () {
      var breadCrumbsPath = new Path.default({
            displayProperty: 'title',
            keyProperty: 'id'
         }),
         drawBreadCrumbs;
      drawBreadCrumbs = BreadCrumbsUtil.drawBreadCrumbs;
      BreadCrumbsUtil.drawBreadCrumbs = jest.fn();
      breadCrumbsPath.calculateBreadcrumbsUtil = BreadCrumbsUtil;

      it('bread crumbs path update', function () {
         breadCrumbsPath._calculateBreadCrumbsToDraw([]);
         expect(breadCrumbsPath._visibleItems.length).toEqual(0);
      });

      BreadCrumbsUtil.drawBreadCrumbs = drawBreadCrumbs;
   });
   describe('Controls.BreadCrumbs.MultilinePath', function () {
      var MultilinePathCrumbs = new MultilinePath.default();
      MultilinePathCrumbs.ARROW_WIDTH = 10;
      MultilinePathCrumbs.DOTS_WIDTH = 20;
      BreadCrumbsUtil.ARROW_WIDTH = 10;
      BreadCrumbsUtil.DOTS_WIDTH = 20;
      BreadCrumbsUtil.getMinWidth = () => {
         return 30;
      };

      // 2 крошки
      var options1 = {
         containerWidth: 100,
         displayProperty: 'title'
      };
      var options2 = {
         containerWidth: 350,
         displayProperty: 'title'
      };
      var options3 = {
         containerWidth: 320,
         displayProperty: 'title'
      };
      var items1 = [
         {
            id: 1,
            title: 'Очень длинное название',
            secondTitle: 'тест1',
            parent: null
         },
         {
            id: 2,
            title: 'Длинное название второй папки',
            secondTitle: 'тест2',
            parent: 1
         }
      ].map((item) => {
         return new entity.Model({
            rawData: item,
            keyProperty: 'id'
         });
      });

      // несколько крошек
      var items2 = [
         {
            id: 1,
            title: 'Очень длинное название',
            secondTitle: 'тест1',
            parent: null
         },
         {
            id: 2,
            title: 'Длинное название второй папки',
            secondTitle: 'тест2',
            parent: 1
         },
         {
            id: 2,
            title: 'Длинное название папки',
            secondTitle: 'тест2',
            parent: 1
         },
         {
            id: 2,
            title: 'Длинное название папки',
            secondTitle: 'тест2',
            parent: 1
         }
      ].map((item) => {
         return new entity.Model({
            rawData: item,
            keyProperty: 'id'
         });
      });

      const itemsWithNullTitle = [
         {
            id: 1,
            title: null,
            secondTitle: 'тест1',
            parent: null
         },
         {
            id: 2,
            title: 'Длинное название второй папки',
            secondTitle: 'тест2',
            parent: 1
         },
         {
            id: 2,
            title: null,
            secondTitle: 'тест2',
            parent: 1
         },
         {
            id: 2,
            title: 'Длинное название папки',
            secondTitle: 'тест2',
            parent: 1
         }
      ].map((item) => {
         return new entity.Model({
            rawData: item,
            keyProperty: 'id'
         });
      });
      it('2 crumbs', function () {
         BreadCrumbsUtil.getItemsWidth = () => {
            return [50, 50];
         };
         MultilinePathCrumbs._width = 100;
         MultilinePathCrumbs._calculateBreadCrumbsToDraw(items1, options1);
         expect(MultilinePathCrumbs._visibleItemsFirst.length === 2).toBe(true);
         expect(MultilinePathCrumbs._visibleItemsSecond.length === 0).toBe(
            true
         );
      });
      it('null in title', function () {
         BreadCrumbsUtil.getItemsWidth = () => {
            return [50, 50];
         };
         MultilinePathCrumbs._width = 100;
         MultilinePathCrumbs._calculateBreadCrumbsToDraw(
            itemsWithNullTitle,
            options1
         );
         expect(MultilinePathCrumbs._visibleItemsFirst.length === 2).toBe(true);
      });
      it('несколько крошек, причем последняя не влезает в первый контейнер без сокращения', function () {
         BreadCrumbsUtil.getItemsWidth = () => {
            return [100, 100, 100, 100];
         };
         MultilinePathCrumbs._width = 350;
         MultilinePathCrumbs._calculateBreadCrumbsToDraw(items2, options2);
         expect(MultilinePathCrumbs._visibleItemsFirst.length === 4).toBe(true);

         // последняя крошка сократилась, а не упала вниз.
         expect(MultilinePathCrumbs._visibleItemsSecond.length === 0).toBe(
            true
         );
      });
      it('несколько крошек, причем последняя не влезает в первый контейнер с сокращением', function () {
         BreadCrumbsUtil.getItemsWidth = () => {
            return [100, 100, 100, 100];
         };
         MultilinePathCrumbs._width = 320;
         MultilinePathCrumbs._calculateBreadCrumbsToDraw(items2, options3);
         expect(MultilinePathCrumbs._visibleItemsFirst.length === 3).toBe(true);
         expect(MultilinePathCrumbs._visibleItemsSecond.length === 1).toBe(
            true
         );
      });

      it('path caption', () => {
         const hPath = new HeadingPath();
         const record = {
            get: () => {
               return '123';
            }
         };
         const items = ['111', record];
         let result = hPath._getCounterCaption(items);
         expect(result).toEqual('123');

         result = hPath._getCounterCaption([]);
         expect(result).toEqual(undefined);
      });
   });
});
