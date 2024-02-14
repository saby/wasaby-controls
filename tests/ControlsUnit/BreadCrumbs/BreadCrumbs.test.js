define(['Controls/breadcrumbs', 'Types/entity'], function (crumbs, entity) {
   describe('Controls.BreadCrumbs.View', function () {
      var bc, data;
      beforeEach(function () {
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
         bc = new crumbs.View();
         bc.saveOptions({
            items: data.map(function (item) {
               return new entity.Model({
                  rawData: item,
                  keyProperty: 'id'
               });
            }),
            keyProperty: 'id',
            parentProperty: 'parent',
            displayProperty: 'test'
         });
      });
      afterEach(function () {
         bc.destroy();
         bc = null;
      });
      it('_onItemMouseEnter', function () {
         var hoveredItem = {
            get: () => {
               return 'id';
            }
         };

         bc._notify = function (e, args) {
            if (e === 'hoveredItemChanged') {
               expect(hoveredItem).toEqual(args[0]);
            }
         };
         bc._onItemMouseEnter({}, { item: hoveredItem });
      });
      it('_addWithOverflow', function () {
         // две крошки
         let View = new crumbs.View();
         View._items = [
            {
               id: 1,
               item: {
                  get: () => {
                     return 'title';
                  }
               },
               withOverflow: false
            },
            {
               id: 2,
               item: {
                  get: () => {
                     return '1';
                  }
               },
               withOverflow: false
            }
         ];
         View._addWithOverflow();
         expect(View._items[0].withOverflow).toBe(true);
         expect(View._items[1].withOverflow).toBe(false);

         // крошка и точки
         View._items = [
            {
               id: 1,
               item: {
                  get: () => {
                     return '...';
                  }
               },
               withOverflow: false,
               isDots: true
            },
            {
               id: 2,
               item: {
                  get: () => {
                     return 'title';
                  }
               },
               withOverflow: false
            }
         ];
         View._addWithOverflow();
         expect(View._items[0].withOverflow).toBe(false);
         expect(View._items[1].withOverflow).toBe(true);
      });
      describe('_onItemClick', function () {
         const mockEvent = (e) => {
            return { ...e, stopSyntheticEvent: jest.fn() };
         };
         it('item', function () {
            var itemData = {
               item: new entity.Model({
                  rawData: {
                     id: 2,
                     title: 'Notebooks 2'
                  },
                  keyProperty: 'id'
               })
            };
            bc._notify = function (e, args) {
               if (e === 'itemClick') {
                  expect(itemData.item.get('id')).toEqual(args[0].get('id'));
               }
            };
            bc._onItemClick(mockEvent(), itemData);

            // check notify itemClick in readOnly mode
            var notifyClickCalled = false;
            bc._options.readOnly = true;
            bc._notify = function (e) {
               if (e === 'itemClick') {
                  notifyClickCalled = true;
               }
            };
            bc._onItemClick(mockEvent(), itemData);
            expect(notifyClickCalled).toBe(false);
         });
         it('dots', function () {
            var itemData = {
               item: {
                  title: '...'
               }
            };
            bc._menuOpener = {
               open: function (opener, target, options) {
                  expect(target).toEqual(123);
                  expect(options.templateOptions.displayProperty).toEqual('test');
               },
               close: jest.fn()
            };
            bc._dotsClick(
               {
                  currentTarget: 123,
                  nativeEvent: {
                     stopPropagation: jest.fn()
                  }
               },
               itemData
            );

            bc._dotsClick(
               {
                  currentTarget: 123,
                  nativeEvent: {
                     stopPropagation: jest.fn()
                  }
               },
               itemData
            );
         });

         it('dots with option readOnly', function () {
            var itemData = {
               item: {
                  title: '...'
               }
            };
            bc._options.readOnly = true;
            let readOnly = false;

            bc._menuOpener = {
               open: function (opener, target, options) {
                  readOnly = options.templateOptions.readOnly;
               },
               close: jest.fn()
            };
            bc._dotsClick(
               {
                  currentTarget: 123,
                  nativeEvent: {
                     stopPropagation: jest.fn()
                  }
               },
               itemData
            );
            expect(readOnly).toBe(true);
         });
      });
      it('_handleNavMenuResult', function (done) {
         bc._notify = function (e, eventArgs) {
            if (e === 'itemClick') {
               expect(bc._options.items[0]).toBe(eventArgs[0]);
            }
         };
         bc._menuOpener = {
            close: function () {
               done();
            }
         };

         var args = new entity.Model({
            rawData: data[0],
            keyProperty: 'id'
         });
         bc._handleNavMenuResult([args]);
      });
   });
});
