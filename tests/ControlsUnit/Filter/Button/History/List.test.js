define(
   [
      'Controls/_filterPopup/History/List',
      'UI/State',
      'Types/chain',
      'ControlsUnit/Filter/Button/History/testHistorySource',
      'Controls/filter',
      'Types/entity',
      'Controls/history',
      'Types/collection',
      'Env/Env'
   ],
   function(List, uiState, chain, HistorySourceDemo, filter, entity, history, collection, Env) {
      describe('FilterHistoryList', function() {
         var items2 = [
            {id: 'period', value: [3], resetValue: [1], textValue: 'Past month'},
            {id: 'state', value: [1], resetValue: [1]},
            {id: 'limit', value: [1], resetValue: '', textValue: 'Due date', visibility: false},
            {id: 'sender', value: '', resetValue: '', visibility: false},
            {id: 'author', value: 'Ivanov K.K.', textValue: 'Ivanov K.K.', resetValue: ''},
            {id: 'responsible', value: '', resetValue: '', visibility: false},
            {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
            {id: 'operation', value: '', resetValue: '', visibility: false},
            {id: 'group', value: [1], resetValue: '', visibility: false},
            {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: false},
            {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
            {id: 'own', value: [2], resetValue: '', textValue: 'On department', visibility: false},
            {id: 'our organisation', value: '', resetValue: '', visibility: false},
            {id: 'document', value: '', resetValue: '', visibility: false},
            {id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false}
         ];

         var items1 = [
            {id: 'period', value: [3], resetValue: [1], textValue: 'Past month'},
            {id: 'state', value: [1], resetValue: [1]},
            {id: 'limit', value: [1], resetValue: '', textValue: 'Due date', visibility: true},
            {id: 'sender', value: '', resetValue: '', textValue: 'Petrov B.B', visibility: true},
            {id: 'author', value: 'Ivanov K.K.', textValue: 'Ivanov K.K.', resetValue: ''},
            {id: 'responsible', value: '', resetValue: '', visibility: false},
            {id: 'tagging', value: '', resetValue: '', textValue: 'Marks', visibility: false},
            {id: 'operation', value: '', resetValue: '', visibility: false},
            {id: 'group', value: [1], resetValue: '', visibility: false},
            {id: 'unread', value: true, resetValue: false, textValue: 'Unread', visibility: true},
            {id: 'loose', value: true, resetValue: '', textValue: 'Loose', visibility: false},
            {id: 'own', value: [2], resetValue: '', textValue: 'On department', visibility: true},
            {id: 'our organisation', value: '', resetValue: '', visibility: false},
            {id: 'document', value: '', resetValue: '', visibility: false},
            {id: 'activity', value: [1], resetValue: '', selectedKeys: [1], visibility: false}
         ];

         var itemsHistory = [items1, items2];

         var list = new List.default();

         var config = {
            historyId: 'TEST_HISTORY_ID',
            orientation: 'vertical'
         };

         var items = [
            {id: 'period', value: [2], resetValue: [1], textValue: 'Today'},
            {id: 'sender', value: '', resetValue: '', textValue: ''},
            {id: 'author', value: 'Ivanov K.K.', resetValue: '', textValue: 'Ivanov K.K.', visibility: true},
            {id: 'responsible', value: '', resetValue: '', textValue: 'Petrov T.T.', visibility: false}
         ];

         after(() => {
            list.destroy();
         });

         filter.HistoryUtils.loadHistoryItems({historyId: 'TEST_HISTORY_ID'}).addCallback(function(items) {
            config.items = items;
            config.filterItems = items;
         });

         list.saveOptions(config);

         it('_historyCount', function() {
            list._beforeMount({
               items: new collection.RecordSet(),
               filterItems: []
            });
            assert.equal(list._historyCount, history.Constants.MAX_HISTORY);
         });

         it('get text', function() {
            var textArr = [];
            list._beforeMount(config);
            textArr = list._getText(list._options.items, items, filter.HistoryUtils.getHistorySource({historyId: config.historyId}));
            assert.equal(textArr[0], 'Past month, Due date, Ivanov K.K., Unread, On department');
            assert.equal(textArr[1], 'Past month, Ivanov K.K.');

         });

         it('on resize', function() {
            var updated;
            list._forceUpdate = function() {
               updated = true;
            };
            list._onResize();
            assert.isTrue(list._isMaxHeight);
            assert.isTrue(updated);

            updated = false;
            list._onResize();
            assert.isFalse(updated);
         });

         it('click separator', function() {
            let isResized = false;
            list._notify = (event) => {
               if (event === 'controlResize') {
                  isResized = true;
               }
            };
            list._isMaxHeight = true;
            list._clickSeparatorHandler();
            assert.isFalse(list._isMaxHeight);
            assert.isTrue(isResized);
         });

         it('_clickHandler', function() {
            var histItems = [];
            list._notify = (e, args) => {
               if (e == 'applyHistoryFilter') {
                  histItems = args[0];
               }
            };
            var savedList = list;
            chain.factory(list._options.items).each(function(item, index) {
               if (item) {
                  savedList._clickHandler('click', item);
                  assert.deepEqual(histItems, itemsHistory[index]);
               }
            });
         });

         it('pin click', function() {
            // ! unit-???????? ?????? assert
            if (Env.constants.isServerSide) { return; }
            var savedList = list;
            chain.factory(list._options.items).each(function(item) {
               if (item) {
                  savedList._onPinClick('click', item);
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
               }
            });
            const text = 'savedText';

            let openConfig;

            list._stickyOpener = {
               open: (cfg) => {
                  openConfig = cfg;
               }
            };
            list._onFavoriteClick(event, favoriteItem, text);
            assert.equal(openConfig.target, 'testTarget');
            assert.deepEqual(openConfig.targetPoint, {
               vertical: 'bottom',
               horizontal: 'left'
            });
            assert.deepEqual(openConfig.direction, {
               horizontal: 'left'
            });
         });

         it('_deleteFavorite', () => {
            const listFavorite = new List.default();
            let closed = false;
            let removeFired = false;
            const sandBox = sinon.createSandbox();
            listFavorite._editItem = {get: () => {}};
            listFavorite._options = { historyId: '1231123' };
            listFavorite._stickyOpener = {
               close: () => closed = true
            };
            sandBox.replace(listFavorite, '_getSource',() => {
               return {
                  remove: () => {removeFired = true},
                  getDataObject: () => {}
               };
            });

            listFavorite._deleteFavorite({});
            assert.isTrue(closed);
            assert.isTrue(removeFired);
            sandBox.restore();
         });

         it('_saveFavorite', () => {
            const listFavorite = new List.default();
            let editedItem;
            let updateFired = false;
            const sandBox = sinon.createSandbox();
            listFavorite._editItem = { get: () => {}, set: (property, data) => { editedItem = data; } };
            listFavorite._options = { historyId: '1231123' };

            sandBox.replace(listFavorite, '_getSource', () => {
               return {
                  update: () => {updateFired = true},
                  getDataObject: () => {}
               };
            });

            let record = new entity.Model({
               rawData: {
                  items: items,
                  linkText: 'textLine',
                  isClient: false
               }
            });

            let expectedEditedItem = JSON.stringify({
               items: items,
               linkText: 'textLine',
               isClient: false
            });
            listFavorite._saveFavorite(record);
            assert.deepEqual(editedItem, expectedEditedItem);
            assert.isTrue(updateFired);
            sandBox.restore();
         });

         describe('_mapByField', function() {

            it('map by resetValues', function() {
               var filterItems = [
                  {id: 'period', value: [2], resetValue: [1], textValue: 'Today'},
                  {id: 'sender', value: '', resetValue: 'test_sender', textValue: ''},
                  {id: 'author', value: 'Ivanov K.K.', resetValue: true, textValue: 'Ivanov K.K.', visibility: true},
                  {id: 'responsible', value: '', resetValue: '', textValue: 'Petrov T.T.', visibility: false}
               ];
               var resetValues = list._mapByField(filterItems, 'resetValue');
               assert.deepEqual(resetValues, {
                  'period': [1],
                  'sender': 'test_sender',
                  'author': true,
                  'responsible': ''
               });
            });

            it('map by value', function() {
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

               assert.deepEqual(byValue, result);
            });

         });


         it('_getStringHistoryFromItems', function() {
            let resetValues = {
               'period': [1],
               'sender': 'test_sender',
               'author': '',
               'responsible': ''
            };
            let historyItems = [
               {name: 'period', value: [2], textValue: 'Today'},
               {name: 'sender', value: '', textValue: ''},
               {name: 'author', value: 'Ivanov K.K.', textValue: 'Ivanov K.K.', visibility: true},
               {name: 'responsible', value: '', textValue: 'Petrov T.T.', visibility: false}
            ];
            let historyString = list._getStringHistoryFromItems(historyItems, resetValues);
            assert.strictEqual(historyString, 'Today, Ivanov K.K.');
         });

         it('_getEditDialogOptions', function() {
            var favoriteItem = new entity.Model({
               rawData: {
                  ObjectId: 'testId',
                  ObjectData: JSON.stringify({
                     linkText: 'testLinkText',
                     items: items1,
                     globalParams: 0
                  })
               }
            });
            var self = {
               _options: {
                  filterItems: items1
               }
            };
            var editableOptions = list._getEditDialogOptions(favoriteItem, null, 'savedText');
            assert.equal(editableOptions.editedTextValue, 'savedText');
         });
      });
   });
