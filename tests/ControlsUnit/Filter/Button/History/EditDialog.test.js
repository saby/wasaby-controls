define(['Controls/filterPopup', 'Core/core-clone'], function (filterPopup, Clone) {
   describe('FilterHistory:EditDialog', function () {
      let items = [
         { name: 'period', value: [2], textValue: 'Today' },
         { name: 'warehouse', value: [], textValue: '' },
         { name: 'sender', value: '', textValue: '' },
         {
            name: 'author',
            value: 'Ivanov K.K.',
            textValue: 'Ivanov K.K.',
            visibility: true
         },
         {
            name: 'responsible',
            value: 'Petrov T.T.',
            textValue: 'Petrov T.T.',
            visibility: false
         }
      ];

      let defaultConfig = {
         items: items,
         isClient: 0,
         isFavorite: false,
         editedTextValue: 'Today, Ivanov K.K.'
      };

      it('prepareConfig', function () {
         let dialog = new filterPopup._EditDialog();
         dialog._keyProperty = dialog._getKeyProperty(defaultConfig.items);
         dialog.prepareConfig(dialog, defaultConfig);
         expect(dialog._placeholder).toEqual(defaultConfig.editedTextValue);
         expect(dialog._textValue).toEqual('');
         expect(dialog._isClient).toEqual(0);
         expect(dialog._selectedFilters).toEqual(['period', 'author']);
         expect(dialog._source).toBeTruthy();
      });

      it('_beforeUpdate', function () {
         let dialog = new filterPopup._EditDialog();
         dialog.saveOptions(defaultConfig);
         dialog._keyProperty = dialog._getKeyProperty(defaultConfig.items);

         let newConfig = { ...defaultConfig };
         newConfig.editedTextValue = 'new text';
         newConfig.isFavorite = true;
         newConfig.isClient = 1;
         dialog._beforeUpdate(newConfig);
         expect(dialog._textValue).toEqual(newConfig.editedTextValue);
         expect(dialog._isClient).toEqual(newConfig.isClient);
         expect(dialog._selectedFilters).toEqual(['period', 'author']);
      });

      it('_delete', function () {
         let dialog = new filterPopup._EditDialog();

         let expectedResult,
            isClosed = false;
         dialog._notify = (event, data) => {
            if (event === 'sendResult') {
               expectedResult = data[0];
            } else if (event === 'close') {
               isClosed = true;
            }
         };

         dialog._delete();
         expect(expectedResult.action).toEqual('delete');
         expect(isClosed).toBe(true);
      });

      it('_apply', function () {
         let dialog = new filterPopup._EditDialog();
         let isShowedConfirm = false;
         dialog.saveOptions(defaultConfig);
         dialog._keyProperty = dialog._getKeyProperty(defaultConfig.items);
         dialog.prepareConfig(dialog, defaultConfig);
         dialog._selectedFilters = [];
         let expectedResult = {},
            isClosed = false;
         dialog._notify = (event, data) => {
            if (event === 'sendResult') {
               expectedResult = data[0];
            } else if (event === 'close') {
               isClosed = true;
            }
         };

         dialog.showConfirmation = () => {
            isShowedConfirm = true;
         };

         dialog._apply();
         expect(expectedResult).toEqual({});
         expect(isClosed).toBe(false);
         expect(isShowedConfirm).toBe(true);

         dialog._selectedFilters = ['author'];
         dialog._apply();
         expect(expectedResult.action).toEqual('save');
         expect(expectedResult.record.get('linkText')).toEqual(dialog._placeholder);
         expect(expectedResult.record.get('isClient')).toEqual(0);
         expect(isClosed).toBe(true);
      });

      it('getItemsToSave', function () {
         let dialog = new filterPopup._EditDialog();
         dialog._keyProperty = dialog._getKeyProperty(defaultConfig.items);
         dialog.prepareConfig(dialog, defaultConfig);

         let itemsToSave = Clone(items);
         itemsToSave[4].visibility = true;

         let expectedItems = Clone(itemsToSave);
         expectedItems[4].value = null;
         expectedItems[4].textValue = '';
         expectedItems[4].visibility = false;
         let resultItems = dialog.getItemsToSave(itemsToSave, dialog._selectedFilters);
         expect(expectedItems).toEqual(resultItems);
      });

      it('getItemsToSaveOldItems', () => {
         let dialog = new filterPopup._EditDialog();
         let oldItems = Clone(items);
         oldItems.forEach((item) => {
            item.id = item.name;
            delete item.name;
         });
         const config = Clone(defaultConfig);
         config.items = oldItems;
         dialog._keyProperty = dialog._getKeyProperty(config.items);
         dialog.prepareConfig(dialog, config);

         let itemsToSave = Clone(oldItems);
         itemsToSave[4].visibility = true;

         let expectedItems = Clone(itemsToSave);
         expectedItems[4].value = null;
         expectedItems[4].textValue = '';
         expectedItems[4].visibility = false;
         let resultItems = dialog.getItemsToSave(itemsToSave, dialog._selectedFilters);
         expect(expectedItems).toEqual(resultItems);
      });
   });
});
