define(['Controls/Pending', 'Core/Deferred'], (
   PendingRegistrator,
   Deferred
) => {
   'use strict';
   describe('Controls/Container/PendingRegistrator', () => {
      it('finishPendingOperations', () => {
         let Registrator = new PendingRegistrator.default();
         let def1 = new Deferred();
         let def2 = new Deferred();
         let def3 = new Deferred();
         const callPendingFail = [];

         Registrator._beforeMount();
         Registrator._registerPendingHandler(null, def1, {
            onPendingFail: function () {
               callPendingFail.push(1);
            }
         });
         Registrator._registerPendingHandler(null, def2, {
            validate: function () {
               return false;
            },
            onPendingFail: function () {
               callPendingFail.push(2);
            }
         });
         Registrator._registerPendingHandler(null, def3, {
            onPendingFail: function () {
               callPendingFail.push(3);
            }
         });

         Registrator.finishPendingOperations();

         expect(callPendingFail).toEqual([1, 3]);

         Registrator._beforeUnmount();
      });
      it('register/unregister pending', async () => {
         let Registrator = new PendingRegistrator.default();
         let def1 = new Deferred();
         let def2 = new Deferred();
         let def3 = new Deferred();
         const baseRoot = null;
         const firstRoot = 1;

         Registrator._beforeMount();
         Registrator._children = {
            loadingIndicator: {
               show: () => {
                  return 'id1';
               },
               hide: (id) => {
                  expect(id).toEqual('id1');
               }
            }
         };
         Registrator._registerPendingHandler(null, def1, {});
         Registrator._registerPendingHandler(null, def2, {
            showLoadingIndicator: true,
            root: firstRoot
         });
         Registrator._registerPendingHandler(null, def3, {});
         expect(
            Object.keys(Registrator._pendingController._pendings).length
         ).toEqual(2);
         expect(
            Object.keys(Registrator._pendingController._pendings[baseRoot])
               .length
         ).toEqual(2);
         expect(
            Object.keys(Registrator._pendingController._pendings[firstRoot])
               .length
         ).toEqual(1);

         def1.callback();
         def2.callback();
         def3.callback();

         await Promise.all([def1, def2, def3]);

         expect(
            Object.keys(Registrator._pendingController._pendings)
         ).toHaveLength(0);

         Registrator._beforeUnmount();
      });

      it('hasRegisteredPendings', () => {
         let Registrator = new PendingRegistrator.default();
         Registrator._beforeMount();
         let pendingCfg1 = {
            validate: () => {
               return false;
            }
         };
         let pendingCfg2 = {
            validateCompatible: () => {
               return true;
            }
         };
         Registrator._registerPendingHandler(null, new Deferred(), pendingCfg1);
         expect(Registrator._hasRegisteredPendings()).toEqual(false);

         Registrator._registerPendingHandler(null, new Deferred(), pendingCfg2);
         expect(Registrator._hasRegisteredPendings()).toEqual(true);
         expect(Registrator._hasRegisteredPendings(false)).toEqual(false);

         Registrator._registerPendingHandler(null, new Deferred(), {});
         expect(Registrator._hasRegisteredPendings()).toEqual(true);

         Registrator._beforeUnmount();
      });

      it('should call unregisterPending1', (done) => {
         let resolver;
         const Registrator = new PendingRegistrator.default();
         Registrator._beforeMount();
         const promise = new Promise((resolve) => {
            resolver = resolve;
         });

         let stub = jest
            .spyOn(Registrator._pendingController, 'unregisterPending')
            .mockClear()
            .mockImplementation();
         Registrator._registerPendingHandler(null, promise, {});
         promise
            .then(() => {
               expect(stub).toHaveBeenCalledTimes(1);
               done();
               Registrator._beforeUnmount();
            })
            .catch(done);
         resolver();
      });

      it('should call unregisterPending2', (done) => {
         let rejector;
         const Registrator = new PendingRegistrator.default();
         Registrator._beforeMount();
         const promise = new Promise((resolve, reject) => {
            rejector = reject;
         });

         let stub = jest
            .spyOn(Registrator._pendingController, 'unregisterPending')
            .mockClear()
            .mockImplementation();
         Registrator._registerPendingHandler(null, promise, {});
         promise.then(done).catch(() => {
            expect(stub).toHaveBeenCalledTimes(1);
            done();
            Registrator._beforeUnmount();
         });
         rejector();
      });
      [
         {
            pendingCounter: 0
         },
         {
            pendingCounter: 10
         }
      ].forEach((test, testNumber) => {
         it('should use correct _pendingsCounter ' + testNumber, (done) => {
            let resolver;
            const Registrator = new PendingRegistrator.default();
            Registrator._beforeMount();
            const promise = new Promise((resolve) => {
               resolver = resolve;
            });

            Registrator._pendingController._pendingsCounter =
               test.pendingCounter;

            let stub = jest
               .spyOn(Registrator._pendingController, 'unregisterPending')
               .mockClear()
               .mockImplementation();
            Registrator._registerPendingHandler(null, promise, {});
            promise
               .then(() => {
                  expect(stub).toHaveBeenCalledWith(null, test.pendingCounter);
                  done();
                  Registrator._beforeUnmount();
               })
               .catch(done);
            resolver();
         });
      });

      it('should call pendingsFinished', () => {
         let Registrator = new PendingRegistrator.PendingClass({
            notifyHandler: jest.fn()
         });

         Registrator._pendings = {
            key: {
               two: 2,
               three: 3
            }
         };
         const pendingObj = {
            key: {
               three: 3
            }
         };
         Registrator.unregisterPending('key', 'two');
         expect(Registrator._pendings).toEqual(pendingObj);

         Registrator.unregisterPending('key', 'three');
         expect(Registrator._pendings).toEqual({});
      });
   });
});
