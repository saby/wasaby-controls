define([
   'Controls/historyOld',
   'Types/deferred',
   'Env/Env',
   'Application/Env',
   'UI/Utils',
   'Controls-HistoryLocal/HistoryStore'
], (history, defferedLib, Env, ApplicationEnv, { Logger }, { Store }) => {
   describe('Controls/historyOld:Service', () => {
      it('query', async () => {
         await Store.push('queryTestId', 'someId');
         const service = new history.Service({ historyId: 'queryTestId' });

         const queryResult = await service.query();
         expect(queryResult.getRawData().recent.at(0).get('ObjectId')).toEqual('someId');
      });

      it('query without history id', () => {
         const service = new history.Service({ historyIds: [] });
         let isSourceCalled = false;

         service._historyDataSource = {
            call: () => {
               isSourceCalled = false;
            }
         };

         return new Promise((resolve) => {
            jest.spyOn(Logger, 'error').mockClear().mockImplementation();
            service.query().then(null, () => {
               expect(isSourceCalled).toBe(false);
               expect(Logger.error).toHaveBeenCalledTimes(1);
               jest.restoreAllMocks();
               resolve();
            });
         });
      });

      it('destroy', async () => {
         const service = new history.Service({ historyId: 'destroyTestId' });
         await Store.push('destroyTestId', 'someId');
         await service.destroy('someId');
         const queryResult = await service.query();
         expect(queryResult.getRawData().recent.getCount()).toEqual(0);
      });
   });
});
