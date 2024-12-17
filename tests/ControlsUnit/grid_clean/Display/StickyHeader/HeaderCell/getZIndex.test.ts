import { GridHeaderCell } from 'Controls/grid';
import { getHeaderRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

const FIXED_HEADER_Z_INDEX = 4;
const STICKY_HEADER_Z_INDEX = 3;

describe('Controls/grid_clean/Display/StickyHeader/HeaderCell/getZIndex', () => {
    function createHeaderCell({
        hasColumnsScroll,
        isFixed,
        stickyLadderCellsCount,
    }): GridHeaderCell<any> {
        const column = { displayProperty: 'col1' };
        const headerColumn = {};

        return new GridHeaderCell({
            owner: getHeaderRowMock({
                gridColumnsConfig: [column],
                headerColumnsConfig: [headerColumn],
                hasColumnScroll: hasColumnsScroll,
                isStickyHeader: true,
                leftPadding: 's',
                rightPadding: 's',
                stickyLadderCellsCount,
            }),
            column: headerColumn,
            isFixed,
        });
    }

    it('getZIndex without columnScroll ', () => {
        const gridHeaderCell = createHeaderCell({
            hasColumnsScroll: false,
            isFixed: false,
            stickyLadderCellsCount: 0,
        });
        const zIndex = gridHeaderCell.getZIndex();
        expect(zIndex).toBe(STICKY_HEADER_Z_INDEX);
    });
    it('getZIndex with columnScroll on non-fixed cell', () => {
        const gridHeaderCell = createHeaderCell({
            hasColumnsScroll: true,
            isFixed: false,
            stickyLadderCellsCount: 0,
        });
        const zIndex = gridHeaderCell.getZIndex();
        expect(zIndex).toBe(STICKY_HEADER_Z_INDEX);
    });
    it('getZIndex with columnScroll on fixedCell', () => {
        const gridHeaderCell = createHeaderCell({
            hasColumnsScroll: true,
            isFixed: true,
            stickyLadderCellsCount: 0,
        });
        const zIndex = gridHeaderCell.getZIndex();
        expect(zIndex).toBe(FIXED_HEADER_Z_INDEX);
    });
    it('getZIndex with columnScroll on fixedCell with ladder', () => {
        const gridHeaderCell = createHeaderCell({
            hasColumnsScroll: true,
            isFixed: true,
            stickyLadderCellsCount: 1,
        });
        const zIndex = gridHeaderCell.getZIndex();
        expect(zIndex).toBe(FIXED_HEADER_Z_INDEX + 1);
    });
});
