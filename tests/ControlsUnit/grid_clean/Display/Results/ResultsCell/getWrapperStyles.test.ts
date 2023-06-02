import { GridRow, GridResultsCell } from 'Controls/grid';
import { getResultsRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/Results/ResultsCell/getWrapperStyles', () => {
    let hasColumnScroll;

    const getOwner = () => {
        return getResultsRowMock({
            gridColumnsConfig: [{}],
            hasColumnScroll,
        });
    };

    beforeEach(() => {
        hasColumnScroll = false;
    });

    it('stickyHeader, no columnScroll', () => {
        const cell = new GridResultsCell({
            column: { width: '' },
            owner: getOwner(),
            isSticked: true,
        });
        expect(cell.getWrapperStyles()).toEqual(
            'z-index: 4; grid-column: 1 / 2;'
        );
    });

    it('stickyHeader, with columnScroll, isFixed', () => {
        hasColumnScroll = true;
        const cell = new GridResultsCell({
            column: { width: '' },
            owner: getOwner(),
            isFixed: true,
            isSticked: true,
        });
        expect(cell.getWrapperStyles()).toEqual(
            'z-index: 4; grid-column: 1 / 2;'
        );
    });

    it('stickyHeader, with columnScroll, not isFixed', () => {
        hasColumnScroll = true;
        const cell = new GridResultsCell({
            column: { width: '' },
            owner: getOwner(),
            isFixed: false,
            isSticked: true,
        });
        expect(cell.getWrapperStyles()).toEqual(
            'z-index: 3; grid-column: 1 / 2;'
        );
    });

    it('not stickyHeader', () => {
        const cell = new GridResultsCell({
            column: { width: '' },
            owner: getOwner(),
            isSticked: false,
        });
        expect(cell.getWrapperStyles().trim()).toEqual('grid-column: 1 / 2;');
    });
});
