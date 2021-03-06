define([
   'Controls/form',
   'Core/Deferred',
   'Types/entity',
   'Controls/_form/CrudController',
   'Core/polyfill/PromiseAPIDeferred'
], (form, Deferred, entity, CrudController) => {
   'use strict';

   describe('FormController', () => {
      it('initializingWay', (done) => {
         let FC = new form.Controller();

         let cfg = {
            record: new entity.Record(),
         };

         let isReading = false;
         let isCreating = false;

         FC._readRecordBeforeMount = () => {
            isReading = true;
            return Promise.resolve({ data: true });
         };

         FC._createRecordBeforeMount = () => {
            isCreating = true;
            return Promise.resolve({ data: true });
         };

         let p1 = new Promise((resolve) => {
            let beforeMountResult = FC._beforeMount(cfg);
            assert.equal(isReading, false);
            assert.equal(isCreating, false);
            assert.notEqual(beforeMountResult, true);
            resolve();
         });

         let p2 = new Promise((resolve) => {
            cfg.key = '123';
            let beforeMountResult = FC._beforeMount(cfg);
            assert.equal(isReading, true);
            assert.equal(isCreating, false);
            assert.notEqual(beforeMountResult, true);
            resolve();
         }).catch((error) => {
            done(error);
         });

         let p3 = new Promise((resolve) => {
            cfg = {
               key: 123
            };
            isReading = false;
            let beforeMountResult = FC._beforeMount(cfg);
            assert.equal(isReading, true);
            assert.equal(isCreating, false);
            assert.isTrue(
               beforeMountResult instanceof Deferred ||
               beforeMountResult instanceof Promise
            );
            beforeMountResult.then(({ data }) => {
               assert.equal(data, true);
               resolve();
            }).catch((error) => {
               done(error);
            });
         });
         let p4 = new Promise((resolve) => {
            isReading = false;
            isCreating = false;
            let beforeMountResult = FC._beforeMount({});
            assert.equal(isReading, false);
            assert.equal(isCreating, true);
            assert.isTrue(
               beforeMountResult instanceof Deferred ||
               beforeMountResult instanceof Promise
            );
            beforeMountResult.then(({ data }) => {
               assert.equal(data, true);
               resolve();
            });
         });

         Promise.all([p1, p2, p3, p4]).then(() => {
            FC.destroy();
            done();
         });
      });
      it('beforeUpdate', async () => {
         let FC = new form.Controller();
         let setRecordCalled = false;
         let readCalled = false;
         let createCalled = false;
         let createPromiseResolver;
         let createPromiseResolverUpdate;
         let createPromiseResolverShow;
         let createPromiseResolverReed;
         let createPromiseResolverDelete;
         let createPromise;
         const originConfirmationCallback = FC._confirmRecordChangeHandler;
         const record = {
            isChanged: () => false
         };
         const diffRecord = {
            isChanged: () => false
         };

         FC._setRecord = (record) => {
            FC._record = record;
            setRecordCalled = true;
         };
         FC.read = () => {
            readCalled = true;
            return new Promise((res) => {
               createPromiseResolverReed = res;
            });
         };
         FC.create = () => {
            createCalled = true;
            createPromise = new Promise((res) => { createPromiseResolver = res; });
            return createPromise;
         };
         FC._confirmRecordChangeHandler = (positiveCallback, negativeCallback) => {
            return positiveCallback();
         };
         FC._crudController = {
            _source: null,
            setDataSource(source) {
               this._source = source;
            }
         };

         FC._beforeUpdate({
            record: 'record'
         });
         assert.equal(setRecordCalled, true);
         assert.equal(readCalled, false);
         assert.equal(createCalled, false);

         setRecordCalled = false;
         const newSource = {};
         let originRead = FC.read;
         FC.read = () => {

            // is source changed source will be setted before read
            assert.equal(FC._crudController._source, newSource);
            return originRead();
         };
         FC._beforeUpdate({
            record: record,
            key: 'key',
            source: newSource
         });

         assert.equal(setRecordCalled, true);
         assert.equal(readCalled, true);
         assert.equal(createCalled, false);
         assert.equal(FC._isNewRecord, false);

         setRecordCalled = false;
         readCalled = false;
         FC.read = originRead;

         // ???????????? ???????????? ????????????????????, ???????? ???????????????? ???????? ?? ???????????????? "??????"
         FC._confirmRecordChangeHandler = (positiveCallback, negativeCallback) => {
            return negativeCallback();
         };
         FC._beforeUpdate({
            record: diffRecord,
            key: 'key1'
         });
         assert.equal(setRecordCalled, true);

         FC._confirmRecordChangeHandler = (positiveCallback) => {
            return positiveCallback();
         };
         setRecordCalled = false;
         readCalled = false;
         FC._beforeUpdate({
            isNewRecord: true
         });

         assert.equal(setRecordCalled, false);
         assert.equal(readCalled, false);
         assert.equal(createCalled, true);
         assert.equal(FC._isNewRecord, false);

         await createPromiseResolver();

         assert.equal(FC._isNewRecord, true);

         createCalled = false;
         let updateCalled = false;
         let confirmPopupCalled = false;
         FC._confirmRecordChangeHandler = originConfirmationCallback;
         FC._showConfirmPopup = () => {
            confirmPopupCalled = true;
            return new Promise((res) => {
               createPromiseResolverShow = res;
            });
         };
         FC.update = () => {
            updateCalled = true;
            return new Promise((res) => {
               createPromiseResolverUpdate = res;
            });
         };
         record.isChanged = () => true;
         FC._options.record = record;
         FC._record = record;
         FC._beforeUpdate({
            record: record,
            key: 'key'
         });
         await createPromiseResolverShow(true);
         await createPromiseResolverUpdate();
         await createPromiseResolverReed();

         assert.equal(setRecordCalled, false);
         assert.equal(confirmPopupCalled, true);
         assert.equal(readCalled, true);
         assert.equal(updateCalled, true);
         assert.equal(createCalled, false);
         assert.equal(FC._isNewRecord, true);


         FC._showConfirmPopup = () => {
            confirmPopupCalled = true;
            return new Promise((res) => {
               createPromiseResolverShow = res;
            });
         };

         updateCalled = false;
         readCalled = false;
         confirmPopupCalled = false;
         let isDeleteRecord = false;
         FC._tryDeleteNewRecord = () => {
            isDeleteRecord = true;
            return new Promise((res) => {
               createPromiseResolverDelete = res;
            });
         };
         FC._beforeUpdate({
            record: record,
            key: 'key'
         });
         await createPromiseResolverShow(false);
         await createPromiseResolverDelete();


         assert.equal(setRecordCalled, false);
         assert.equal(confirmPopupCalled, true);
         assert.equal(isDeleteRecord, true);
         assert.equal(readCalled, true);
         assert.equal(updateCalled, false);
         assert.equal(createCalled, false);

         readCalled = false;
         createCalled = false;
         setRecordCalled = false;
         updateCalled = false;
         confirmPopupCalled = false;
         FC._showConfirmPopup = () => {
            confirmPopupCalled = true;
            return new Promise((res) => {
               createPromiseResolverShow = res;
            });
         };
         FC.update = () => {
            updateCalled = true;
            return new Promise((res) => {
               createPromiseResolverUpdate = res;
            });
         };
         let oldRecord = {
            isChanged: () => true
         };
         FC._options.record = oldRecord;
         FC._beforeUpdate({
            record: null
         });
         await createPromiseResolverShow(true);
         await createPromiseResolverUpdate();
         await createPromiseResolverReed();

         assert.equal(setRecordCalled, false);
         assert.equal(confirmPopupCalled, true);
         assert.equal(readCalled, false);
         assert.equal(updateCalled, true);
         assert.equal(createCalled, true);
         assert.equal(FC._isNewRecord, true);

         // ???????????? ???? ???????????? ???????????????????? ???????????? ?????? ?????????????? ???? ??????????????
         setRecordCalled = false;
         confirmPopupCalled = false;
         FC._isConfirmShowed = false;

         oldRecord = {
            isChanged: () => true
         };
         FC._options.record = oldRecord;
         FC._record = oldRecord;
         FC._beforeUpdate({
            record: {}
         });

         assert.equal(setRecordCalled, false);
         assert.equal(confirmPopupCalled, true);

         // ???????????? ???????????? ????????????????????, ???????? ???????? ?????????????????????????? ???? ????????????????????
         readCalled = false;
         createCalled = false;
         setRecordCalled = false;
         confirmPopupCalled = false;
         FC._isConfirmShowed = false;

         oldRecord = {
            isChanged: () => false
         };
         FC._options.record = oldRecord;
         FC._record = oldRecord;
         FC._beforeUpdate({
            record: {}
         });

         assert.equal(setRecordCalled, true);
         assert.equal(confirmPopupCalled, false);

         FC.destroy();
      });

      it('beforeUpdate change isNewRecord', () => {
         let FC = new form.Controller();
         FC._isNewRecord = undefined;
         FC._crudController = {
            setDataSource: () => {}
         };

         FC._beforeUpdate({isNewRecord: true, record: 123});
         assert.equal(FC._isNewRecord, true);

         FC._isConfirmShowed = true;
         FC._beforeUpdate({isNewRecord: false, record: 123});
         assert.equal(FC._isNewRecord, true);

         FC._isConfirmShowed = false;
         FC._beforeUpdate({isNewRecord: false, record: 123});
         assert.equal(FC._isNewRecord, false);

         FC.destroy();
      });

      it('calcInitializingWay', () => {
         let FC = new form.Controller();
         const options = {};
         let initializingWay = FC._calcInitializingWay(options);
         assert.equal(initializingWay, 'create');

         options.key = 123;
         initializingWay = FC._calcInitializingWay(options);
         assert.equal(initializingWay, 'read');

         options.record = 123;
         initializingWay = FC._calcInitializingWay(options);
         assert.equal(initializingWay, 'delayedRead');

         delete options.key;
         initializingWay = FC._calcInitializingWay(options);
         assert.equal(initializingWay, 'local');

         options.initializingWay = 'test';
         initializingWay = FC._calcInitializingWay(options);
         assert.equal(initializingWay, 'test');
         FC.destroy();
      });

      it('FormController update', (done) => {
         let isUpdatedCalled = false;
         let FC = new form.Controller();
         FC._forceUpdate = () => {
            setTimeout(FC._afterUpdate.bind(FC));
         };
         let validation = {
            submit: () => Promise.resolve(true)
         };
         FC._children = { validation };

         FC._crudController = {
            update() {}
         };
         var sandbox = sinon.createSandbox();
         let stubUpdate = sandbox.spy(FC._crudController, 'update');

         FC._update().then(() => {
            assert.equal(stubUpdate.callCount, 1);
            done();
            FC.destroy();
         });
      });

      it('FormController update with Config', (done) => {
         let configData = {
            additionalData: {
               name: 'cat'
            }
         };
         let FC = new form.Controller();
         let validation = {
            submit: () => Promise.resolve(true)
         };
         let data;
         FC._record = {
            getKey: () => 'id1',
            isChanged: () => true
         };
         FC._isNewRecord = true;
         let dataSource = {
            update: () => (new Deferred()).callback('key')
         };
         let argsCorrectUpdate = {
            key: 'key',
            isNewRecord: true,
            name: 'cat'
         };
         FC._notify = (event, arg) => {
            if (event === 'sendResult' && arg[0].formControllerEvent === 'update') {
               data = arg[0].additionalData;
            }
         };
         FC._children = { validation };
         FC._processError = () => {};
         FC._crudController = new CrudController.default(dataSource,
             FC._notifyHandler.bind(FC), FC.registerPendingNotifier.bind(FC), FC.indicatorNotifier.bind(FC));
         FC._forceUpdate = () => {
            setTimeout(FC._afterUpdate.bind(FC));
         };
         FC.update(configData).then(() => {
            assert.deepEqual(data, argsCorrectUpdate);
            done();
            FC.destroy();
         });
      });

      it('beforeUnmount', () => {
         let isDestroyCall = false;
         let source = {
            destroy: (id) => {
               assert.equal(id, 'id1');
               isDestroyCall = true;
            }
         };
         const createFC = () => {
            let FC = new form.Controller();
            FC.saveOptions({ source });
            FC._record = {
               getKey: () => 'id1'
            };
            FC._crudController = {
               hideIndicator () {}
            };
            return FC;
         };
         let FC = createFC();
         FC._beforeUnmount();
         FC.destroy();

         assert.equal(isDestroyCall, false);

         let FC2 = createFC();
         FC2._isNewRecord = true;
         FC2._crudController = {
            hideIndicator () {}
         };
         FC2._beforeUnmount();
         assert.equal(isDestroyCall, true);
         FC2.destroy();
      });

      it('delete new record', () => {
         let FC = new form.Controller();
         let isDestroyCalled = false;
         const source = {
            destroy: () => {
               isDestroyCalled = true;
            }
         };
         FC.saveOptions({ source });
         FC._tryDeleteNewRecord();
         assert.equal(isDestroyCalled, false);

         FC._record = {
            getKey: () => null
         };
         FC._isNewRecord = true;

         FC._tryDeleteNewRecord();
         assert.equal(isDestroyCalled, false);

         FC._record = {
            getKey: () => 'key'
         };
         FC._tryDeleteNewRecord();
         assert.equal(isDestroyCalled, true);

         FC.destroy();
      });

      it('_notifyHandler', () => {
         let createComponent = function(Component) {
            return new Component.Controller();
         };
         let name = 'deletesuccessed',
            args = {},
            sandbox = sinon.sandbox.create(),
            component = createComponent(form);

         sandbox.stub(component, '_notifyToOpener');
         sandbox.stub(component, '_notify');
         component._notifyHandler(name, args);
         sinon.assert.callOrder(component._notifyToOpener, component._notify);
         sandbox.restore();
      });


      it('requestCustomUpdate isNewRecord', (done) => {
         let FC = new form.Controller();
         const sandbox = sinon.createSandbox();
         FC._isNewRecord = true;
         sandbox.stub(FC, '_notify').returns(true);
         FC.update().then(() => {
            assert.equal(FC._isNewRecord, false);
            assert.deepEqual(FC._notify.args[0], ['requestCustomUpdate', [FC._record]]);
            done();
            FC.destroy();
            sandbox.restore();
         });
      });
      it('requestCustomUpdate', () => {
         let FC = new form.Controller();
         let update = false;
         FC._notify = (event) => {
            if( event === 'requestCustomUpdate') {
               return false;
            }
            return true;
         };
         FC._notifyToOpener = (eventName) => {
            if ( eventName === 'updatestarted') {
               update = true;
               FC.destroy();
            }
         };
         let validation = {
            submit: () => Promise.resolve(true)
         };
         FC._isNewRecord = true;
         FC._requestCustomUpdate = function() {
            return false;
         };
         FC._record = {
            getKey: () => 'id1',
            isChanged: () => true
         };
         let crud = {
            update: () => Promise.resolve()
         };
         FC._children = { crud, validation };
         FC._processError = () => {};
         FC.update();
         assert.equal(update, true);
         FC.destroy();
      });

      it('update with error', (done) => {
         let error = false;
         let FC = new form.Controller();
         FC._record = {
            getKey: () => 'id1',
            isChanged: () => true
         };
         FC._notify = (event) => {
            return false;
         };
         FC._validateController = {
            submit: () => Promise.reject('error'),
            resolveSubmit: () => Promise.reject('error'),
            deferSubmit: () => Promise.reject('error'),
         };
         FC._crudController = {
            update: () => Promise.reject()
         };
         FC._processError = () => {
         };
         FC._forceUpdate = () => {
            setTimeout(FC._afterUpdate.bind(FC));
         };
         FC.update().catch(() => {
            error = true;
            assert.isTrue(error);
            FC.destroy();
            done();
         });
      });

      it('create record before mount check record state', () => {
         let FC = new form.Controller();
         FC._record = 'initModel';
         const cfg = {
            source: {
               create: () => Promise.resolve(new entity.Record())
            },
            initializingWay: 'delayedCreate'
         };
         return FC._createRecordBeforeMount(cfg).then(() => {
            assert.equal(FC._record, 'initModel');
            FC.destroy();
         });
      });

      it('createHandler and readHandler ', () => {
         let FC = new form.Controller();
         FC._createHandler();
         assert.equal(FC._wasCreated, true);
         assert.equal(FC._isNewRecord, true);

         FC._readHandler();
         assert.equal(FC._wasRead, true);
         assert.equal(FC._isNewRecord, false);
         FC.destroy();
      });

      describe('_onCloseErrorDialog()', () => {
         let fc;

         beforeEach(() => {
            fc = new form.Controller();
            fc._error = {};
            sinon.stub(fc, '_notify');
         });

         afterEach(() => {
            sinon.reset();
         });

         it('without record', () => {
            fc._onCloseErrorDialog();
            assert.isNotOk(fc._error, 'resets viewConfig of error container');
            assert.isTrue(fc._notify.calledOnce, 'notifies "close"');
            assert.deepEqual(fc._notify.getCall(0).args, ['close', [], { bubbling: true }]);
         });

         it('with record', () => {
            fc._record = {};
            fc._onCloseErrorDialog();
            assert.isNotOk(fc._error, 'resets viewConfig of error container');
            assert.isNotOk(fc._notify.called, 'does not notify "close"');
         });
      });
   });
});
