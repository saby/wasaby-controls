import CrudController from 'Controls/_form/CrudController';
import { Local, Memory as MemorySource } from 'Types/source';
import { Record } from 'Types/entity';
import { Controller } from 'Controls/form';

interface ITestRecord {
    id: number;
    title: string;
}

describe('Controls/form:CrudController', () => {
    let crud: CrudController;
    let formController: Controller;
    let source: Local;
    let stubNotify;
    const record: Record<ITestRecord> = new Record<ITestRecord>({
        rawData: {
            id: 0,
            title: 'test',
        },
    });
    record.getId = () => {
        return record.get<'id'>('id');
    };

    beforeEach(() => {
        formController = new Controller();
        formController._isMount = true;
        source = new MemorySource();
        crud = new CrudController(
            source,
            formController._notifyHandler.bind(formController),
            formController.registerPendingNotifier.bind(formController),
            formController.indicatorNotifier.bind(formController)
        );
        stubNotify = jest
            .spyOn(formController, '_notify')
            .mockClear()
            .mockImplementation();
    });

    describe('create', () => {
        it('Success', (done) => {
            const resolvePromise = Promise.resolve<Record>(record);
            jest.spyOn(source, 'create')
                .mockClear()
                .mockReturnValue(resolvePromise);

            const actual = crud.create();

            expect(formController._notify).toHaveBeenCalledWith(
                'registerPending',
                expect.anything(),
                expect.anything()
            );
            actual
                .then(() => {
                    expect(formController._notify).toHaveBeenCalledWith(
                        'createsuccessed',
                        expect.anything()
                    );
                    done();
                })
                .catch(() => {
                    done('should not go into the Promise.catch handler');
                });
        });
        it('Fail', (done) => {
            const rejectPromise = Promise.reject<Record>(record);
            jest.spyOn(source, 'create')
                .mockClear()
                .mockReturnValue(rejectPromise);

            const actual = crud.create();

            expect(formController._notify).toHaveBeenCalledWith(
                'registerPending',
                expect.anything(),
                expect.anything()
            );

            actual
                .then(() => {
                    done('should not go into the Promise.then handler');
                })
                .catch(() => {
                    expect(formController._notify).toHaveBeenCalledWith(
                        'createfailed',
                        expect.anything()
                    );
                    done();
                });
        });
    });

    describe('read', () => {
        it('Success', (done) => {
            const resolvePromise = Promise.resolve<void>();
            jest.spyOn(source, 'read')
                .mockClear()
                .mockReturnValue(resolvePromise);
            const actual = crud.read('1');

            expect(stubNotify).toHaveBeenCalledWith(
                'registerPending',
                expect.anything(),
                expect.anything()
            );
            actual
                .then(() => {
                    expect(stubNotify).toHaveBeenCalledWith(
                        'readsuccessed',
                        expect.anything()
                    );
                    done();
                })
                .catch(() => {
                    done('should not go into the Promise.catch handler');
                });
        });
        it('Fail', (done) => {
            const rejectPromise = Promise.reject<void>();
            jest.spyOn(source, 'read')
                .mockClear()
                .mockReturnValue(rejectPromise);
            const actual = crud.read('1');

            expect(stubNotify).toHaveBeenCalledWith(
                'registerPending',
                expect.anything(),
                expect.anything()
            );

            actual
                .then(() => {
                    done('should not go into the Promise.then handler');
                })
                .catch(() => {
                    expect(stubNotify).toHaveBeenCalledWith(
                        'readfailed',
                        expect.anything()
                    );
                    done();
                });
        });
    });

    describe('update', () => {
        it('Success', (done) => {
            const resolvePromise = Promise.resolve<void>();
            jest.spyOn(source, 'update')
                .mockClear()
                .mockReturnValue(resolvePromise);
            record.set<'title'>('title', 'update test');

            const actual = crud.update(record);

            expect(stubNotify).toHaveBeenCalledWith(
                'registerPending',
                expect.anything(),
                expect.anything()
            );
            actual
                .then(() => {
                    expect(stubNotify).toHaveBeenCalledWith(
                        'updatesuccessed',
                        expect.anything()
                    );
                    done();
                })
                .catch(() => {
                    done('should not go into the Promise.catch handler');
                });

            record.set<'title'>('title', 'test');
            record.acceptChanges(['title']);
        });
        it('Fail', (done) => {
            const rejectPromise = Promise.reject<void>();
            jest.spyOn(source, 'update')
                .mockClear()
                .mockReturnValue(rejectPromise);
            record.set<'title'>('title', 'update test');

            const actual = crud.update(record);

            expect(stubNotify).toHaveBeenCalledWith(
                'registerPending',
                expect.anything(),
                expect.anything()
            );

            actual
                .then(() => {
                    done('should not go into the Promise.then handler');
                })
                .catch(() => {
                    expect(stubNotify).toHaveBeenCalledWith(
                        'updatefailed',
                        expect.anything()
                    );
                    done();
                });

            record.set<'title'>('title', 'test');
            record.acceptChanges(['title']);
        });
        it('There is nothing to update', () => {
            const actual = crud.update(record);
            expect(actual).toBeNull();
        });
    });
    describe('delete', () => {
        it('Success', (done) => {
            const resolvePromise = Promise.resolve<void>();
            jest.spyOn(source, 'destroy')
                .mockClear()
                .mockReturnValue(resolvePromise);

            const actual = crud.delete(record);

            expect(stubNotify).toHaveBeenCalledWith(
                'registerPending',
                expect.anything(),
                expect.anything()
            );
            actual
                .then(() => {
                    expect(stubNotify).toHaveBeenCalledWith(
                        'deletesuccessed',
                        expect.anything()
                    );
                    done();
                })
                .catch(() => {
                    done('should not go into the Promise.catch handler');
                });
        });
        it('Fail', (done) => {
            const rejectPromise = Promise.reject<void>();
            jest.spyOn(source, 'destroy')
                .mockClear()
                .mockReturnValue(rejectPromise);

            const actual = crud.delete(record);

            expect(stubNotify).toHaveBeenCalledWith(
                'registerPending',
                expect.anything(),
                expect.anything()
            );

            actual
                .then(() => {
                    done('should not go into the Promise.then handler');
                })
                .catch(() => {
                    expect(stubNotify).toHaveBeenCalledWith(
                        'deletefailed',
                        expect.anything()
                    );
                    done();
                });
        });
    });
});
