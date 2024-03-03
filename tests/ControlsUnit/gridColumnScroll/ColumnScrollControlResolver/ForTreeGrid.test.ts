const NOT_LOADED_NEEDED_LIB_ERROR = Error('NOT_LOADED_NEEDED_LIB_ERROR');

// Перехватываем Logger, чтобы бросать исключения и отслеживать их, вместо ошибки в консоль, которую он создает.
import type { Logger } from 'UI/Utils';

const TestLogger = {} as typeof Logger;

jest.mock('UI/Utils', () => {
    return {
        __esModule: true,
        Logger: TestLogger,
    };
});

import { isLoaded } from 'WasabyLoader/ModulesLoader';
import { resolveColumnScrollControl } from 'Controls/_gridColumnScroll/ColumnScrollControlResolver';

beforeEach(() => {
    TestLogger.error = jest.fn().mockImplementation(() => {
        throw NOT_LOADED_NEEDED_LIB_ERROR;
    });
});

describe('ControlsUnit/gridColumnScroll/ColumnScrollControlResolver/ForTreeGrid', () => {
    describe('Библиотека дерева с колонками не предзагружена.', () => {
        beforeEach(() => {
            expect(isLoaded('Controls/treeGrid')).toBe(false);
        });

        it(
            'Попытка создать контроллер дерева с колонками с горизонтальным скролом ' +
                'приведет к ошибке, что она не загружена. ',
            () => {
                expect(() => {
                    resolveColumnScrollControl('Controls/treeGrid');
                }).toThrowError(NOT_LOADED_NEEDED_LIB_ERROR);

                expect(isLoaded('Controls/treeGrid')).toBe(false);
            }
        );

        it('Для отказоустойчивости будет создан абстрактный контрол, но об ошибке будет уведомление.', () => {
            let ControllerClass;
            expect(isLoaded('Controls/treeGrid')).toBe(false);

            TestLogger.error = jest.fn();
            expect(() => {
                ControllerClass = resolveColumnScrollControl('Controls/treeGrid');
            }).not.toThrow();
            expect(TestLogger.error).toBeCalled();

            expect(isLoaded('Controls/treeGrid')).toBe(false);

            expect(ControllerClass).toBeDefined();
            expect(ControllerClass['[Controls/gridColumnScroll:ColumnScrollControl]']).toBe(true);
        });
    });

    describe('Библиотека дерева с колонками загружена.', () => {
        beforeEach(async () => {
            await import('Controls/treeGrid');
            expect(isLoaded('Controls/treeGrid')).toBe(true);
        });

        it('Создается контрол дерева с колонками с горизонтальным скролом.', async () => {
            expect(isLoaded('Controls/treeGrid')).toBe(true);

            const ControllerClass = resolveColumnScrollControl('Controls/treeGrid');

            expect(ControllerClass).toBeDefined();
            expect(ControllerClass['[Controls/gridColumnScroll:ColumnScrollControl]']).toBe(true);
            expect(ControllerClass['[Controls/treeGrid:TreeGridControl]']).toBe(true);
        });
    });
});
