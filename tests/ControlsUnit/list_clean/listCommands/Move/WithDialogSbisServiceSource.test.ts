import { Logger } from 'UI/Utils';
import { Control } from 'UI/Base';
import { IHashMap } from 'Types/declarations';

import { CrudEntityKey, DataSet, SbisService } from 'Types/source';
import { IMoveWithDialogOptions, MoveWithDialog as MoveAction } from 'Controls/listCommands';
import { ISelectionObject } from 'Controls/interface';
import { DialogOpener, Confirmation, IBasePopupOptions } from 'Controls/popup';
import { Model, adapter, Record } from 'Types/entity';

const sbisServiceSource: Partial<SbisService> = {
    getAdapter(): any {
        return new adapter.Json();
    },
    getBinding(): any {
        return {
            move: 'move',
            list: 'list',
        };
    },
    move(items: CrudEntityKey[], target: CrudEntityKey, meta?: IHashMap<any>): Promise<void> {
        return Promise.resolve();
    },
    call(command: string, data?: object): Promise<DataSet> {
        return Promise.resolve(undefined);
    },
    getKeyProperty(): string {
        return 'id';
    },
};

function createFakeModel(rawData: { id: number; folder: number; 'folder@': boolean }): Model {
    return new Model({
        rawData,
        keyProperty: 'id',
    });
}

function mockDialogOpener(openFunction?: (args: popup.IBasePopupOptions) => Promise<any>): any {
    let popupId = null;
    return {
        open: jest
            .spyOn(DialogOpener.prototype, 'open')
            .mockClear()
            .mockImplementation((popupOptions: IBasePopupOptions) => {
                popupId = 'POPUP_ID';
                return openFunction(popupOptions);
            }),
        isOpened: jest
            .spyOn(DialogOpener.prototype, 'isOpened')
            .mockClear()
            .mockImplementation(() => {
                return !!popupId;
            }),
    };
}

