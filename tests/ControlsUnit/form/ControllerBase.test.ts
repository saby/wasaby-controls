import { ControllerBase } from 'Controls/form';
import { Model } from 'Types/entity';
import {Deferred} from 'Types/deferred';

const createModel = (id) => {
    return new Model({ rawData: { id }, keyProperty: 'id' });
};

describe('Controls/_form/ControllerBase', () => {
    it('beforeMount', () => {
        const FC = new ControllerBase({});
        const options = {
            record: new Model(),
        };
        FC._beforeMount(options);
        expect(FC._record).toEqual(options.record);

        options.record = null;
        FC._beforeMount(options);
        expect(FC._record).toEqual(options.record);

        options.record = 'random data';
        FC._beforeMount(options);
        expect(FC._record).toEqual(null); // previous value

        FC.destroy();
    });

    it('afterMount', () => {
        const FC = new ControllerBase({});
        const spy = jest.spyOn(FC, '_notify').mockClear();

        FC._afterMount();

        const [, eventArgs] = spy.mock.calls[0];
        const [, config] = eventArgs;
        const showMethod = jest
            .spyOn(FC, '_needShowConfirmation')
            .mockClear()
            .mockImplementation();

        config.validate();
        expect(showMethod).toHaveBeenCalled();

        FC.destroy();
    });

    it('beforeUpdate', () => {
        const FC = new ControllerBase({});
        const firstRecord = createModel(1);
        const secondRecord = createModel('1,1');
        const thirdRecord = createModel(2);
        FC._record = firstRecord;
        FC._beforeUpdate({ record: secondRecord });
        expect(FC._record).toEqual(secondRecord);

        FC._beforeUpdate({ record: thirdRecord });
        expect(FC._record).toEqual(thirdRecord);

        FC._beforeUpdate({ record: null });
        expect(FC._record).toEqual(null);

        FC.destroy();
    });

    it('needShowConfirmation', () => {
        const FC = new ControllerBase({});

        expect(FC._needShowConfirmation()).toEqual(false);
        const record = createModel(1);
        record.set('id', 2); // Для состояния измененности
        FC._record = record;

        expect(FC._needShowConfirmation()).toEqual(true);

        const confirmationShowingCallback = jest.fn(() => {
            return 'custom value';
        });
        FC.saveOptions({ confirmationShowingCallback });
        expect(FC._needShowConfirmation()).toEqual('custom value');

        FC.destroy();
    });

    it('showConfirmDialog', () => {
        const FC = new ControllerBase({});
        const promise = Promise.resolve();
        const confirmMethod = jest
            .spyOn(FC, '_confirmDialogResult')
            .mockClear();

        FC._showConfirmDialog(promise, true);
        expect(confirmMethod).toHaveBeenCalledTimes(1);

        jest.spyOn(FC, '_showConfirmPopup')
            .mockClear()
            .mockImplementation(() => {
                return promise;
            });
        FC._showConfirmDialog(promise, true);
        return promise.then(() => {
            expect(confirmMethod).toHaveBeenCalledTimes(2);
            FC.destroy();
        });
    });

    it('showConfirmDialog', () => {
        const FC = new ControllerBase({});
        const fakeCallback = {
            isReady: () => {
                return false;
            },
            callback: jest.fn(),
        };
        FC._confirmDialogResult(false, fakeCallback);
        expect(fakeCallback.callback).toHaveBeenCalledWith(false);

        const notifySpy = jest.spyOn(FC, '_notify').mockClear();
        FC._confirmDialogResult(undefined, undefined);
        expect(notifySpy).toHaveBeenCalledWith(
            'cancelFinishingPending',
            expect.anything(),
            expect.anything()
        );

        const promise = Promise.resolve({ validationErrors: true });
        jest.spyOn(FC, 'update')
            .mockClear()
            .mockImplementation(() => {
                return promise;
            });
        FC._confirmDialogResult(true, fakeCallback);

        return promise.then(() => {
            expect(notifySpy).toHaveBeenCalledWith(
                'cancelFinishingPending',
                expect.anything(),
                expect.anything()
            );
            FC.destroy();
        });
    });

    it('add/remove validators', () => {
        const FC = new ControllerBase({});
        const addValidator = jest
            .spyOn(FC._validateController, 'addValidator')
            .mockClear();
        const removeValidator = jest
            .spyOn(FC._validateController, 'removeValidator')
            .mockClear();
        FC._onValidateCreated(null, 1);
        FC._onValidateCreated(null, 2);
        FC._onValidateDestroyed(null, 2);
        expect(addValidator).toHaveBeenCalledTimes(2);
        expect(removeValidator).toHaveBeenCalledTimes(1);
        expect(FC._validateController._validates.length).toEqual(1);
        FC.destroy();
    });

    it('update successed', () => {
        const FC = new ControllerBase({});
        const record = createModel(1);
        record.set('id', 2); // Для состояния измененности
        FC._record = record;

        jest.spyOn(FC, '_startFormOperations')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve();
            });
        jest.spyOn(FC, 'validate')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve({ hasErrors: false });
            });
        const notifySpy = jest.spyOn(FC, '_notify').mockClear();

        return FC.update().then(() => {
            expect(notifySpy).toHaveBeenCalledWith(
                'validationSuccessed',
                expect.anything()
            );
            expect(notifySpy).toHaveBeenCalledWith(
                'updateSuccessed',
                expect.anything()
            );
            expect(notifySpy).toHaveBeenCalledWith(
                'recordChanged',
                expect.anything()
            );
            expect(FC._record.isChanged()).toBe(false);
            FC.destroy();
        });
    });

    it('update failed', () => {
        const FC = new ControllerBase({});

        jest.spyOn(FC, '_startFormOperations')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve();
            });
        jest.spyOn(FC, 'validate')
            .mockClear()
            .mockImplementation(() => {
                return Promise.resolve({ hasErrors: true });
            });
        const notifySpy = jest.spyOn(FC, '_notify').mockClear();

        return FC.update()
            .then(() => {
                expect(notifySpy).toHaveBeenCalledWith('validationFailed');
                expect(notifySpy).toHaveBeenCalledWith('validationFailed2');
            })
            .catch(jest.fn());
    });

    it('registerPending', async () => {
        let updatePromise;
        const FC = new ControllerBase({});
        FC._crudController = {
            hideIndicator: jest.fn(),
        };
        FC._createChangeRecordPending();
        expect(FC._pendingPromise !== undefined).toBe(true);
        FC.update = () => {
            return new Promise((res) => {
                return (updatePromise = res);
            });
        };
        FC._confirmDialogResult(true, new Deferred());
        await updatePromise({});
        expect(FC._pendingPromise === null).toBe(true);

        FC._createChangeRecordPending();
        FC._beforeUnmount();
        expect(FC._pendingPromise === null).toBe(true);
        FC.destroy();
    });

    it('_confirmRecordChangeHandler', async () => {
        const FC = new ControllerBase();
        let isDefaultCalled = false;
        let isNegativeCalled = false;
        let showConfirmPopupResult = false;
        const defaultAnswerCallback = () => {
            return (isDefaultCalled = true);
        };
        const negativeAnswerCallback = () => {
            return (isNegativeCalled = true);
        };
        const mokePromiseFunction = () => {
            return {
                then: (thenCallback) => {
                    return thenCallback(showConfirmPopupResult);
                },
            };
        };
        const mokePromiseRejectFunction = () => {
            return {
                then: (thenCallback, catchCallback) => {
                    return catchCallback();
                },
            };
        };

        FC._needShowConfirmation = () => {
            return false;
        };
        FC._confirmRecordChangeHandler(
            defaultAnswerCallback,
            negativeAnswerCallback
        );
        expect(isDefaultCalled).toEqual(true);
        expect(isNegativeCalled).toEqual(false);
        isDefaultCalled = false;

        FC._needShowConfirmation = () => {
            return true;
        };
        FC._showConfirmPopup = mokePromiseFunction;
        FC._confirmRecordChangeHandler(
            defaultAnswerCallback,
            negativeAnswerCallback
        );
        expect(isDefaultCalled).toEqual(false);
        expect(isNegativeCalled).toEqual(true);
        isNegativeCalled = false;

        showConfirmPopupResult = true;
        FC.update = mokePromiseFunction;
        FC._confirmRecordChangeHandler(
            defaultAnswerCallback,
            negativeAnswerCallback
        );
        expect(isDefaultCalled).toEqual(true);
        expect(isNegativeCalled).toEqual(false);
        isDefaultCalled = false;

        FC.update = mokePromiseRejectFunction;
        FC._confirmRecordChangeHandler(
            defaultAnswerCallback,
            negativeAnswerCallback
        );
        expect(isDefaultCalled).toEqual(false);
        expect(isNegativeCalled).toEqual(false);
        expect(FC._isConfirmShowed).toBe(false);
        FC.destroy();
    });

    it('formOperations', () => {
        const FC = new ControllerBase();
        let isSaveCalled = false;
        let isCancelCalled = false;
        let isDestroyed = false;
        const operation = {
            save() {
                isSaveCalled = true;
            },
            cancel() {
                isCancelCalled = true;
            },
            isDestroyed() {
                return isDestroyed;
            },
        };
        FC._registerFormOperationHandler(null, operation);
        FC._registerFormOperationHandler(null, operation);
        expect(FC._formOperationsStorage.length).toEqual(2);

        FC._startFormOperations('save');
        expect(isSaveCalled).toEqual(true);
        expect(isCancelCalled).toEqual(false);

        isSaveCalled = false;
        FC._startFormOperations('cancel');
        expect(isSaveCalled).toEqual(false);
        expect(isCancelCalled).toEqual(true);
        isCancelCalled = false;

        isDestroyed = true;
        FC._startFormOperations('cancel');
        expect(isSaveCalled).toEqual(false);
        expect(isCancelCalled).toEqual(false);
        expect(FC._formOperationsStorage.length).toEqual(0);

        FC.destroy();
    });

    it('_confirmDialogResult', (done) => {
        const FC = new ControllerBase();
        const promise = new Promise((resolve, reject) => {
            reject('update error');
        });
        FC.update = () => {
            return promise;
        };
        let calledEventName;
        FC._notify = (event) => {
            calledEventName = event;
        };
        FC._confirmDialogResult(true, new Promise(jest.fn()));
        promise.catch(() => {
            expect(calledEventName).toEqual('cancelFinishingPending');
            FC.destroy();
            done();
        });
    });

    it('_needShowConfirmation', () => {
        const FC = new ControllerBase();
        FC._record = new Model({
            rawData: {
                someField: '',
            },
        });
        FC._record.set('someField', 'newValue');

        const result = FC._needShowConfirmation();
        expect(result).toBe(true);
        FC._record.acceptChanges();
        FC._options.confirmationShowingCallback = () => {
            return true;
        };
        expect(result).toBe(true);
    });
});
