define([
   'Controls/tabs',
   'Types/source',
   'Types/entity',
   'Types/collection',
   'Controls/Utils/getFontWidth'
], function (tabsMod, sourceLib, entity, collection, getFontWidthUtil) {
   describe('Controls/_tabs/AdaptiveButtons', function () {
      const data = [
         {
            id: 1,
            title: 'Первый'
         },
         {
            id: 2,
            title: 'Второй'
         },
         {
            id: 3,
            title: 'Третий'
         }
      ];

      const data2 = [
         {
            key: 'someKey1',
            caption: 'Первый'
         },
         {
            key: 'someKey2',
            caption: 'Второй'
         },
         {
            key: 'someKey3',
            caption: 'Третий'
         }
      ];
      const items = new collection.RecordSet({
         keyProperty: 'id',
         rawData: data
      });
      const items2 = new collection.RecordSet({
         keyProperty: 'key',
         rawData: data2
      });
      const adaptiveButtons = new tabsMod.AdaptiveButtons();
      it('_calcVisibleItems', function () {
         adaptiveButtons._getItemsWidth = () => {
            return [50, 50, 50];
         };
         adaptiveButtons._moreButtonWidth = 10;
         const options = {
            align: 'left',
            displayProperty: 'title',
            containerWidth: 120,
            selectedKey: 1,
            keyProperty: 'id'
         };
         const options2 = {
            align: 'right',
            displayProperty: 'caption',
            containerWidth: 120,
            selectedKey: 'someKey2',
            keyProperty: 'key'
         };

         adaptiveButtons._keyProperty = 'key';

         adaptiveButtons._calcVisibleItems(
            items2,
            options2,
            options2.selectedKey
         );
         expect(adaptiveButtons._visibleItems.getRawData()).toEqual([
            {
               canShrink: true,
               caption: 'Второй',
               key: 'someKey2'
            },
            {
               canShrink: false,
               caption: 'Третий',
               key: 'someKey3'
            }
         ]);

         adaptiveButtons._keyProperty = 'id';

         adaptiveButtons._calcVisibleItems(items, options, options.selectedKey);
         expect(adaptiveButtons._visibleItems.getRawData()).toEqual([
            {
               canShrink: false,
               id: 1,
               title: 'Первый'
            },
            {
               canShrink: true,
               id: 2,
               title: 'Второй'
            }
         ]);

         adaptiveButtons._keyProperty = 'id';
         options.selectedKey = 3;
         adaptiveButtons._calcVisibleItems(items, options, options.selectedKey);
         expect(adaptiveButtons._visibleItems.getRawData()).toEqual([
            {
               canShrink: false,
               id: 1,
               title: 'Первый'
            },
            {
               canShrink: true,
               id: 3,
               title: 'Третий'
            }
         ]);
      });
      it('_menuItemClickHandler', function () {
         const buttons = new tabsMod.AdaptiveButtons();
         var notifyCorrectCalled = false;
         buttons._notify = function (eventName) {
            if (eventName === 'selectedKeyChanged') {
               notifyCorrectCalled = true;
            }
         };
         let event1 = {
            nativeEvent: {
               button: 1
            }
         };
         buttons._options = {
            keyProperty: 'id'
         };
         buttons._visibleItems = items;
         buttons._position = 0;
         buttons._updateFilter = jest.fn();
         buttons._items = items;
         buttons._getTextWidth = () => {
            return 30;
         };
         buttons._keyProperty = 'id';

         buttons._menuItemClickHandler(event1, [1]);
         expect(notifyCorrectCalled).toEqual(true);

         buttons.destroy();
      });
      it('_getTextWidth', function () {
         jest
            .spyOn(getFontWidthUtil, 'getFontWidth')
            .mockClear()
            .mockImplementation(() => {
               return 31.2;
            });
         let maxWidth = adaptiveButtons._getTextWidth('text');
         expect(maxWidth).toEqual(32);
         jest.restoreAllMocks();

         jest
            .spyOn(getFontWidthUtil, 'getFontWidth')
            .mockClear()
            .mockImplementation(() => {
               return 31.8;
            });
         maxWidth = adaptiveButtons._getTextWidth('text');
         expect(maxWidth).toEqual(32);
         jest.restoreAllMocks();
      });
      it('_updateFilter', function () {
         const adaptiveBtn = new tabsMod.AdaptiveButtons();
         adaptiveBtn._position = 3;
         adaptiveBtn._keyProperty = 'id';
         adaptiveBtn._visibleItems = new collection.RecordSet({
            keyProperty: 'id',
            rawData: [
               {
                  id: 1,
                  title: 'Первый'
               },
               {
                  id: 2,
                  title: 'Второй'
               },
               {
                  id: 3,
                  title: 'Третий'
               },
               {
                  id: 4,
                  title: 'Четвертый'
               }
            ]
         });
         adaptiveBtn._items = new collection.RecordSet({
            keyProperty: 'id',
            rawData: [
               {
                  id: 1,
                  title: 'Первый'
               },
               {
                  id: 2,
                  title: 'Второй'
               },
               {
                  id: 3,
                  title: 'Третий'
               },
               {
                  id: 4,
                  title: 'Четвертый'
               },
               {
                  id: 5,
                  title: 'Пятый'
               },
               {
                  id: 6,
                  title: 'Шестой'
               }
            ]
         });
         const options4 = { selectedKey: 1 };
         adaptiveBtn._updateFilter(options4);
         expect(adaptiveBtn._filter).toEqual({ id: [5, 6] });
         options4.selectedKey = 4;
         adaptiveBtn._updateFilter(options4);
         expect(adaptiveBtn._filter).toEqual({ id: [4, 5, 6] });
      });
   });
});
