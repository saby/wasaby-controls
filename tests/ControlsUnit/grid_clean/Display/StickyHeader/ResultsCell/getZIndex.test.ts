import { GridResultsCell } from 'Controls/grid';
import { getResultsRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

const FIXED_RESULTS_Z_INDEX = 4;
const STICKY_RESULTS_Z_INDEX = 3;

describe('Controls/grid_clean/Display/StickyHeader/ResultsCell/getZIndex', () => {
    function createResultsCell({
        hasColumnsScroll,
        isFixed,
    }): GridResultsCell<any> {
        const column = { displayProperty: 'col1' };
        const resultsColumn = {};

        return new GridResultsCell({
            owner: getResultsRowMock({
                gridColumnsConfig: [column],
                hasColumnScroll: hasColumnsScroll,
                leftPadding: 's',
                rightPadding: 's',
                isStickyHeader: true,
            }),
            column: resultsColumn,
            isFixed,
        });
    }
    it('getZIndex without columnScroll ', () => {
        const gridResultsCell = createResultsCell({
            hasColumnsScroll: false,
            isFixed: false,
        });
        const zIndex = gridResultsCell.getZIndex();
        expect(zIndex).toBe(FIXED_RESULTS_Z_INDEX);
    });
    it('getZIndex with columnScroll on non-fixed cell', () => {
        const gridResultsCell = createResultsCell({
            hasColumnsScroll: true,
            isFixed: false,
        });
        const zIndex = gridResultsCell.getZIndex();
        expect(zIndex).toBe(STICKY_RESULTS_Z_INDEX);
    });
    it('getZIndex with columnScroll on fixedCell', () => {
        const gridResultsCell = createResultsCell({
            hasColumnsScroll: true,
            isFixed: true,
        });
        const zIndex = gridResultsCell.getZIndex();
        expect(zIndex).toBe(FIXED_RESULTS_Z_INDEX);
    });
});
