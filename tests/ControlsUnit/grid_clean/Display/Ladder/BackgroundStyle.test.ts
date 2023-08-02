import { GridDataCell } from 'Controls/grid';
import { CssClassesAssert as cAssert } from 'ControlsUnit/CustomAsserts';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/DataCell/BackgroundStyle.test.ts', () => {
    const getGridCell = (backgroundStyle: string): GridDataCell => {
        return new GridDataCell({
            backgroundStyle,
            owner: getDataRowMock({
                gridColumnsConfig: [{}],
                hoverBackgroundStyle: 'default',
                editingConfig: {
                    mode: 'cell',
                },
                editingColumnIndex: 0,
            }),
            column: { displayProperty: 'key' },
        });
    };

    describe('getContentClasses()', () => {
        it('should contain background-color classes when hiddenForLadder', () => {
            const cell = getGridCell('custom');
            cAssert.notInclude(
                cell.getContentClasses('default', 'default'),
                'controls-background-custom'
            );

            cell.setHiddenForLadder(true);
            cAssert.include(
                cell.getContentClasses('default', 'default'),
                'controls-background-custom'
            );
        });

        it('"default" background-color class should be changable in ContrastWrapper', () => {
            const cell = getGridCell('default');
            cell.setHiddenForLadder(true);
            cAssert.include(
                cell.getContentClasses('default', 'default'),
                'controls-background-default-sticky'
            );
        });
    });
});
