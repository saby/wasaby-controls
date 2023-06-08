import { Controller, INITIALIZING_WAY } from 'Controls/form';
import * as Deferred from 'Core/Deferred';
import { Model, Record } from 'Types/entity';
import { ErrorViewMode } from 'Controls/error';

const createModel = (id) => {
    return new Model({ rawData: { id }, keyProperty: 'id' });
};

describe('FormController', () => {
    it('initializingWay', (done) => {
        const FC = new Controller({});

        let cfg = {
            record: new Record(),
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

        const p1 = new Promise((resolve) => {
            const beforeMountResult = FC._beforeMount(cfg);
            expect(isReading).toEqual(false);
            expect(isCreating).toEqual(false);
            expect(beforeMountResult).not.toEqual(true);
            resolve();
        });

        const p2 = new Promise((resolve) => {
            cfg.entityKey = '123';
            const beforeMountResult = FC._beforeMount(cfg);
            expect(isReading).toEqual(true);
            expect(isCreating).toEqual(false);
            expect(beforeMountResult).not.toEqual(true);
            resolve();
        }).catch((error) => {
            done(error);
        });

        const p3 = new Promise((resolve) => {
            cfg = {
                entityKey: 123,
            };
            isReading = false;
            const beforeMountResult = FC._beforeMount(cfg);
            expect(isReading).toEqual(true);
            expect(isCreating).toEqual(false);
            expect(
                beforeMountResult instanceof Deferred ||
                    beforeMountResult instanceof Promise
            ).toBe(true);
            beforeMountResult
                .then(({ data }) => {
                    expect(data).toEqual(true);
                    resolve();
                })
                .catch((error) => {
                    done(error);
                });
        });
        const p4 = new Promise((resolve) => {
            isReading = false;
            isCreating = false;
            const beforeMountResult = FC._beforeMount({});
            expect(isReading).toEqual(false);
            expect(isCreating).toEqual(true);
            expect(
                beforeMountResult instanceof Deferred ||
                    beforeMountResult instanceof Promise
            ).toBe(true);
            beforeMountResult.then(({ data }) => {
                expect(data).toEqual(true);
                resolve();
            });
        });

        Promise.all([p1, p2, p3, p4]).then(() => {
            FC.destroy();
            done();
        });
    });
    it('beforeUpdate', async () => {
        const FC = new Controller({});
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
            isChanged: () => {
                return false;
            },
        };
        const diffRecord = {
            isChanged: () => {
                return false;
            },
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
            createPromise = new Promise((res) => {
                createPromiseResolver = res;
            });
            return createPromise;
        };
        FC._confirmRecordChangeHandler = (
            positiveCallback,
            negativeCallback
        ) => {
            return positiveCallback();
        };
        FC._crudController = {
            _source: null,
            setDataSource(source) {
                this._source = source;
            },
        };

        FC._beforeUpdate({
            record: 'record',
        });
        expect(setRecordCalled).toEqual(true);
        expect(readCalled).toEqual(false);
        expect(createCalled).toEqual(false);

        setRecordCalled = false;
        const newSource = {};
        const originRead = FC.read;
        FC.read = () => {
            // is source changed source will be setted before read
            expect(FC._crudController._source).toEqual(newSource);
            return originRead();
        };
        FC._beforeUpdate({
            record,
            entityKey: 'key',
            source: newSource,
        });

        expect(setRecordCalled).toEqual(true);
        expect(readCalled).toEqual(true);
        expect(createCalled).toEqual(false);
        expect(FC._isNewRecord).toEqual(false);

        setRecordCalled = false;
        readCalled = false;
        FC.read = originRead;

        // Рекорд должен обновиться, если показали окно и ответили "Нет"
        FC._confirmRecordChangeHandler = (
            positiveCallback,
            negativeCallback
        ) => {
            return negativeCallback();
        };
        FC._beforeUpdate({
            record: diffRecord,
            entityKey: 'key1',
        });
        expect(setRecordCalled).toEqual(true);

        FC._confirmRecordChangeHandler = (positiveCallback) => {
            return positiveCallback();
        };
        setRecordCalled = false;
        readCalled = false;
        FC._beforeUpdate({
            isNewRecord: true,
        });

        expect(setRecordCalled).toEqual(false);
        expect(readCalled).toEqual(false);
        expect(createCalled).toEqual(true);
        expect(FC._isNewRecord).toEqual(false);

        await createPromiseResolver();

        expect(FC._isNewRecord).toEqual(true);

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
        record.isChanged = () => {
            return true;
        };
        FC._options.record = record;
        FC._record = record;
        FC._beforeUpdate({
            record,
            entityKey: 'key',
        });
        await createPromiseResolverShow(true);
        await createPromiseResolverUpdate();
        await createPromiseResolverReed();

        expect(setRecordCalled).toEqual(false);
        expect(confirmPopupCalled).toEqual(true);
        expect(readCalled).toEqual(true);
        expect(updateCalled).toEqual(true);
        expect(createCalled).toEqual(false);
        expect(FC._isNewRecord).toEqual(true);

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
            record,
            entityKey: 'key',
        });
        await createPromiseResolverShow(false);
        await createPromiseResolverDelete();

        expect(setRecordCalled).toEqual(false);
        expect(confirmPopupCalled).toEqual(true);
        expect(isDeleteRecord).toEqual(true);
        expect(readCalled).toEqual(true);
        expect(updateCalled).toEqual(false);
        expect(createCalled).toEqual(false);

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
            isChanged: () => {
                return true;
            },
        };
        FC._options.record = oldRecord;
        FC._beforeUpdate({
            record: null,
        });
        await createPromiseResolverShow(true);
        await createPromiseResolverUpdate();
        await createPromiseResolverReed();

        expect(setRecordCalled).toEqual(false);
        expect(confirmPopupCalled).toEqual(true);
        expect(readCalled).toEqual(false);
        expect(updateCalled).toEqual(true);
        expect(createCalled).toEqual(true);
        expect(FC._isNewRecord).toEqual(true);

        // Рекорд не должен поменяться прежде чем ответят на конфирм
        setRecordCalled = false;
        confirmPopupCalled = false;
        FC._isConfirmShowed = false;

        oldRecord = {
            isChanged: () => {
                return true;
            },
        };
        FC._options.record = oldRecord;
        FC._record = oldRecord;
        FC._beforeUpdate({
            record: {},
        });

        expect(setRecordCalled).toEqual(false);
        expect(confirmPopupCalled).toEqual(true);

        // Рекорд должен поменяться, если окно подтверждения не показалось
        readCalled = false;
        createCalled = false;
        setRecordCalled = false;
        confirmPopupCalled = false;
        FC._isConfirmShowed = false;

        oldRecord = {
            isChanged: () => {
                return false;
            },
        };
        FC._options.record = oldRecord;
        FC._record = oldRecord;
        FC._beforeUpdate({
            record: {},
        });

        expect(setRecordCalled).toEqual(true);
        expect(confirmPopupCalled).toEqual(false);

        FC.destroy();
    });

    it('beforeUpdate change isNewRecord', () => {
        const FC = new Controller({});
        FC._isNewRecord = undefined;
        FC._crudController = {
            setDataSource: jest.fn(),
        };

        FC._beforeUpdate({ isNewRecord: true, record: 123 });
        expect(FC._isNewRecord).toEqual(true);

        FC._isConfirmShowed = true;
        FC._beforeUpdate({ isNewRecord: false, record: 123 });
        expect(FC._isNewRecord).toEqual(true);

        FC._isConfirmShowed = false;
        FC._beforeUpdate({ isNewRecord: false, record: 123 });
        expect(FC._isNewRecord).toEqual(false);

        FC.destroy();
    });

    it('calcInitializingWay', () => {
        const FC = new Controller({});
        const options = {};
        let initializingWay = FC._calcInitializingWay(options);
        expect(initializingWay).toEqual('create');

        options.entityKey = 123;
        initializingWay = FC._calcInitializingWay(options);
        expect(initializingWay).toEqual('read');

        options.record = 123;
        initializingWay = FC._calcInitializingWay(options);
        expect(initializingWay).toEqual('delayedRead');

        delete options.entityKey;
        initializingWay = FC._calcInitializingWay(options);
        expect(initializingWay).toEqual('local');

        options.initializingWay = 'test';
        initializingWay = FC._calcInitializingWay(options);
        expect(initializingWay).toEqual('test');
        FC.destroy();
    });

    it('beforeUnmount', () => {
        let isDestroyCall = false;
        const source = {
            destroy: (id) => {
                expect(id).toEqual('id1');
                isDestroyCall = true;
            },
        };
        const createFC = () => {
            const FC = new Controller({});
            FC.saveOptions({ source });
            FC._record = {
                getKey: () => {
                    return 'id1';
                },
            };
            FC._crudController = {
                hideIndicator: jest.fn(),
            };
            return FC;
        };
        const FC = createFC();
        FC._beforeUnmount();
        FC.destroy();

        expect(isDestroyCall).toEqual(false);

        const FC2 = createFC();
        FC2._isNewRecord = true;
        FC2._crudController = {
            hideIndicator: jest.fn(),
        };
        FC2._beforeUnmount();
        expect(isDestroyCall).toEqual(true);
        FC2.destroy();
    });

    it('delete new record', () => {
        const FC = new Controller({});
        let isDestroyCalled = false;
        const source = {
            destroy: () => {
                isDestroyCalled = true;
            },
        };
        FC.saveOptions({ source });
        FC._tryDeleteNewRecord();
        expect(isDestroyCalled).toEqual(false);

        FC._record = {
            getKey: () => {
                return null;
            },
        };
        FC._isNewRecord = true;

        FC._tryDeleteNewRecord();
        expect(isDestroyCalled).toEqual(false);

        FC._record = {
            getKey: () => {
                return 'key';
            },
        };
        FC._tryDeleteNewRecord();
        expect(isDestroyCalled).toEqual(true);

        FC.destroy();
    });

    it('_notifyHandler', () => {
        const name = 'deletesuccessed';
        const args = {};
        const component = new Controller({});

        jest.spyOn(component, '_notifyToOpener')
            .mockClear()
            .mockImplementation();
        jest.spyOn(component, '_notify').mockClear().mockImplementation();
        component._notifyHandler(name, args);
        expect(
            component._notifyToOpener.mock.invocationCallOrder[0]
        ).toBeLessThan(component._notify.mock.invocationCallOrder[0]);
    });

    it('requestCustomUpdate isNewRecord', async () => {
        const FC = new Controller({});
        const updateCfg = {};
        FC._isNewRecord = true;
        jest.spyOn(FC, '_notify').mockClear().mockReturnValue(true);
        await FC.update(updateCfg);

        expect(FC._isNewRecord).toEqual(false);
        expect(FC._notify.mock.calls[0]).toEqual([
            'requestCustomUpdate',
            [FC._record, updateCfg],
        ]);
        FC.destroy();
    });
    it('requestCustomUpdate', () => {
        const FC = new Controller({});
        let update = false;
        FC._notify = (event) => {
            if (event === 'requestCustomUpdate') {
                return false;
            }
            return true;
        };
        FC._notifyToOpener = (eventName) => {
            if (eventName === 'updatestarted') {
                update = true;
                FC.destroy();
            }
        };
        const validation = {
            submit: () => {
                return Promise.resolve(true);
            },
        };
        FC._isNewRecord = true;
        FC._requestCustomUpdate = () => {
            return false;
        };
        FC._record = {
            getKey: () => {
                return 'id1';
            },
            isChanged: () => {
                return true;
            },
        };
        const crud = {
            update: () => {
                return Promise.resolve();
            },
        };
        FC._children = { crud, validation };
        FC._processError = jest.fn();
        FC.update();
        expect(update).toEqual(true);
        FC.destroy();
    });

    it('read with error', async () => {
        const FC = new Controller({});
        let currentExpectedMode;
        const opts = {
            entityKey: 123,
            record: { key: 123 },
            initializingWay: 'preload',
        };
        FC._beforeMount(opts);
        FC.saveOptions(opts);
        FC._crudController.read = () => {
            return Promise.reject();
        };
        FC._errorController.process = (cfg) => {
            expect(cfg.mode).toEqual(currentExpectedMode);
            return Promise.resolve({});
        };

        currentExpectedMode = 'include';
        opts.initializingWay = 'remote';
        FC.saveOptions(opts);
        await FC.read(123).catch((e) => {
            return e;
        });

        currentExpectedMode = 'dialog';
        opts.initializingWay = 'delayed_remote';
        FC.saveOptions(opts);
        await FC.read(123).catch((e) => {
            return e;
        });
    });

    it('create record before mount check record state', () => {
        const FC = new Controller({});
        FC._record = 'initModel';
        const cfg = {
            source: {
                create: () => {
                    return Promise.resolve(new Record());
                },
            },
            initializingWay: 'delayedCreate',
        };
        return FC._createRecordBeforeMount(cfg).then(() => {
            expect(FC._record).toEqual('initModel');
            FC.destroy();
        });
    });

    it('createHandler and readHandler ', () => {
        const FC = new Controller({});
        FC._createHandler();
        expect(FC._wasCreated).toEqual(true);
        expect(FC._isNewRecord).toEqual(true);

        FC._readHandler();
        expect(FC._wasRead).toEqual(true);
        expect(FC._isNewRecord).toEqual(false);
        FC.destroy();
    });

    it('afterMount. Create before mount', () => {
        const FC = new Controller({});
        const record = createModel(1);
        FC._record = record;
        FC._createdInMounting = {
            result: record,
            isError: false,
        };
        const notifyHandler = jest
            .spyOn(FC, '_notifyHandler')
            .mockClear()
            .mockImplementation();
        const createHandler = jest
            .spyOn(FC, '_createHandler')
            .mockClear()
            .mockImplementation();
        FC._afterMount();

        expect(FC._isMount).toBe(true);
        expect(notifyHandler).toHaveBeenCalledWith(
            'createsuccessed',
            expect.anything()
        );
        expect(createHandler).toHaveBeenCalledWith(record);
        expect(FC._createdInMounting).toBeNull();

        FC._createdInMounting = {
            isError: true,
        };
        FC._afterMount();
        expect(notifyHandler).toHaveBeenCalledWith(
            'createfailed',
            expect.anything()
        );
        expect(FC._createdInMounting).toBeNull();
        FC.destroy();
    });

    it('afterMount. Read before mount', () => {
        const FC = new Controller({});
        const record = createModel(1);
        FC._record = record;
        FC._readInMounting = {
            result: record,
            isError: false,
        };
        const notifyHandler = jest
            .spyOn(FC, '_notifyHandler')
            .mockClear()
            .mockImplementation();
        const readHandler = jest
            .spyOn(FC, '_readHandler')
            .mockClear()
            .mockImplementation();
        FC._afterMount();

        expect(FC._isMount).toBe(true);
        expect(notifyHandler).toHaveBeenCalledWith(
            'readsuccessed',
            expect.anything()
        );
        expect(readHandler).toHaveBeenCalledWith(record);
        expect(FC._readInMounting).toBeNull();

        FC._readInMounting = {
            isError: true,
        };
        FC._afterMount();
        expect(notifyHandler).toHaveBeenCalledWith(
            'readfailed',
            expect.anything()
        );
        expect(FC._readInMounting).toBeNull();
        FC.destroy();
    });

    it('afterUpdate', () => {
        const FC = new Controller({});
        const activate = jest
            .spyOn(FC, 'activate')
            .mockClear()
            .mockImplementation();

        FC._afterUpdate({});
        expect(activate).not.toHaveBeenCalled();

        FC.saveOptions({
            record: createModel(1),
            initializingWay: INITIALIZING_WAY.PRELOAD,
        });
        FC._wasDestroyed = true;
        FC._wasCreated = true;
        FC._wasRead = true;
        FC._afterUpdate({});

        expect(activate).toHaveBeenCalled();
        expect(FC._wasCreated).toBe(false);
        expect(FC._wasRead).toBe(false);
        expect(FC._wasDestroyed).toBe(false);
        FC.destroy();
    });

    it('createRecordBeforeMount success', () => {
        const FC = new Controller({});
        const record = createModel(1);
        const cfg = {
            initializigWay: INITIALIZING_WAY.CREATE,
            source: {
                create: jest.fn().mockResolvedValue(record),
            },
        };
        FC._isMount = true;
        const notifyRead = jest
            .spyOn(FC, '_createRecordBeforeMountNotify')
            .mockClear()
            .mockImplementation();
        return FC._createRecordBeforeMount(cfg).then(() => {
            expect(FC._record).toEqual(record);
            expect(notifyRead).toHaveBeenCalled();
            FC.destroy();
        });
    });

    it('createRecordBeforeMount reject', () => {
        const FC = new Controller({});
        const cfg = {
            source: {
                create: jest.fn().mockRejectedValue(undefined),
            },
        };
        FC._errorController = {
            setOnProcess: jest.fn(),
            process: () => {
                return Promise.resolve();
            },
        };
        const setFunctionToRepeat = jest
            .spyOn(FC, '_setFunctionToRepeat')
            .mockClear();
        const processError = jest.spyOn(FC, 'processError').mockClear();
        return FC._createRecordBeforeMount(cfg).catch(() => {
            expect(FC._createdInMounting.isError).toEqual(true);
            expect(setFunctionToRepeat).toHaveBeenCalled();
            expect(processError).toHaveBeenCalled();
            FC.destroy();
        });
    });

    it('create', () => {
        const FC = new Controller({});
        FC._beforeMount({
            initializingWay: INITIALIZING_WAY.PRELOAD,
        });
        jest.spyOn(FC._crudController, 'create')
            .mockClear()
            .mockImplementation()
            .mockResolvedValue({});
        const createHandler = jest
            .spyOn(FC, '_createHandler')
            .mockClear()
            .mockImplementation();
        return FC.create().then(() => {
            expect(createHandler).toHaveBeenCalled();
            FC.destroy();
        });
    });

    it('readRecordBeforeMount success', () => {
        const FC = new Controller({});
        const record = createModel(1);
        const cfg = {
            source: {
                read: jest.fn().mockResolvedValue(record),
            },
        };
        FC._isMount = true;
        const notifyRead = jest
            .spyOn(FC, '_readRecordBeforeMountNotify')
            .mockClear()
            .mockImplementation();
        return FC._readRecordBeforeMount(cfg).then(() => {
            expect(FC._record).toEqual(record);
            expect(notifyRead).toHaveBeenCalled();
            FC.destroy();
        });
    });

    it('readRecordBeforeMount reject', () => {
        const FC = new Controller({});
        const cfg = {
            source: {
                read: jest.fn().mockRejectedValue(),
            },
        };
        FC._errorController = {
            setOnProcess: jest.fn(),
            process: jest.fn().mockResolvedValue(),
        };
        const setFunctionToRepeat = jest
            .spyOn(FC, '_setFunctionToRepeat')
            .mockClear();
        const processError = jest.spyOn(FC, 'processError').mockClear();
        FC._isMount = true;
        const notifyRead = jest
            .spyOn(FC, '_readRecordBeforeMountNotify')
            .mockClear()
            .mockImplementation();
        return FC._readRecordBeforeMount(cfg).catch(() => {
            expect(FC._readInMounting.isError).toEqual(true);
            expect(setFunctionToRepeat).toHaveBeenCalled();
            expect(processError).toHaveBeenCalled();
            expect(notifyRead).toHaveBeenCalled();
            FC.destroy();
        });
    });

    it('updating failed with validation success', () => {
        const FC = new Controller({});
        FC._beforeMount({
            initializingWay: INITIALIZING_WAY.PRELOAD,
        });
        const result = { hasErrors: false };
        jest.spyOn(FC, 'validate')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve(result);
            });
        jest.spyOn(FC._crudController, 'update')
            .mockClear()
            .mockImplementation(() => {
                return Promise.reject({});
            });
        const processError = jest
            .spyOn(FC, 'processError')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve({});
            });
        return FC._update().catch(() => {
            expect(processError).toHaveBeenCalled();
            FC.destroy();
        });
    });

    it('updating failed with validation failed', () => {
        const FC = new Controller({});
        FC._beforeMount({
            initializingWay: INITIALIZING_WAY.PRELOAD,
        });
        const result = { hasErrors: true };
        jest.spyOn(FC, 'validate')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve(result);
            });
        jest.spyOn(FC, '_createError')
            .mockClear()
            .mockImplementation(() => {
                return 'error';
            });
        const notify = jest
            .spyOn(FC, '_notify')
            .mockClear()
            .mockImplementation();
        return FC._update().catch(() => {
            expect(notify).toHaveBeenCalledWith(
                'validationFailed',
                expect.anything()
            );
        });
    });

    it('delete success', () => {
        const FC = new Controller({});
        FC._record = createModel(1);
        FC._beforeMount({
            initializingWay: INITIALIZING_WAY.PRELOAD,
        });
        const updateIsNewRecord = jest
            .spyOn(FC, '_updateIsNewRecord')
            .mockClear()
            .mockImplementation();
        jest.spyOn(FC._crudController, 'delete')
            .mockClear()
            .mockImplementation()
            .mockResolvedValue({});
        return FC.delete().then(() => {
            expect(FC._record).toEqual(null);
            expect(FC._wasDestroyed).toBe(true);
            expect(updateIsNewRecord).toHaveBeenCalled();
            FC.destroy();
        });
    });

    it('delete reject', () => {
        const FC = new Controller({});
        FC._beforeMount({
            initializingWay: INITIALIZING_WAY.PRELOAD,
        });
        const setFunctionToRepeat = jest
            .spyOn(FC, '_setFunctionToRepeat')
            .mockClear();
        const processError = jest
            .spyOn(FC, 'processError')
            .mockClear()
            .mockImplementation()
            .mockResolvedValue();
        jest.spyOn(FC._crudController, 'delete')
            .mockClear()
            .mockImplementation()
            .mockRejectedValue({});
        return FC.delete().then(() => {
            expect(setFunctionToRepeat).toHaveBeenCalled();
            expect(processError).toHaveBeenCalled();
            FC.destroy();
        });
    });

    describe('_onCloseErrorDialog()', () => {
        let fc;

        beforeEach(() => {
            fc = new Controller({});
            fc._error = {};
            jest.spyOn(fc, '_notify').mockClear().mockImplementation();
        });

        it('without record', () => {
            fc._onCloseErrorDialog();
            expect(fc._error).toBeFalsy();
            expect(fc._notify).toHaveBeenCalledTimes(1);
            expect(fc._notify.mock.calls[0]).toEqual([
                'close',
                [],
                { bubbling: true },
            ]);
        });

        it('with record', () => {
            fc._record = {};
            fc._onCloseErrorDialog();
            expect(fc._error).toBeFalsy();
            expect(fc._notify).not.toHaveBeenCalled();
        });
    });

    describe('_getErrorProcessingMode', () => {
        [
            {
                options: {
                    initializingWay: 'preload',
                },
                record: new Record(),
                result: ErrorViewMode.dialog,
            },
            {
                options: {
                    initializingWay: 'delayedRead',
                },
                record: new Record(),
                result: ErrorViewMode.dialog,
            },
            {
                options: {
                    initializingWay: 'preload',
                },
                record: null,
                result: ErrorViewMode.include,
            },
            {
                options: {
                    initializingWay: 'read',
                },
                record: new Record(),
                result: ErrorViewMode.include,
            },
            {
                options: {
                    initializingWay: 'read',
                },
                record: null,
                result: ErrorViewMode.include,
            },
        ].forEach((test, index) => {
            it('should return correct error view mode type ' + index, () => {
                const control = new Controller();
                control._options = test.options;
                control._record = test.record;
                const result = control._getErrorProcessingMode();

                expect(result).toEqual(test.result);
            });
        });
    });

    describe('_updateErrorRepeatConfig', () => {
        let error;
        let FC;

        beforeEach(() => {
            error = new Error('test error');
            FC = new Controller({});
            FC._beforeMount({
                entityKey: 1,
                record: { key: 1 },
                initializingWay: 'preload',
            });
            FC._repeatFunction = () => {
                return Promise.resolve();
            };
        });

        it('does nothing on server side', () => {
            jest.spyOn(FC._errorController, 'updateOnProcess').mockClear();

            FC._updateErrorRepeatConfig();

            expect(FC._errorController.updateOnProcess).not.toHaveBeenCalled();
        });
    });
});
