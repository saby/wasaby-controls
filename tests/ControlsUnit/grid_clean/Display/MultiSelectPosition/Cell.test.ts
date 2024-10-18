import { GridCell } from 'Controls/grid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { getRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/MultiSelectPosition/Cell', () => {
    it('getContentClasses', () => {
        const getCell = (columnIndex: number) => {
            return new GridCell({
                owner: getRowMock({
                    gridColumnsConfig: [{}],
                    hoverBackgroundStyle: 'default',
                    multiSelectVisibility: 'onhover',
                    hasMultiSelectColumn: true,
                    leftPadding: 's',
                    rightPadding: 's',
                    topPadding: 's',
                    bottomPadding: 's',
                    columnIndex,
                }),
                column: {},
            });
        };

        // checkbox
        CssClassesAssert.notInclude(getCell(0).getContentClasses(), [
            'controls-Grid__cell_spacingFirstCol_s',
            'controls-Grid__cell_spacingLeft_s',
        ]);
        // First after checkbox
        CssClassesAssert.notInclude(getCell(1).getContentClasses(), [
            'controls-Grid__cell_spacingFirstCol_s',
            'controls-Grid__cell_spacingLeft_s',
        ]);
    });
});
