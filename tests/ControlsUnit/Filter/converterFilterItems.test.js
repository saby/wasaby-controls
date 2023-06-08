define(['Controls/_filter/converterFilterItems'], function (Converter) {
   describe('ConverterFilterItems', function () {
      let filterSource = [
         {
            name: 'text',
            value: 'value1',
            resetValue: 'resetValue1',
            viewMode: 'basic'
         },
         {
            name: 'boolean',
            value: 'value2',
            resetValue: 'resetValue2',
            textValue: '123',
            viewMode: 'basic',
            source: 'dataSource'
         },
         {
            name: 'Array',
            value: 'value3',
            resetValue: 'resetValue3',
            viewMode: 'extended',
            visibility: false,
            caption: '12345'
         },
         {
            name: 'Number',
            value: 'value4',
            resetValue: 'resetValue4',
            viewMode: 'frequent',
            editorOptions: { source: 'dataSource' }
         }
      ];

      let detailPanelItems = [
         {
            name: 'text',
            value: 'value1',
            resetValue: 'resetValue1',
            visibility: undefined,
            viewMode: 'basic'
         },
         {
            name: 'boolean',
            value: 'value2',
            resetValue: 'resetValue2',
            textValue: '123',
            viewMode: 'basic',
            source: 'dataSource',
            visibility: undefined
         },
         {
            name: 'Array',
            value: 'value3',
            resetValue: 'resetValue3',
            viewMode: 'extended',
            visibility: false,
            caption: '12345'
         },
         {
            name: 'Number',
            value: 'value4',
            resetValue: 'resetValue4',
            viewMode: 'frequent',
            visibility: undefined,
            editorOptions: { source: 'dataSource' }
         }
      ];

      let filterItems = [
         {
            name: 'text',
            value: 'value1',
            resetValue: 'resetValue1',
            visibility: undefined,
            viewMode: 'basic'
         },
         {
            name: 'boolean',
            value: 'value2',
            resetValue: 'resetValue2',
            textValue: '123',
            viewMode: 'basic',
            source: 'dataSource',
            visibility: undefined
         },
         {
            name: 'Array',
            value: 'value3',
            resetValue: 'resetValue3',
            viewMode: 'extended',
            visibility: false,
            caption: '12345'
         },
         {
            name: 'Number',
            value: 'value4',
            resetValue: 'resetValue4',
            viewMode: 'frequent',
            visibility: undefined,
            editorOptions: { source: 'dataSource' }
         }
      ];

      it('convertToDetailPanelItems', function () {
         let actualDetailPanelItems =
            Converter.convertToDetailPanelItems(filterSource);
         expect(actualDetailPanelItems).toEqual(detailPanelItems);
      });

      it('convertToFilterSource', function () {
         let actualFilterSource = Converter.convertToFilterSource(filterItems);
         expect(actualFilterSource).toEqual(filterSource);
      });

      it('convertToFilterSource items with name', function () {
         let innerFilterItems = [
            {
               name: 'text',
               value: 'value1',
               viewMode: 'basic'
            },
            {
               name: 'boolean',
               value: 'value2',
               textValue: '123',
               viewMode: 'basic'
            },
            {
               name: 'Array',
               value: 'value3',
               viewMode: 'extended',
               visibility: false
            },
            {
               name: 'Number',
               value: 'value4',
               viewMode: 'frequent'
            }
         ];
         innerFilterItems.clone = true;
         let actualFilterItems =
            Converter.convertToFilterSource(innerFilterItems);
         expect(actualFilterItems).toEqual(innerFilterItems);
         expect(actualFilterItems.clone).toBe(true);
      });
   });
});
