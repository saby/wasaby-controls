import { Logger } from 'UI/Utils';
import { IHashMap } from 'Types/declarations';

import { CrudEntityKey, DataSet, SbisService, LOCAL_MOVE_POSITION } from 'Types/source';
import { IMoveProvider, MoveProvider } from 'Controls/listCommands';
import { ISelectionObject } from 'Controls/interface';
import { adapter, Record } from 'Types/entity';

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

describe('ControlsUnit/list_clean/listCommands/Move/ProviderSbisServiceSource', () => {
    let provider: MoveProvider;
    let config: Partial<IMoveProvider>;
    let stubLoggerError: any;
    let selection: ISelectionObject;
    let callCatch: boolean;

    beforeEach(() => {
        selection = {
            selected: [1, 3, 5, 7],
            excluded: [3],
        };

        config = {
            parentProperty: 'folder',
            source: sbisServiceSource as SbisService,
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
            provider = new MoveProvider();
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

        // recursive при перемещении должен быть false
        it('recursive should be false', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: [3],
            };
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
                        expect(data.filter.get('selection').get('recursive')).toBe(false);
                        return Promise.resolve(dataSet);
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
                .finally(() => {
                    expect(stubCall).toHaveBeenCalled();
                });
        });

        // Попытка вызвать move() с заполненными selected[] и excluded[]
        it('should try to move "after" with correct selection', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: [3],
            };

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
                    ...config,
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с заполненным excluded[] но с пустым selected[]
        it('should try to move "on" without selected keys', () => {
            const correctSelection: ISelectionObject = {
                selected: [],
                excluded: [3],
            };
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
                    ...config,
                    selection: correctSelection,
                    filter: { myProp: 'test' },
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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
        it('should try to move without excluded keys', () => {
            const correctSelection: ISelectionObject = {
                selected: [1, 3, 5, 7],
                excluded: [],
            };
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
                    expect(stubCall).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Попытка вызвать move() с target===undefined
        it('should not move to undefined target', () => {
            const spyCall = jest.spyOn(sbisServiceSource, 'call').mockClear();
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
                    expect(spyCall).not.toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать move() с некорректным filter
        it('should not move with incorrect filter (sbisService)', () => {
            const spyCall = jest.spyOn(sbisServiceSource, 'call').mockClear();
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
                    expect(spyCall).not.toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать move() с некорректным position
        it('should not move to invalid position', () => {
            const spyCall = jest.spyOn(sbisServiceSource, 'call').mockClear();
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
                    expect(spyCall).not.toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать move() с filter===undefined
        it('should move with undefined filter', () => {
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
            return provider
                .execute({
                    ...config,
                    selection,
                    filter: undefined,
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.On,
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

        // Попытка вызвать move() с target === null при перемещении в папку
        it('should move with target === null', () => {
            const spyCall = jest.spyOn(sbisServiceSource, 'call').mockClear();
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
                    // Ожидаю. что перемещение пройдёт успешно
                    expect(stubLoggerError).not.toHaveBeenCalled();
                    expect(spyCall).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Попытка вызвать move() с target===null при смене мест
        it('should not move "Before"/"After" to null target', () => {
            const spyCall = jest.spyOn(sbisServiceSource, 'call').mockClear();
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
                    expect(spyCall).not.toHaveBeenCalled();
                    expect(callCatch).toBe(true);
                });
        });

        // Попытка вызвать move() с position===on
        it('should move with position === LOCAL_MOVE_POSITION.On', () => {
            const spyCall = jest.spyOn(sbisServiceSource, 'call').mockClear();
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
                    expect(spyCall).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // Попытка вызвать move() с position===after
        it('should move with position === LOCAL_MOVE_POSITION.After', () => {
            const spyMove = jest.spyOn(sbisServiceSource, 'move').mockClear();
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
            const spyMove = jest.spyOn(sbisServiceSource, 'move').mockClear();
            return provider
                .execute({
                    ...config,
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

        // parentProperty передаётся на backend при вызове move()
        it('incorrect parentProperty does not affect move() result', () => {
            const parentProperty = {};
            const stubMove = jest
                .spyOn(sbisServiceSource, 'move')
                .mockClear()
                .mockImplementation(
                    (items: CrudEntityKey[], target: CrudEntityKey, meta?: IHashMap<any>) => {
                        // @ts-ignore
                        expect(meta.parentProperty).toBeDefined();
                        return Promise.resolve();
                    }
                );
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
                    expect(stubMove).toHaveBeenCalled();
                    expect(callCatch).toBe(false);
                });
        });

        // move() вызывается с учётом sorting
        it('should call move() with Sorting', () => {
            const parentProperty = {};
            const stubMove = jest
                .spyOn(sbisServiceSource, 'move')
                .mockClear()
                .mockImplementation(
                    (items: CrudEntityKey[], target: CrudEntityKey, meta?: IHashMap<any>) => {
                        // @ts-ignore
                        expect(meta.query).toBeDefined();
                        const orderBy = meta.query.getOrderBy();
                        expect(orderBy[0].getSelector()).toEqual('field');
                        expect(orderBy[0].getOrder()).toBe(false);
                        return Promise.resolve();
                    }
                );
            return provider
                .execute({
                    ...config,
                    // eslint-disable-next-line
                    parentProperty,
                    selection,
                    filter: {},
                    targetKey: 4,
                    position: LOCAL_MOVE_POSITION.Before,
                    sorting: [{ field: 'ASC' }],
                })
                .then(jest.fn())
                .catch(() => {
                    callCatch = true;
                })
                .finally(() => {
                    expect(stubMove).toHaveBeenCalled();
                });
        });
    });
});
