define(['Controls/filter'], function (filter) {
   describe('filter:resetFilterUtils', function () {
      it('hasResetValue', function () {
         let items = [
            {
               id: 'text',
               value: 'value1',
               resetValue: 'resetValue1'
            },
            {
               id: 'boolean',
               value: 'value2',
               resetValue: 'resetValue2'
            }
         ];
         let result = filter.FilterUtils.hasResetValue(items);
         expect(result).toBe(true);

         items = [
            {
               id: 'text',
               value: 'value1'
            },
            {
               id: 'boolean',
               value: 'value2'
            }
         ];
         result = filter.FilterUtils.hasResetValue(items);
         expect(result).toBe(false);
      });

      it('resetFilter', function () {
         let items = [
            {
               id: 'text',
               value: 'value1',
               resetValue: 'resetValue1',
               visibility: undefined
            },
            {
               id: 'boolean',
               value: 'value2',
               resetValue: 'resetValue2',
               textValue: '123',
               visibility: undefined,
               viewMode: 'basic',
               editorOptions: {
                  extendedCaption: 'testExtendedCaption'
               }
            },
            {
               id: 'Array',
               value: 'resetValue3',
               resetValue: 'resetValue3',
               viewMode: 'extended',
               visibility: true
            },
            {
               id: 'Number',
               value: 'value4',
               resetValue: 'resetValue4',
               visibility: false
            },
            {
               id: 'Object',
               value: 'value5',
               resetValue: 'resetValue5',
               textValue: null,
               visibility: false
            }
         ];

         let expectedItems = [
            {
               id: 'text',
               value: 'resetValue1',
               resetValue: 'resetValue1',
               visibility: undefined
            },
            {
               id: 'boolean',
               value: 'resetValue2',
               resetValue: 'resetValue2',
               textValue: '',
               visibility: undefined,
               viewMode: 'extended',
               editorOptions: {
                  extendedCaption: 'testExtendedCaption'
               }
            },
            {
               id: 'Array',
               value: 'resetValue3',
               resetValue: 'resetValue3',
               viewMode: 'extended',
               visibility: false
            },
            {
               id: 'Number',
               value: 'resetValue4',
               resetValue: 'resetValue4',
               visibility: false
            },
            {
               id: 'Object',
               value: 'resetValue5',
               resetValue: 'resetValue5',
               textValue: null,
               visibility: false
            }
         ];

         filter.FilterUtils.resetFilter(items);
         expect(items).toEqual(expectedItems);
      });
   });
});
