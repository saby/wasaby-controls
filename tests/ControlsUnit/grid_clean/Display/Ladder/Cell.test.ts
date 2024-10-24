import { CssClassesAssert as cAssert } from 'ControlsUnit/CustomAsserts';
import Cell from 'Controls/_gridDisplay/Cell';
import { getRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/Ladder/Cell', () => {
    const getCell = (stickyLadder?: boolean) => {
        return new Cell({
            owner: getRowMock({
                gridColumnsConfig: [{}],
                hoverBackgroundStyle: 'default',
                editingConfig: {
                    mode: 'cell',
                },
                stickyLadder,
            }),
            column: { displayProperty: 'key' },
        });
    };

    it('.getContentClasses()', () => {
        cAssert.notInclude(
            getCell().getContentClasses('default', 'default'),
            'controls-Grid__row-cell__content_ladderHeader'
        );
        cAssert.include(
            getCell(true).getContentClasses('default', 'default'),
            'controls-Grid__row-cell__content_ladderHeader'
        );
    });
});
