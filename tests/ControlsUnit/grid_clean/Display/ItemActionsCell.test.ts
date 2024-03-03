import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { GridItemActionsCell } from 'Controls/grid';
import { DRAG_SCROLL_JS_SELECTORS } from 'Controls/columnScroll';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/ItemActionsCell', () => {
    it('getWrapperStyles', () => {
        const cell = new GridItemActionsCell({
            column: {},
            rowspan: 2,
            owner: getDataRowMock({
                gridColumnsConfig: [{}],
            }),
        });
        expect(cell.getWrapperStyles()).toEqual(
            'width: 0px; min-width: 0px; max-width: 0px; padding: 0px; z-index: 2; grid-row: 1 / 3;'
        );
    });

    it('getWrapperClasses', () => {
        const getCell = (isFullGridSupport) => {
            return new GridItemActionsCell({
                column: {},
                rowspan: 2,
                owner: getDataRowMock({
                    gridColumnsConfig: [{}],
                    isFullGridSupport,
                    DisplayItemActions: true,
                }),
            });
        };

        CssClassesAssert.include(
            getCell(true).getWrapperClasses(),
            DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE
        );
        CssClassesAssert.include(
            getCell(false).getWrapperClasses(),
            DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE
        );
    });
});
