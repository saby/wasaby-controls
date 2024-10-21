import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';
import { TreeGridNodeExtraItemCell } from 'Controls/treeGrid';

describe('Controls/treeGrid_clean/Display/NodeFooterCell', () => {
    let columnIndex = 0;
    const getMockedOwner = () => {
        return {
            getColumnIndex: () => {
                return columnIndex;
            },
            hasColumnScroll: () => {
                return false;
            },
            hasMultiSelectColumn: () => {
                return false;
            },
            isFullGridSupport: () => {
                return true;
            },
            getColumnsCount: () => {
                return 1;
            },
            hasItemActionsSeparatedCell: () => {
                return false;
            },
        };
    };

    describe('.getWrapperClasses()', () => {
        beforeEach(() => {
            columnIndex = 0;
        });
        it('first cell without separators', () => {
            columnIndex = 0;
            const cell = new TreeGridNodeExtraItemCell({
                owner: getMockedOwner(),
                leftSeparatorSize: 's',
            });

            CssClassesAssert.notInclude(
                cell.getWrapperClasses(),
                'controls-Grid__columnSeparator_size-s'
            );
        });

        it('second cell with separators', () => {
            columnIndex = 1;
            const cell = new TreeGridNodeExtraItemCell({
                owner: getMockedOwner(),
                leftSeparatorSize: 's',
            });

            CssClassesAssert.include(
                cell.getWrapperClasses(),
                'controls-Grid__columnSeparator_size-s'
            );
        });
    });
});
