import { Logger } from 'UI/Utils';
import { CrudEntityKey, LOCAL_MOVE_POSITION, Memory } from 'Types/source';
import { IHashMap } from 'Types/declarations';
import * as clone from 'Core/core-clone';
import { IMoveProvider, MoveProvider } from 'Controls/listCommands';
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

describe('ControlsUnit/list_clean/listCommands/Move/ProviderMemorySource', () => {
    let provider: MoveProvider;
    let config: Partial<IMoveProvider>;
    let source: Memory;
    let stubLoggerError: any;
    let selection: ISelectionObject;
    let callCatch: boolean;

    beforeEach(() => {
        const _data = clone(data);
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
        };

        // to prevent throwing console error
        stubLoggerError = jest.spyOn(Logger, 'error').mockClear().mockImplementation();

        callCatch = false;
    });

    describe('ICrudPlus', () => {
        beforeEach(() => {
            provider = new MoveProvider();
        });

        // Передан source===undefined при перемещении методом move()
        it('move() + source is not set/invalid', () => {
            return provider
                .execute({
                    ...config,
                    source: undefined,
                    selection,
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.After,
                })
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю, что перемещение провалится из-за того, что source не задан
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать move() с невалидным selection
        it('should not move "after" with invalid selection', () => {
            return provider
                .execute({
                    ...config,
                    // eslint-disable-next-line
                    selection: ['1', '2', '2'],
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.After,
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать move() с selection===undefined
        it('should not move "after" with undefined selection', () => {
            return provider
                .execute({
                    ...config,
                    // eslint-disable-next-line
                    selection: undefined,
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.After,
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере
                    expect(stubLoggerError).toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать move() с пустым selection
        it('should try to move "after" with empty selection', () => {
            return provider
                .execute({
                    ...config,
                    selection: {
                        selected: [],
                        excluded: [],
                    },
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.After,
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Попытка вызвать move() с заполненными selected[] и excluded[]
        it('should try to move "after" with correct selection', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: [3],
            };

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
                        expect(meta.parentProperty).toEqual(config.parentProperty);
                        return Promise.resolve();
                    }
                );
            return provider
                .execute({
                    ...config,
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с заполненным excluded[] но с пустым selected[]
        it('should try to move "on" without selected keys', () => {
            const correctSelection: ISelectionObject = {
                selected: [],
                excluded: [3],
            };
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
                        expect(meta.parentProperty).toEqual(config.parentProperty);
                        return Promise.resolve();
                    }
                );

            return provider
                .execute({
                    ...config,
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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
        it('should try to move without excluded keys', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: [],
            };
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
                        expect(meta.parentProperty).toEqual(config.parentProperty);
                        return Promise.resolve();
                    }
                );
            return provider
                .execute({
                    ...config,
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с target===undefined
        it('should not move to undefined target', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: { myProp: 'test' },
                    targetKey: undefined,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с некорректным filter
        it('should not move with incorrect filter (source)', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: jest.fn(),
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с некорректным position
        it('should not move to invalid position', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: {},
                    targetKey: 4,
                    // eslint-disable-next-line
                    position: 'incorrect',
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

        // Попытка вызвать move() с filter===undefined
        it('should move with undefined filter', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: undefined,
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с target === null при перемещении в папку
        it('should move "On" with target === null', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: {},
                    targetKey: null,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с target===null при смене мест
        it('should not move "Before"/"After" to null target', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: { myProp: 'test' },
                    targetKey: null,
                    position: LOCAL_MOVE_POSITION.Before,
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    // Ожидаю. что перемещение провалится из-за ошибки, брошенной в контроллере,
                    // При этом не будет записана ошибка в лог
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(spyMove).not.toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать move() с position===on
        it('should move with position === LOCAL_MOVE_POSITION.On', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: {},
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с position===after
        it('should move with position === LOCAL_MOVE_POSITION.After', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: {},
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.After,
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

        // Попытка вызвать move() с position===after
        it('should move with position === LOCAL_MOVE_POSITION.Before', () => {
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: {},
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.Before,
                })
                .then((result: boolean) => {
                    // Ожидаю. что перемещение произойдёт успешно, т.к. все условия соблюдены
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(spyMove).toHaveBeenCalled();
                    expect(result).not.toBe(false);
                });
        });

        // Некорректный parentProperty вызове move()
        it('incorrect parentProperty does not affect move() result', () => {
            const parentProperty = {};
            const spyMove = jest.spyOn(source, 'move').mockClear();
            return provider
                .execute({
                    ...config,
                    // eslint-disable-next-line
                    parentProperty,
                    selection,
                    filter: {},
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.Before,
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
