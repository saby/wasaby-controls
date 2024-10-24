define(['Controls/history', 'Types/deferred', 'Env/Env', 'Application/Env', 'UI/Utils'], (
   history,
   defferedLib,
   Env,
   ApplicationEnv,
   { Logger }
) => {
   describe('Controls/history:Service', () => {
      const originalGetStore = ApplicationEnv.getStore;
      const originalSetStore = ApplicationEnv.setStore;

      afterEach(() => {
         ApplicationEnv.getStore = originalGetStore;
         ApplicationEnv.setStore = originalSetStore;
      });

      it('query', (done) => {
         const isBrowser = Env.constants.isBrowserPlatform;
         Env.constants.isBrowserPlatform = true;

         const service = new history.Service({ historyId: 'testId' });
         const loadDeferred = new defferedLib.Deferred();

         service._$historyDataSource = {
            call: () => {
               return loadDeferred;
            }
         };

         let queryDef = service.query();
         expect(queryDef === loadDeferred).toBe(true);

         let nextQuery = service.query();
         const expectedData = { history: 'test' };
         service.saveHistory('testId', expectedData);
         nextQuery.addCallback((data) => {
            expect(data.getRawData()).toEqual(expectedData);
            done();
         });
         loadDeferred.callback();
         Env.constants.isBrowserPlatform = isBrowser;
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

      it('query in offline application', (done) => {
         const service = new history.Service({ historyId: 'testId' });
         Env.detection.isDesktop = true;
         const result = service.query();
         Env.detection.isDesktop = false;
         result.then((res) => {
            expect(res.getAll().getCount() === 0).toBe(true);
            Env.detection.isDesktop = true;
            service.update({ $_addFromData: true }).then((updateRes) => {
               expect(updateRes).not.toBeDefined();
               done();
            });
            Env.detection.isDesktop = false;
         });
      });

      it('destroy', () => {
         const service = new history.Service({ historyId: 'testId' });
         let methodName;
         let methodMeta;

         service._$historyDataSource = {
            call: (method, meta) => {
               methodName = method;
               methodMeta = meta;
            }
         };

         service.destroy('test');

         expect(methodName).toEqual('Delete');
         expect(methodMeta).toEqual({
            history_id: 'testId',
            object_id: 'test'
         });
      });
   });
});
