import TreeCheckboxCell from 'Controls/_baseTreeGrid/display/TreeCheckboxCell';
import { CssClassesAssert } from 'ControlsUnit/CustomAsserts';

describe('Controls/_baseTreeGrid/display/TreeGridNodeExtraItemCell', () => {
    let mockedOwner;

    beforeEach(() => {
        mockedOwner = {
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
                return {
                    mode: 'cell',
                };
            },
            getColumnIndex: () => {
                return 0;
            },
            getColumnsCount: () => {
                return 1;
            },
            getMultiSelectVisibility: () => {
                return 'hidden';
            },
            getEditingBackgroundStyle: () => {
                return '';
            },
            getGridColumnsConfig: () => {
                return [1];
            },
            getStickyColumnsCount: () => {
                return 0;
            },
            hasMultiSelectColumn: () => {
                return false;
            },
            isFullGridSupport: () => {
                return false;
            },
            isActive: () => {
                return false;
            },
            hasColumnScroll: () => {
                return false;
            },
            isEditing: () => {
                return false;
            },
            isMarked: () => {
                return false;
            },
            shouldDisplayMarker: () => {
                return false;
            },
            isDragTargetNode: () => {
                return false;
            },
            isSticked: () => {
                return false;
            },
            getGroupViewMode: () => {
                return 'default';
            },
        };
    });

    describe('getWrapperClasses', () => {
        it('is drag target node', () => {
            mockedOwner.isDragTargetNode = () => {
                return true;
            };
            const cell = new TreeCheckboxCell({
                owner: mockedOwner,
                column: { width: '' },
            });
            const classes = cell.getWrapperClasses('default');
            CssClassesAssert.include(
                classes,
                'controls-TreeGridView__dragTargetNode controls-TreeGridView__dragTargetNode_first'
            );
        });

        it('is not drag target node', () => {
            mockedOwner.isDragTargetNode = () => {
                return false;
            };
            const cell = new TreeCheckboxCell({
                owner: mockedOwner,
                column: { width: '' },
            });
            const classes = cell.getWrapperClasses('default');
            CssClassesAssert.notInclude(
                classes,
                'controls-TreeGridView__dragTargetNode controls-TreeGridView__dragTargetNode_first'
            );
        });

        it('item is marked', () => {
            mockedOwner.shouldDisplayMarker = () => {
                return true;
            };
            const cell = new TreeCheckboxCell({
                owner: mockedOwner,
                column: { width: '' },
                style: 'default',
            });
            const classes = cell.getWrapperClasses('default');
            CssClassesAssert.include(
                classes,
                'controls-Grid__row-cell_selected controls-Grid__row-cell_selected-default'
            );
        });
    });
});
