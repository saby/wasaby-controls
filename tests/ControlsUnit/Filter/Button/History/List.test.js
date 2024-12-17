define([
   'Controls/_filterPopup/History/List',
   'UI/State',
   'Types/chain',
   'ControlsUnit/Filter/Button/History/testHistorySource',
   'Controls/filter',
   'Types/entity',
   'Controls/history',
   'Types/collection',
   'Controls/HistoryStore'
], function (
   List,
   uiState,
   chain,
   HistorySourceDemo,
   filter,
   entity,
   history,
   collection,
   { Store }
) {
   describe('FilterHistoryList', function () {
      var items2;
      var items1;
      var itemsHistory;
      var list;
      var config;
      var items;

      beforeEach(async () => {
         items2 = [
            {
               id: 'period',
               value: [3],
               resetValue: [1],
               textValue: 'Past month'
            },
            { id: 'state', value: [1], resetValue: [1] },
            {
               id: 'limit',
               value: [1],
               resetValue: '',
               textValue: 'Due date',
               visibility: false
            },
            {
               id: 'sender',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'author',
               value: 'Ivanov K.K.',
               textValue: 'Ivanov K.K.',
               resetValue: ''
            },
            {
               id: 'responsible',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'tagging',
               value: '',
               resetValue: '',
               textValue: 'Marks',
               visibility: false
            },
            {
               id: 'operation',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'group',
               value: [1],
               resetValue: '',
               visibility: false
            },
            {
               id: 'unread',
               value: true,
               resetValue: false,
               textValue: 'Unread',
               visibility: false
            },
            {
               id: 'loose',
               value: true,
               resetValue: '',
               textValue: 'Loose',
               visibility: false
            },
            {
               id: 'own',
               value: [2],
               resetValue: '',
               textValue: 'On department',
               visibility: false
            },
            {
               id: 'our organisation',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'document',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'activity',
               value: [1],
               resetValue: '',
               selectedKeys: [1],
               visibility: false
            }
         ];
         items1 = [
            {
               id: 'period',
               value: [3],
               resetValue: [1],
               textValue: 'Past month'
            },
            { id: 'state', value: [1], resetValue: [1] },
            {
               id: 'limit',
               value: [1],
               resetValue: '',
               textValue: 'Due date',
               visibility: true
            },
            {
               id: 'sender',
               value: '',
               resetValue: '',
               textValue: 'Petrov B.B',
               visibility: true
            },
            {
               id: 'author',
               value: 'Ivanov K.K.',
               textValue: 'Ivanov K.K.',
               resetValue: ''
            },
            {
               id: 'responsible',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'tagging',
               value: '',
               resetValue: '',
               textValue: 'Marks',
               visibility: false
            },
            {
               id: 'operation',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'group',
               value: [1],
               resetValue: '',
               visibility: false
            },
            {
               id: 'unread',
               value: true,
               resetValue: false,
               textValue: 'Unread',
               visibility: true
            },
            {
               id: 'loose',
               value: true,
               resetValue: '',
               textValue: 'Loose',
               visibility: false
            },
            {
               id: 'own',
               value: [2],
               resetValue: '',
               textValue: 'On department',
               visibility: true
            },
            {
               id: 'our organisation',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'document',
               value: '',
               resetValue: '',
               visibility: false
            },
            {
               id: 'activity',
               value: [1],
               resetValue: '',
               selectedKeys: [1],
               visibility: false
            }
         ];
         itemsHistory = [items1, items2];
         list = new List.default();
         jest.spyOn(list, '_forceUpdate').mockImplementation();
         config = {
            historyId: 'TEST_HISTORY_ID',
            orientation: 'vertical'
         };
         items = [
            {
               id: 'period',
               value: [2],
               resetValue: [1],
               textValue: 'Today'
            },
            {
               id: 'sender',
               value: '',
               resetValue: '',
               textValue: ''
            },
            {
               id: 'author',
               value: 'Ivanov K.K.',
               resetValue: '',
               textValue: 'Ivanov K.K.',
               visibility: true
            },
            {
               id: 'responsible',
               value: '',
               resetValue: '',
               textValue: 'Petrov T.T.',
               visibility: false
            }
         ];
         const items3 = await filter.HistoryUtils.loadHistoryItems({
            historyId: 'TEST_HISTORY_ID'
         });
         items3.setKeyProperty('id');
         config.items = items3;
         config.filterItems = items3;
         list.saveOptions(config);
      });

      it('_historyCount', function () {
         list._beforeMount({
            items: new collection.RecordSet({
               keyProperty: 'id'
            }),
            filterItems: []
         });
         expect(list._historyCount).toEqual(history.Constants.MAX_HISTORY);
      });

      it('on resize', function () {
         list._onResize();
         expect(list._isMaxHeight).toBe(true);
      });

      it('click separator', function () {
         let isResized = false;
         list._notify = (event) => {
            if (event === 'controlResize') {
               isResized = true;
            }
         };
         list._isMaxHeight = true;
         list._clickSeparatorHandler();
         expect(list._isMaxHeight).toBe(false);
         expect(isResized).toBe(false);

         list._afterUpdate(list._options);
         expect(isResized).toBe(true);
      });

      it('_clickHandler', function () {
         var histItems = [];
         list._notify = (e, args) => {
            if (e === 'applyHistoryFilter') {
               histItems = args[0];
            }
         };
         var savedList = list;
         chain.factory(list._options.items).each(function (item, index) {
            if (item) {
               savedList._clickHandler('click', item);
               expect(histItems).toEqual(itemsHistory[index]);
            }
         });
      });

      it('_onFavoriteClick', () => {
         const event = {
            target: 'testTarget'
         };
         const favoriteItem = new entity.Model({
            rawData: {
               ObjectId: 'testId',
               ObjectData: JSON.stringify({
                  linkText: 'testLinkText',
                  items: items1,
                  globalParams: 0
               })
            },
            keyProperty: 'ObjectId'
         });
         const text = 'savedText';

         let openConfig;

         list._stickyOpener = {
            open: (cfg) => {
               openConfig = cfg;
            }
         };
         list._onFavoriteClick(event, favoriteItem, text);
         expect(openConfig.target).toEqual('testTarget');
         expect(openConfig.targetPoint).toEqual({
            vertical: 'bottom',
            horizontal: 'left'
         });
         expect(openConfig.direction).toEqual({
            horizontal: 'left'
         });
      });

      it('_deleteFavorite', () => {
         const listFavorite = new List.default();
         let closed = false;
         listFavorite._editItem = { getKey: jest.fn() };
         listFavorite._options = { historyId: '1231123' };
         listFavorite._stickyOpener = {
            close: () => {
               closed = true;
            }
         };

         listFavorite._deleteFavorite({});
         expect(closed).toBe(true);
         jest.restoreAllMocks();
      });

      it('_saveFavorite', () => {
         const listFavorite = new List.default();
         listFavorite._editItem = {
            getKey: () => {
               return 'test';
            },
            set: () => {
               return 'test';
            },
            get: () => {
               return null;
            }
         };
         listFavorite._options = { historyId: '1231123' };

         let record = new entity.Model({
            rawData: {
               items: items,
               linkText: 'textLine',
               isClient: false
            },
            keyProperty: 'id'
         });

         let expectedEditedItem = JSON.stringify({
            items: items,
            linkText: 'textLine',
            isClient: false
         });
         listFavorite._saveFavorite(record);
         expect(Store.getLocal('1231123').pinned.getRecordById('test').get('ObjectData')).toEqual(
            expectedEditedItem
         );
         jest.restoreAllMocks();
      });

      describe('_mapByField', function () {
         it('map by resetValues', function () {
            var filterItems = [
               {
                  id: 'period',
                  value: [2],
                  resetValue: [1],
                  textValue: 'Today'
               },
               {
                  id: 'sender',
                  value: '',
                  resetValue: 'test_sender',
                  textValue: ''
               },
               {
                  id: 'author',
                  value: 'Ivanov K.K.',
                  resetValue: true,
                  textValue: 'Ivanov K.K.',
                  visibility: true
               },
               {
                  id: 'responsible',
                  value: '',
                  resetValue: '',
                  textValue: 'Petrov T.T.',
                  visibility: false
               }
            ];
            var resetValues = list._mapByField(filterItems, 'resetValue');
            expect(resetValues).toEqual({
               period: [1],
               sender: 'test_sender',
               author: true,
               responsible: ''
            });
         });

         it('map by value', function () {
            var byValue = list._mapByField(items1, 'value');
            var result = {
               period: [3],
               state: [1],
               limit: [1],
               sender: '',
               author: 'Ivanov K.K.',
               responsible: '',
               tagging: '',
               operation: '',
               group: [1],
               unread: true,
               loose: true,
               own: [2],
               'our organisation': '',
               document: '',
               activity: [1]
            };

            expect(byValue).toEqual(result);
         });
      });

      it('_getStringHistoryFromItems', function () {
         let resetValues = {
            period: [1],
            sender: 'test_sender',
            author: '',
            responsible: ''
         };
         let historyItems = [
            { name: 'period', value: [2], textValue: 'Today' },
            { name: 'sender', value: '', textValue: '' },
            {
               name: 'author',
               value: 'Ivanov K.K.',
               textValue: 'Ivanov K.K.',
               visibility: true
            },
            {
               name: 'responsible',
               value: '',
               textValue: 'Petrov T.T.',
               visibility: false
            }
         ];
         let historyString = list._getStringHistoryFromItems(historyItems, resetValues);
         expect(historyString).toBe('Today, Ivanov K.K.');
      });

      it('_getEditDialogOptions', function () {
         var favoriteItem = new entity.Model({
            rawData: {
               ObjectId: 'testId',
               ObjectData: JSON.stringify({
                  linkText: 'testLinkText',
                  items: items1,
                  globalParams: 0
               })
            },
            keyProperty: 'ObjectId'
         });
         var editableOptions = list._getEditDialogOptions(favoriteItem, null, 'savedText');
         expect(editableOptions.editedTextValue).toEqual('savedText');
      });
   });
});
