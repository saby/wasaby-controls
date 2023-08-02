define(['Controls/_filter/Utils/mergeSource'], function (mergeSource) {
   it('mergeSource', () => {
      var items = [
         {
            id: 'testId',
            value: '',
            textValue: '',
            resetValue: ''
         },
         {
            id: 'testId2',
            value: 'testValue',
            textValue: '',
            resetValue: '',
            visibility: false
         },
         {
            id: 'testId3',
            value: 'testValue2',
            textValue: 'textTextValue',
            resetValue: ''
         },
         {
            id: 'testId4',
            value: 'testValue2',
            resetValue: '',
            visibility: true
         }
      ];

      var history = [
         {
            id: 'testId',
            value: 'testValue',
            resetValue: '',
            textValue: 'textTextValue'
         },
         {
            id: 'testId2',
            value: 'testValue1',
            resetValue: '',
            textValue: '',
            visibility: true
         },
         {
            id: 'testId4',
            value: 'testValue1',
            resetValue: '',
            textValue: '',
            visibility: undefined
         }
      ];

      var result = [
         {
            id: 'testId',
            value: 'testValue',
            textValue: 'textTextValue',
            resetValue: ''
         },
         {
            id: 'testId2',
            value: 'testValue1',
            textValue: '',
            resetValue: '',
            visibility: true
         },
         {
            id: 'testId3',
            value: 'testValue2',
            textValue: 'textTextValue',
            resetValue: ''
         },
         {
            id: 'testId4',
            value: 'testValue1',
            resetValue: '',
            visibility: undefined
         }
      ];

      mergeSource.default(items, history);
      expect(result).toEqual(items);

      items = [
         {
            name: 'testId',
            value: '',
            textValue: '',
            resetValue: '',
            viewMode: 'extended',
            anyField: 'anyValue123'
         }
      ];

      history = [
         {
            name: 'testId',
            value: 'testValue',
            resetValue: '',
            textValue: 'textTextValue',
            anyField: 'anyValue',
            viewMode: 'frequent'
         }
      ];

      result = [
         {
            name: 'testId',
            value: 'testValue',
            textValue: 'textTextValue',
            resetValue: '',
            viewMode: 'extended',
            anyField: 'anyValue'
         }
      ];

      mergeSource.default(items, history);
      expect(result).toEqual(items);
   });
});
