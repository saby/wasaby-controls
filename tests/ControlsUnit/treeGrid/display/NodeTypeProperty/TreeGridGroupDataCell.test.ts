import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

import { TreeGridGroupDataRow, TreeGridGroupDataCell } from 'Controls/treeGrid';

describe('Controls/treeGrid/display/NodeTypeProperty/TreeGridGroupDataCell', () => {
    let columnIndex: number;
    let multiSelectVisibility: string;

    const owner = {
        getHoverBackgroundStyle: () => {
            return 'default';
        },
        isDragged: () => {
            return false;
        },
        hasItemActionsSeparatedCell: () => {
            return false;
        },
        getTopPadding: () => {
            return 'default';
        },
        getBottomPadding: () => {
            return 'default';
        },
        getLeftPadding: () => {
            return 'default';
        },
        getRightPadding: () => {
            return 'default';
        },
        getEditingConfig: () => {
            return null;
        },
        getColumnIndex: () => {
            return columnIndex;
        },
        getColumnsCount: () => {
            return 0;
        },
        getMultiSelectVisibility: () => {
            return multiSelectVisibility;
        },
        hasMultiSelectColumn: () => {
            return multiSelectVisibility !== 'hidden';
        },
        hasColumnScroll: () => {
            return false;
        },
        isDragTargetNode: () => {
            return false;
        },
        isEditing: () => {
            return false;
        },
        shouldDisplayMarker: () => {
            return false;
        },
    } as undefined as TreeGridGroupDataRow<any>;

    function getGroupCell(options?: object): TreeGridGroupDataCell<any> {
        return new TreeGridGroupDataCell({
            column: { displayProperty: 'key' },
            ...options,
            owner,
            theme: 'default',
            style: 'default',
        });
    }

    beforeEach(() => {
        columnIndex = 0;
        multiSelectVisibility = 'hidden';
    });

    it('getContentClasses should return group cell content classes', () => {
        CssClassesAssert.include(getGroupCell().getContentClasses(), [
            'controls-ListView__groupContent',
            'controls-ListView__groupContent_height',
        ]);
    });

    it('getWrapperClasses should return group cell wrapper classes', () => {
        CssClassesAssert.include(getGroupCell().getWrapperClasses('default'), [
            'controls-Grid__row-cell',
            'controls-Grid__cell_default',
            'controls-Grid__row-cell_default',
            'controls-Grid__no-rowSeparator',
            'controls-Grid__row-cell_withRowSeparator_size-null',
        ]);
    });

    it('getWrapperClasses should not include spacingFirstCol class', () => {
        CssClassesAssert.notInclude(
            getGroupCell().getWrapperClasses('default'),
            'controls-Grid__cell_spacingFirstCol_default'
        );
    });

    it('return default column template when no groupNodeConfig', () => {
        columnIndex = 3;
        const groupCell = getGroupCell({
            column: { displayProperty: 'key', width: '100px' },
        });
        expect(groupCell.getTemplate()).toEqual('Controls/grid:ColumnTemplate');
    });

    it('return group column template when groupNodeConfig', () => {
        columnIndex = 3;
        const groupCell = getGroupCell({
            column: {
                displayProperty: 'key',
                width: '100px',
                groupNodeConfig: {
                    textAlign: 'center',
                },
            },
        });
        expect(groupCell.getTemplate()).toEqual('Controls/treeGrid:GroupColumnTemplate');
    });

    it('return group column template when the very first column', () => {
        const groupCell = getGroupCell({
            column: { displayProperty: 'key', width: '100px' },
        });
        expect(groupCell.getTemplate()).toEqual('Controls/treeGrid:GroupColumnTemplate');
    });

    it('return group column template when the very first column and multiselect', () => {
        multiSelectVisibility = 'visible';
        columnIndex = 1;
        const groupCell = getGroupCell({
            column: { displayProperty: 'key', width: '100px' },
        });
        expect(groupCell.getTemplate()).toEqual('Controls/treeGrid:GroupColumnTemplate');
    });
});
