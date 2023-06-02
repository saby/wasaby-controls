define(['Controls/history', 'Controls/suggestPopup'], function (
   history,
   suggestPopup
) {
   describe('Controls/_suggestPopup/LoadService', function () {
      it('LoadHistoryService', function (done) {
         new suggestPopup.LoadService({
            historyId: 'historyField'
         }).addCallback(function (historyService) {
            expect(historyService instanceof history.Service).toBe(true);
            expect(
               new suggestPopup.LoadService({
                  historyId: 'historyField'
               }).getResult() instanceof history.Service
            ).toBe(true);
            done();
         });
      });
   });
});
