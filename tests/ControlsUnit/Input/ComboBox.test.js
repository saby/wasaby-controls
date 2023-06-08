define([
   'Controls/dropdown',
   'Core/core-clone',
   'Types/source',
   'Types/collection',
   'Types/entity'
], (dropdown, Clone, sourceLib, collection, entity) => {
   describe('Input.Combobox', () => {
      let items = [
         {
            id: '1',
            title: 'Запись 1'
         },
         {
            id: '2',
            title: 'Запись 2'
         },
         {
            id: '3',
            title: 'Запись 3'
         }
      ];

      let itemsRecords = new collection.RecordSet({
         keyProperty: 'id',
         rawData: items
      });

      let config = {
         selectedKey: '2',
         displayProperty: 'title',
         keyProperty: 'id',
         value: 'New text',
         placeholder: 'This is placeholder',
         source: new sourceLib.Memory({
            keyProperty: 'id',
            data: items
         })
      };

      let getCombobox = function (cfg) {
         let combobox = new dropdown.Combobox(cfg);
         combobox.saveOptions(cfg);
         combobox._simpleViewModel = { updateOptions: jest.fn() };
         return combobox;
      };

      describe('_setText', () => {
         let combobox;
         beforeEach(() => {
            const newConfig = { ...config, emptyKey: null };
            combobox = getCombobox(newConfig);
         });

         it('_setText', function () {
            combobox._setText(combobox._options, [itemsRecords.at(1)]);
            expect('Запись 2').toEqual(combobox._value);
            combobox._setText(combobox._options, []);
            expect('').toBe(combobox._value);
            expect('This is placeholder').toBe(combobox._placeholder);

            combobox._setText(combobox._options, [
               new entity.Model({
                  rawData: { id: '1', title: 123 }
               })
            ]);
            expect('123').toBe(combobox._value);
         });

         it('_setText set 0', function () {
            let selectedItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [{ id: '1', title: 0 }]
            });
            combobox._setText(combobox._options, [selectedItems.at(0)]);
            expect('0').toEqual(combobox._value);
         });

         it('_setText empty item', function () {
            let emptyItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [{ id: null, title: 'Не выбрано' }]
            });
            combobox._options.emptyText = 'Не выбрано';
            combobox._options.emptyKey = null;
            combobox._setText(combobox._options, [emptyItems.at(0)]);
            expect('').toEqual(combobox._value);
            expect('Не выбрано').toEqual(combobox._placeholder);
         });

         it('_setText key = emptyKey', function () {
            let emptyItems = new collection.RecordSet({
               keyProperty: 'id',
               rawData: [{ id: null, title: 'Не выбрано' }]
            });
            combobox._options.emptyText = null;
            combobox._options.emptyKey = null;
            combobox._setText(combobox._options, [emptyItems.at(0)]);
            expect('Не выбрано').toEqual(combobox._value);
            expect('This is placeholder').toEqual(combobox._placeholder);
         });
      });

      it('_selectedItemsChangedHandler', function () {
         let combobox = getCombobox(config);
         combobox._notify = function (event, data) {
            if (event === 'valueChanged') {
               expect(data[0]).toEqual('Запись 2');
            } else if (event === 'selectedKeyChanged') {
               expect(data[0]).toEqual('2');
            }
         };
      });

      describe('_beforeMount', function () {
         it('beforeMount with selectedKeys', () => {
            let combobox = getCombobox(config);
            combobox._beforeMount(config);
            expect(combobox._value).toEqual('New text');
            expect(combobox._placeholder).toEqual('This is placeholder');
         });

         it('beforeMount without source', () => {
            const comboboxOptions = { ...config };
            delete comboboxOptions.source;
            const combobox = getCombobox(comboboxOptions);
            expect(combobox._beforeMount(comboboxOptions) === undefined).toBeTruthy();
         });
      });

      it('_beforeUpdate', function () {
         let combobox = getCombobox(config);
         let isUpdated = false;
         combobox._controller = {
            update: () => {
               isUpdated = true;
            }
         };
         combobox._beforeUpdate({});
         expect(isUpdated).toBe(true);
      });

      it('_beforeUpdate readOnly changes', function () {
         let combobox = getCombobox(config);
         combobox._controller = {
            update: jest.fn()
         };
         combobox._beforeUpdate({
            readOnly: true
         });
         expect(combobox._readOnly).toBe(true);
      });

      it('dataLoadCallback option', function () {
         let isCalled = false;
         let combobox = getCombobox(config);
         combobox._options.dataLoadCallback = () => {
            isCalled = true;
         };
         combobox._dataLoadCallback(combobox._options, itemsRecords);

         expect(isCalled).toBe(true);
      });

      it('_getMenuPopupConfig', () => {
         let combobox = getCombobox(config);
         combobox._container = { offsetWidth: 250 };

         let result = combobox._getMenuPopupConfig();
         expect(result.templateOptions.width).toEqual(250);

         combobox._container.offsetWidth = null;
         result = combobox._getMenuPopupConfig();
         expect(result.templateOptions.width).toEqual(null);
      });

      it('_afterMount', () => {
         let combobox = getCombobox(config);
         let selectedItemIsChanged = false;
         combobox._selectedItemsChangedHandler = () => {
            selectedItemIsChanged = true;
         };
         combobox._selectedItem = new entity.Model({
            rawData: {
               key: 1
            }
         });
         combobox._countItems = 1;
         combobox._afterMount({
            keyProperty: 'key',
            selectedKey: 1
         });
         expect(selectedItemIsChanged).toBe(false);

         combobox._afterMount({
            keyProperty: 'key',
            selectedKey: 5
         });
         expect(selectedItemIsChanged).toBe(true);
      });

      describe('check readOnly state', () => {
         let combobox;
         let itemsCallback = new collection.RecordSet({
            keyProperty: 'key',
            rawData: []
         });
         beforeEach(() => {
            combobox = getCombobox(config);
            combobox._controller = {
               update: jest.fn()
            };
         });

         it('count of items = 0', () => {
            combobox._dataLoadCallback(combobox._options, itemsCallback);
            expect(combobox._readOnly).toBe(true);
            expect(combobox._selectedItem).not.toBeDefined();
            expect(combobox._countItems).toEqual(0);
         });

         it('count of items = 1', () => {
            itemsCallback.add(
               new entity.Model({
                  rawData: { key: '1' }
               })
            );
            combobox._dataLoadCallback(combobox._options, itemsCallback);
            expect(combobox._readOnly).toBe(true);
            expect(combobox._selectedItem).toEqual(itemsCallback.at(0));
         });

         it('count of items = 1, with emptyText', () => {
            combobox._options.emptyText = 'test';
            combobox._options.readOnly = false;
            combobox._dataLoadCallback(combobox._options, itemsCallback);
            expect(combobox._readOnly).toBe(false);
         });

         it('count of items = 2', () => {
            itemsCallback.add(
               new entity.Model({
                  rawData: { key: '2' }
               })
            );
            combobox._dataLoadCallback(combobox._options, itemsCallback);
            expect(combobox._readOnly).toBe(false);
            expect(combobox._selectedItem).not.toBeDefined();
         });

         it('count of items = 2, with options.readOnly', () => {
            combobox._options.readOnly = true;
            combobox._dataLoadCallback(combobox._options, itemsCallback);
            expect(combobox._readOnly).toBe(true);
         });
      });
   });
});