describe('ControlsUnit/list_clean/listCommands/Move/WithDialogSbisServiceSource', () => {
    let provider: MoveAction;
    let config: IMoveWithDialogOptions;
    let stubLoggerError: any;
    let selection: ISelectionObject;
    let callCatch: boolean;

    beforeEach(() => {
        // fake opener
        const opener = new Control({});

        selection = {
            selected: [1, 3, 5, 7],
            excluded: [3],
        };

        config = {
            parentProperty: 'folder',
            source: sbisServiceSource as SbisService,
            popupOptions: {
                opener,
                templateOptions: {
                    keyProperty: 'id',
                    nodeProperty: 'folder@',
                    parentProperty: 'folder',
                },
                template: 'fakeTemplate',
            },
        };

        // to prevent throwing console error
        stubLoggerError = jest.spyOn(Logger, 'error').mockClear().mockImplementation();

        callCatch = false;
    });

    describe('SbisService', () => {
        let dataSet: DataSet;

        beforeEach(() => {
            dataSet = new DataSet({
                rawData: [
                    {
                        '@DocRoutingRule': 1327,
                        id: 1351,
                    },
                ],
                keyProperty: 'id',
            });
            provider = new MoveAction(config);
        });

        // Попытка вызвать moveWithDialog() с невалидным selection
        it('should not move with dialog and invalid selection', () => {
            mockDialogOpener(() => {
                return Promise.reject('FAKE');
            });
            const stubConfirmation = jest
                .spyOn(Confirmation, 'openPopup')
                .mockClear()
                .mockImplementation((args) => {
                    return Promise.resolve(true);
                });
            return provider
                .execute({
                    // eslint-disable-next-line
                    selection: ['1', '2', '2'],
                    filter: { myProp: 'test' },
                })
                .then(jest.fn())
                .catch((error) => {
                    callCatch = true;
                    expect(error).not.toEqual('FAKE');
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за ошибки,
                    // брошенной в контроллере на этапе открытия диалога
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(stubConfirmation).toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать moveWithDialog() с selection===undefined
        it('should not move with dialog and selection === undefined', () => {
            mockDialogOpener(() => {
                return Promise.reject('FAKE');
            });
            const stubConfirmation = jest
                .spyOn(Confirmation, 'openPopup')
                .mockClear()
                .mockImplementation((args) => {
                    return Promise.resolve(true);
                });
            // @ts-ignore
            return provider
                .execute({
                    // eslint-disable-next-line
                    selection: undefined,
                    filter: { myProp: 'test' },
                })
                .then(jest.fn())
                .catch((error) => {
                    callCatch = true;
                    expect(error).not.toEqual('FAKE');
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за ошибки,
                    // брошенной в контроллере на этапе открытия диалога
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(stubConfirmation).toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать moveWithDialog() с пустым selection
        it('should not move with dialog and empty selection', () => {
            const correctSelection: ISelectionObject = {
                selected: [],
                excluded: [3],
            };
            // to prevent popup open
            mockDialogOpener(() => {
                return Promise.reject('FAKE');
            });
            const stubConfirmation = jest
                .spyOn(Confirmation, 'openPopup')
                .mockClear()
                .mockImplementation((args) => {
                    return Promise.resolve(true);
                });
            // @ts-ignore
            return provider
                .execute({
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за popup.Confirmation,
                    // открытого в контроллере на этапе открытия диалога
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(stubConfirmation).toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать moveWithDialog() с заполненными selected[] и excluded[]
        it('should try to move with dialog and correct selection', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: [3],
            };
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(
                        createFakeModel({
                            id: 3,
                            folder: null,
                            'folder@': null,
                        })
                    )
                );
            });
            const stubCall = jest
                .spyOn(sbisServiceSource, 'call')
                .mockClear()
                .mockImplementation(
                    (
                        command: string,
                        data?: {
                            method: string;
                            filter: Record;
                            folder_id: number;
                        }
                    ) => {
                        expect(data.filter).toBeDefined();
                        expect(data.filter.get('selection').get('marked')).toEqual(
                            correctSelection.selected.map((key) => {
                                return `${key}`;
                            })
                        );
                        expect(data.filter.get('selection').get('excluded')).toEqual(
                            correctSelection.excluded.map((key) => {
                                return `${key}`;
                            })
                        );
                        return Promise.resolve(dataSet);
                    }
                );
            return provider
                .execute({
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                })
                .then((result: DataSet) => {
                    expect(result).toEqual(dataSet);
                })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(stubCall).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Попытка вызвать move() с заполненным selected[] но с пустым excluded[]
        it('should try to move with dialog and without excluded keys', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: [],
            };
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(
                        createFakeModel({
                            id: 3,
                            folder: null,
                            'folder@': null,
                        })
                    )
                );
            });
            const stubCall = jest
                .spyOn(sbisServiceSource, 'call')
                .mockClear()
                .mockImplementation(
                    (
                        command: string,
                        data?: {
                            method: string;
                            filter: Record;
                            folder_id: number;
                        }
                    ) => {
                        expect(data.filter).toBeDefined();
                        expect(data.filter.get('selection').get('marked')).toEqual(
                            correctSelection.selected.map((key) => {
                                return `${key}`;
                            })
                        );
                        expect(data.filter.get('selection').get('excluded')).toEqual(
                            correctSelection.excluded.map((key) => {
                                return `${key}`;
                            })
                        );
                        return Promise.resolve(dataSet);
                    }
                );
            return provider
                .execute({
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                })
                .then((result: DataSet) => {
                    expect(result).toEqual(dataSet);
                })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(stubCall).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Попытка вызвать resolveMoveWithDialog() с некорректным filter
        it('should not move with dialog with incorrect filter (sbisService)', () => {
            const spyCall = jest.spyOn(sbisServiceSource, 'call').mockClear();
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(
                        createFakeModel({
                            id: 3,
                            folder: null,
                            'folder@': null,
                        })
                    )
                );
            });
            return provider
                .execute({
                    selection,
                    filter: jest.fn(),
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(spyCall).not.toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать resolveMoveWithDialog() с filter===undefined
        it('should move with dialog and undefined filter (sbisService)', () => {
            const stubCall = jest
                .spyOn(sbisServiceSource, 'call')
                .mockClear()
                .mockImplementation(
                    (
                        command: string,
                        data?: {
                            method: string;
                            filter: Record;
                            folder_id: number;
                        }
                    ) => {
                        expect(data.filter).toBeDefined();
                        return Promise.resolve(dataSet);
                    }
                );
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(
                        createFakeModel({
                            id: 3,
                            folder: null,
                            'folder@': null,
                        })
                    )
                );
            });
            return provider
                .execute({
                    selection,
                    filter: undefined,
                })
                .then((result: DataSet) => {
                    expect(result).toEqual(dataSet);
                })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(stubCall).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Попытка вызвать resolveMoveWithDialog() с заполненным filter
        it('should move with dialog and filter (sbisService)', () => {
            const stubCall = jest
                .spyOn(sbisServiceSource, 'call')
                .mockClear()
                .mockImplementation(
                    (
                        command: string,
                        data?: {
                            method: string;
                            filter: Record;
                            folder_id: number;
                        }
                    ) => {
                        expect(data.filter).toBeDefined();
                        expect(data.filter.get('mother')).toEqual('anarchy');
                        return Promise.resolve(dataSet);
                    }
                );
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(
                        createFakeModel({
                            id: 3,
                            folder: null,
                            'folder@': null,
                        })
                    )
                );
            });
            return provider
                .execute({
                    selection,
                    filter: { mother: 'anarchy' },
                })
                .then((result: DataSet) => {
                    expect(result).toEqual(dataSet);
                })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(stubCall).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Если call возвращает ошибку, нужно её отлавливать и передавать дальше в reject
        it('should catch call method error', () => {
            let callThen = false;
            const stubCall = jest
                .spyOn(sbisServiceSource, 'call')
                .mockClear()
                .mockImplementation(
                    (
                        command: string,
                        data?: {
                            method: string;
                            filter: Record;
                            folder_id: number;
                        }
                    ) => {
                        return Promise.reject('server is gone');
                    }
                );
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(
                        createFakeModel({
                            id: 3,
                            folder: null,
                            'folder@': null,
                        })
                    )
                );
            });
            return provider
                .execute({
                    selection,
                    filter: { mother: 'anarchy' },
                })
                .then((result: DataSet) => {
                    callThen = true;
                })
                .catch((error) => {
                    expect(error).toEqual('server is gone');
                })
                .finally(() => {
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(stubCall).toHaveBeenCalled();
                    expect(callThen).toBe(false);
                });
        });
    });
});
