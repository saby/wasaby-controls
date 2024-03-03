define(['Controls/filterPopup', 'Types/collection', 'Types/entity', 'Types/chain'], function (
   filterPopup,
   collection,
   entity,
   chain
) {
   describe('SimplePanel:HierarchyList', function () {
      let defaultItems = new collection.RecordSet({
         keyProperty: 'id',
         rawData: [
            { id: '-1', title: 'folder 1', node: true },
            { id: '0', title: 'folder 2', node: true },
            { id: '1', title: 'Test1', parent: '-1' },
            { id: '2', title: 'Test2', parent: '-1' },
            { id: '3', title: 'Test3', parent: '-1' },
            { id: '4', title: 'Test4', parent: '0' },
            { id: '5', title: 'Test5', parent: '0' },
            { id: '6', title: 'Test6', parent: '0' }
         ]
      });

      let defaultConfig = {
         displayProperty: 'title',
         keyProperty: 'id',
         nodeProperty: 'node',
         parentProperty: 'parent',
         emptyText: '',
         emptyKey: '2',
         resetValue: ['2'],
         id: 'text',
         items: defaultItems.clone(),
         selectorItems: defaultItems.clone(),
         selectedKeys: [],
         multiSelect: true
      };

      let getHierarchyList = function (config) {
         let list = new filterPopup._HierarchyList();
         list.saveOptions(config);
         return list;
      };

      it('_beforeMount', function () {
         let list = getHierarchyList(defaultConfig);
         list._beforeMount(defaultConfig);
         expect(chain.factory(list._folders).count()).toBe(2);
         expect(list._selectedKeys).toEqual({ 0: [], '-1': [] });
         expect(list._sourceControllers[0].getItems().getCount()).toBe(4);
      });

      it('_beforeMount adapter', function () {
         let sbisItems = new collection.RecordSet({
            adapter: new entity.adapter.Sbis(),
            rawData: {
               d: [
                  [1, 'first item'],
                  [2, 'second item'],
                  [3, 'third item']
               ],
               s: [
                  { n: 'id', t: 'Строка' },
                  { n: 'title', t: 'Строка' }
               ]
            },
            keyProperty: 'id'
         });
         let config = {
            ...defaultConfig,
            items: sbisItems,
            selectorItems: sbisItems
         };
         let list = getHierarchyList(config);
         list._beforeMount(config);
         expect(chain.factory(list._folders).count()).toBe(0);
      });

      it('_itemClickHandler', function () {
         let list = getHierarchyList(defaultConfig),
            itemClickResult,
            checkBoxClickResult;
         list._notify = (event, data) => {
            if (event === 'itemClick') {
               itemClickResult = data[0];
            } else if (event === 'checkBoxClick') {
               checkBoxClickResult = data[0];
            }
         };
         list._beforeMount(defaultConfig);

         // item click without selection
         list._itemClickHandler({}, '0', ['1']);
         expect(itemClickResult).toEqual({ 0: ['1'] });

         // checkbox click
         list._selectionChanged = true;
         list._selectedKeys = { 0: ['1'], '-1': [] };
         list._itemClickHandler({}, '-1', ['5']);
         expect(checkBoxClickResult).toEqual({ 0: ['1'], '-1': ['5'] });

         // checkbox click
         list._itemClickHandler({}, '0', []);
         expect(checkBoxClickResult).toEqual({ 0: [], '-1': ['5'] });
      });

      it('_checkBoxClickHandler', function () {
         let list = getHierarchyList(defaultConfig),
            itemClickResult,
            checkBoxClickResult;
         list._notify = (event, data) => {
            if (event === 'itemClick') {
               itemClickResult = data[0];
            } else if (event === 'checkBoxClick') {
               checkBoxClickResult = data[0];
            }
         };
         list._beforeMount(defaultConfig);

         list._checkBoxClickHandler({}, '0', ['1']);
         expect(checkBoxClickResult).toEqual({ 0: ['1'], '-1': [] });

         // folder click
         list._checkBoxClickHandler({}, '0', ['-1']);
         expect(itemClickResult).toEqual({ 0: ['-1'], '-1': [] });

         // item click, folder was selected
         list._checkBoxClickHandler({}, '0', ['1']);
         expect(itemClickResult).toEqual({ 0: ['1'], '-1': [] });

         // folder 1 was selected, click on another folder
         list._selectedKeys = { 0: ['0'], '-1': [] };
         list._checkBoxClickHandler({}, '-1', ['-1']);
         expect(itemClickResult).toEqual({ 0: [], '-1': ['-1'] });

         // folder 2 was selected, click on item from folder 1
         list._checkBoxClickHandler({}, '0', ['1']);
         expect(checkBoxClickResult).toEqual({ 0: ['1'], '-1': ['-1'] });

         // folder 2 and item from folder 1 was selected, click on folder 1
         list._checkBoxClickHandler({}, '0', ['0']);
         expect(itemClickResult).toEqual({ 0: ['0'], '-1': [] });

         // item from folder 2 was selected, click on folder 1
         list._selectedKeys = { 0: [], '-1': ['5'] };
         list._checkBoxClickHandler({}, '0', ['0']);
         expect(itemClickResult).toEqual({ 0: ['0'], '-1': [] });
      });

      it('_emptyItemClickHandler', function () {
         let list = getHierarchyList(defaultConfig),
            itemClickResult;
         list._notify = (event, data) => {
            if (event === 'itemClick') {
               itemClickResult = data[0];
            }
         };
         list._beforeMount(defaultConfig);

         list._emptyItemClickHandler();
         expect(list._selectedKeys).toEqual(['2']);
         expect(itemClickResult).toEqual(['2']);
      });
   });
});
