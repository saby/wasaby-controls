import DataCell from 'Controls/_grid/display/DataCell';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { getDataRowMock } from 'ControlsUnit/_listsUtils/mockOwner';

describe('Controls/_grid/display/DataCell', () => {
    let shouldDisplayMarker;
    let hasMultiSelectColumn;
    let columnsCount;
    let columnIndex;

    const getOwner = () => {
        return getDataRowMock({
            gridColumnsConfig: [{}],
            shouldDisplayMarker,
            hasMultiSelectColumn,
            columnsCount,
            columnIndex,
            topPadding: 'null',
            bottomPadding: 'null',
            isMarked: true,
            editingBackgroundStyle: 'default',
            rowSeparatorSize: 's',
            editingConfig: { mode: '' },
            editingColumnIndex: 0,
        });
    };

    describe('getWrapperClasses', () => {
        beforeEach(() => {
            shouldDisplayMarker = false;
            hasMultiSelectColumn = false;
            columnsCount = 1;
            columnIndex = 0;
        });

        it('not should display marker', () => {
            const cell = new DataCell({
                owner: getOwner(),
                column: { width: '' },
                theme: 'default',
                style: 'master',
            });
            CssClassesAssert.notInclude(
                cell.getWrapperClasses('', false),
                'controls-Grid__row-cell_selected controls-Grid__row-cell_selected-master ' +
                    'controls-Grid__row-cell_selected__first-master ' +
                    'controls-Grid__row-cell_selected__last controls-Grid__row-cell_selected__last-master'
            );
        });

        it('should display marker and is last column', () => {
            shouldDisplayMarker = true;

            const cell = new DataCell({
                owner: getOwner(),
                column: { width: '' },
                theme: 'default',
                style: 'master',
            });
            CssClassesAssert.include(
                cell.getWrapperClasses('', false),
                'controls-Grid__row-cell_selected controls-Grid__row-cell_selected-master ' +
                    'controls-Grid__row-cell_selected__first-master ' +
                    'controls-Grid__row-cell_selected__last controls-Grid__row-cell_selected__last-master'
            );
        });

        it('should display marker and is not last column', () => {
            shouldDisplayMarker = true;
            columnsCount = 2;

            const cell = new DataCell({
                owner: getOwner(),
                column: { width: '' },
                theme: 'default',
                style: 'master',
            });
            CssClassesAssert.include(
                cell.getWrapperClasses('', false),
                'controls-Grid__row-cell_selected controls-Grid__row-cell_selected-master ' +
                    'controls-Grid__row-cell_selected__first-master '
            );
        });

        it('should display marker and is not first column', () => {
            shouldDisplayMarker = true;
            columnsCount = 2;
            columnIndex = 1;

            const cell = new DataCell({
                owner: getOwner(),
                column: { width: '' },
                theme: 'default',
                style: 'master',
            });
            CssClassesAssert.include(
                cell.getWrapperClasses('', false),
                'controls-Grid__row-cell_selected controls-Grid__row-cell_selected-master ' +
                    'controls-Grid__row-cell_selected__last controls-Grid__row-cell_selected__last-master'
            );
        });
    });
});
