import { GridDataRow } from 'Controls/grid';
import { Model } from 'Types/entity';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

const getOwner = (gridColumnsConfig) => {
    return getGridCollectionMock({
        gridColumnsConfig,
        stickyColumnsCount: 2,
    });
};

describe('Controls/grid_clean/Display/Ladder/Row/Colspan', () => {
    describe('getColumns', () => {
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

        it('without Colspan', () => {
            const columnsConfig = [
                {
                    displayProperty: 'first',
                    stickyProperty: ['prop1', 'prop2'],
                    width: '100px',
                },
                {
                    displayProperty: 'second',
                    width: '100px',
                },
            ];
            const gridRow = new GridDataRow({
                owner: getOwner(columnsConfig),
                columnsConfig,
                stickyLadder: {
                    prop1: { headingStyle: 'style' },
                    prop2: { headingStyle: 'style' },
                },
                gridColumnsConfig: columnsConfig,
                contents: record,
            });

            gridRow.updateLadder(
                {},
                {
                    prop1: { headingStyle: 'style' },
                    prop2: { headingStyle: 'style' },
                }
            );
            expect(Array.isArray(gridRow.getColumns())).toBe(true);
            expect(gridRow.getColumns().length).toEqual(4);
        });

        it('with Colspan end', () => {
            const columnsConfig = [
                {
                    displayProperty: 'first',
                    stickyProperties: ['prop1', 'prop2'],
                },
                {
                    displayProperty: 'second',
                },
            ];
            const gridRow = new GridDataRow({
                owner: getOwner(columnsConfig),
                colspanCallback: () => {
                    return 'end';
                },
                columnsConfig,
                gridColumnsConfig: columnsConfig,
                contents: record,
            });
            gridRow.updateLadder(
                {},
                {
                    prop1: { headingStyle: 'style' },
                    prop2: { headingStyle: 'style' },
                }
            );
            expect(Array.isArray(gridRow.getColumns())).toBe(true);
            expect(gridRow.getColumns().length).toEqual(1);
        });

        it('with Colspan ', () => {
            const columnsConfig = [
                {
                    displayProperty: 'first',
                    stickyProperties: ['prop1'],
                },
                {
                    displayProperty: 'second',
                },
                {
                    displayProperty: 'third',
                },
            ];
            const gridRow = new GridDataRow({
                owner: getOwner(columnsConfig),
                colspanCallback: () => {
                    return 2;
                },
                columnsConfig,
                gridColumnsConfig: columnsConfig,
                contents: record,
            });
            gridRow.updateLadder({}, { prop1: { headingStyle: 'style' } });
            expect(Array.isArray(gridRow.getColumns())).toBe(true);
            expect(gridRow.getColumns().length).toEqual(2);
        });
    });
});
