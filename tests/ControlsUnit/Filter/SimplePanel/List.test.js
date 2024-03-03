define(['Controls/filterPopup', 'Types/collection'], function (filterPopup, collection) {
   describe('FilterSimplePanelList', function () {
      let defaultItems = new collection.RecordSet({
         keyProperty: 'id',
         rawData: [
            { id: '1', title: 'Test1' },
            { id: '2', title: 'Test2' },
            { id: '3', title: 'Test3' },
            { id: '4', title: 'Test4' },
            { id: '5', title: 'Test5' },
            { id: '6', title: 'Test6' }
         ]
      });

      let defaultConfig = {
         displayProperty: 'title',
         keyProperty: 'id',
         emptyText: '',
         resetValue: ['2'],
         id: 'text',
         items: defaultItems.clone(),
         selectedKeys: [],
         multiSelect: true,
         theme: 'testTheme',
         nodeProperty: 'node'
      };

      let getList = function (config) {
         let list = new filterPopup._List();
         list.saveOptions(config);
         return list;
      };

      it('_beforeUpdate', function () {
         let list = getList(defaultConfig),
            items = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [
                  { id: '1', title: 'Test1' },
                  { id: '2', title: 'Test2' },
                  { id: '3', title: 'Test3' }
               ]
            });
         let newConfig = { ...defaultConfig, items };
         list._beforeMount(defaultConfig);
         list._beforeUpdate(newConfig);

         let selectedKeys = ['2'];
         newConfig = { ...defaultConfig, selectedKeys };
         list._beforeUpdate(newConfig);
         expect(selectedKeys).toEqual(list._selectedKeys);
      });

      it('_itemClickHandler', function () {
         const config = { ...defaultConfig, items: defaultItems.clone() };
         let list = getList(config),
            itemClickResult,
            checkBoxClickResult;
         list._notify = (event, data) => {
            if (event === 'itemClick') {
               itemClickResult = data[0];
            } else if (event === 'checkBoxClick') {
               checkBoxClickResult = data[0];
            }
         };
         list._beforeMount(config);
         list._options.emptyKey = '2';

         let isCheckBoxClick = false;
         let event = {
            target: {
               closest: () => {
                  return isCheckBoxClick;
               }
            }
         };

         // item click without selection
         list._itemClickHandler(event, defaultItems.at(0));
         expect(itemClickResult).toEqual(['1']);

         // item click with selection
         let newConfig = { ...config, selectedKeys: ['1', '3'] };
         list._beforeUpdate(newConfig);
         list._selectionChanged = true;
         list._selectedItemsChanged(event, [defaultItems.at(2)]); // click on '3'
         expect(checkBoxClickResult).toEqual(['3']);

         // checkbox click, current keys = ['1']
         isCheckBoxClick = true;
         list._selectedItemsChanged(event, [defaultItems.at(4)]); // click on '5'
         expect(checkBoxClickResult).toEqual(['5']);

         // checkbox click, current keys = ['1', '5']
         isCheckBoxClick = true;
         list._itemClickHandler(event, defaultItems.at(1)); // click on '2' = emptyKey
         expect(itemClickResult).toEqual(['2']);

         // folder click
         isCheckBoxClick = false;
         list._options.nodeProperty = 'node';
         let item = defaultItems.at(2).clone();
         item.set('node', true);
         list._itemClickHandler(event, item);
         expect(itemClickResult).toEqual(['3']);
      });

      it('_afterOpenDialogCallback', function () {
         let list = getList(defaultConfig);
         list._beforeMount(defaultConfig);
         let isNotified;
         list._notify = (event) => {
            if (event === 'moreButtonClick') {
               isNotified = true;
            }
         };
         list._afterOpenDialogCallback([1, 2, 3]);
         expect(isNotified).toBe(true);
      });
   });
});
