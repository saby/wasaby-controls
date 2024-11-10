import { CssClassesAssert as cAssert } from './../../CustomAsserts';
import CheckboxCell from 'Controls/_baseGrid/display/CheckboxCell';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/DataCell', () => {
    describe('getWrapperClasses', () => {
        it('should add background-color class', () => {
            const cell = new CheckboxCell({
                owner: getDataRowMock({
                    gridColumnsConfig: [{}],
                    hasColumnScroll: true,
                    editingBackgroundStyle: 'default',
                    hoverBackgroundStyle: 'default',
                    isActive: true,
                }),
                column: { displayProperty: 'key' },
                theme: 'default',
                style: 'default',
            });
            cAssert.include(cell.getWrapperClasses(null, true), [
                'controls-background-default-sticky',
            ]);
        });
    });
});
