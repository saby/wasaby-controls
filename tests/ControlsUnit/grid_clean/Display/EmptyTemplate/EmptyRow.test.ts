import { GridEmptyRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/EmptyTemplate/EmptyRow', () => {
    const getCollection = (hasSpacingColumn: boolean = false) => {
        return getGridCollectionMock({
            gridColumnsConfig: [
                { displayProperty: 'col1' },
                { displayProperty: 'col2' },
                { displayProperty: 'col3' },
            ],
            hasMultiSelectColumn: true,
            hasSpacingColumn,
        });
    };

    it('should not add multiselect column to colspaned empty row', () => {
        const emptyRow = new GridEmptyRow({
            owner: getCollection(),
            rowTemplate: () => {
                return 'EMPTY_TEMPLATE';
            },
        });

        const emptyColumns = emptyRow.getColumns();
        expect(emptyColumns.length).toEqual(1);
        expect(emptyColumns[0].getColspan()).toEqual(4);
    });

    it('should not add spacing column to colspaned empty row', () => {
        const emptyRow = new GridEmptyRow({
            owner: getCollection(true),
            rowTemplate: () => {
                return 'EMPTY_TEMPLATE';
            },
        });

        const emptyColumns = emptyRow.getColumns();
        expect(emptyColumns.length).toEqual(1);
        expect(emptyColumns[0].getColspan()).toEqual(5);
    });
});
