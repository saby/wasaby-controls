define(['Controls/filter', 'Controls/history', 'Env/Env', 'Types/source'], function (
   filter,
   history,
   Env,
   sourceLib
) {
   describe('Filter.Button.HistoryUtils', function () {
      var historyId = 'TEST_HISTORY_ID_UTILS';

      it('getHistorySource', function () {
         var isServerSide = Env.constants.isServerSide;
         Env.constants.isServerSide = false;
         var hSource = filter.HistoryUtils.getHistorySource({
            historyId: historyId
         });
         expect(hSource instanceof history.FilterSource).toBe(true);
         var hSource2 = filter.HistoryUtils.getHistorySource({
            historyId: historyId
         });
         expect(hSource === hSource2).toBe(true);
         Env.constants.isServerSide = isServerSide;
      });

      it('getHistorySource isServerSide', function () {
         var hSource = filter.HistoryUtils.getHistorySource({
            historyId: historyId
         });
         var hSource2 = filter.HistoryUtils.getHistorySource({
            historyId: historyId
         });
         expect(hSource === hSource2).toBe(true);
      });

      it('isHistorySource', function () {
         let origSource = new sourceLib.Memory({
            keyProperty: 'key',
            data: []
         });
         let hSource = new history.Source({
            originSource: origSource,
            historySource: new history.Service({
               historyId: 'TEST'
            })
         });

         expect(filter.HistoryUtils.isHistorySource(hSource)).toBe(true);
         expect(filter.HistoryUtils.isHistorySource(origSource)).toBe(false);
      });
   });
});
