import { GridDataCell } from 'Controls/grid';
import { CssClassesAssert as cAssert } from 'ControlsUnit/CustomAsserts';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/Swipe/Animation/DataCell.test.ts', () => {
    const getCell = (isAnimatedForSelection?: boolean) => {
        return new GridDataCell({
            backgroundStyle: 'custom',
            owner: getDataRowMock({
                gridColumnsConfig: [{}],
                hoverBackgroundStyle: 'default',
                isAnimatedForSelection,
                editingConfig: {
                    mode: 'cell',
                },
            }),
            column: { displayProperty: 'key' },
        });
    };

    it('.getContentClasses() should contain animation classes when animated', () => {
        cAssert.notInclude(
            getCell().getContentClasses('default', 'default'),
            'controls-ListView__item_rightSwipeAnimation'
        );

        cAssert.include(
            getCell(true).getContentClasses('default', 'default'),
            'controls-ListView__item_rightSwipeAnimation'
        );
    });
});
