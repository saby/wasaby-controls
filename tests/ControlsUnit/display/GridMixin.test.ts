import { GridCollection, GridHeaderCell } from 'Controls/grid';
import { Model } from 'Types/entity';

describe('Controls/_display/GridMixin', () => {
    describe('ladder', () => {
        let grid;
        const collection = [
            {
                id: 1,
                title: '1',
            },
            {
                id: 2,
                title: '1',
            },
            {
                id: 2,
                title: '2',
            },
        ];
        const cfg = {
            collection,
            columns: [{ displayProperty: 'title' }],
            ladderProperties: ['title'],
        };
        beforeEach(() => {
            grid = new GridCollection(cfg);
        });
        it('init Ladder', () => {
            expect(grid.at(0).getLadder()).toBeTruthy();
        });
        afterEach(() => {
            grid.destroy();
        });
    });

    describe('hasMultiSelectColumn', () => {
        const grid = new GridCollection({
            collection: [{ id: 1 }],
            columns: [{}, {}],
        });

        it('hasMultiSelectColumn()', () => {
            grid.setMultiSelectVisibility('visible');
            grid.setMultiSelectPosition('default');
            expect(grid.hasMultiSelectColumn()).toBe(true);

            grid.setMultiSelectVisibility('onactivated');
            grid.setMultiSelectPosition('default');
            expect(grid.hasMultiSelectColumn()).toBe(true);

            grid.setMultiSelectVisibility('hidden');
            grid.setMultiSelectPosition('default');
            expect(grid.hasMultiSelectColumn()).toBe(false);

            grid.setMultiSelectVisibility('visible');
            grid.setMultiSelectPosition('custom');
            expect(grid.hasMultiSelectColumn()).toBe(false);

            grid.setMultiSelectVisibility('onactivated');
            grid.setMultiSelectPosition('custom');
            expect(grid.hasMultiSelectColumn()).toBe(false);

            grid.setMultiSelectVisibility('hidden');
            grid.setMultiSelectPosition('custom');
            expect(grid.hasMultiSelectColumn()).toBe(false);
        });
    });

    describe('sorting', () => {
        it('should set sorting to header cells', () => {
            const header = [
                { sortingProperty: 'count' },
                { sortingProperty: 'price' },
            ];
            const columns = [{ width: '1px' }, { width: '1px' }];
            const grid = new GridCollection({
                collection: [{ id: 1, price: '12', count: '40' }],
                header,
                columns,
            });
            const headerColumns = grid
                .getHeader()
                .getRow()
                .getColumns() as GridHeaderCell<Model>[];
            grid.setSorting([{ price: 'DESC' }]);
            expect(headerColumns[1].getSorting()).toEqual('DESC');
            expect(headerColumns[0].getSorting()).not.toEqual('DESC');
        });
    });
});
