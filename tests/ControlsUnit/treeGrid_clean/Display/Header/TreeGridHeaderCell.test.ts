import { TreeGridHeaderCell } from 'Controls/treeGrid';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/treeGrid/Display/Header/TreeGridHeaderCell', () => {
    let columnIndex: number;
    let hasMultiSelect: boolean;
    let isCheckBoxCell: boolean;
    let expanderSize: string;

    const column = {};

    const getMockedOwner = () => {
        return {
            getColumnIndex: () => {
                return columnIndex;
            },
            hasColumnScroll: () => {
                return false;
            },
            hasNewColumnScroll: () => {
                return false;
            },
            isFullGridSupport: () => {
                return true;
            },
            isMultiline: () => {
                return false;
            },
            getBounds: () => {
                return { row: { end: 2 } };
            },
            hasMultiSelectColumn: () => {
                return hasMultiSelect;
            },
            getHeaderConfig: () => {
                return [column];
            },
            getGridColumnsConfig: () => {
                return [column];
            },
        };
    };

    function getCell(): TreeGridHeaderCell {
        return new TreeGridHeaderCell({
            owner: getMockedOwner(),
            column,
            displayExpanderPadding: true,
            isCheckBoxCell,
            expanderSize,
        });
    }

    describe('getContentClasses()', () => {
        it('-multiSelectVisibility, should add expanderPadding to first column', () => {
            expanderSize = 's';
            isCheckBoxCell = false;
            hasMultiSelect = false;
            columnIndex = 0;
            CssClassesAssert.include(
                getCell().getContentClasses(),
                'controls-TreeView__expanderPadding-s'
            );
        });

        it('+multiSelectVisibility, should add expanderPadding to second column', () => {
            expanderSize = 's';
            isCheckBoxCell = true;
            hasMultiSelect = true;
            columnIndex = 0;
            CssClassesAssert.notInclude(
                getCell().getContentClasses(),
                'controls-TreeView__expanderPadding-s'
            );

            isCheckBoxCell = false;
            hasMultiSelect = true;
            columnIndex = 1;
            CssClassesAssert.include(
                getCell().getContentClasses(),
                'controls-TreeView__expanderPadding-s'
            );
        });

        it('-multiSelectVisibility, -expanderSize, should add default expanderPadding to first column', () => {
            expanderSize = undefined;
            isCheckBoxCell = false;
            hasMultiSelect = false;
            columnIndex = 0;
            CssClassesAssert.include(
                getCell().getContentClasses(),
                'controls-TreeView__expanderPadding-default'
            );
        });
    });
});
