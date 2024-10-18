import { GridHeaderRow } from 'Controls/grid';
import { getGridCollectionMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/MultiHeader/HeaderRow/Ladder', () => {
    const columns = [
        {
            displayProperty: 'date',
            stickyProperty: ['date', 'time'],
        },
        {},
        {},
    ];

    /*
     * +-----------+-----+
     * |     |     2     |
     * +  1  +-----+-----+
     * |     |  3  |  4  |
     * +-----------+-----+
     * */
    const header = [
        {
            startColumn: 1,
            endColumn: 2,
            startRow: 1,
            endRow: 3,
        },
        {
            startColumn: 2,
            endColumn: 4,
            startRow: 1,
            endRow: 2,
        },
        {
            startColumn: 2,
            endColumn: 3,
            startRow: 2,
            endRow: 3,
        },
        {
            startColumn: 3,
            endColumn: 4,
            startRow: 2,
            endRow: 3,
        },
    ];

    const getOwner = () => {
        return getGridCollectionMock({
            gridColumnsConfig: columns,
            headerConfig: header,
            leftPadding: 's',
            rightPadding: 's',
        });
    };

    const mockedHeaderModel = {
        isMultiline: () => {
            return true;
        },
        isSticked: () => {
            return false;
        },
        getRowIndex: () => {
            return 0;
        },
        getBounds: () => {
            return {
                row: { start: 1, end: 3 },
                column: { start: 1, end: 4 },
            };
        },
    };
    it('get right colspan and rowspan params for both ladder cells', () => {
        const headerRow = new GridHeaderRow({
            owner: getOwner(),
            headerModel: mockedHeaderModel,
            columnsConfig: header,
            gridColumnsConfig: columns,
        });
        const columnItems = headerRow.getColumns();

        expect(columnItems[0].isLadderCell()).toBe(true);
        expect(columnItems[0].getColspanStyles()).toEqual('grid-column: 1 / 2;');
        expect(columnItems[0].getRowspanStyles()).toEqual('grid-row: 1 / 3;');

        expect(columnItems[2].isLadderCell()).toBe(true);
        expect(columnItems[2].getColspanStyles()).toEqual('grid-column: 3 / 4;');
        expect(columnItems[2].getRowspanStyles()).toEqual('grid-row: 1 / 3;');
    });
});
