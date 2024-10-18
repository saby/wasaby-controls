import { GridDataRow } from 'Controls/grid';
import { Model } from 'Types/entity';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/columns/Row', () => {
    let record: Model;

    beforeEach(() => {
        record = new Model({
            rawData: { key: 1, title: 'first' },
            keyProperty: 'key',
        });
    });

    afterEach(() => {
        record = undefined;
    });

    describe('constructor', () => {
        it('empty columns', () => {
            const columnsConfig = [];
            const gridRow = new GridDataRow({
                owner: getGridCollectionMock({
                    gridColumnsConfig: columnsConfig,
                }),
                columnsConfig,
                stickyLadder: {
                    prop1: { headingStyle: 'style' },
                    prop2: { headingStyle: 'style' },
                },
                gridColumnsConfig: columnsConfig,
                contents: record,
            });

            expect(Array.isArray(gridRow.getColumns())).toBe(true);
            expect(gridRow.getColumns().length).toEqual(0);
        });
    });

    describe('.setColumnsConfig()', () => {
        it('[DATA] => [DATA]', () => {
            const columnsConfig = [{ displayProperty: 'before' }];
            const gridRow = new GridDataRow({
                owner: getGridCollectionMock({
                    gridColumnsConfig: columnsConfig,
                }),
                columnsConfig,
                gridColumnsConfig: columnsConfig,
                contents: record,
            });

            expect(Array.isArray(gridRow.getColumns())).toBe(true);
            expect(gridRow.getColumns().length).toEqual(1);
            expect(gridRow.getColumns()[0].getColumnConfig()).toEqual({
                displayProperty: 'before',
            });
            expect(gridRow.getVersion()).toEqual(0);

            // Устанавливаем новые колонки
            gridRow.setColumnsConfig([{ displayProperty: 'after' }]);

            expect(Array.isArray(gridRow.getColumns())).toBe(true);
            expect(gridRow.getColumns().length).toEqual(1);
            expect(gridRow.getColumns()[0].getColumnConfig()).toEqual({
                displayProperty: 'after',
            });
            expect(gridRow.getVersion()).toEqual(1);
        });

        it('[NULL] => [DATA]', () => {
            const columnsConfig = [{ displayProperty: 'before' }];
            const gridRow = new GridDataRow({
                owner: getGridCollectionMock({
                    gridColumnsConfig: columnsConfig,
                }),
                gridColumnsConfig: columnsConfig,
                columnsConfig,
                contents: record,
            });

            gridRow.setColumnsConfig(null);
            expect(gridRow.getVersion()).toEqual(1);
            expect(gridRow.getColumns()).not.toBeDefined();

            // Устанавливаем новые колонки
            gridRow.setColumnsConfig([{ displayProperty: 'after' }]);

            expect(gridRow.getVersion()).toEqual(2);
            expect(gridRow.getColumns().length).toEqual(1);
        });

        it('[DATA] => [NULL]', () => {
            const columnsConfig = [{ displayProperty: 'before' }];
            const gridRow = new GridDataRow({
                owner: getGridCollectionMock({
                    gridColumnsConfig: columnsConfig,
                }),
                columnsConfig,
                gridColumnsConfig: columnsConfig,
                contents: record,
            });

            expect(Array.isArray(gridRow.getColumns())).toBe(true);
            expect(gridRow.getColumns().length).toEqual(1);
            expect(gridRow.getColumns()[0].getColumnConfig()).toEqual({
                displayProperty: 'before',
            });
            expect(gridRow.getVersion()).toEqual(0);

            // Устанавливаем новые колонки
            gridRow.setColumnsConfig(null);

            expect(gridRow.getVersion()).toEqual(1);
            expect(gridRow.getColumns()).toBeNull();
        });
    });
});
