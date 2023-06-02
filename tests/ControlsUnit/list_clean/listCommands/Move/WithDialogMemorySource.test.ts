import { Control } from 'UI/Base';
import { Logger } from 'UI/Utils';
import { CrudEntityKey, LOCAL_MOVE_POSITION, Memory } from 'Types/source';
import { IHashMap } from 'Types/declarations';
import { Model } from 'Types/entity';
import * as clone from 'Core/core-clone';
import { DialogOpener, IBasePopupOptions, Confirmation } from 'Controls/popup';
import {
    IMoveWithDialogOptions,
    MoveWithDialog as MoveAction,
} from 'Controls/listCommands';
import { ISelectionObject } from 'Controls/interface';

const data = [
    {
        id: 1,
        folder: null,
        'folder@': true,
    },
    {
        id: 2,
        folder: null,
        'folder@': null,
    },
    {
        id: 3,
        folder: null,
        'folder@': null,
    },
    {
        id: 4,
        folder: 1,
        'folder@': true,
    },
    {
        id: 5,
        folder: 1,
        'folder@': null,
    },
    {
        id: 6,
        folder: null,
        'folder@': null,
    },
];

function createFakeModel(rawData: {
    id: number;
    folder: number;
    'folder@': boolean;
}): Model {
    return new Model({
        rawData,
        keyProperty: 'id',
    });
}

function mockDialogOpener(
    openFunction?: (args: IBasePopupOptions) => Promise<any>
): any {
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

describe('ControlsUnit/list_clean/listCommands/Move/WithDialogMemorySource', () => {
    let provider: MoveAction;
    let config: IMoveWithDialogOptions;
    let source: Memory;
    let stubLoggerError: any;
    let selection: ISelectionObject;
    let callCatch: boolean;

    beforeEach(() => {
        const _data = clone(data);

        // fake opener
        const opener = new Control({});

        source = new Memory({
            keyProperty: 'id',
            data: _data,
        });

        selection = {
            selected: [1, 3, 5, 7],
            excluded: [3],
        };

        config = {
            parentProperty: 'folder',
            source,
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
        stubLoggerError = jest
            .spyOn(Logger, 'error')
            .mockClear()
            .mockImplementation();

        callCatch = false;
    });

    describe('ICrudPlus', () => {
        beforeEach(() => {
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
            return provider
                .execute({
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                })
                .then(jest.fn())
                .catch((error) => {
                    callCatch = true;
                    expect(error).not.toEqual('FAKE');
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
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            const stubMove = jest
                .spyOn(source, 'move')
                .mockClear()
                .mockImplementation(
                    (
                        items: CrudEntityKey | CrudEntityKey[],
                        target: CrudEntityKey,
                        meta?: IHashMap<any>
                    ) => {
                        expect(items).toEqual(correctSelection.selected);
                        expect(target).toEqual(4);
                        expect(meta.position).toEqual(LOCAL_MOVE_POSITION.On);
                        expect(meta.parentProperty).toEqual(
                            config.parentProperty
                        );
                        return Promise.resolve();
                    }
                );
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
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(stubMove).toHaveBeenCalled();
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
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            const stubMove = jest
                .spyOn(source, 'move')
                .mockClear()
                .mockImplementation(
                    (
                        items: CrudEntityKey | CrudEntityKey[],
                        target: CrudEntityKey,
                        meta?: IHashMap<any>
                    ) => {
                        expect(items).toEqual(correctSelection.selected);
                        expect(target).toEqual(4);
                        expect(meta.position).toEqual(LOCAL_MOVE_POSITION.On);
                        expect(meta.parentProperty).toEqual(
                            config.parentProperty
                        );
                        return Promise.resolve();
                    }
                );
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
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(stubMove).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Попытка вызвать resolveMoveWithDialog() с некорректным filter
        it('should not move with dialog with incorrect filter (source)', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            return provider
                .execute({
                    selection,
                    source,
                    filter: jest.fn(),
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(spyMove).not.toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать resolveMoveWithDialog() с filter===undefined
        it('should move with dialog and undefined filter (source)', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            // to prevent popup open
            mockDialogOpener((args) => {
                return Promise.resolve(
                    args.eventHandlers.onResult(createFakeModel(data[3]))
                );
            });
            return provider
                .execute({
                    selection,
                    source,
                    filter: undefined,
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(spyMove).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });
    });
});
