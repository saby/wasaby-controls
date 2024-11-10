import { Logger } from 'UI/Utils';
import * as clone from 'Core/core-clone';
import { Memory } from 'Types/source';
import { Remove, IActionOptions } from 'Controls/listCommands';
import { ISelectionObject } from 'Controls/interface';
import { EntityKey } from 'Types/_source/ICrud';
import Query from 'Types/_source/Query';
import DataSet from 'Types/_source/DataSet';

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

function resolveRemove(options: IActionOptions) {
    return new Promise((resolve) => {
        new Remove({
            ...options,
            providerName: 'Controls/listCommands:RemoveProvider',
        })
            .execute({})
            .then(() => {
                return resolve(true);
            })
            .catch(() => {
                return resolve(false);
            });
    });
}

describe('Controls/list_clean/ListCommands/RemoveProvider', () => {
    let source: Memory;
    let selection: ISelectionObject;

    beforeEach(() => {
        const _data = clone(data);

        selection = {
            selected: [1, 3, 5],
            excluded: [3],
        };

        source = new Memory({
            keyProperty: 'id',
            data: _data,
        });

        // to prevent throwing console error
        jest.spyOn(Logger, 'error').mockClear().mockImplementation();
    });

    it('remove() should not remove without source', () => {
        return resolveRemove({
            selection,
            source: undefined,
        }).then((result: boolean) => {
            // Ожидаем, что упадёт из-за ошибки, брошенной в контроллере
            expect(result).toBe(false);
        });
    });

    it('remove() should not remove with incorrect selection', () => {
        return resolveRemove({
            source,
            // eslint-disable-next-line
            selection: [0, 1, 2],
        }).then((result: boolean) => {
            // Ожидаем, что упадёт из-за ошибки, брошенной в контроллере
            expect(result).toBe(false);
        });
    });

    it('remove() should not remove with undefined selection', () => {
        // @ts-ignore
        return resolveRemove({ source }).then((result: boolean) => {
            // Ожидаем, что упадёт из-за ошибки, брошенной в контроллере
            expect(result).toBe(false);
        });
    });

    it('remove() should remove with correct selection', () => {
        const correctSelection = {
            selected: [1, 3, 5],
            excluded: [3],
        };
        const stubQuery = jest
            .spyOn(source, 'query')
            .mockClear()
            .mockImplementation((query?: Query) => {
                return Promise.resolve(
                    new DataSet({
                        keyProperty: 'id',
                        rawData: [{ id: 1 }, { id: 5 }],
                    })
                );
            });
        const destroyCallback = (keys: EntityKey | EntityKey[], meta?: object) => {
            expect(keys[1]).toEqual(5);
            return Promise.resolve();
        };
        const stubDestroy = jest
            .spyOn(source, 'destroy')
            .mockClear()
            .mockImplementation(destroyCallback);

        return resolveRemove({
            source,
            selection: correctSelection,
        }).then((result: boolean) => {
            // Ожидаем, что удаление пройдёт успешно
            expect(result).toBe(true);
            expect(stubQuery).toHaveBeenCalled();
            expect(stubDestroy).toHaveBeenCalled();
        });
    });

    it('remove() should remove with empty selection', () => {
        const correctSelection = {
            selected: [],
            excluded: [3],
        };
        const stubQuery = jest
            .spyOn(source, 'query')
            .mockClear()
            .mockImplementation((query?: Query) => {
                return Promise.resolve(
                    new DataSet({
                        keyProperty: 'id',
                        rawData: [{ id: 1 }, { id: 2 }, { id: 5 }],
                    })
                );
            });
        const stubDestroy = jest
            .spyOn(source, 'destroy')
            .mockClear()
            .mockImplementation((keys: EntityKey | EntityKey[], meta?: object) => {
                expect(keys[1]).toEqual(2);
                return Promise.resolve();
            });
        return resolveRemove({
            source,
            selection: correctSelection,
        }).then((result: boolean) => {
            // Ожидаем, что удаление пройдёт успешно
            expect(result).toBe(true);
            expect(stubQuery).toHaveBeenCalled();
            expect(stubDestroy).toHaveBeenCalled();
        });
    });

    it('removeItems() should call query for [null] selection', () => {
        const correctSelection = {
            selected: [null],
            excluded: [],
        };
        const stubQuery = jest
            .spyOn(source, 'query')
            .mockClear()
            .mockImplementation((query?: Query) => {
                return Promise.resolve(
                    new DataSet({
                        keyProperty: 'id',
                        rawData: [{ id: 1 }, { id: 2 }, { id: 5 }],
                    })
                );
            });
        const stubDestroy = jest
            .spyOn(source, 'destroy')
            .mockClear()
            .mockImplementation((keys: EntityKey | EntityKey[], meta?: object) => {
                expect(keys[1]).toEqual(2);
                return Promise.resolve();
            });
        return resolveRemove({
            source,
            selection: correctSelection,
        }).then((result: boolean) => {
            // Ожидаем, что удаление пройдёт успешно
            expect(result).toBe(true);
            expect(stubQuery).toHaveBeenCalled();
            expect(stubDestroy).toHaveBeenCalled();
        });
    });

    it('remove() should not remove with undefined selection', () => {
        // @ts-ignore
        return resolveRemove({ source }).then((result: boolean) => {
            // Ожидаем, что упадёт из-за ошибки, брошенной в контроллере
            expect(result).toBe(false);
        });
    });
});
