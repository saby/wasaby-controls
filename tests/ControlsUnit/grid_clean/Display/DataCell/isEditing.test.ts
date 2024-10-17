import { GridDataCell } from 'Controls/grid';
import { CssClassesAssert as cAssert } from './../../../CustomAsserts';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/grid_clean/Display/DataCell/isEditing', () => {
    describe('single editable cell', () => {
        function createGridDataCell(isEditing: boolean): GridDataCell {
            return new GridDataCell({
                owner: getDataRowMock({
                    gridColumnsConfig: [{}],
                    fadedClass: '',
                    hoverBackgroundStyle: 'default',
                    editingColumnIndex: 0,
                    editingConfig: {
                        mode: 'cell',
                    },
                    isEditing,
                }),
                column: { displayProperty: 'key' },
            });
        }

        it('.getContentClasses() for editable', () => {
            const cell = createGridDataCell(false);
            cAssert.include(cell.getContentClasses('default', 'default'), [
                'controls-Grid__row-cell_editing-mode-single-cell',
                'controls-Grid__row-cell_single-cell_editable',
            ]);

            cAssert.notInclude(
                cell.getContentClasses('default', 'default'),
                'controls-Grid__row-cell_single-cell_editing'
            );
        });

        it('.getContentClasses() for last editable column', () => {
            const cell = createGridDataCell(false);
            cAssert.include(
                cell.getContentClasses('default', 'default'),
                'controls-Grid__row-cell_editing-mode-single-cell_last'
            );
        });

        it('.getContentClasses() for editing', () => {
            const cell = createGridDataCell(true);
            cAssert.include(
                cell.getContentClasses('default', 'default'),
                'controls-Grid__row-cell_single-cell_editing'
            );
        });

        it('.getContentClasses() for editing with columnScroll', () => {
            const cell = new GridDataCell({
                owner: getDataRowMock({
                    gridColumnsConfig: [{}],
                    fadedClass: '',
                    hoverBackgroundStyle: 'default',
                    editingColumnIndex: 0,
                    editingConfig: {
                        mode: 'cell',
                    },
                    isEditing: true,
                    hasColumnScroll: true,
                    editingBackgroundStyle: 'default',
                }),
                column: { displayProperty: 'key' },
            });

            cAssert.include(cell.getWrapperClasses('default', true), 'controls-background-default');
        });
    });
});
