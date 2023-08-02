define([
   'Controls/filterPopup',
   'Controls/_filterPopup/SimplePanel/DropdownViewModel',
   'Types/collection'
], function (filterPopup, DropdownViewModel, collection) {
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

      it('_beforeMount', function () {
         let expectedListModel = new DropdownViewModel({
            items: defaultConfig.items,
            selectedKeys: defaultConfig.selectedKeys,
            keyProperty: defaultConfig.keyProperty,
            itemTemplateProperty: defaultConfig.itemTemplateProperty,
            displayProperty: defaultConfig.displayProperty,
            emptyText: defaultConfig.emptyText,
            emptyKey: defaultConfig.emptyKey,
            hasApplyButton: defaultConfig.hasApplyButton,
            hasClose: true,
            iconSize: defaultConfig.iconSize,
            theme: defaultConfig.theme,
            nodeProperty: defaultConfig.nodeProperty,
            parentProperty: defaultConfig.parentProperty,
            levelPadding: defaultConfig.levelPadding
         });
         let list = getList(defaultConfig);
         list._beforeMount(defaultConfig);
         expect(list._listModel._options).toEqual(expectedListModel._options);
      });

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
         expect(items.getRawData()).toEqual(list._listModel.getItems().getRawData());

         let selectedKeys = ['2'];
         newConfig = { ...defaultConfig, selectedKeys };
         list._beforeUpdate(newConfig);
         expect(selectedKeys).toEqual(list._listModel.getSelectedKeys());
      });

      it('_itemClickHandler', function () {
         let list = getList(defaultConfig),
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
         let newConfig = { ...defaultConfig, selectedKeys: ['1', '3'] };
         list._beforeUpdate(newConfig);
         list._selectionChanged = true;
         list._itemClickHandler(event, defaultItems.at(2)); // click on '3'
         expect(checkBoxClickResult).toEqual(['1']);

         // checkbox click, current keys = ['1']
         isCheckBoxClick = true;
         list._itemClickHandler(event, defaultItems.at(4)); // click on '5'
         expect(checkBoxClickResult).toEqual(['1', '5']);

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
