define(['Controls/filterDateRangeEditor', 'Controls/dateRange'], function (
   DateRangeEditor,
   dateRange
) {
   describe('Controls/filter:DateRange', function () {
      it('_beforeMount', () => {
         var rangeEditor = new DateRangeEditor.default();
         rangeEditor._beforeMount({
            editorMode: 'Lite'
         });
         expect(rangeEditor._datePopupType).toEqual('shortDatePicker');

         rangeEditor._beforeMount({
            editorMode: 'Selector'
         });
         expect(rangeEditor._datePopupType).toEqual('datePicker');
      });

      describe('_beforeMount _emptyCaption', () => {
         let rangeEditor;
         const resetValue = [new Date('April 1, 1995'), new Date('April 30, 1995')];

         beforeEach(() => {
            rangeEditor = new DateRangeEditor.default();
         });

         it('option emptyCaption', () => {
            rangeEditor._beforeMount({
               emptyCaption: 'testCaption',
               resetValue
            });
            expect(rangeEditor._emptyCaption).toEqual('testCaption');
         });

         it('without option emptyCaption', () => {
            rangeEditor._beforeMount({
               resetValue
            });
            expect(rangeEditor._emptyCaption).toEqual("Апрель'95");
         });
      });

      it('_rangeChanged', () => {
         var rangeEditor = new DateRangeEditor.default();
         var textValue;

         rangeEditor.saveOptions({
            emptyCaption: 'testEmptyCaption'
         });

         rangeEditor._notify = (evt, eventValue) => {
            if (evt === 'textValueChanged') {
               textValue = eventValue[0];
            }
         };

         rangeEditor._dateRangeModule = dateRange;

         rangeEditor._rangeChanged(
            { stopPropagation: jest.fn() },
            new Date('April 17, 1995 03:24:00'),
            new Date('May 17, 1995 03:24:00')
         );
         expect(textValue).toEqual('17.04.95 - 17.05.95');
      });

      it('textValueChanged with captionFormatter', () => {
         const rangeEditor = new DateRangeEditor.default();
         const resetValue = [
            new Date('April 17, 1995 03:24:00'),
            new Date('May 17, 1995 03:24:00')
         ];
         let textValue;

         rangeEditor.saveOptions({
            resetValue,
            value: resetValue,
            captionFormatter: () => {
               return 'testTextValue';
            }
         });
         rangeEditor._dateRangeModule = dateRange;

         rangeEditor._notify = (event, eventValue) => {
            if (event === 'textValueChanged') {
               textValue = eventValue[0];
            }
         };

         rangeEditor._rangeChanged({ stopPropagation: jest.fn() }, null, null);
         expect(textValue === 'testTextValue').toBeTruthy();
      });
   });
});
