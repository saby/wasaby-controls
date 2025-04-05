const NOT_LOADED_NEEDED_LIB_ERROR = Error('NOT_LOADED_NEEDED_LIB_ERROR');
const UNNEEDED_TREE_GRID_LOADED_ERROR = Error('UNNEEDED_TREE_GRID_LOADED_ERROR');

// Перехватываем Logger, чтобы бросать исключения и отслеживать их, вместо ошибки в консоль, которую он создает.
import type { Logger } from 'UI/Utils';

const TestLogger = {} as typeof Logger;

jest.mock('UI/Utils', () => {
    return {
        __esModule: true,
        Logger: TestLogger,
    };
});

jest.mock('Controls/treeGrid', () => {
    throw UNNEEDED_TREE_GRID_LOADED_ERROR;
});

import { isLoaded } from 'WasabyLoader/ModulesLoader';
import { resolveColumnScrollControl } from 'Controls/_gridColumnScroll/ColumnScrollControlResolver';

beforeEach(() => {
    TestLogger.error = jest.fn().mockImplementation(() => {
        throw NOT_LOADED_NEEDED_LIB_ERROR;
    });
});

describe('ControlsUnit/gridColumnScroll/ColumnScrollControlResolver/ForGrid', () => {
    describe('Библиотека дерева с колонками не предзагружена.', () => {
        beforeEach(() => {
            expect(isLoaded('Controls/treeGrid')).toBe(false);
        });

        it('Попытка создать контроллер таблицы с горизонтальным скролом приведет к ошибке, что она не загружена. ', () => {
            expect(isLoaded('Controls/grid')).toBe(false);

            expect(() => {
                resolveColumnScrollControl('Controls/grid');
            }).toThrowError(NOT_LOADED_NEEDED_LIB_ERROR);

            expect(isLoaded('Controls/grid')).toBe(false);
        });

        it('Для отказоустойчивости будет создан абстрактный контрол, но об ошибке будет уведомление.', () => {
            let ControllerClass;
            expect(isLoaded('Controls/grid')).toBe(false);

            TestLogger.error = jest.fn();
            expect(() => {
                ControllerClass = resolveColumnScrollControl('Controls/grid');
            }).not.toThrow();
            expect(TestLogger.error).toBeCalled();

            expect(isLoaded('Controls/grid')).toBe(false);

            expect(ControllerClass).toBeDefined();
            expect(ControllerClass['[Controls/gridColumnScroll:ColumnScrollControl]']).toBe(true);
        });
    });

    describe('Библиотека таблицы загружена.', () => {
        beforeEach(async () => {
            await import('Controls/grid');
            expect(isLoaded('Controls/grid')).toBe(true);
        });

        it('Создается контрол таблицы с горизонтальным скролом.', () => {
            const ControllerClass = resolveColumnScrollControl('Controls/grid');

            expect(ControllerClass).toBeDefined();
            expect(ControllerClass['[Controls/gridColumnScroll:ColumnScrollControl]']).toBe(true);
            expect(ControllerClass['[Controls/grid:GridControl]']).toBe(true);
        });

        it('При создании таблицы с горизонтальным скролом НЕ должна затягиваться библиотека Controls/treeGrid.', () => {
            expect(isLoaded('Controls/treeGrid')).toBe(false);

            expect(() => {
                resolveColumnScrollControl('Controls/grid');
            }).not.toThrow();

            expect(isLoaded('Controls/treeGrid')).toBe(false);
        });
    });
});
