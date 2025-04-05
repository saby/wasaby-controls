define(['Controls/dropdown', 'Controls/historyOld', 'Types/source'], (
   dropdown,
   history,
   Source
) => {
   describe('dropdownHistoryUtils', () => {
      it('getFilter', () => {
         var filter = dropdown.dropdownHistoryUtils.getSourceFilter(
            { id: 'test' },
            new history.Source({})
         );
         expect(filter).toEqual({ $_history: true, id: 'test' });
         filter = dropdown.dropdownHistoryUtils.getSourceFilter(
            { id: 'test2' },
            new Source.Memory({})
         );
         expect(filter).toEqual({ id: 'test2' });
         filter = dropdown.dropdownHistoryUtils.getSourceFilter(undefined, new history.Source({}));
         expect(filter).toEqual({ $_history: true });
      });
   });
});
